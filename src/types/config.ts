export interface CareerStage {
  id: string;
  label: string;
  min_year: number;
  max_year: number;
}

export interface IncomeBand {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export interface AssetBand {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export interface JobType {
  code: string;
  label: string;
}

export interface ConfigData {
  careerStages: CareerStage[];
  incomeBands: IncomeBand[];
  assetBands: AssetBand[];
  jobTypes: JobType[];
}

