# PDF 파일 업로드 및 반영 가이드

이 문서는 ChatGPT 사전 학습을 위해 PDF 파일을 업로드하고 프롬프트에 반영하는 방법을 설명합니다.

## 📋 개요

프로젝트는 두 가지 학습 구조를 지원합니다:

1. **현재 구조 (구조화된 JSON)**: `config/llm-prompt-config.json`과 `config/income-bracket-learning-points.json`을 사용
2. **PDF 파일 반영**: PDF 파일을 업로드하여 추가 학습 자료로 활용

## 🚀 시작하기

### 1단계: PDF 파싱 라이브러리 설치

프로젝트 루트에서 다음 명령어를 실행하세요:

```bash
npm install pdf-parse --save
```

### 2단계: 업로드 디렉토리 생성

PDF 파일이 저장될 디렉토리를 생성합니다:

```bash
mkdir -p public/uploads/pdfs
```

또는 코드가 자동으로 생성합니다.

## 📤 PDF 파일 업로드 방법

### 방법 1: API를 통한 업로드 (권장)

#### cURL 사용

```bash
curl -X POST http://localhost:3000/api/upload-pdf \
  -F "file=@/path/to/your/document.pdf" \
  -F "title=문서 제목" \
  -F "description=문서 설명" \
  -F "maxLength=5000"
```

#### JavaScript/TypeScript 사용

```typescript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('title', '문서 제목');
formData.append('description', '문서 설명');
formData.append('maxLength', '5000');

const response = await fetch('/api/upload-pdf', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result);
```

### 방법 2: 수동 업로드

1. **PDF 파일 복사**
   - PDF 파일을 `public/uploads/pdfs/` 디렉토리에 복사
   - 파일명 예시: `my-document.pdf`

2. **설정 파일 수정**
   - `config/pdf-config.json` 파일 열기
   - PDF 정보 추가:

```json
{
  "enabled": true,
  "pdfs": [
    {
      "id": "pdf-1",
      "title": "내 문서 제목",
      "filename": "my-document.pdf",
      "enabled": true,
      "maxLength": 5000,
      "description": "문서 설명"
    }
  ]
}
```

## ⚙️ PDF 설정 관리

### 설정 파일 구조

`config/pdf-config.json`:

```json
{
  "enabled": true,
  "pdfs": [
    {
      "id": "pdf-1",
      "title": "문서 제목",
      "filename": "document.pdf",
      "enabled": true,
      "maxLength": 5000,
      "description": "문서 설명"
    }
  ]
}
```

### 설정 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `enabled` | boolean | PDF 기능 전체 활성화 여부 |
| `pdfs` | array | PDF 파일 목록 |
| `pdfs[].id` | string | PDF 고유 ID |
| `pdfs[].title` | string | PDF 제목 (프롬프트에 표시됨) |
| `pdfs[].filename` | string | 파일명 (public/uploads/pdfs/ 내의 파일명) |
| `pdfs[].enabled` | boolean | 해당 PDF 활성화 여부 |
| `pdfs[].maxLength` | number | 프롬프트에 포함할 최대 텍스트 길이 (문자 수) |
| `pdfs[].description` | string | PDF 설명 (선택사항) |

### API를 통한 설정 업데이트

```bash
curl -X PUT http://localhost:3000/api/pdf-config \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "pdfs": [
      {
        "id": "pdf-1",
        "title": "업데이트된 제목",
        "filename": "document.pdf",
        "enabled": true,
        "maxLength": 10000
      }
    ]
  }'
```

## 🔍 PDF 목록 조회

```bash
curl http://localhost:3000/api/upload-pdf
```

또는

```bash
curl http://localhost:3000/api/pdf-config
```

## 🎯 프롬프트에 반영되는 방식

PDF가 활성화되면, 프롬프트에 다음과 같은 섹션이 추가됩니다:

```
## 추가 학습 자료 (PDF 문서)

다음 문서들을 참고하여 진단을 수행하세요. 문서의 내용을 바탕으로 더 정확하고 깊이 있는 진단을 제공할 수 있습니다.

## 참고 문서: 문서 제목

[PDF에서 추출된 텍스트 내용...]

---

**중요**: PDF 문서의 내용을 참고하되, 문서 내용을 그대로 복사하지 말고 사용자의 상황에 맞게 해석하여 적용하세요.
```

## 📝 사용 예시

### 예시 1: 단일 PDF 업로드

```bash
# PDF 업로드
curl -X POST http://localhost:3000/api/upload-pdf \
  -F "file=@career-guide.pdf" \
  -F "title=커리어 가이드" \
  -F "description=커리어 발전을 위한 가이드 문서" \
  -F "maxLength=5000"
```

### 예시 2: 여러 PDF 업로드

여러 PDF를 업로드하려면 각각 업로드하고, 설정 파일에서 모두 활성화하세요:

```json
{
  "enabled": true,
  "pdfs": [
    {
      "id": "pdf-1",
      "title": "커리어 가이드",
      "filename": "career-guide.pdf",
      "enabled": true,
      "maxLength": 5000
    },
    {
      "id": "pdf-2",
      "title": "재무 관리 가이드",
      "filename": "finance-guide.pdf",
      "enabled": true,
      "maxLength": 5000
    }
  ]
}
```

## ⚠️ 주의사항

### 1. 파일 크기 제한

- Next.js 기본 파일 업로드 크기 제한: 4.5MB
- 더 큰 파일을 업로드하려면 `next.config.js`에서 설정:

```javascript
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
```

### 2. 텍스트 길이 제한

- `maxLength`로 프롬프트에 포함될 텍스트 길이를 제한할 수 있습니다
- 기본값: 5000자
- 너무 긴 텍스트는 LLM 토큰 제한에 영향을 줄 수 있습니다

### 3. 캐시 관리

PDF 설정을 변경한 후에는 서버를 재시작하거나 캐시를 초기화해야 합니다:

```typescript
import { clearPDFCache, clearPDFConfigCache } from '@/lib/pdf/loader';

// 캐시 초기화
clearPDFCache();
clearPDFConfigCache();
```

### 4. Git 관리

`public/uploads/pdfs/` 디렉토리는 `.gitignore`에 추가하는 것을 권장합니다:

```gitignore
# PDF 업로드 파일
public/uploads/pdfs/*
!public/uploads/pdfs/.gitkeep
```

## 🔧 문제 해결

### PDF 파싱 실패

- PDF 파일이 손상되었는지 확인
- PDF가 암호화되어 있지 않은지 확인
- `pdf-parse` 라이브러리가 설치되었는지 확인

### 텍스트 추출 실패

- PDF가 이미지만 포함하고 있는 경우 텍스트 추출이 불가능할 수 있습니다
- OCR이 필요한 경우 별도 처리 필요

### 프롬프트에 반영되지 않음

1. `config/pdf-config.json`에서 `enabled: true` 확인
2. 각 PDF의 `enabled: true` 확인
3. 서버 재시작
4. PDF 파일이 `public/uploads/pdfs/` 디렉토리에 존재하는지 확인

## 📚 API 엔드포인트 요약

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/upload-pdf` | POST | PDF 파일 업로드 |
| `/api/upload-pdf` | GET | PDF 목록 조회 |
| `/api/pdf-config` | GET | PDF 설정 조회 |
| `/api/pdf-config` | PUT | PDF 설정 업데이트 |

## 🎉 완료!

PDF 파일을 업로드하고 설정하면, ChatGPT 진단 시 해당 PDF의 내용이 참고 자료로 활용됩니다!

