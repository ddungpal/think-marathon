# 생각 마라톤 - 사전 질문 기반 진단 시스템

사용자의 직업, 커리어 단계, 월평균소득 구간, 순자산 구간을 기반으로 LLM(ChatGPT)을 활용해 사고 패턴 중심의 구조화된 진단 결과를 제공하는 웹 서비스입니다.

## 핵심 목표

- 숫자를 해석하지 않는다
- 판단 기준은 흔들리지 않는다
- 같은 입력은 항상 같은 결과를 만든다
- 결과는 "정보"가 아니라 "사고를 촉발하는 진단"이어야 한다

## 기술 스택

- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **폼 관리**: React Hook Form
- **유효성 검증**: Zod
- **LLM**: OpenAI GPT-4o-mini

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```
OPENAI_API_KEY=sk-your-api-key-here
NEXT_PUBLIC_APP_NAME=생각 마라톤
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router
│   ├── api/          # API 라우트
│   ├── page.tsx      # 메인 페이지
│   └── result/       # 결과 페이지
├── components/        # React 컴포넌트
│   ├── ui/           # 기본 UI 컴포넌트
│   ├── form/         # 입력 폼 컴포넌트
│   └── result/       # 결과 표시 컴포넌트
├── lib/              # 공통 로직
│   ├── config/       # Config 관리
│   ├── cache/        # 캐싱
│   ├── llm/          # LLM 연동
│   └── validation/   # 입력값 검증
└── types/            # TypeScript 타입 정의
```

## 주요 기능

- **Config 기반 판단**: 모든 판단 기준은 Config 파일로 관리
- **캐싱**: 동일 입력에 대한 결과는 캐시에서 즉시 반환
- **일관성 보장**: 같은 입력은 항상 같은 결과
- **비용 통제**: 캐싱 우선, LLM 호출 최소화

## 배포

### 로컬 빌드

```bash
npm run build
npm start
```

### Vercel 배포

이 프로젝트는 Vercel에 최적화되어 있습니다.

**📚 배포 가이드:**
- **빠른 시작**: [QUICK_START.md](./QUICK_START.md) - 5분 완성 가이드
- **상세 가이드**: [DEPLOYMENT.md](./DEPLOYMENT.md) - 전체 배포 절차
- **명령어 모음**: [DEPLOY_COMMANDS.md](./DEPLOY_COMMANDS.md) - 단계별 명령어

**🚀 빠른 배포 (요약):**
1. Git 초기화 및 GitHub 업로드
2. [Vercel](https://vercel.com)에 로그인
3. GitHub 저장소 Import
4. 환경 변수 설정 (`OPENAI_API_KEY`)
5. Deploy 클릭

## 환경 변수

프로덕션 환경에서는 다음 환경 변수를 설정해야 합니다:

- `OPENAI_API_KEY`: OpenAI API 키 (필수)

## 라이선스

MIT

