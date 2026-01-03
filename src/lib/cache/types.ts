import { DiagnosisResult } from '@/types/output';

export interface CacheInterface {
  get(key: string): Promise<DiagnosisResult | null>;
  set(key: string, value: DiagnosisResult): Promise<void>;
  has(key: string): Promise<boolean>;
  clear(): Promise<void>;
  size(): Promise<number>;
}

