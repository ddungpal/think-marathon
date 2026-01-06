# Netlify 환경 변수 설정 가이드

이 문서는 Netlify에서 환경 변수를 설정하는 방법을 단계별로 설명합니다.

## 📋 환경 변수란?

환경 변수는 애플리케이션이 실행될 때 사용하는 설정값입니다. 예를 들어:
- `OPENAI_API_KEY`: OpenAI API 키 (보안상 중요한 정보)
- `NODE_ENV`: 실행 환경 (development, production 등)

**중요**: 환경 변수는 코드에 직접 포함하지 않고, 배포 플랫폼에서 별도로 관리합니다.

---

## 🚀 방법 1: Netlify 대시보드에서 설정 (권장)

### 1단계: Netlify 대시보드 접속

1. [Netlify](https://app.netlify.com)에 로그인
2. 배포된 사이트를 클릭하여 사이트 대시보드로 이동

### 2단계: Site settings 접속

1. 상단 메뉴에서 **"Site configuration"** 클릭
2. 왼쪽 사이드바에서 **"Environment variables"** 클릭
   - 또는 직접 URL: `https://app.netlify.com/sites/YOUR_SITE_NAME/configuration/env`

### 3단계: 환경 변수 추가

1. **"Add a variable"** 또는 **"Add variable"** 버튼 클릭
2. 다음 정보 입력:

   **Key (변수 이름):**
   ```
   OPENAI_API_KEY
   ```

   **Value (변수 값):**
   ```
   sk-your-actual-openai-api-key-here
   ```
   - 실제 OpenAI API 키를 입력하세요
   - [OpenAI API Keys](https://platform.openai.com/api-keys)에서 확인 가능

3. **"Save"** 또는 **"Add variable"** 버튼 클릭

### 4단계: 추가 환경 변수 (선택사항)

필요한 경우 다음 변수도 추가할 수 있습니다:

| Key | Value | 설명 |
|-----|-------|------|
| `NODE_ENV` | `production` | 프로덕션 환경 설정 |
| `NEXT_PUBLIC_APP_NAME` | `생각 마라톤` | 앱 이름 (클라이언트에서 접근 가능) |

### 5단계: 재배포

환경 변수를 추가한 후:

1. **"Deploys"** 탭으로 이동
2. 최신 배포 옆의 **"..."** 메뉴 클릭
3. **"Trigger deploy"** → **"Deploy site"** 선택
   - 또는 GitHub에 새로운 커밋을 푸시하면 자동으로 재배포됩니다

---

## 🔧 방법 2: netlify.toml 파일에 설정

`netlify.toml` 파일에 환경 변수를 직접 설정할 수 있습니다.

### 1단계: netlify.toml 파일 확인

프로젝트 루트에 `netlify.toml` 파일이 있는지 확인하세요.

### 2단계: 환경 변수 섹션 추가

`netlify.toml` 파일에 다음 섹션을 추가합니다:

```toml
[context.production.environment]
  OPENAI_API_KEY = "your-openai-api-key-here"
  NODE_ENV = "production"
```

**전체 예시:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[context.production.environment]
  OPENAI_API_KEY = "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  NODE_ENV = "production"
```

### 3단계: 파일 커밋 및 푸시

```bash
git add netlify.toml
git commit -m "Add environment variables to netlify.toml"
git push
```

### ⚠️ 보안 주의사항

**중요**: `netlify.toml` 파일은 Git에 커밋되므로, 실제 API 키를 직접 넣으면 보안 위험이 있습니다.

**권장 방법:**
1. **대시보드 사용 (권장)**: 민감한 정보는 Netlify 대시보드에서만 설정
2. **환경 변수 분리**: `netlify.toml`에는 비민감한 변수만 설정
3. **Git ignore**: `.env` 파일은 `.gitignore`에 포함되어 있어야 함

**대안:**
- `netlify.toml`에는 주석으로만 표시하고, 실제 값은 Netlify 대시보드에서 설정
- 또는 Netlify CLI를 사용하여 환경 변수 설정 (아래 방법 3 참고)

---

## 🔧 방법 3: Netlify CLI를 사용한 설정 (명령어)

Netlify CLI를 사용하면 명령어로 환경 변수를 설정할 수 있습니다.

### 1단계: Netlify CLI 설치

```bash
npm install -g netlify-cli
```

또는 프로젝트에 로컬 설치:

```bash
npm install --save-dev netlify-cli
```

### 2단계: Netlify 로그인

```bash
netlify login
```

브라우저가 열리면 Netlify 계정으로 로그인하세요.

### 3단계: 사이트 연결 (처음만)

프로젝트 디렉토리에서:

```bash
netlify init
```

또는 기존 사이트에 연결:

```bash
netlify link
```

### 4단계: 환경 변수 설정

**프로덕션 환경 변수 설정:**
```bash
netlify env:set OPENAI_API_KEY "sk-proj-your-actual-api-key-here" --context production
```

**모든 환경에 설정:**
```bash
netlify env:set OPENAI_API_KEY "sk-proj-your-actual-api-key-here"
```

**다른 환경 변수도 설정:**
```bash
netlify env:set NODE_ENV "production" --context production
```

### 5단계: 환경 변수 확인

설정된 환경 변수 목록 확인:

```bash
netlify env:list
```

특정 환경 변수 확인:

```bash
netlify env:get OPENAI_API_KEY
```

### 6단계: 환경 변수 삭제

```bash
netlify env:unset OPENAI_API_KEY --context production
```

### CLI 명령어 요약

| 명령어 | 설명 |
|--------|------|
| `netlify env:set KEY "value"` | 환경 변수 설정 (모든 환경) |
| `netlify env:set KEY "value" --context production` | 프로덕션 환경에만 설정 |
| `netlify env:set KEY "value" --context deploy-preview` | Deploy preview에만 설정 |
| `netlify env:list` | 모든 환경 변수 목록 확인 |
| `netlify env:get KEY` | 특정 환경 변수 값 확인 |
| `netlify env:unset KEY` | 환경 변수 삭제 |

### 장점

- ✅ 명령어로 빠르게 설정 가능
- ✅ 스크립트로 자동화 가능
- ✅ CI/CD 파이프라인에 통합 가능
- ✅ Git에 커밋하지 않아도 됨 (보안)

---

## 🔧 방법 4: 배포 시 설정 (일회성)

배포 설정 화면에서도 환경 변수를 추가할 수 있습니다:

1. **"Add new site"** → **"Import an existing project"** 선택
2. GitHub 저장소 선택 후 **"Import"** 클릭
3. **"Show advanced"** 클릭
4. **"New variable"** 섹션에서 환경 변수 추가
5. **"Deploy site"** 클릭

---

## 📝 환경 변수 설정 예시

### 필수 환경 변수

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 선택적 환경 변수

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=생각 마라톤
```

---

## 🔍 환경 변수 확인 방법

### 1. Netlify 대시보드에서 확인

1. **"Site configuration"** → **"Environment variables"** 이동
2. 설정된 모든 환경 변수 목록 확인
3. Key는 보이지만 Value는 마스킹되어 표시됨 (보안)

### 2. 빌드 로그에서 확인 (디버깅용)

1. **"Deploys"** 탭 → 배포 클릭
2. 빌드 로그에서 환경 변수가 제대로 로드되었는지 확인
3. ⚠️ **주의**: 로그에 실제 값이 노출되지 않도록 주의

### 3. 코드에서 확인 (개발용)

```typescript
// 서버 사이드에서만 접근 가능
console.log('API Key exists:', !!process.env.OPENAI_API_KEY);

// 클라이언트 사이드에서 접근 가능 (NEXT_PUBLIC_ 접두사 필요)
console.log('App Name:', process.env.NEXT_PUBLIC_APP_NAME);
```

---

## 🔐 보안 주의사항

### ✅ 해야 할 것

1. **환경 변수 사용**: 민감한 정보는 반드시 환경 변수로 관리
2. **Git에 커밋하지 않기**: `.env.local` 파일은 `.gitignore`에 포함되어 있음
3. **Netlify에서만 관리**: 프로덕션 환경 변수는 Netlify 대시보드에서만 설정

### ❌ 하지 말아야 할 것

1. **코드에 직접 포함**: API 키를 코드에 하드코딩하지 않기
2. **Git에 커밋**: `.env` 파일을 Git에 커밋하지 않기
3. **공개 저장소에 노출**: 환경 변수를 GitHub Issues나 PR에 공유하지 않기

---

## 🛠️ 문제 해결

### 환경 변수가 적용되지 않는 경우

1. **재배포 확인**
   - 환경 변수 추가 후 반드시 재배포 필요
   - **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**

2. **변수 이름 확인**
   - 대소문자 구분 확인
   - 오타 확인 (예: `OPENAI_API_KEY` vs `OPENAI_APIKEY`)

3. **빌드 로그 확인**
   - **"Deploys"** → 배포 클릭 → 빌드 로그 확인
   - 환경 변수 관련 에러 메시지 확인

### 환경 변수 값이 잘못된 경우

1. **변수 수정**
   - **"Environment variables"** → 변수 옆 **"Edit"** 클릭
   - 값 수정 후 **"Save"**

2. **변수 삭제 후 재추가**
   - 변수 옆 **"Delete"** 클릭
   - 새로 추가

---

## 📚 환경 변수 스코프 설정

Netlify에서는 환경 변수의 적용 범위를 설정할 수 있습니다:

### 1. All scopes (모든 배포)

- Production 배포
- Deploy previews
- Branch deploys

### 2. Specific scopes (특정 배포만)

- Production deploys only
- Deploy previews only
- Branch deploys only

**설정 방법:**
1. 환경 변수 추가/수정 시
2. **"Scopes"** 드롭다운에서 선택
3. **"Save"** 클릭

---

## 🎯 빠른 체크리스트

환경 변수 설정 완료 확인:

- [ ] Netlify 대시보드 접속
- [ ] Site configuration → Environment variables 이동
- [ ] `OPENAI_API_KEY` 변수 추가
- [ ] 실제 OpenAI API 키 값 입력
- [ ] Save 클릭
- [ ] 재배포 실행 (또는 자동 재배포 대기)
- [ ] 배포 성공 확인
- [ ] 웹사이트에서 API 호출 테스트

---

## 💡 팁

1. **변수 그룹화**: 관련된 환경 변수는 이름에 접두사를 사용 (예: `OPENAI_`, `DATABASE_`)
2. **문서화**: 팀과 공유할 때는 변수 이름만 공유하고 값은 공유하지 않기
3. **백업**: 환경 변수 목록을 안전한 곳에 문서로 저장 (값 제외)

---

## 📞 추가 도움

- [Netlify 공식 문서 - Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Next.js 환경 변수 가이드](https://nextjs.org/docs/basic-features/environment-variables)

---

**환경 변수 설정이 완료되면 사이트가 정상적으로 작동합니다!** 🎉

