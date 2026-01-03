import { RawInput } from './input';
import { DiagnosisResult } from './output';

export interface DiagnoseRequest extends RawInput {}

export interface DiagnoseResponse {
  success: boolean;
  data?: DiagnosisResult;
  cached?: boolean;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

