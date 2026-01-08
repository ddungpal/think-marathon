# Netlify Firebase 환경 변수 설정 가이드

Netlify 배포 환경에서 Firebase를 사용하기 위한 환경 변수 설정 방법입니다.

## 🔴 문제 증상

다음과 같은 에러가 발생하는 경우:

```
Firebase apiKey is not set. Please set NEXT_PUBLIC_FIREBASE_API_KEY in Netlify environment variables
```

이는 Netlify 배포 환경에서 Firebase 환경 변수가 설정되지 않았을 때 발생합니다.

## ✅ 해결 방법

### 방법 1: Netlify 대시보드에서 설정 (권장)

1. **Netlify 대시보드 접속**
   - [https://app.netlify.com](https://app.netlify.com) 접속
   - 로그인 후 해당 사이트 선택

2. **환경 변수 설정 페이지로 이동**
   - 왼쪽 메뉴에서 **"Site configuration"** 클릭
   - **"Environment variables"** 클릭

3. **Firebase 환경 변수 추가**

   다음 환경 변수들을 하나씩 추가하세요:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyA4Cb5SDOQqi8IF6ikQaQPrCbdSQ_Lbfe8` |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `think-marathon.firebaseapp.com` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `think-marathon` |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `think-marathon.firebasestorage.app` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `550015102782` |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:550015102782:web:13afe71578788a5ac4866f` |
   | `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-3FQ05ZY981` |

   **추가 방법:**
   - **"Add a variable"** 버튼 클릭
   - Key와 Value 입력
   - **"Save"** 클릭
   - 모든 변수에 대해 반복

4. **재배포 실행**
   - 환경 변수 설정 후 자동으로 재배포가 시작됩니다
   - 또는 **"Deploys"** 탭에서 **"Trigger deploy"** → **"Deploy site"** 클릭

### 방법 2: Netlify CLI 사용

터미널에서 다음 명령어를 실행하세요:

```bash
# Netlify CLI 설치 (없는 경우)
npm install -g netlify-cli

# Netlify 로그인
netlify login

# 사이트 연결
netlify link

# 환경 변수 설정
netlify env:set NEXT_PUBLIC_FIREBASE_API_KEY "AIzaSyA4Cb5SDOQqi8IF6ikQaQPrCbdSQ_Lbfe8"
netlify env:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN "think-marathon.firebaseapp.com"
netlify env:set NEXT_PUBLIC_FIREBASE_PROJECT_ID "think-marathon"
netlify env:set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET "think-marathon.firebasestorage.app"
netlify env:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID "550015102782"
netlify env:set NEXT_PUBLIC_FIREBASE_APP_ID "1:550015102782:web:13afe71578788a5ac4866f"
netlify env:set NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID "G-3FQ05ZY981"

# 재배포
netlify deploy --prod
```

### 방법 3: netlify.toml에 추가 (비추천)

⚠️ **보안 주의**: 이 방법은 Git에 커밋되므로 비추천합니다.

`netlify.toml` 파일에 다음을 추가:

```toml
[context.production.environment]
  NEXT_PUBLIC_FIREBASE_API_KEY = "AIzaSyA4Cb5SDOQqi8IF6ikQaQPrCbdSQ_Lbfe8"
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "think-marathon.firebaseapp.com"
  NEXT_PUBLIC_FIREBASE_PROJECT_ID = "think-marathon"
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "think-marathon.firebasestorage.app"
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "550015102782"
  NEXT_PUBLIC_FIREBASE_APP_ID = "1:550015102782:web:13afe71578788a5ac4866f"
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = "G-3FQ05ZY981"
```

## 🔍 확인 방법

### 1. 환경 변수 확인

Netlify 대시보드에서:
- **"Site configuration"** → **"Environment variables"**
- 모든 `NEXT_PUBLIC_FIREBASE_*` 변수가 설정되어 있는지 확인

### 2. 빌드 로그 확인

1. **"Deploys"** 탭 클릭
2. 최신 배포 선택
3. **"Build log"** 확인
4. 환경 변수 관련 에러가 없는지 확인

### 3. 런타임 확인

1. 배포된 사이트 접속
2. 브라우저 개발자 도구 (F12) 열기
3. **Console** 탭에서 Firebase 관련 에러 확인
4. **Network** 탭에서 Firebase API 호출 확인

## 📝 중요 사항

### NEXT_PUBLIC_ 접두사

- `NEXT_PUBLIC_` 접두사가 붙은 환경 변수만 클라이언트 사이드에서 접근 가능합니다.
- 이 변수들은 **빌드 시점**에 번들에 포함됩니다.
- 환경 변수를 변경한 후에는 **반드시 재배포**해야 합니다.

### 빌드 vs 런타임

- Next.js는 빌드 시점에 `NEXT_PUBLIC_*` 환경 변수를 번들에 포함시킵니다.
- 환경 변수를 변경한 후에는 새로 빌드해야 변경사항이 반영됩니다.
- Netlify는 환경 변수 변경 시 자동으로 재배포를 시작합니다.

### 환경별 설정

Netlify에서는 다음 환경별로 환경 변수를 설정할 수 있습니다:

- **Production**: 프로덕션 배포
- **Branch deploys**: 특정 브랜치 배포
- **Deploy previews**: PR 미리보기 배포

각 환경에 맞게 환경 변수를 설정할 수 있습니다.

## 🐛 문제 해결

### 환경 변수가 적용되지 않는 경우

1. **재배포 확인**
   - 환경 변수 설정 후 재배포가 실행되었는지 확인
   - **"Deploys"** 탭에서 최신 배포 확인

2. **변수 이름 확인**
   - `NEXT_PUBLIC_` 접두사가 정확한지 확인
   - 대소문자 구분 확인

3. **빌드 로그 확인**
   - 빌드 로그에서 환경 변수 관련 에러 확인
   - 빌드가 성공적으로 완료되었는지 확인

4. **캐시 삭제**
   - Netlify 대시보드 → **"Site configuration"** → **"Build & deploy"**
   - **"Clear cache and retry deploy"** 클릭

### 여전히 에러가 발생하는 경우

1. **브라우저 콘솔 확인**
   - 개발자 도구에서 정확한 에러 메시지 확인
   - 에러 메시지에 표시된 환경 변수 이름 확인

2. **로컬 테스트**
   - 로컬에서 `.env.local` 파일로 테스트
   - 로컬에서는 작동하는지 확인

3. **Firebase 설정 확인**
   - Firebase Console에서 프로젝트 설정 확인
   - API 키가 활성화되어 있는지 확인

## 📚 참고 자료

- [Netlify 환경 변수 문서](https://docs.netlify.com/environment-variables/overview/)
- [Next.js 환경 변수 문서](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase 설정 가이드](https://firebase.google.com/docs/web/setup)

