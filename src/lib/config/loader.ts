import { ConfigData, CareerStage, IncomeBand, AssetBand, JobType } from '@/types/config';
import { IncomeBracketLearningPointsData } from '@/types/learning-points';
import fs from 'fs';
import path from 'path';

let configCache: ConfigData | null = null;
let learningPointsCache: IncomeBracketLearningPointsData | null = null;

async function loadJSON<T>(filePath: string): Promise<T> {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(fileContents) as T;
}

export async function loadConfig(): Promise<ConfigData> {
  if (configCache) {
    return configCache;
  }

  try {
    const [careerStagesData, incomeBandsData, assetBandsData, jobTypesData] = await Promise.all([
      loadJSON<{ career_stages: CareerStage[] }>('config/career-stages.json'),
      loadJSON<{ income_bands: IncomeBand[] }>('config/income-bands.json'),
      loadJSON<{ asset_bands: AssetBand[] }>('config/asset-bands.json'),
      loadJSON<{ job_types: JobType[] }>('config/job-types.json'),
    ]);

    configCache = {
      careerStages: careerStagesData.career_stages,
      incomeBands: incomeBandsData.income_bands,
      assetBands: assetBandsData.asset_bands,
      jobTypes: jobTypesData.job_types,
    };

    return configCache;
  } catch (error) {
    console.error('Failed to load config:', error);
    throw new Error('Config loading failed');
  }
}

export function getConfig(): ConfigData {
  if (!configCache) {
    throw new Error('Config not loaded. Call loadConfig() first.');
  }
  return configCache;
}

export async function loadLearningPoints(): Promise<IncomeBracketLearningPointsData> {
  if (learningPointsCache) {
    return learningPointsCache;
  }

  try {
    learningPointsCache = await loadJSON<IncomeBracketLearningPointsData>(
      'config/income-bracket-learning-points.json'
    );
    return learningPointsCache;
  } catch (error) {
    console.error('Failed to load learning points:', error);
    throw new Error('Learning points loading failed');
  }
}

export function getLearningPoints(): IncomeBracketLearningPointsData {
  if (!learningPointsCache) {
    throw new Error('Learning points not loaded. Call loadLearningPoints() first.');
  }
  return learningPointsCache;
}

