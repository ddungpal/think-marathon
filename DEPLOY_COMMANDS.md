# 🚀 배포 실행 명령어

이 문서는 GitHub 업로드 및 Vercel 배포를 위한 단계별 명령어를 제공합니다.

## 📍 현재 위치 확인

```bash
# 프로젝트 디렉토리로 이동
cd "/Users/dongwonchoi/Desktop/동원 백업/동원폴더/cursor/cursor_think_marathon"

# 현재 위치 확인
pwd
```

---

## 1단계: Git 초기화 및 첫 커밋

```bash
# Git 저장소 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋 생성
git commit -m "Initial commit: Think Marathon project"
```

---

## 2단계: GitHub 저장소 생성

### 웹 브라우저에서:

1. [GitHub 새 저장소 생성](https://github.com/new) 접속
2. 다음 정보 입력:
   - **Repository name**: `think-marathon`
   - **Description**: `사고 패턴 중심의 진단 시스템`
   - **Public** 또는 **Private** 선택
   - ⚠️ **"Add a README file"**, **"Add .gitignore"**, **"Choose a license"** 모두 **체크하지 않음**
3. **"Create repository"** 클릭

---

## 3단계: GitHub에 연결 및 업로드

```bash
# GitHub 저장소 URL 연결 (YOUR_USERNAME을 실제 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/think-marathon.git

# 브랜치 이름을 main으로 설정
git branch -M main

# GitHub에 푸시
git push -u origin main
```

**예시:**
```bash
# 만약 GitHub 사용자명이 "dongwonchoi"라면:
git remote add origin https://github.com/dongwonchoi/think-marathon.git
git branch -M main
git push -u origin main
```

**인증 요청 시:**
- GitHub Personal Access Token 사용 (권장)
- 또는 SSH 키 설정 후 사용

---

## 4단계: Vercel 배포

### 웹 브라우저에서:

1. [Vercel](https://vercel.com) 접속
2. **"Sign Up"** → **"Continue with GitHub"** 클릭
3. GitHub 계정으로 로그인
4. 대시보드에서 **"Add New..."** → **"Project"** 클릭
5. **"Import Git Repository"**에서 `think-marathon` 선택
6. **"Import"** 클릭

### 프로젝트 설정:

1. **Project Name**: `think-marathon` (기본값 유지)
2. **Framework Preset**: `Next.js` (자동 감지)
3. **Root Directory**: `./` (기본값 유지)
4. **Build Command**: `npm run build` (기본값 유지)
5. **Output Directory**: `.next` (기본값 유지)

### 환경 변수 설정:

1. **"Environment Variables"** 섹션 클릭
2. 다음 변수 추가:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | `sk-your-actual-api-key-here` |

3. **"Add"** 클릭
4. **"Deploy"** 버튼 클릭

---

## 5단계: 배포 확인

배포가 완료되면 (약 2-3분):

1. Vercel 대시보드에서 제공되는 URL 확인
   - 예: `https://think-marathon.vercel.app`
2. 브라우저에서 해당 URL 접속
3. 진단 폼 테스트

---

## 🔄 코드 업데이트 후 재배포

코드를 수정한 후:

```bash
# 변경사항 추가
git add .

# 커밋
git commit -m "Update: 변경 내용 설명"

# GitHub에 푸시
git push origin main
```

**Vercel이 자동으로 재배포합니다!** 🎉

---

## 📝 전체 명령어 요약 (복사해서 사용)

```bash
# 1. 디렉토리 이동
cd "/Users/dongwonchoi/Desktop/동원 백업/동원폴더/cursor/cursor_think_marathon"

# 2. Git 초기화
git init

# 3. 파일 추가
git add .

# 4. 첫 커밋
git commit -m "Initial commit: Think Marathon project"

# 5. GitHub 연결 (YOUR_USERNAME 변경 필요)
git remote add origin https://github.com/YOUR_USERNAME/think-marathon.git

# 6. 브랜치 설정
git branch -M main

# 7. GitHub에 푸시
git push -u origin main
```

그 다음 [Vercel](https://vercel.com)에서 프로젝트를 Import하고 환경 변수를 설정하면 완료!

---

## ❓ 문제 해결

### Git 인증 오류

```bash
# Personal Access Token 사용 (권장)
# GitHub Settings → Developer settings → Personal access tokens → Generate new token
# 권한: repo (전체)
# 토큰을 비밀번호 대신 사용
```

### 푸시 실패

```bash
# 원격 저장소 확인
git remote -v

# 원격 저장소 재설정
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/think-marathon.git
```

### Vercel 빌드 실패

1. Vercel 대시보드 → **"Deployments"** 탭 확인
2. 실패한 배포 클릭하여 에러 로그 확인
3. 일반적인 원인:
   - 환경 변수 누락 (`OPENAI_API_KEY`)
   - 빌드 에러 (로컬에서 `npm run build` 테스트)

---

## ✅ 체크리스트

- [ ] Git 저장소 초기화 완료
- [ ] GitHub 저장소 생성 완료
- [ ] GitHub에 코드 업로드 완료
- [ ] Vercel 계정 생성 완료
- [ ] Vercel에 프로젝트 Import 완료
- [ ] 환경 변수 설정 완료 (`OPENAI_API_KEY`)
- [ ] 배포 성공 확인
- [ ] 웹사이트 테스트 완료

---

**모든 단계를 완료하면 웹사이트가 공개됩니다!** 🎊

