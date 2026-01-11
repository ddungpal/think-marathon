import OpenAI from 'openai';
import { NormalizedInput } from '@/types/input';
import { DiagnosisResult } from '@/types/output';
import { buildPrompt } from './prompt';
import { validateResponse } from './validator';

// OpenAI 클라이언트를 지연 초기화 (런타임에만 생성)
function getOpenAIClient(): OpenAI {
  // 환경 변수에서 API 키 가져오기
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    // 디버깅 정보 추가
    const envKeys = Object.keys(process.env).filter(key => 
      key.includes('OPENAI') || key.includes('API')
    );
    console.error('OPENAI_API_KEY is not set. Available env keys:', envKeys);
    console.error('NODE_ENV:', process.env.NODE_ENV);
    throw new Error('OPENAI_API_KEY is not set in environment variables. Please check Netlify environment variables and redeploy.');
  }
  
  // API 키가 설정되었는지 확인 (빈 문자열 체크)
  const trimmedKey = apiKey.trim();
  if (trimmedKey === '') {
    console.error('OPENAI_API_KEY is set but empty');
    throw new Error('OPENAI_API_KEY is empty. Please set a valid API key in Netlify environment variables.');
  }
  
  // API 키 형식 기본 검증 (sk- 또는 sk-proj-로 시작)
  if (!trimmedKey.startsWith('sk-')) {
    console.error('OPENAI_API_KEY format is invalid (should start with sk-)');
    throw new Error('OPENAI_API_KEY format is invalid. Please check your API key in Netlify environment variables.');
  }
  
  return new OpenAI({
    apiKey: trimmedKey,
    timeout: 30000, // 30초 타임아웃
    maxRetries: 1, // 재시도 1회만
  });
}

export async function generateDiagnosis(
  context: NormalizedInput
): Promise<DiagnosisResult> {
  const prompt = await buildPrompt(context);
  const openai = getOpenAIClient(); // 런타임에 클라이언트 생성

  try {
    const response = await Promise.race([
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 3000, // 새로운 필드 추가로 토큰 수 증가 (각 섹션 3-7문장 × 7개 섹션 + JSON 형식 고려)
        response_format: { type: 'json_object' },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('LLM timeout')), 30000)
      ),
    ]);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from LLM');
    }

    // 디버깅: 실제 응답 내용 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('LLM Response:', content);
    }

    const validation = validateResponse(content);
    if (!validation.valid || !validation.data) {
      // 더 자세한 에러 정보 제공
      console.error('LLM Response validation failed:', {
        error: validation.error,
        content: content.substring(0, 500), // 처음 500자만 로깅
      });
      throw new Error(validation.error || 'Invalid response format');
    }

    return validation.data;
  } catch (error) {
    // OpenAI API 에러를 더 자세히 로깅
    if (error instanceof Error) {
      // OpenAI API 에러인 경우
      if ('status' in error || 'code' in error) {
        console.error('OpenAI API Error:', {
          message: error.message,
          name: error.name,
          // @ts-ignore - OpenAI 에러 객체
          status: error.status,
          // @ts-ignore
          code: error.code,
          // @ts-ignore
          type: error.type,
        });
      } else {
        console.error('LLM call failed:', error.message, error.stack);
      }
    } else {
      console.error('LLM call failed (unknown error):', error);
    }
    throw error;
  }
}

