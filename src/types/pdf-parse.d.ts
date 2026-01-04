/**
 * pdf-parse 모듈 타입 선언
 * pdf-parse는 선택적 의존성이므로 타입 정의를 별도로 제공합니다.
 */
declare module 'pdf-parse' {
  interface PDFInfo {
    Title?: string;
    Author?: string;
    Subject?: string;
    Keywords?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
    Trapped?: string;
  }

  interface PDFMetadata {
    info?: PDFInfo;
    metadata?: any;
    numpages: number;
    numrender: number;
    info?: PDFInfo;
    version?: string;
  }

  interface PDFData extends PDFMetadata {
    text: string;
    numpages: number;
    numrender: number;
    info?: PDFInfo;
    metadata?: any;
    version?: string;
  }

  function pdfParse(dataBuffer: Buffer, options?: any): Promise<PDFData>;
  
  export default pdfParse;
}

