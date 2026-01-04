import fs from 'fs/promises';
import path from 'path';

/**
 * PDF 파일에서 텍스트를 추출합니다.
 * 
 * @param filePath PDF 파일 경로
 * @returns 추출된 텍스트
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    // pdf-parse 라이브러리를 사용하여 PDF 파싱
    // 동적 import를 사용하여 빌드 타임 에러 방지
    let pdfParse;
    try {
      pdfParse = await import('pdf-parse');
    } catch (importError) {
      console.warn('pdf-parse 라이브러리를 찾을 수 없습니다. PDF 기능을 사용하려면 npm install pdf-parse를 실행하세요.');
      throw new Error('PDF_PARSER_NOT_AVAILABLE');
    }

    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse.default(dataBuffer);
    
    return data.text;
  } catch (error) {
    // pdf-parse가 없는 경우를 구분
    if (error instanceof Error && error.message === 'PDF_PARSER_NOT_AVAILABLE') {
      throw error;
    }
    console.error('PDF 파싱 실패:', error);
    throw new Error(`PDF 파일을 읽을 수 없습니다: ${filePath}`);
  }
}

/**
 * PDF 파일이 존재하는지 확인합니다.
 */
export async function checkPDFExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * PDF 파일의 메타데이터를 가져옵니다.
 */
export async function getPDFMetadata(filePath: string): Promise<{
  title?: string;
  author?: string;
  pages: number;
  size: number;
}> {
  try {
    let pdfParse;
    try {
      pdfParse = await import('pdf-parse');
    } catch (importError) {
      console.warn('pdf-parse 라이브러리를 찾을 수 없습니다.');
      throw new Error('PDF_PARSER_NOT_AVAILABLE');
    }

    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse.default(dataBuffer);
    const stats = await fs.stat(filePath);
    
    return {
      title: data.info?.Title,
      author: data.info?.Author,
      pages: data.numpages,
      size: stats.size,
    };
  } catch (error) {
    // pdf-parse가 없는 경우를 구분
    if (error instanceof Error && error.message === 'PDF_PARSER_NOT_AVAILABLE') {
      throw error;
    }
    console.error('PDF 메타데이터 읽기 실패:', error);
    throw new Error(`PDF 메타데이터를 읽을 수 없습니다: ${filePath}`);
  }
}

