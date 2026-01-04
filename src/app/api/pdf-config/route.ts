import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { loadPDFConfig, clearPDFCache, clearPDFConfigCache } from '@/lib/pdf/loader';
import { PDFConfig } from '@/types/pdf-config';

const PDF_CONFIG_PATH = path.join(process.cwd(), 'config', 'pdf-config.json');

// PDF 설정 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { enabled, pdfs } = body as Partial<PDFConfig>;

    const currentConfig = await loadPDFConfig();
    
    const updatedConfig: PDFConfig = {
      enabled: enabled !== undefined ? enabled : currentConfig.enabled,
      pdfs: pdfs || currentConfig.pdfs,
    };

    // 설정 파일 저장
    await writeFile(PDF_CONFIG_PATH, JSON.stringify(updatedConfig, null, 2), 'utf-8');

    // 캐시 초기화
    clearPDFCache();
    clearPDFConfigCache();

    return NextResponse.json({
      success: true,
      data: updatedConfig,
    });
  } catch (error) {
    console.error('PDF 설정 업데이트 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'PDF 설정 업데이트에 실패했습니다.',
      },
      { status: 500 }
    );
  }
}

// PDF 설정 조회
export async function GET() {
  try {
    const pdfConfig = await loadPDFConfig();
    return NextResponse.json({
      success: true,
      data: pdfConfig,
    });
  } catch (error) {
    console.error('PDF 설정 조회 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'PDF 설정을 조회할 수 없습니다.',
      },
      { status: 500 }
    );
  }
}

