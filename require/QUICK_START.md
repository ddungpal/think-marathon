# 🚀 빠른 시작 가이드

## GitHub 업로드 및 Vercel 배포 (5분 완성)

### 1️⃣ Git 초기화 및 커밋

```bash
# 프로젝트 디렉토리로 이동
cd "/Users/dongwonchoi/Desktop/동원 백업/동원폴더/cursor/cursor_think_marathon"

# Git 초기화 (처음 한 번만)
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Think Marathon project"
```

### 2️⃣ GitHub 저장소 생성 및 연결

1. [GitHub](https://github.com/new)에서 새 저장소 생성
   - Repository name: `think-marathon`
   - Public 또는 Private 선택
   - **README, .gitignore, license 추가하지 않음** (이미 있음)

2. GitHub에서 제공한 명령어 실행 (아래는 예시):

```bash
# YOUR_USERNAME을 실제 GitHub 사용자명으로 변경
git remote add origin https://github.com/YOUR_USERNAME/think-marathon.git
git branch -M main
git push -u origin main
```

### 3️⃣ Vercel 배포

1. [Vercel](https://vercel.com) 접속 → **"Sign Up"** → **"Continue with GitHub"**

2. 대시보드에서 **"Add New..."** → **"Project"** 클릭

3. 방금 업로드한 `think-marathon` 저장소 선택 → **"Import"**

4. **환경 변수 설정**:
   - **"Environment Variables"** 섹션 클릭
   - Name: `OPENAI_API_KEY`
   - Value: 실제 OpenAI API 키 입력
   - **"Add"** 클릭

5. **"Deploy"** 버튼 클릭

6. 배포 완료 후 제공되는 URL로 접속하여 테스트!

---

## ✅ 완료 확인

배포가 성공하면 다음과 같은 URL이 제공됩니다:
- `https://think-marathon.vercel.app` (예시)

이 URL을 공유하면 누구나 웹사이트에 접속하여 진단 서비스를 사용할 수 있습니다!

---

## 🔄 업데이트 방법

코드를 수정한 후:

```bash
git add .
git commit -m "Update: 변경 내용"
git push origin main
```

Vercel이 자동으로 재배포합니다! 🎉

---

## ❓ 문제가 발생하면?

자세한 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

