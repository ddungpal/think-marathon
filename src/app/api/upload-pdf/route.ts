import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { extractTextFromPDF, getPDFMetadata } from '@/lib/pdf/parser';
import { loadPDFConfig } from '@/lib/pdf/loader';
import { PDFFile } from '@/types/pdf-config';

const PDF_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'pdfs');
const PDF_CONFIG_PATH = path.join(process.cwd(), 'config', 'pdf-config.json');

// 업로드 디렉토리 생성
async function ensureUploadDir() {
  try {
    await mkdir(PDF_UPLOAD_DIR, { recursive: true });
  } catch (error) {
    // 디렉토리가 이미 존재하는 경우 무시
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string || 'Untitled PDF';
    const description = formData.get('description') as string || '';
    const maxLength = formData.get('maxLength') ? parseInt(formData.get('maxLength') as string) : 5000;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // PDF 파일인지 확인
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, error: 'PDF 파일만 업로드할 수 있습니다.' },
        { status: 400 }
      );
    }

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filePath = path.join(PDF_UPLOAD_DIR, filename);

    // 파일 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // PDF 메타데이터 가져오기
    let metadata;
    try {
      metadata = await getPDFMetadata(filePath);
    } catch (error) {
      console.warn('PDF 메타데이터 읽기 실패:', error);
      metadata = { pages: 0, size: buffer.length };
    }

    // PDF 설정 파일 업데이트
    const pdfConfig = await loadPDFConfig();
    const newPDF: PDFFile = {
      id: `pdf-${timestamp}`,
      title: title,
      filename: filename,
      enabled: true,
      maxLength: maxLength,
      description: description,
    };

    pdfConfig.pdfs.push(newPDF);

    // 설정 파일 저장
    const fs = await import('fs/promises');
    await fs.writeFile(PDF_CONFIG_PATH, JSON.stringify(pdfConfig, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      data: {
        id: newPDF.id,
        title: newPDF.title,
        filename: newPDF.filename,
        metadata: metadata,
      },
    });
  } catch (error) {
    console.error('PDF 업로드 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'PDF 업로드에 실패했습니다.',
      },
      { status: 500 }
    );
  }
}

// PDF 목록 조회
export async function GET() {
  try {
    const pdfConfig = await loadPDFConfig();
    return NextResponse.json({
      success: true,
      data: {
        enabled: pdfConfig.enabled,
        pdfs: pdfConfig.pdfs,
      },
    });
  } catch (error) {
    console.error('PDF 목록 조회 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'PDF 목록을 조회할 수 없습니다.',
      },
      { status: 500 }
    );
  }
}

