import OpenAI from 'openai';
import { NormalizedInput } from '@/types/input';
import { DiagnosisResult } from '@/types/output';
import { buildPrompt } from './prompt';
import { validateResponse } from './validator';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30초 타임아웃
  maxRetries: 1, // 재시도 1회만
});

export async function generateDiagnosis(
  context: NormalizedInput
): Promise<DiagnosisResult> {
  const prompt = buildPrompt(context);

  try {
    const response = await Promise.race([
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 2000, // 각 섹션 3-7문장 × 3개 섹션 + JSON 형식 고려
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
    console.error('LLM call failed:', error);
    throw error;
  }
}

