# PDF 파일 반영 구조 완료 요약

## ✅ 구현 완료 사항

### 1. PDF 파싱 모듈
- `src/lib/pdf/parser.ts`: PDF 텍스트 추출 및 메타데이터 읽기
- `src/lib/pdf/loader.ts`: PDF 설정 로드 및 내용 관리

### 2. API 엔드포인트
- `POST /api/upload-pdf`: PDF 파일 업로드
- `GET /api/upload-pdf`: PDF 목록 조회
- `GET /api/pdf-config`: PDF 설정 조회
- `PUT /api/pdf-config`: PDF 설정 업데이트

### 3. 타입 정의
- `src/types/pdf-config.ts`: PDF 설정 및 내용 타입

### 4. 설정 파일
- `config/pdf-config.json`: PDF 설정 파일

### 5. 프롬프트 통합
- `src/lib/llm/prompt.ts`: PDF 내용을 프롬프트에 자동 통합

### 6. 문서
- `PDF_UPLOAD_GUIDE.md`: 상세한 사용 가이드

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install pdf-parse --save
```

### 2. PDF 업로드

#### 방법 A: API 사용

```bash
curl -X POST http://localhost:3000/api/upload-pdf \
  -F "file=@your-document.pdf" \
  -F "title=문서 제목" \
  -F "maxLength=5000"
```

#### 방법 B: 수동 설정

1. PDF 파일을 `public/uploads/pdfs/`에 복사
2. `config/pdf-config.json` 수정:

```json
{
  "enabled": true,
  "pdfs": [
    {
      "id": "pdf-1",
      "title": "문서 제목",
      "filename": "your-document.pdf",
      "enabled": true,
      "maxLength": 5000
    }
  ]
}
```

### 3. 활성화 확인

- `config/pdf-config.json`에서 `enabled: true` 확인
- 각 PDF의 `enabled: true` 확인
- 서버 재시작

## 📁 파일 구조

```
프로젝트 루트/
├── config/
│   └── pdf-config.json          # PDF 설정 파일
├── public/
│   └── uploads/
│       └── pdfs/                 # PDF 파일 저장 디렉토리
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── upload-pdf/      # PDF 업로드 API
│   │       └── pdf-config/       # PDF 설정 API
│   ├── lib/
│   │   ├── pdf/
│   │   │   ├── parser.ts        # PDF 파싱
│   │   │   └── loader.ts        # PDF 로더
│   │   └── llm/
│   │       └── prompt.ts        # 프롬프트 빌더 (PDF 통합)
│   └── types/
│       └── pdf-config.ts          # PDF 타입 정의
└── PDF_UPLOAD_GUIDE.md         # 상세 가이드
```

## 🔄 두 가지 학습 구조

### 1. 현재 구조 (구조화된 JSON)
- `config/llm-prompt-config.json`: LLM 프롬프트 설정
- `config/income-bracket-learning-points.json`: 소득 구간별 학습 포인트

### 2. PDF 파일 반영
- `config/pdf-config.json`: PDF 설정
- `public/uploads/pdfs/`: PDF 파일 저장소

**두 구조는 동시에 사용 가능합니다!**

## 📝 주요 기능

1. **PDF 업로드**: API 또는 수동으로 PDF 파일 업로드
2. **텍스트 추출**: PDF에서 텍스트 자동 추출
3. **프롬프트 통합**: 활성화된 PDF 내용이 자동으로 프롬프트에 포함
4. **길이 제한**: `maxLength`로 프롬프트에 포함될 텍스트 길이 제한
5. **캐싱**: PDF 내용 캐싱으로 성능 최적화

## ⚙️ 설정 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `enabled` | PDF 기능 전체 활성화 | `false` |
| `pdfs[].enabled` | 개별 PDF 활성화 | `false` |
| `pdfs[].maxLength` | 최대 텍스트 길이 (문자) | `5000` |

## 🔍 확인 방법

1. **PDF 목록 조회**:
   ```bash
   curl http://localhost:3000/api/upload-pdf
   ```

2. **설정 확인**:
   ```bash
   curl http://localhost:3000/api/pdf-config
   ```

3. **프롬프트 확인**: 진단 API 호출 시 PDF 내용이 프롬프트에 포함되는지 확인

## 📚 더 자세한 정보

- `PDF_UPLOAD_GUIDE.md`: 상세한 사용 가이드 및 문제 해결

## 🎉 완료!

이제 PDF 파일을 업로드하여 ChatGPT 학습에 활용할 수 있습니다!

