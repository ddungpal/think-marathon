/**
 * PDF 설정 타입 정의
 */
export interface PDFConfig {
  /** PDF 기능 활성화 여부 */
  enabled: boolean;
  /** PDF 파일 목록 */
  pdfs: PDFFile[];
}

/**
 * PDF 파일 정보
 */
export interface PDFFile {
  /** PDF 고유 ID */
  id: string;
  /** PDF 제목 */
  title: string;
  /** 파일명 */
  filename: string;
  /** 활성화 여부 */
  enabled: boolean;
  /** 프롬프트에 포함할 최대 텍스트 길이 (문자 수) */
  maxLength?: number;
  /** 설명 */
  description?: string;
}

/**
 * PDF 내용
 */
export interface PDFContent {
  /** PDF ID */
  id: string;
  /** PDF 제목 */
  title: string;
  /** 추출된 텍스트 */
  text: string;
  /** 최대 길이 */
  maxLength: number;
}

