import { DiagnosisResult } from '@/types/output';

export interface ValidationResult {
  valid: boolean;
  data?: DiagnosisResult;
  error?: string;
}

