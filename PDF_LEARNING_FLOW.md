# PDF 학습 시스템 동작 원리

이 문서는 PDF 학습이 어떻게 작동하고 진단 결과에 반영되는지 설명합니다.

## 📋 전체 흐름

### 1단계: PDF 설정 로드
```
진단 요청 → ensurePDFConfigLoaded() → loadPDFConfig()
```

**위치**: `src/app/api/diagnose/route.ts:43-54`
- PDF 설정 파일을 로드합니다
- TypeScript 파일(`src/data/config/pdf-config.ts`)에서 먼저 시도
- 실패 시 JSON 파일(`config/pdf-config.json`)에서 시도

### 2단계: PDF 내용 로드 (프롬프트 생성 시)
```
buildPrompt() → loadPDFConfig() → loadPDFContents() → extractTextFromPDF()
```

**위치**: `src/lib/llm/prompt.ts:65-98`
- 프롬프트 생성 시 PDF 내용을 로드합니다
- `pdfConfig.enabled === true`이고 활성화된 PDF가 있어야 함
- 각 PDF의 `enabled === true`인 것만 로드

### 3단계: PDF 내용을 프롬프트에 포함
```
buildPrompt() → pdfSection 생성 → LLM 프롬프트에 추가
```

**위치**: `src/lib/llm/prompt.ts:65-98`
- PDF 내용이 `pdfSection`에 포함됩니다
- 프롬프트의 "추가 학습 자료 (PDF 문서)" 섹션에 추가됩니다

### 4단계: LLM에 전달
```
buildPrompt() → generateDiagnosis() → OpenAI API 호출
```

**위치**: `src/lib/llm/client.ts:42-106`
- 전체 프롬프트(PDF 내용 포함)를 LLM에 전달합니다
- LLM이 PDF 내용을 참고하여 진단 결과를 생성합니다

## 🔍 현재 상태 확인

### 1. PDF 설정 확인

**TypeScript 파일**: `src/data/config/pdf-config.ts`
```typescript
export const pdfConfig: PDFConfig = {
  enabled: false,  // ❌ 비활성화됨
  pdfs: [
    {
      id: "pdf-1",
      title: "예시 PDF 문서",
      filename: "example.pdf",
      enabled: false,  // ❌ 비활성화됨
      maxLength: 5000,
    }
  ]
};
```

**JSON 파일**: `config/pdf-config.json`
```json
{
  "enabled": false,  // ❌ 비활성화됨
  "pdfs": [
    {
      "id": "pdf-1",
      "title": "학습자본의 정의 1차",
      "filename": "학습자본의 정의 1차.pdf",
      "enabled": false,  // ❌ 비활성화됨
      "maxLength": 5000
    }
  ]
}
```

### 2. PDF 파일 확인

**위치**: `public/uploads/pdfs/`
- ✅ `학습자본의 정의 1차.pdf` 파일이 존재합니다

## ❌ 문제점

### 문제 1: PDF 설정이 비활성화됨
- `pdfConfig.enabled === false`
- 이 때문에 PDF 내용이 로드되지 않습니다

### 문제 2: PDF 파일이 비활성화됨
- 개별 PDF의 `enabled === false`
- 설정이 활성화되어도 개별 PDF가 비활성화되어 있으면 로드되지 않습니다

### 문제 3: TypeScript 파일이 실제 파일과 불일치
- TypeScript 파일: `filename: "example.pdf"`
- JSON 파일: `filename: "학습자본의 정의 1차.pdf"`
- 실제 파일: `학습자본의 정의 1차.pdf`
- TypeScript 파일이 오래된 정보를 가지고 있습니다

## ✅ 해결 방법

### 방법 1: JSON 파일 수정 (권장 - 즉시 반영)

`config/pdf-config.json` 파일을 다음과 같이 수정:

```json
{
  "enabled": true,
  "pdfs": [
    {
      "id": "pdf-1",
      "title": "학습자본의 정의 1차",
      "filename": "학습자본의 정의 1차.pdf",
      "enabled": true,
      "maxLength": 5000,
      "description": "학습자본의 정의와 관련된 내용"
    }
  ]
}
```

**중요**: TypeScript 파일도 함께 업데이트해야 합니다.

### 방법 2: TypeScript 파일 수정 (빌드에 포함)

`src/data/config/pdf-config.ts` 파일을 다음과 같이 수정:

```typescript
import { PDFConfig } from '@/types/pdf-config';

export const pdfConfig: PDFConfig = {
  enabled: true,  // ✅ 활성화
  pdfs: [
    {
      id: "pdf-1",
      title: "학습자본의 정의 1차",
      filename: "학습자본의 정의 1차.pdf",  // ✅ 실제 파일명
      enabled: true,  // ✅ 활성화
      maxLength: 5000,
      description: "학습자본의 정의와 관련된 내용"
    }
  ]
};
```

### 방법 3: PDF 업로드 API 사용

```bash
# PDF 업로드 (자동으로 설정 업데이트)
POST /api/upload-pdf
```

또는

