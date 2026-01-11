import { DiagnosisResult } from '@/types/output';
import { ValidationResult } from './types';

export function countSentences(text: string): number {
  // 문장 종결 기호로 문장 수 계산
  const sentenceEndings = /[.!?。！？]\s*/g;
  const matches = text.match(sentenceEndings);
  return matches ? matches.length : 1;
}

export function validateResponse(json: string): ValidationResult {
  try {
    // JSON 파싱 전에 마크다운 코드 블록이나 불필요한 텍스트 제거
    let cleanedJson = json.trim();
    
    // 마크다운 코드 블록 제거
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // JSON 객체만 추출 (중괄호로 시작하고 끝나는 부분)
    const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedJson = jsonMatch[0];
    }
    
    const data = JSON.parse(cleanedJson) as any;

    // 실제 키 확인 (디버깅 정보 포함)
    const availableKeys = Object.keys(data);
    const missingKeys: string[] = [];
    
    // 필수 키 확인
    if (!data.common_concerns) missingKeys.push('common_concerns');
    if (!data.current_capabilities) missingKeys.push('current_capabilities');
    if (!data.learning_points) missingKeys.push('learning_points');

    if (missingKeys.length > 0) {
      return {
        valid: false,
        error: `Missing required keys: ${missingKeys.join(', ')}. Available keys: ${availableKeys.join(', ')}`,
      };
    }

    // 타입 확인 (필수 + 선택적 필드)
    const requiredFields = ['common_concerns', 'current_capabilities', 'learning_points'];
    const optionalFields = ['frequent_thoughts', 'unknown_things', 'must_learn', 'recommended_training', 'avoid_studies'];
    
    for (const field of requiredFields) {
      if (typeof data[field] !== 'string') {
        return {
          valid: false,
          error: `Field ${field} must be a string. Got: ${typeof data[field]}`,
        };
      }
    }
    
    for (const field of optionalFields) {
      if (data[field] && typeof data[field] !== 'string') {
        return {
          valid: false,
          error: `Field ${field} must be a string. Got: ${typeof data[field]}`,
        };
      }
    }

    // 빈 문자열 확인 (필수 필드만)
    if (
      !data.common_concerns.trim() ||
      !data.current_capabilities.trim() ||
      !data.learning_points.trim()
    ) {
      return {
        valid: false,
        error: 'All required values must be non-empty strings',
      };
    }

    // 문장 수 확인 (3-7문장) - 필수 필드만
    const concernsSentences = countSentences(data.common_concerns);
    const capabilitiesSentences = countSentences(data.current_capabilities);
    const learningSentences = countSentences(data.learning_points);

    if (
      concernsSentences < 3 ||
      concernsSentences > 7 ||
      capabilitiesSentences < 3 ||
      capabilitiesSentences > 7 ||
      learningSentences < 3 ||
      learningSentences > 7
    ) {
      return {
        valid: false,
        error: `Invalid sentence count. Each section must have 3-7 sentences. Got: ${concernsSentences}, ${capabilitiesSentences}, ${learningSentences}`,
      };
    }

    // 결과 객체 생성 (모든 필드 포함)
    const result: DiagnosisResult = {
      common_concerns: data.common_concerns,
      current_capabilities: data.current_capabilities,
      learning_points: data.learning_points,
    };
    
    // 선택적 필드 추가
    if (data.frequent_thoughts) result.frequent_thoughts = data.frequent_thoughts;
    if (data.unknown_things) result.unknown_things = data.unknown_things;
    if (data.must_learn) result.must_learn = data.must_learn;
    if (data.recommended_training) result.recommended_training = data.recommended_training;
    if (data.avoid_studies) result.avoid_studies = data.avoid_studies;

    return {
      valid: true,
      data: result,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

