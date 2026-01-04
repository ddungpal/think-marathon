import fs from 'fs/promises';
import path from 'path';
import { extractTextFromPDF, checkPDFExists } from './parser';
import { PDFConfig, PDFContent } from '@/types/pdf-config';

const PDF_CONFIG_PATH = path.join(process.cwd(), 'config', 'pdf-config.json');
const PDF_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'pdfs');

// PDF 설정 캐시
let pdfConfigCache: PDFConfig | null = null;
let pdfContentCache: Map<string, PDFContent> = new Map();

/**
 * PDF 설정 파일을 로드합니다.
 */
export async function loadPDFConfig(): Promise<PDFConfig> {
  if (pdfConfigCache) {
    return pdfConfigCache;
  }

  try {
    const fileContent = await fs.readFile(PDF_CONFIG_PATH, 'utf-8');
    pdfConfigCache = JSON.parse(fileContent);
    return pdfConfigCache!;
  } catch (error) {
    // 설정 파일이 없으면 기본값 반환
    console.warn('PDF 설정 파일을 찾을 수 없습니다. 기본값을 사용합니다.');
    pdfConfigCache = {
      enabled: false,
      pdfs: [],
    };
    return pdfConfigCache;
  }
}

/**
 * PDF 설정을 가져옵니다.
 */
export function getPDFConfig(): PDFConfig {
  if (!pdfConfigCache) {
    throw new Error('PDF 설정이 로드되지 않았습니다. loadPDFConfig()를 먼저 호출하세요.');
  }
  return pdfConfigCache;
}

/**
 * 활성화된 PDF 파일들의 내용을 로드합니다.
 */
export async function loadPDFContents(): Promise<Map<string, PDFContent>> {
  const config = await loadPDFConfig();
  
  if (!config.enabled || config.pdfs.length === 0) {
    return new Map();
  }

  const contents = new Map<string, PDFContent>();

  for (const pdf of config.pdfs) {
    if (!pdf.enabled) {
      continue;
    }

    // 캐시 확인
    if (pdfContentCache.has(pdf.id)) {
      contents.set(pdf.id, pdfContentCache.get(pdf.id)!);
      continue;
    }

    try {
      const filePath = path.join(PDF_UPLOAD_DIR, pdf.filename);
      
      if (!(await checkPDFExists(filePath))) {
        console.warn(`PDF 파일을 찾을 수 없습니다: ${filePath}`);
        continue;
      }

      const text = await extractTextFromPDF(filePath);
      
      const content: PDFContent = {
        id: pdf.id,
        title: pdf.title,
        text: text,
        maxLength: pdf.maxLength || 5000, // 기본값: 5000자
      };

      // 텍스트 길이 제한
      const truncatedText = content.text.length > content.maxLength
        ? content.text.substring(0, content.maxLength) + '...'
        : content.text;

      contents.set(pdf.id, {
        ...content,
        text: truncatedText,
      });

      // 캐시에 저장
      pdfContentCache.set(pdf.id, contents.get(pdf.id)!);
    } catch (error) {
      // pdf-parse 라이브러리가 없는 경우는 경고만 출력하고 계속 진행
      if (error instanceof Error && error.message === 'PDF_PARSER_NOT_AVAILABLE') {
        console.warn(`PDF 파서가 사용 불가능합니다. PDF 기능을 사용하려면 npm install pdf-parse를 실행하세요. (${pdf.id})`);
        continue;
      }
      console.error(`PDF 로드 실패 (${pdf.id}):`, error);
    }
  }

  return contents;
}

/**
 * PDF 내용 캐시를 초기화합니다.
 */
export function clearPDFCache(): void {
  pdfContentCache.clear();
}

/**
 * PDF 설정 캐시를 초기화합니다.
 */
export function clearPDFConfigCache(): void {
  pdfConfigCache = null;
}

