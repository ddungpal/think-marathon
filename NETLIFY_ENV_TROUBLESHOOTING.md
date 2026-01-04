# Netlify 환경 변수 문제 해결 가이드

## 🔍 문제 상황

Netlify 대시보드에 `OPENAI_API_KEY` 환경 변수를 추가했는데도 여전히 에러가 발생하는 경우의 해결 방법입니다.

---

## ✅ 체크리스트

### 1. 환경 변수 설정 확인

- [ ] Netlify 대시보드에서 `OPENAI_API_KEY` 변수가 존재하는지 확인
- [ ] 변수 이름이 정확히 `OPENAI_API_KEY`인지 확인 (대소문자, 언더스코어)
- [ ] 변수 값이 실제 OpenAI API 키인지 확인 (눈 아이콘으로 확인)
- [ ] 모든 Deploy context에 값이 설정되어 있는지 확인

### 2. 재배포 확인 (가장 중요!)

**환경 변수를 추가/수정한 후 반드시 재배포해야 합니다!**

#### 방법 A: 수동 재배포
1. Netlify 대시보드 → **"Deploys"** 탭
2. 최신 배포 옆 **"..."** 메뉴 클릭
3. **"Trigger deploy"** → **"Deploy site"** 선택
4. 배포 완료 대기 (약 2-3분)

#### 방법 B: 빈 커밋으로 재배포
```bash
git commit --allow-empty -m "Trigger redeploy for environment variables"
git push
```

### 3. 빌드 로그 확인

1. **"Deploys"** 탭 → 최신 배포 클릭
2. 빌드 로그에서 다음 확인:
   - 환경 변수가 제대로 로드되었는지
   - 에러 메시지 확인
   - `OPENAI_API_KEY is not set` 같은 메시지가 있는지

---

## 🛠️ 해결 방법

### 방법 1: 환경 변수 재설정

1. **"Environment variables"** 페이지로 이동
2. `OPENAI_API_KEY` 변수 옆 **"Options"** → **"Edit"** 클릭
3. 값 확인 후 **"Save"** 클릭
4. **재배포 실행** (중요!)

### 방법 2: 변수 삭제 후 재추가

1. `OPENAI_API_KEY` 변수 삭제
2. 새로 추가:
   - Key: `OPENAI_API_KEY`
   - Value: 실제 API 키
3. **재배포 실행**

### 방법 3: Deploy Context 확인

이미지에서 보이는 것처럼, 각 Deploy context에 값이 설정되어 있는지 확인:

- Production ✅
- Deploy Previews ✅
- Branch deploys ✅
- Preview Server & Agent Runners ✅
- Local development (Netlify CLI) ✅

**모든 context에 동일한 값이 설정되어 있는지 확인하세요.**

### 방법 4: 환경 변수 스코프 확인

1. `OPENAI_API_KEY` 변수 옆 **"Options"** 클릭
2. **"Edit"** 클릭
3. **"Scopes"** 섹션 확인:
   - "All scopes" 선택되어 있는지 확인
   - 또는 특정 스코프만 선택되어 있다면 "All scopes"로 변경

---

## 🔍 디버깅 방법

### 1. 빌드 로그에서 확인

Netlify 빌드 로그에서 다음을 확인:

```
Environment variables:
  OPENAI_API_KEY = [hidden]
  NODE_ENV = production
```

`OPENAI_API_KEY`가 목록에 있는지 확인하세요.

### 2. 런타임 로그 확인

1. **"Functions"** 탭 → **"View logs"** 클릭
2. API 호출 시 에러 로그 확인
3. `OPENAI_API_KEY is not set` 메시지가 있는지 확인

### 3. 테스트 API 엔드포인트 생성 (선택사항)

환경 변수를 확인하기 위한 테스트 엔드포인트를 만들 수 있습니다:

```typescript
// src/app/api/test-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  const keyLength = process.env.OPENAI_API_KEY?.length || 0;
  
  return NextResponse.json({
    hasKey,
    keyLength,
    nodeEnv: process.env.NODE_ENV,
    // 실제 키 값은 반환하지 않음 (보안)
  });
}
```

배포 후 `/api/test-env`로 접속하여 환경 변수가 로드되었는지 확인할 수 있습니다.

---

## ⚠️ 주의사항

### 1. 빌드 타임 vs 런타임

Next.js는 빌드 타임에 환경 변수를 번들링합니다. 하지만 Netlify에서는:
- **서버 사이드 (API Routes)**: 런타임에 `process.env`로 접근 가능
- **클라이언트 사이드**: `NEXT_PUBLIC_` 접두사가 필요

`OPENAI_API_KEY`는 서버 사이드에서만 사용되므로 `NEXT_PUBLIC_` 접두사가 **없어야** 합니다.

### 2. 환경 변수 이름 확인

정확한 이름을 사용하세요:
- ✅ `OPENAI_API_KEY` (올바름)
- ❌ `OPENAI_APIKEY` (틀림)
- ❌ `openai_api_key` (틀림 - 소문자)
- ❌ `OPENAI-API-KEY` (틀림 - 하이픈)

### 3. 공백 확인

API 키 값에 앞뒤 공백이 없는지 확인하세요:
- ✅ `sk-proj-xxxxx...` (올바름)
- ❌ ` sk-proj-xxxxx... ` (틀림 - 공백 포함)

---

## 🎯 단계별 해결 절차

### Step 1: 환경 변수 확인
1. Netlify 대시보드 → **"Environment variables"**
2. `OPENAI_API_KEY` 존재 확인
3. 눈 아이콘으로 실제 값 확인

### Step 2: 재배포
1. **"Deploys"** 탭
2. **"Trigger deploy"** → **"Deploy site"**
3. 배포 완료 대기

### Step 3: 테스트
1. 배포된 사이트 접속
2. 진단 폼 입력
3. "진단 시작하기" 클릭
4. 정상 작동 확인

### Step 4: 로그 확인 (여전히 에러인 경우)
1. **"Functions"** → **"View logs"**
2. 에러 메시지 확인
3. 위의 해결 방법 시도

---

## 📞 추가 도움

### Netlify 지원

- [Netlify 공식 문서 - Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Netlify Support](https://www.netlify.com/support/)

### Next.js 환경 변수

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## 💡 자주 발생하는 실수

1. **재배포를 하지 않음** ⚠️ 가장 흔한 실수
2. **변수 이름 오타** (대소문자, 언더스코어)
3. **API 키 값에 공백 포함**
4. **Deploy context에 값이 설정되지 않음**
5. **스코프 설정이 잘못됨**

---

**대부분의 경우 재배포를 하면 해결됩니다!** 🎉

