import { ConfigData } from '@/types/config';
import { IncomeBracketLearningPointsData } from '@/types/learning-points';
import { careerStages } from '@/data/config/career-stages';
import { jobTypes } from '@/data/config/job-types';
import { incomeBands } from '@/data/config/income-bands';
import { assetBands } from '@/data/config/asset-bands';
import fs from 'fs';
import path from 'path';

let configCache: ConfigData | null = null;
let learningPointsCache: IncomeBracketLearningPointsData | null = null;

// JSON 파일 로드 (learning points용)
async function loadJSON<T>(filePath: string): Promise<T> {
  // 여러 경로 시도
  const paths = [
    path.join(process.cwd(), 'public', filePath),
    path.join(process.cwd(), filePath),
    path.join(process.cwd(), 'src', filePath),
  ];
  
  for (const fullPath of paths) {
    try {
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf-8');
        return JSON.parse(fileContents) as T;
      }
    } catch {
      continue;
    }
  }
  
  throw new Error(`Config file not found: ${filePath}`);
}

export async function loadConfig(): Promise<ConfigData> {
  if (configCache) {
    return configCache;
  }

  try {
    // TypeScript 파일에서 직접 import (빌드 시점에 번들에 포함됨)
    configCache = {
      careerStages,
      incomeBands,
      assetBands,
      jobTypes,
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
    // TypeScript 파일에서 직접 import (빌드 시점에 번들에 포함됨)
    const { incomeBracketLearningPoints } = await import('@/data/config/income-bracket-learning-points');
    learningPointsCache = incomeBracketLearningPoints;
    return learningPointsCache;
  } catch (error) {
    console.error('Failed to load learning points:', error);
    // 폴백: JSON 파일 시도
    try {
      learningPointsCache = await loadJSON<IncomeBracketLearningPointsData>(
        'config/income-bracket-learning-points.json'
      );
      return learningPointsCache;
    } catch (jsonError) {
      console.error('Failed to load learning points from JSON:', jsonError);
      throw new Error('Learning points loading failed');
    }
  }
}

export function getLearningPoints(): IncomeBracketLearningPointsData {
  if (!learningPointsCache) {
    throw new Error('Learning points not loaded. Call loadLearningPoints() first.');
  }
  return learningPointsCache;
}

