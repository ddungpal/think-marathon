# 배포 가이드

이 문서는 "생각 마라톤" 프로젝트를 GitHub에 업로드하고 Vercel에 배포하는 방법을 설명합니다.

## 📋 사전 준비

1. **GitHub 계정**이 필요합니다.
2. **Vercel 계정**이 필요합니다 (GitHub 계정으로 가입 가능).
3. **OpenAI API Key**가 필요합니다.

---

## 1단계: GitHub에 프로젝트 업로드

### 1.1 Git 저장소 초기화

```bash
# 프로젝트 디렉토리로 이동
cd "/Users/dongwonchoi/Desktop/동원 백업/동원폴더/cursor/cursor_think_marathon"

# Git 저장소 초기화 (이미 초기화되어 있다면 생략)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Think Marathon project"
```

### 1.2 GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단의 **"+"** 버튼 클릭 → **"New repository"** 선택
3. 저장소 정보 입력:
   - **Repository name**: `think-marathon` (또는 원하는 이름)
   - **Description**: "사고 패턴 중심의 진단 시스템"
   - **Visibility**: Public 또는 Private 선택
   - **Initialize this repository with**: 체크하지 않음 (이미 로컬에 파일이 있으므로)
4. **"Create repository"** 클릭

### 1.3 로컬 저장소와 GitHub 연결

```bash
# GitHub에서 제공한 저장소 URL을 사용 (YOUR_USERNAME을 실제 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/think-marathon.git

# 또는 SSH를 사용하는 경우
# git remote add origin git@github.com:YOUR_USERNAME/think-marathon.git

# 브랜치 이름을 main으로 변경 (필요시)
git branch -M main

# GitHub에 푸시
git push -u origin main
```

### 1.4 확인

GitHub 저장소 페이지에서 파일들이 업로드되었는지 확인하세요.

---

## 2단계: Vercel에 배포

### 2.1 Vercel 계정 생성

1. [Vercel](https://vercel.com)에 접속
2. **"Sign Up"** 클릭
3. **"Continue with GitHub"** 선택하여 GitHub 계정으로 가입

### 2.2 프로젝트 Import

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **"Import Git Repository"** 섹션에서 방금 업로드한 GitHub 저장소 선택
3. **"Import"** 클릭

### 2.3 프로젝트 설정

1. **Project Name**: `think-marathon` (또는 원하는 이름)
2. **Framework Preset**: Next.js (자동 감지됨)
3. **Root Directory**: `./` (기본값)
4. **Build Command**: `npm run build` (기본값)
5. **Output Directory**: `.next` (기본값)
6. **Install Command**: `npm install` (기본값)

### 2.4 환경 변수 설정

**"Environment Variables"** 섹션에서 다음 변수를 추가:

| 변수 이름 | 값 | 설명 |
|---------|-----|------|
| `OPENAI_API_KEY` | `sk-...` | OpenAI API 키 (필수) |
| `NODE_ENV` | `production` | 프로덕션 환경 설정 (선택) |

**추가 방법:**
1. **"Environment Variables"** 섹션 클릭
2. **"Name"**에 `OPENAI_API_KEY` 입력
3. **"Value"**에 실제 OpenAI API 키 입력
4. **"Add"** 클릭

### 2.5 배포 실행

1. **"Deploy"** 버튼 클릭
2. 배포가 완료될 때까지 대기 (약 2-3분)
3. 배포 완료 후 제공되는 URL로 접속하여 테스트

---

## 3단계: 배포 확인 및 테스트

### 3.1 배포 URL 확인

배포가 완료되면 Vercel 대시보드에서 다음과 같은 URL을 제공합니다:
- **Production URL**: `https://think-marathon.vercel.app` (예시)
- **Preview URL**: 각 커밋마다 생성되는 미리보기 URL

### 3.2 테스트

1. 제공된 URL로 접속
2. 진단 폼에 정보 입력
3. "진단 시작하기" 클릭
4. 결과가 정상적으로 표시되는지 확인

---

## 4단계: 커스텀 도메인 설정 (선택사항)

### 4.1 도메인 추가

1. Vercel 대시보드 → 프로젝트 선택
2. **"Settings"** → **"Domains"** 클릭
3. 도메인 입력 (예: `think-marathon.com`)
4. DNS 설정 안내에 따라 도메인 DNS 레코드 추가

---

## 🔄 업데이트 배포

코드를 수정한 후 GitHub에 푸시하면 자동으로 Vercel에 재배포됩니다:

```bash
# 변경사항 커밋
git add .
git commit -m "Update: 설명"

# GitHub에 푸시
git push origin main
```

Vercel이 자동으로 변경사항을 감지하고 재배포합니다.

---

## 🛠️ 문제 해결

### 배포 실패 시

1. **Vercel 대시보드** → **"Deployments"** 탭 확인
2. 실패한 배포 클릭하여 에러 로그 확인
3. 일반적인 원인:
   - 환경 변수 누락
   - 빌드 에러
   - 의존성 설치 실패

### 환경 변수 확인

1. Vercel 대시보드 → 프로젝트 → **"Settings"** → **"Environment Variables"**
2. 모든 필수 환경 변수가 설정되어 있는지 확인

### 로컬에서 빌드 테스트

배포 전에 로컬에서 빌드가 성공하는지 확인:

```bash
npm run build
```

---

## 📝 참고사항

- **환경 변수**: `.env.local` 파일은 Git에 커밋되지 않습니다. Vercel에서 직접 설정해야 합니다.
- **캐시**: Vercel은 자동으로 빌드 캐시를 관리합니다.
- **무료 플랜**: Vercel 무료 플랜으로도 충분히 사용 가능합니다.
- **API 제한**: OpenAI API 사용량에 따라 비용이 발생할 수 있습니다.

---

## 🎉 완료!

배포가 완료되면 누구나 웹사이트에 접속하여 진단 서비스를 사용할 수 있습니다!

