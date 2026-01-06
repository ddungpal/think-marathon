# Netlify ChatGPT API Key 설정 가이드

## 🎯 문제 상황

- ✅ 로컬 개발 환경(`npm run dev`)에서는 정상 작동
- ❌ Netlify 서버에서는 에러 발생
- 원인: `OPENAI_API_KEY` 환경 변수가 Netlify에 설정되지 않음

---

## 🚀 해결 방법: Netlify 대시보드에서 설정 (가장 안전)

### 1단계: Netlify 대시보드 접속

1. 브라우저에서 [Netlify](https://app.netlify.com) 접속
2. 로그인 후 배포된 사이트를 클릭

### 2단계: Site configuration 이동

1. 상단 메뉴에서 **"Site configuration"** 클릭
   - 또는 왼쪽 사이드바에서 **"Configuration"** 클릭
2. 왼쪽 메뉴에서 **"Environment variables"** 클릭
   - URL 예시: `https://app.netlify.com/sites/YOUR_SITE_NAME/configuration/env`

### 3단계: 환경 변수 추가

1. **"Add a variable"** 또는 **"Add variable"** 버튼 클릭
2. 다음 정보 입력:

   **Key (변수 이름):**
   ```
   OPENAI_API_KEY
   ```
   ⚠️ 정확히 입력: 대소문자 구분, 언더스코어(`_`) 포함

   **Value (변수 값):**
   ```
   sk-proj-your-actual-openai-api-key-here
   ```
   - 실제 OpenAI API 키를 입력하세요
   - [OpenAI API Keys](https://platform.openai.com/api-keys)에서 확인 가능
   - 형식: `sk-proj-` 또는 `sk-`로 시작

3. **"Save"** 또는 **"Add variable"** 버튼 클릭

### 4단계: 재배포 (중요!)

환경 변수를 추가한 후 반드시 재배포해야 합니다:

**방법 A: 수동 재배포**
1. **"Deploys"** 탭으로 이동
2. 최신 배포 옆의 **"..."** (점 3개) 메뉴 클릭
3. **"Trigger deploy"** → **"Deploy site"** 선택
4. 배포 완료 대기 (약 2-3분)

**방법 B: 자동 재배포**
- GitHub에 새로운 커밋을 푸시하면 자동으로 재배포됩니다
- 예: `git commit --allow-empty -m "Trigger redeploy" && git push`

---

## 🔍 설정 확인 방법

### 1. Netlify 대시보드에서 확인

1. **"Site configuration"** → **"Environment variables"** 이동
2. `OPENAI_API_KEY` 변수가 목록에 표시되는지 확인
3. Value는 보안상 마스킹되어 표시됨 (예: `sk-proj-****`)

### 2. 빌드 로그에서 확인

1. **"Deploys"** 탭 → 최신 배포 클릭
2. 빌드 로그 확인
3. 환경 변수가 제대로 로드되었는지 확인
   - ⚠️ 로그에 실제 API 키 값이 노출되지 않도록 주의

### 3. 웹사이트에서 테스트

1. 배포된 사이트 URL 접속
2. 진단 폼에 정보 입력
3. "진단 시작하기" 클릭
4. 정상적으로 결과가 나오는지 확인

---

## 📝 OpenAI API Key 발급 방법

### 1. OpenAI 계정 생성/로그인

1. [OpenAI Platform](https://platform.openai.com) 접속
2. 계정 생성 또는 로그인

### 2. API Key 발급

1. 왼쪽 메뉴에서 **"API keys"** 클릭
2. **"Create new secret key"** 클릭
3. Key 이름 입력 (예: "Netlify Production")
4. **"Create secret key"** 클릭
5. ⚠️ **Key를 복사하세요!** (한 번만 표시됨)
6. 안전한 곳에 저장 (예: 비밀번호 관리자)

### 3. Key 형식

- 형식: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- 또는: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- 길이: 약 50자 이상

---

## ⚠️ 보안 주의사항

### ✅ 해야 할 것

1. **Netlify 대시보드에서만 관리**: API 키는 Netlify 대시보드에서만 설정
2. **Git에 커밋하지 않기**: `.env.local` 파일은 Git에 커밋하지 않음
3. **공유하지 않기**: API 키를 GitHub Issues, PR, 채팅 등에 공유하지 않기

### ❌ 하지 말아야 할 것

1. **코드에 직접 포함**: API 키를 코드에 하드코딩하지 않기
2. **netlify.toml에 직접 입력**: `netlify.toml` 파일에 실제 키를 넣으면 Git에 커밋됨
3. **공개 저장소에 노출**: 환경 변수를 공개적으로 공유하지 않기

---

## 🛠️ 문제 해결

### 환경 변수가 적용되지 않는 경우

1. **재배포 확인**
   - 환경 변수 추가 후 반드시 재배포 필요
   - **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**

2. **변수 이름 확인**
   - 정확히 `OPENAI_API_KEY` (대문자, 언더스코어)
   - 오타 확인 (예: `OPENAI_APIKEY` ❌)

3. **빌드 로그 확인**
   - **"Deploys"** → 배포 클릭 → 빌드 로그 확인
   - 에러 메시지 확인

### API Key가 잘못된 경우

1. **변수 수정**
   - **"Environment variables"** → 변수 옆 **"Edit"** 클릭
   - 값 수정 후 **"Save"**
   - 재배포 필요

2. **변수 삭제 후 재추가**
   - 변수 옆 **"Delete"** 클릭
   - 새로 추가
   - 재배포 필요

### 여전히 에러가 발생하는 경우

1. **에러 메시지 확인**
   - Netlify 빌드 로그에서 정확한 에러 메시지 확인
   - 브라우저 개발자 도구 콘솔 확인

2. **API Key 유효성 확인**
   - OpenAI 대시보드에서 Key가 활성화되어 있는지 확인
   - Key가 만료되었거나 삭제되었는지 확인

3. **코드 확인**
   - `src/lib/llm/client.ts`에서 환경 변수 읽기 확인
   - 에러 메시지: `OPENAI_API_KEY is not set in environment variables`

---

## 🎯 빠른 체크리스트

환경 변수 설정 완료 확인:

- [ ] Netlify 대시보드 접속
- [ ] Site configuration → Environment variables 이동
- [ ] `OPENAI_API_KEY` 변수 추가
- [ ] 실제 OpenAI API 키 값 입력
- [ ] Save 클릭
- [ ] 재배포 실행 (Trigger deploy)
- [ ] 배포 성공 확인
- [ ] 웹사이트에서 API 호출 테스트

---

## 📚 추가 참고 자료

- [Netlify 공식 문서 - Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [OpenAI API Keys 관리](https://platform.openai.com/api-keys)
- [Next.js 환경 변수 가이드](https://nextjs.org/docs/basic-features/environment-variables)

---

## 💡 팁

1. **변수 그룹화**: 관련된 환경 변수는 이름에 접두사를 사용
   - 예: `OPENAI_API_KEY`, `OPENAI_MODEL` 등

2. **문서화**: 팀과 공유할 때는 변수 이름만 공유하고 값은 공유하지 않기

3. **백업**: 환경 변수 목록을 안전한 곳에 문서로 저장 (값 제외)

4. **테스트**: 환경 변수 설정 후 반드시 실제 웹사이트에서 테스트

---

**환경 변수 설정이 완료되면 Netlify 서버에서도 정상적으로 작동합니다!** 🎉

