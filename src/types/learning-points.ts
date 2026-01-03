export interface IncomeBracketLearningPoint {
  percentile: number;
  income_range: {
    min: number;
    max: number | null;
  };
  common_problems: string[];
  cognitive_gaps: string[];
  learning_points: string[];
}

export interface IncomeBracketLearningPointsData {
  brackets: IncomeBracketLearningPoint[];
}

