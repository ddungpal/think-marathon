import { NormalizedInput } from '@/types/input';

export function generateCacheKey(input: NormalizedInput): string {
  return `${input.job_type_code}:${input.career_stage.id}:${input.income_band.id}:${input.asset_band.id}`;
}

