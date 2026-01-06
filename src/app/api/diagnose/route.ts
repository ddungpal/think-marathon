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
  let errorStage = 'unknown';

  try {
    // Config 로드 확인
    errorStage = 'config_loading';
    logger.info('Starting diagnosis request');
    
    await ensureConfigLoaded();
    logger.info('Config loaded');
    
    await ensureLLMConfigLoaded();
    logger.info('LLM config loaded');
    
    await ensureLearningPointsLoaded();
    logger.info('Learning points loaded');
    
    await ensurePDFConfigLoaded();
    logger.info('PDF config loaded');
    
    const config = getConfig();
    logger.info('Config retrieved');

    // 요청 파싱
    errorStage = 'request_parsing';
    logger.info('Parsing request body');
    const body: DiagnoseRequest = await request.json();
    logger.info('Request body parsed', { 
      hasName: !!body.name,
      hasAge: !!body.age,
      hasJobType: !!body.job_type,
      hasCareerYears: !!body.career_years,
      hasMonthlyIncome: !!body.monthly_income,
      hasNetWorth: !!body.net_worth,
    });

    // 입력값 검증
    errorStage = 'input_validation';
    logger.info('Validating input');
    const validation = validateInput(body);
    if (!validation.valid) {
      logger.warn('Input validation failed', { errors: validation.errors });
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
    logger.info('Input validation passed');

    // 정규화
    errorStage = 'input_normalization';
    logger.info('Normalizing input');
    const normalized = normalizeInput(body, config);
    logger.info('Input normalized', {
      jobType: normalized.job_type_label,
      careerStage: normalized.career_stage.label,
      incomeBand: normalized.income_band.label,
      assetBand: normalized.asset_band.label,
    });

    // 캐시 키 생성
    errorStage = 'cache_key_generation';
    const cacheKey = generateCacheKey(normalized);
    logger.info('Cache key generated', { cacheKey });

    // 캐시 조회
    errorStage = 'cache_lookup';
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
    logger.info('Cache miss');

    // 캐시 미스 - LLM 호출
    errorStage = 'llm_call';
    logger.info('Cache miss, calling LLM', { cacheKey });

    // Rate Limiter 적용
    await llmRateLimiter.acquire();
    try {
      errorStage = 'llm_generation';
      logger.info('Generating diagnosis with LLM');
      const result = await generateDiagnosis(normalized);
      logger.info('LLM call successful, saving to cache');

      // 캐시 저장
      errorStage = 'cache_saving';
      await memoryCache.set(cacheKey, result);
      logger.info('Cache saved');

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
    
    // OpenAI API 에러 체크
    const isOpenAIError = error instanceof Error && (
      error.message.includes('OpenAI') ||
      error.message.includes('API key') ||
      error.message.includes('authentication') ||
      error.message.includes('401') ||
      error.message.includes('403')
    );
    
    // Config 로드 에러 체크
    const isConfigError = error instanceof Error && (
      error.message.includes('Config') ||
      error.message.includes('config') ||
      error.message.includes('loading failed')
    );
    
    // 원본 에러 정보를 로깅 (디버깅용)
    const originalError = error instanceof Error ? {
      message: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 500), // 스택 추적의 처음 500자만
    } : error;
    
    logger.error('Diagnosis failed', {
      error: appError.message,
      code: appError.code,
      errorStage, // 에러가 발생한 단계
      responseTime: Date.now() - startTime,
      isEnvError,
      isOpenAIError,
      isConfigError,
      originalError,
      // 환경 변수 디버깅 정보 (프로덕션에서도 로깅)
      envCheck: {
        hasKey: !!process.env.OPENAI_API_KEY,
        keyLength: process.env.OPENAI_API_KEY?.length || 0,
        keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) || 'N/A', // sk-proj만 표시
        nodeEnv: process.env.NODE_ENV,
      },
    });

    // 클라이언트 에러 (400-499)
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

    // 서버 에러 (500+) - 사용자 친화적인 메시지
    let errorMessage = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';
    
    if (isEnvError) {
      errorMessage = 'API 키가 설정되지 않았습니다. Netlify 환경 변수를 확인하고 재배포해주세요.';
      errorCode = 'MISSING_API_KEY';
    } else if (isOpenAIError) {
      errorMessage = 'OpenAI API 호출에 실패했습니다. API 키를 확인해주세요.';
      errorCode = 'OPENAI_API_ERROR';
    } else if (isConfigError) {
      errorMessage = '설정 파일을 불러오는데 실패했습니다.';
      errorCode = 'CONFIG_ERROR';
    }

    return NextResponse.json<DiagnoseResponse>(
      {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}