```bash
# PDF 설정 직접 업데이트
PUT /api/pdf-config
Content-Type: application/json

{
  "enabled": true,
  "pdfs": [
    {
      "id": "pdf-1",
      "title": "학습자본의 정의 1차",
      "filename": "학습자본의 정의 1차.pdf",
      "enabled": true,
      "maxLength": 5000
    }
  ]
}
```

## 📝 PDF 학습이 반영되는 방식

### 1. PDF 내용 추출
```
PDF 파일 → pdf-parse → 텍스트 추출
```
- `src/lib/pdf/parser.ts`의 `extractTextFromPDF()` 함수 사용
- `pdf-parse` 라이브러리로 PDF에서 텍스트 추출
- `maxLength` 값으로 텍스트 길이 제한 (기본: 5000자)

### 2. 프롬프트에 포함
```typescript
## 추가 학습 자료 (PDF 문서)

다음 문서들을 참고하여 진단을 수행하세요. 
문서의 내용을 바탕으로 더 정확하고 깊이 있는 진단을 제공할 수 있습니다.

## 참고 문서: 학습자본의 정의 1차

[PDF 내용이 여기에 포함됨]

**중요**: PDF 문서의 내용을 참고하되, 문서 내용을 그대로 복사하지 말고 
사용자의 상황에 맞게 해석하여 적용하세요.
```

### 3. LLM이 PDF 내용을 활용
- PDF 내용을 참고하여 진단 결과 생성
- 사용자의 상황에 맞게 해석하여 적용
- PDF의 개념과 원칙을 진단에 반영

## 🔧 즉시 수정 (빠른 해결)

다음 두 파일을 수정하세요:

### 1. `config/pdf-config.json`
```json
{
  "enabled": true,
  "pdfs": [
    {
      "id": "pdf-1",
      "title": "학습자본의 정의 1차",
      "filename": "학습자본의 정의 1차.pdf",
      "enabled": true,
      "maxLength": 5000,
      "description": "학습자본의 정의와 관련된 내용"
    }
  ]
}
```

### 2. `src/data/config/pdf-config.ts`
```typescript
import { PDFConfig } from '@/types/pdf-config';

export const pdfConfig: PDFConfig = {
  enabled: true,
  pdfs: [
    {
      id: "pdf-1",
      title: "학습자본의 정의 1차",
      filename: "학습자본의 정의 1차.pdf",
      enabled: true,
      maxLength: 5000,
      description: "학습자본의 정의와 관련된 내용"
    }
  ]
};
```

## 🧪 확인 방법

### 1. 로그 확인
진단 실행 시 다음 로그가 나타나야 합니다:
```
PDF config loaded
PDF 내용 로드: pdf-1
PDF 내용 로드 성공: 학습자본의 정의 1차
```

### 2. 프롬프트 확인 (디버깅용)
`src/lib/llm/prompt.ts`에 로그 추가:
```typescript
console.log('PDF Section:', pdfSection);
```

### 3. 결과 확인
- 진단 결과에 PDF 내용이 반영되었는지 확인
- PDF의 개념이나 원칙이 결과에 포함되었는지 확인

## ⚠️ 주의사항

1. **PDF 파서 라이브러리 필요**
   ```bash
   npm install pdf-parse
   ```

2. **텍스트 길이 제한**
   - `maxLength`로 제한 (기본: 5000자)
   - 긴 PDF는 처음 부분만 사용됨

3. **캐싱**
   - PDF 내용은 캐시되어 재로드되지 않음
   - PDF를 변경한 경우 캐시 초기화 필요

4. **TypeScript 파일 우선순위**
   - TypeScript 파일이 JSON 파일보다 우선
   - 두 파일 모두 업데이트해야 함

## 🐛 문제 해결

### PDF가 로드되지 않는 경우

1. **PDF 설정 확인**
   ```bash
   # PDF 설정 확인
   curl http://localhost:3000/api/pdf-config
   ```

2. **PDF 파일 존재 확인**
   ```bash
   ls -la public/uploads/pdfs/
   ```

3. **pdf-parse 라이브러리 확인**
   ```bash
   npm list pdf-parse
   ```

4. **서버 로그 확인**
   - PDF 로드 실패 메시지 확인
   - 에러 원인 파악

### PDF 내용이 프롬프트에 포함되지 않는 경우

1. **프롬프트 로그 확인**
   - `buildPrompt()` 함수에 로그 추가
   - `pdfSection` 값 확인

2. **PDF 설정 재확인**
   - `enabled: true` 확인
   - 개별 PDF의 `enabled: true` 확인

3. **PDF 파일 형식 확인**
   - PDF 파일이 손상되지 않았는지 확인
   - 텍스트 추출 가능한 PDF인지 확인

## 📚 참고 자료

- PDF 파서: `src/lib/pdf/parser.ts`
- PDF 로더: `src/lib/pdf/loader.ts`
- 프롬프트 빌더: `src/lib/llm/prompt.ts`
- PDF 설정 타입: `src/types/pdf-config.ts`

