export interface DiagnosisResult {
  // 기존 필드
  common_concerns: string;
  current_capabilities: string;
  learning_points: string;
  
  // 새로운 필드
  frequent_thoughts?: string; // 내가 자주 하는 생각
  unknown_things?: string; // 이 구간에서 잘 모르는 것
  must_learn?: string; // 반드시 배워야 하는 것
  recommended_training?: string; // 추천 생각 훈련
  avoid_studies?: string; // 지금은 피해야 할 공부
}

// 6단계 타입 정의
export type CareerStageType = '노동자' | '숙련자' | '실력자' | '전문가' | '시스템' | '브랜드';

// 단계별 정보
export interface StageInfo {
  type: CareerStageType;
  label: string;
  description: string;
  percentile: number;
}

