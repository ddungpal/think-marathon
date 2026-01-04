# Netlify 배포 가이드

이 문서는 "생각 마라톤" 프로젝트를 Netlify에 배포하는 방법을 설명합니다.

## 📋 사전 준비

1. **GitHub 계정** 및 저장소 (이미 완료)
2. **Netlify 계정**이 필요합니다 (GitHub 계정으로 가입 가능)
3. **OpenAI API Key**가 필요합니다

---

## 1단계: Netlify 계정 생성

1. [Netlify](https://www.netlify.com)에 접속
2. **"Sign up"** 클릭
3. **"Continue with GitHub"** 선택하여 GitHub 계정으로 가입

---

## 2단계: 프로젝트 Import

1. Netlify 대시보드에서 **"Add new site"** → **"Import an existing project"** 클릭
2. **"Deploy with GitHub"** 선택
3. GitHub 인증 후 방금 업로드한 `think-marathon` 저장소 선택
4. **"Import"** 클릭

---

## 3단계: 빌드 설정

Netlify가 자동으로 Next.js를 감지하지만, 다음 설정을 확인하세요:

### 기본 설정

- **Branch to deploy**: `main` (또는 기본 브랜치)
- **Build command**: `npm run build`
- **Publish directory**: `.next` (또는 자동 감지)

### 고급 설정 (필요시)

**"Show advanced"** 클릭 후:

- **Base directory**: (비워둠)
- **Build command**: `npm run build`
- **Publish directory**: `.next`

---

## 4단계: 환경 변수 설정

자세한 환경 변수 설정 방법은 [NETLIFY_ENV_SETUP.md](./NETLIFY_ENV_SETUP.md)를 참고하세요.

### 빠른 설정 방법:

1. **Site configuration** → **"Environment variables"** 클릭
2. **"Add a variable"** 버튼 클릭
3. 다음 변수 추가:

| 변수 이름 (Key) | 값 (Value) | 설명 |
|---------------|----------|------|
| `OPENAI_API_KEY` | `sk-...` | OpenAI API 키 (필수) |
| `NODE_ENV` | `production` | 프로덕션 환경 설정 (선택) |

4. **"Save"** 클릭
5. 재배포 실행 (자동 또는 수동)

---

## 5단계: 배포 실행

1. **"Deploy site"** 버튼 클릭
2. 배포가 완료될 때까지 대기 (약 3-5분)
3. 배포 완료 후 제공되는 URL로 접속하여 테스트

---

## 6단계: 배포 확인

배포가 완료되면 Netlify 대시보드에서 다음과 같은 URL을 제공합니다:
- **Production URL**: `https://think-marathon.netlify.app` (예시)
- **Deploy preview**: 각 커밋마다 생성되는 미리보기 URL

### 테스트

1. 제공된 URL로 접속
2. 진단 폼에 정보 입력
3. "진단 시작하기" 클릭
4. 결과가 정상적으로 표시되는지 확인

---

## 🔄 업데이트 배포

코드를 수정한 후 GitHub에 푸시하면 자동으로 Netlify에 재배포됩니다:

```bash
# 변경사항 커밋
git add .
git commit -m "Update: 설명"

# GitHub에 푸시
git push origin main
```

Netlify가 자동으로 변경사항을 감지하고 재배포합니다.

---

## 🛠️ 문제 해결

### 배포 실패 시

1. **Netlify 대시보드** → **"Deploys"** 탭 확인
2. 실패한 배포 클릭하여 에러 로그 확인
3. 일반적인 원인:
   - 환경 변수 누락 (`OPENAI_API_KEY`)
   - 빌드 에러
   - 의존성 설치 실패

### TypeScript 에러

만약 TypeScript 타입 에러가 발생한다면:

1. 로컬에서 빌드 테스트:
   ```bash
   npm run build
   ```
2. 에러가 있다면 수정 후 다시 커밋 및 푸시

### 환경 변수 확인

1. Netlify 대시보드 → 프로젝트 → **"Site settings"** → **"Environment variables"**
2. 모든 필수 환경 변수가 설정되어 있는지 확인

---

## 📝 Netlify 설정 파일

프로젝트 루트에 `netlify.toml` 파일이 포함되어 있어 자동으로 설정됩니다:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"
```

---

## 🎉 완료!

배포가 완료되면 누구나 웹사이트에 접속하여 진단 서비스를 사용할 수 있습니다!

---

## 📚 참고사항

- **무료 플랜**: Netlify 무료 플랜으로도 충분히 사용 가능합니다
- **빌드 시간**: 무료 플랜은 월 300분 빌드 시간 제공
- **대역폭**: 무료 플랜은 월 100GB 대역폭 제공
- **API 제한**: OpenAI API 사용량에 따라 비용이 발생할 수 있습니다

