import { NextRequest, NextResponse } from 'next/server';
import { loadConfig, getConfig, loadLearningPoints } from '@/lib/config/loader';
import { loadLLMConfig } from '@/lib/config/llm-config-loader';
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

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let cacheHit = false;

  try {
    // Config 로드 확인
    await ensureConfigLoaded();
    await ensureLLMConfigLoaded();
    await ensureLearningPointsLoaded();
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

    logger.error('Diagnosis failed', {
      error: appError.message,
      code: appError.code,
      responseTime: Date.now() - startTime,
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

    // 서버 에러
    return NextResponse.json<DiagnoseResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
      },
      { status: 500 }
    );
  }
}

