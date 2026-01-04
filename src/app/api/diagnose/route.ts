import { NextRequest, NextResponse } from 'next/server';
import { loadConfig, getConfig, loadLearningPoints } from '@/lib/config/loader';
import { loadLLMConfig } from '@/lib/config/llm-config-loader';
import { loadPDFConfig } from '@/lib/pdf/loader';
import { normalizeInput } from '@/lib/config/mapper';
import { validateInput } from '@/lib/validation/input-validator';
import { generateCacheKey } from '@/lib/utils/cache-key';
import { memoryCache } from '@/lib/cache/memory';
import { generateDiagnosis } from '@/lib/llm/client';
import { llmRateLimiter } from '@/lib/llm/rate-limiter';
import { handleError, AppError } from '@/lib/errors/error-handler';
import { logger } from '@/lib/logger/logger';
import { DiagnoseRequest, DiagnoseResponse } from '@/types/api';

// 서버 시작 시 Config 로드
let configLoaded = false;
let llmConfigLoaded = false;
let learningPointsLoaded = false;
let pdfConfigLoaded = false;

async function ensureConfigLoaded() {
  if (!configLoaded) {
    await loadConfig();
    configLoaded = true;
  }
}

async function ensureLLMConfigLoaded() {
  if (!llmConfigLoaded) {
    await loadLLMConfig();
    llmConfigLoaded = true;
  }
}

async function ensureLearningPointsLoaded() {
  if (!learningPointsLoaded) {
    await loadLearningPoints();
    learningPointsLoaded = true;
  }
}

async function ensurePDFConfigLoaded() {
  if (!pdfConfigLoaded) {
    try {
      await loadPDFConfig();
      pdfConfigLoaded = true;
    } catch (error) {
      // PDF 설정 로드 실패 시에도 계속 진행 (선택적 기능)
      console.warn('PDF 설정 로드 실패 (무시됨):', error);
      pdfConfigLoaded = true; // 실패해도 true로 설정하여 재시도 방지
    }
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let cacheHit = false;

  try {
    // Config 로드 확인
    await ensureConfigLoaded();
    await ensureLLMConfigLoaded();
    await ensureLearningPointsLoaded();
    await ensurePDFConfigLoaded();
    const config = getConfig();

    // 요청 파싱
    const body: DiagnoseRequest = await request.json();

    // 입력값 검증
    const validation = validateInput(body);
    if (!validation.valid) {
      return NextResponse.json<DiagnoseResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: validation.errors?.join(', ') || 'Invalid input',
          },
        },
        { status: 400 }
      );
    }

    // 정규화
    const normalized = normalizeInput(body, config);

    // 캐시 키 생성
    const cacheKey = generateCacheKey(normalized);

    // 캐시 조회
    const cachedResult = await memoryCache.get(cacheKey);
    if (cachedResult) {
      cacheHit = true;
      logger.info('Cache hit', { cacheKey, responseTime: Date.now() - startTime });
      return NextResponse.json<DiagnoseResponse>({
        success: true,
        data: cachedResult,
        cached: true,
      });
    }

    // 캐시 미스 - LLM 호출
    logger.info('Cache miss, calling LLM', { cacheKey });

    // Rate Limiter 적용
    await llmRateLimiter.acquire();
    try {
      const result = await generateDiagnosis(normalized);

      // 캐시 저장
      await memoryCache.set(cacheKey, result);

      logger.info('LLM call successful', {
        cacheKey,
        responseTime: Date.now() - startTime,
      });

      return NextResponse.json<DiagnoseResponse>({
        success: true,
        data: result,
        cached: false,
      });
    } finally {
      llmRateLimiter.release();
    }
  } catch (error) {
    const appError = handleError(error);

    // 환경 변수 관련 에러인 경우 더 자세한 정보 제공
    const isEnvError = appError.message.includes('OPENAI_API_KEY');
    
    logger.error('Diagnosis failed', {
      error: appError.message,
      code: appError.code,
      responseTime: Date.now() - startTime,
      isEnvError,
      // 환경 변수 디버깅 정보 (프로덕션에서도 로깅)
      envCheck: {
        hasKey: !!process.env.OPENAI_API_KEY,
        keyLength: process.env.OPENAI_API_KEY?.length || 0,
        nodeEnv: process.env.NODE_ENV,
      },
    });

    // 클라이언트 에러
    if (appError.statusCode >= 400 && appError.statusCode < 500) {
      return NextResponse.json<DiagnoseResponse>(
        {
          success: false,
          error: {
            code: appError.code,
            message: appError.message,
          },
        },
        { status: appError.statusCode }
      );
    }

    // 서버 에러 - 환경 변수 에러인 경우 더 명확한 메시지
    const errorMessage = isEnvError
      ? 'API 키가 설정되지 않았습니다. Netlify 환경 변수를 확인하고 재배포해주세요.'
      : 'Internal server error';

    return NextResponse.json<DiagnoseResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}

