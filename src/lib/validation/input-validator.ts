import { RawInput } from '@/types/input';

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export function validateInput(input: any): ValidationResult {
  const errors: string[] = [];

  // 필수 필드 확인
  if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
    errors.push('이름을 입력해주세요.');
  }

  if (typeof input.age !== 'number') {
    errors.push('나이는 숫자여야 합니다.');
  } else if (input.age < 0 || input.age > 70) {
    errors.push('나이는 0-70 사이의 값이어야 합니다.');
  }

  if (!input.job_type) {
    errors.push('직업을 선택해주세요.');
  } else if (input.job_type !== '직장인' && input.job_type !== '프리랜서/사업자') {
    errors.push('유효하지 않은 직업 타입입니다.');
  }

  if (typeof input.career_years !== 'number') {
    errors.push('연차는 숫자여야 합니다.');
  } else if (input.career_years < 0 || input.career_years > 30) {
    errors.push('연차는 0-30 사이의 값이어야 합니다.');
  }

  if (typeof input.monthly_income !== 'number') {
    errors.push('월평균소득은 숫자여야 합니다.');
  } else if (input.monthly_income < 0) {
    errors.push('월평균소득은 0 이상이어야 합니다.');
  }

  if (typeof input.net_worth !== 'number') {
    errors.push('순자산은 숫자여야 합니다.');
  } else if (input.net_worth < 0) {
    errors.push('순자산은 0 이상이어야 합니다.');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

