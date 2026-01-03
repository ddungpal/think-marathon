import { IncomeBand } from '@/types/config';
import { IncomeBracketLearningPoint } from '@/types/learning-points';
import { getLearningPoints } from './loader';

/**
 * 소득 구간을 상위 % 구간으로 매핑
 * incomeBand의 범위와 bracket의 범위가 겹치는 경우 매칭
 */
export function mapIncomeToBracket(incomeBand: IncomeBand): IncomeBracketLearningPoint | null {
  let learningPoints;
  try {
    learningPoints = getLearningPoints();
  } catch (error) {
    console.warn('Learning points not loaded:', error);
    return null;
  }

  // 구간을 역순으로 검색 (높은 구간부터)
  const sortedBrackets = [...learningPoints.brackets].sort((a, b) => b.percentile - a.percentile);

  for (const bracket of sortedBrackets) {
    const { min: bracketMin, max: bracketMax } = bracket.income_range;
    const { min: bandMin, max: bandMax } = incomeBand;

    // 구간 겹침 확인
    // incomeBand의 범위와 bracket의 범위가 겹치는지 확인
    const bandMaxValue = bandMax || Infinity;
    const bracketMaxValue = bracketMax || Infinity;

    // 구간이 겹치는 경우: bandMin <= bracketMax && bandMax >= bracketMin
    if (bandMin <= bracketMaxValue && bandMaxValue >= bracketMin) {
      return bracket;
    }
  }

  // 매칭되는 구간이 없으면 가장 낮은 구간 반환
  return learningPoints.brackets.find((b) => b.percentile === 50) || null;
}

