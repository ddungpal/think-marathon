export interface RawInput {
  name: string;
  age: number;
  job_type: string;
  career_years: number;
  monthly_income: number;
  net_worth: number;
}

export interface NormalizedInput {
  job_type_code: string;
  job_type_label: string;
  career_stage: {
    id: string;
    label: string;
  };
  income_band: {
    id: string;
    label: string;
  };
  asset_band: {
    id: string;
    label: string;
  };
}

