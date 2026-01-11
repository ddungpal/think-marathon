import { IncomeBand } from '@/types/config';
import { CareerStageType, StageInfo } from '@/types/output';

/**
 * 실제 소득값을 기반으로 6단계 매핑
 * 새로운 기준:
 * - 0~300만원 이하: 노동자
 * - 300만원 초과~600만원 이하: 숙련자
 * - 600만원 초과~1500만원 이하: 실력자
 * - 1500만원 초과~3000만원 이하: 전문가
 * - 3000만원 초과~5000만원 이하: 시스템
 * - 5000만원 초과~1억원 이하: 브랜드
 */
export function mapIncomeToStageByValue(monthlyIncome: number): StageInfo {
  // 실제 소득값을 기반으로 단계 매핑
  if (monthlyIncome > 5000 && monthlyIncome <= 10000) {
    // 브랜드: 5000만원 초과~1억원 이하
    return {
      type: '브랜드',
      label: '브랜드',
      description: '선택과 집중이 중요한 단계',
      percentile: 0.01,
    };
  } else if (monthlyIncome > 3000 && monthlyIncome <= 5000) {
    // 시스템: 3000만원 초과~5000만원 이하
    return {
      type: '시스템',
      label: '시스템',
      description: '체계와 구조를 만드는 단계',
      percentile: 0.1,
    };
  } else if (monthlyIncome > 1500 && monthlyIncome <= 3000) {
    // 전문가: 1500만원 초과~3000만원 이하
    return {
      type: '전문가',
      label: '전문가',
      description: '결정과 위임의 균형을 찾는 단계',
      percentile: 1,
    };
  } else if (monthlyIncome > 600 && monthlyIncome <= 1500) {
    // 실력자: 600만원 초과~1500만원 이하
    return {
      type: '실력자',
      label: '실력자',
      description: '효율과 확장을 고민하는 단계',
      percentile: 5,
    };
  } else if (monthlyIncome > 300 && monthlyIncome <= 600) {
    // 숙련자: 300만원 초과~600만원 이하
    return {
      type: '숙련자',
      label: '숙련자',
      description: '인정과 기회를 찾는 단계',
      percentile: 20,
    };
  } else {
    // 노동자: 0~300만원 이하
    return {
      type: '노동자',
      label: '노동자',
      description: '기초를 다지는 단계',
      percentile: 50,
    };
  }
}

/**
 * IncomeBand를 기반으로 6단계 매핑 (하위 호환성)
 * 주의: IncomeBand의 중간값을 사용하여 대략적인 단계를 결정
 */
export function mapIncomeToStage(incomeBand: IncomeBand): StageInfo {
  // IncomeBand의 중간값 계산
  const bandMin = incomeBand.min;
  const bandMax = incomeBand.max ?? 10000; // null인 경우 1억으로 가정
  const midValue = (bandMin + bandMax) / 2;
  
  // 중간값을 기반으로 단계 매핑
  return mapIncomeToStageByValue(midValue);
}

/**
 * 단계 타입에 따른 색상 반환 (MBTI 스타일)
 */
export function getStageColor(type: CareerStageType): {
  primary: string;
  secondary: string;
  bg: string;
} {
  const colorMap: Record<CareerStageType, { primary: string; secondary: string; bg: string }> = {
    노동자: {
      primary: '#3B82F6', // Blue
      secondary: '#DBEAFE',
      bg: 'bg-blue-50',
    },
    숙련자: {
      primary: '#10B981', // Green
      secondary: '#D1FAE5',
      bg: 'bg-green-50',
    },
    실력자: {
      primary: '#F59E0B', // Amber
      secondary: '#FEF3C7',
      bg: 'bg-amber-50',
    },
    전문가: {
      primary: '#8B5CF6', // Purple
      secondary: '#EDE9FE',
      bg: 'bg-purple-50',
    },
    시스템: {
      primary: '#EC4899', // Pink
      secondary: '#FCE7F3',
      bg: 'bg-pink-50',
    },
    브랜드: {
      primary: '#EF4444', // Red
      secondary: '#FEE2E2',
      bg: 'bg-red-50',
    },
  };
  
  return colorMap[type] || colorMap.노동자;
}

