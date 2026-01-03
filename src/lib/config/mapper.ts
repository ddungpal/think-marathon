import { ConfigData, CareerStage, IncomeBand, AssetBand, JobType } from '@/types/config';
import { RawInput, NormalizedInput } from '@/types/input';

export function mapCareerStage(years: number, config: ConfigData): CareerStage {
  const stage = config.careerStages.find(
    (s) => years >= s.min_year && years <= s.max_year
  );

  if (!stage) {
    throw new Error(`Invalid career years: ${years}`);
  }

  return stage;
}

export function mapIncomeBand(amount: number, config: ConfigData): IncomeBand {
  const band = config.incomeBands.find(
    (b) => amount >= b.min && (b.max === null || amount <= b.max)
  );

  if (!band) {
    throw new Error(`Invalid income: ${amount}`);
  }

  return band;
}

export function mapAssetBand(amount: number, config: ConfigData): AssetBand {
  const band = config.assetBands.find(
    (b) => amount >= b.min && (b.max === null || amount <= b.max)
  );

  if (!band) {
    throw new Error(`Invalid net worth: ${amount}`);
  }

  return band;
}

export function normalizeInput(input: RawInput, config: ConfigData): NormalizedInput {
  // 직업 타입 매핑
  const jobType = config.jobTypes.find((jt) => jt.label === input.job_type);
  if (!jobType) {
    throw new Error(`Invalid job type: ${input.job_type}`);
  }

  // 커리어 단계 매핑
  const careerStage = mapCareerStage(input.career_years, config);

  // 소득 구간 매핑
  const incomeBand = mapIncomeBand(input.monthly_income, config);

  // 자산 구간 매핑
  const assetBand = mapAssetBand(input.net_worth, config);

  return {
    job_type_code: jobType.code,
    job_type_label: jobType.label,
    career_stage: {
      id: careerStage.id,
      label: careerStage.label,
    },
    income_band: {
      id: incomeBand.id,
      label: incomeBand.label,
    },
    asset_band: {
      id: assetBand.id,
      label: assetBand.label,
    },
  };
}

