import { RawInput } from './input';
import { DiagnosisResult, StageInfo } from './output';

export interface DiagnoseRequest extends RawInput {}

export interface DiagnoseResponse {
  success: boolean;
  data?: DiagnosisResult;
  stage?: StageInfo; // 6단계 정보 추가
  cached?: boolean;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

