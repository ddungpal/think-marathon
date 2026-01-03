프로젝트명
생각 마라톤 – 사전 질문 기반 진단 시스템

1. 프로젝트 목적 (Purpose)
본 프로젝트는 사용자의 직업, 커리어 단계, 월평균소득 구간, 순자산 구간을 기반으로
LLM(ChatGPT)을 활용해 사고 패턴 중심의 구조화된 진단 결과를 제공하는 웹 서비스다.

핵심 목표는 다음과 같다.
- 숫자를 해석하지 않는다
- 판단 기준은 흔들리지 않는다
- 같은 입력은 항상 같은 결과를 만든다
- 결과는 "정보"가 아니라 "사고를 촉발하는 진단"이어야 한다

2. 핵심 설계 원칙 (Design Principles)
    1) 모든 판단 기준은 Config 기반
    2) LLM은 판단자가 아니라 문장 생성기
    3) 일관성은 캐시와 규칙으로 확보
    4) 비용은 시스템적으로 통제
    5) MVP → 운영 → 확장이 자연스럽게 이어지는 구조

3. 사용자 플로우 (User Flow)
    1) 메인 페이지 진입
    2) 사전 질문 입력
    3) 서버에서 입력값을 Config 기준으로 정규화
    4) 캐시 조회
        - 캐시 히트 시 → 결과 즉시 반환
        - 캐시 미스 시 → LLM 호출
    5) LLM 결과 검증 및 캐싱
    6) 진단 결과 페이지 출력

4. 입력 항목 정의 (Input Specification)
    4.1 직업 (Job Type)
        - 타입: Select
        - 옵션
            직장인
            프리랜서/사업자
        - 필수값
        - 내부 처리용 job_type_code 사용

    4.2 연차 (Career Years)
        - 타입: Number
        - 허용 범위: 0 ~ 30
        - 숫자 외 입력 불가
        - 서버에서 Config 기반 커리어 단계로 매핑

    4.3 월평균소득 (Monthly Income)
        - 타입: Number
        - 단위: 만 원
        - 숫자 외 입력 불가
        - 서버에서 Config 기반 소득 구간 ID로 변환

    4.4 순자산 (Net Worth, 대출 제외)
        - 타입: Number
        - 단위: 만 원
        - 숫자 외 입력 불가
        - 서버에서 Config 기반 자산 구간 ID로 변환

5. Config 기반 판단 구조 (중요)
    5.1 커리어 단계 Config (Career Stage)
    {
        "career_stages": [
            { "id": "CAREER_01", "label": "초기", "min_year": 0, "max_year": 3 },
            { "id": "CAREER_02", "label": "중간", "min_year": 4, "max_year": 9 },
            { "id": "CAREER_03", "label": "숙련", "min_year": 10, "max_year": 20 },
            { "id": "CAREER_04", "label": "고연차", "min_year": 21, "max_year": 30 }
        ]
    }

    5.2 월평균소득 구간 Config
    {
        "income_bands": [
            { "id": "INCOME_01", "label": "500만 원 이하", "min": 0, "max": 500 },
            { "id": "INCOME_02", "label": "500만~1,500만", "min": 501, "max": 1500 },
            { "id": "INCOME_03", "label": "1,500만~3,000만", "min": 1501, "max": 3000 },
            { "id": "INCOME_04", "label": "3,000만~5,000만", "min": 3001, "max": 5000 },
            { "id": "INCOME_05", "label": "5,000만~1억", "min": 5001, "max": 10000 },
            { "id": "INCOME_06", "label": "1억 이상", "min": 10001, "max": null }
        ]
    }

    5.3 순자산 구간 Config
    {
        "asset_bands": [
            { "id": "ASSET_01", "label": "1억 이하", "min": 0, "max": 10000 },
            { "id": "ASSET_02", "label": "1억~3억", "min": 10001, "max": 30000 },
            { "id": "ASSET_03", "label": "3억~10억", "min": 30001, "max": 100000 },
            { "id": "ASSET_04", "label": "10억~30억", "min": 100001, "max": 300000 },
            { "id": "ASSET_05", "label": "30억 이상", "min": 300001, "max": null }
        ]
    }

6. LLM 전달용 정규화 Context
LLM에는 원본 숫자를 절대 전달하지 않는다.

{
  "job_type": "직장인",
  "career_stage": { "id": "CAREER_02", "label": "중간" },
  "income_band": { "id": "INCOME_01", "label": "500만 원 이하" },
  "asset_band": { "id": "ASSET_02", "label": "1억~3억" }
}

7. 진단 결과 정의 (Output Specification)
    7.1 출력 항목 (고정)
        - 공통고민
        - 현재역량
        - 학습포인트

7.2 출력 포맷 (강제)
    LLM은 반드시 JSON으로만 응답한다.

    {
    "common_concerns": "...",
    "current_capabilities": "...",
    "learning_points": "..."
    }

    - Key 변경 불가
    - 누락 시 재호출

8. LLM 제어 구조 (안정성 핵심)
8.1 Pre-Processing
    - 숫자 → Config ID 매핑
    - 커리어 단계 정규화

8.2 In-Prompt Control
    - JSON 출력 강제
    - 감정적 위로, 추상적 동기부여 금지
    - 판단 기준과 사고 패턴 중심 서술

8.3 Post-Processing
    - 문장 수 제한 (섹션당 3~7문장)
    - JSON 파싱 실패 시 재요청
    - 의미 불만족에 따른 재요청 금지

9. 캐싱 정책 (제품 규칙)
캐시 키
    job_type_code
    + career_stage_id
    + income_band_id
    + asset_band_id
- 동일 키 → 동일 결과
- 캐시 히트 시 LLM 호출 금지

10. LLM 비용 통제 설계
    1) 캐싱 우선
    2) 사용자/세션 기반 호출 제한
    3) temperature 0~0.3 고정
    4) max_tokens 제한
    5) 재시도 조건 최소화
    6) 토큰 사용량/호출 로그 수집 (운영 단계)

11. 단계별 아키텍처 로드맵
    Phase 1 – MVP
        - Config: 서버 로컬 JSON
        - Cache: 서버 메모리
        - DB: 없음

    Phase 2 – 운영 안정화
        - Config: DB
        - Cache: Redis
        - 로그/비용 모니터링 추가

12. ChatGPT LLM 연동 – API Key 발급 및 구현 규칙
    12.1 API Key 발급
        - OpenAI Dashboard에서 Project API Key 발급
        - Key는 한 번만 노출 → 안전하게 보관

    12.2 Key 보관 규칙
        - 환경변수로만 관리
        - 클라이언트 코드 포함 금지
        - Git 커밋 금지
            OPENAI_API_KEY

    12.3 서버 연동 구조 (필수)
    Client → /api/diagnose → OpenAI API → 결과 반환
    LLM 호출은 서버에서만 수행
    프론트엔드는 입력/결과 표시만 담당

    12.4 LLM 기본 설정
    - model: 최신 안정 GPT 계열
    - temperature: 0 ~ 0.3
    - max_tokens: 제한
    - response_format: JSON 강제

    12.5 Cursor AI 사용 시 주의사항
    - 프론트 코드에 OpenAI SDK 사용 금지
    - API Key 하드코딩 금지
    - 서버 파일에서만 OpenAI 호출

    13. 성공 기준 (Success Metric)
    - 같은 입력에서 결과가 흔들리지 않는가
    - 평균 LLM 비용이 예측 가능한가
    - 사용자가 "정확히 나를 말한다"고 느끼는가
    - 다음 질문을 스스로 떠올리는가

14. 비포함 범위 (Out of Scope)
    - 로그인/회원
    - 결제
    - 결과 이력 UI
    - 관리자 UI

15. 파일 구조 설계 (File Structure)

15.1 프로젝트 구조 개요

```
cursor_think_marathon/
├── prd.md                          # 프로젝트 요구사항 문서
│
├── package.json                    # 프로젝트 의존성 및 스크립트
├── .env.local                      # 환경 변수 (OPENAI_API_KEY 등, .gitignore에 포함)
├── .gitignore                      # Git 제외 파일 목록
├── README.md                       # 프로젝트 설명 및 실행 가이드
│
├── config/                         # Config 파일 (Phase 1: 로컬 JSON)
│   ├── career-stages.json          # 커리어 단계 Config
│   ├── income-bands.json           # 월평균소득 구간 Config
│   ├── asset-bands.json            # 순자산 구간 Config
│   └── job-types.json              # 직업 타입 Config
│
├── src/                            # 소스 코드
│   ├── app/                        # Next.js App Router (프론트엔드 + API)
│   │   ├── layout.tsx              # 루트 레이아웃
│   │   ├── page.tsx                # 메인 페이지 (입력 폼)
│   │   ├── result/                 # 진단 결과 페이지
│   │   │   └── page.tsx            # 결과 표시 페이지
│   │   └── api/                    # API 라우트
│   │       └── diagnose/           # 진단 API 엔드포인트
│   │           └── route.ts        # POST /api/diagnose
│   │
│   ├── lib/                        # 공통 유틸리티 및 로직
│   │   ├── config/                 # Config 로더 및 매퍼
│   │   │   ├── loader.ts           # Config 파일 로드
│   │   │   ├── mapper.ts           # 입력값 → Config ID 매핑
│   │   │   └── types.ts            # Config 타입 정의
│   │   │
│   │   ├── cache/                  # 캐싱 로직 (Phase 1: 메모리)
│   │   │   ├── memory.ts           # 메모리 캐시 구현
│   │   │   └── types.ts            # 캐시 타입 정의
│   │   │
│   │   ├── llm/                    # LLM 연동
│   │   │   ├── client.ts           # OpenAI 클라이언트 설정
│   │   │   ├── prompt.ts           # 프롬프트 생성
│   │   │   ├── validator.ts        # LLM 응답 검증
│   │   │   └── types.ts            # LLM 타입 정의
│   │   │
│   │   └── utils/                  # 기타 유틸리티
│   │       ├── normalize.ts        # 입력값 정규화
│   │       └── cache-key.ts        # 캐시 키 생성
│   │
│   ├── components/                 # React 컴포넌트
│   │   ├── ui/                     # 기본 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Card.tsx
│   │   │
│   │   ├── form/                   # 입력 폼 컴포넌트
│   │   │   ├── DiagnosisForm.tsx   # 메인 진단 입력 폼
│   │   │   ├── JobTypeSelect.tsx   # 직업 선택
│   │   │   ├── CareerYearsInput.tsx # 연차 입력
│   │   │   ├── IncomeInput.tsx     # 월평균소득 입력
│   │   │   └── AssetInput.tsx      # 순자산 입력
│   │   │
│   │   └── result/                 # 결과 표시 컴포넌트
│   │       ├── ResultDisplay.tsx   # 진단 결과 메인 컴포넌트
│   │       ├── CommonConcerns.tsx  # 공통고민 섹션
│   │       ├── CurrentCapabilities.tsx # 현재역량 섹션
│   │       └── LearningPoints.tsx  # 학습포인트 섹션
│   │
│   └── types/                      # TypeScript 타입 정의
│       ├── input.ts                # 입력 타입
│       ├── output.ts               # 출력 타입
│       ├── config.ts               # Config 타입
│       └── api.ts                  # API 요청/응답 타입
│
└── public/                         # 정적 파일
    ├── favicon.ico
    └── images/                     # 이미지 리소스
```

15.2 주요 파일 상세 설명

15.2.1 Config 파일 (`config/`)

- `config/career-stages.json`: 커리어 단계 Config (섹션 5.1 참조)
- `config/income-bands.json`: 월평균소득 구간 Config (섹션 5.2 참조)
- `config/asset-bands.json`: 순자산 구간 Config (섹션 5.3 참조)
- `config/job-types.json`: 직업 타입 Config
  ```json
  {
    "job_types": [
    { "code": "EMPLOYEE", "label": "직장인" },
    { "code": "FREELANCER", "label": "프리랜서/사업자" }
    ]
  }
  ```

15.2.2 API 라우트 (`src/app/api/diagnose/route.ts`)

역할:
- 클라이언트 요청 수신
- 입력값 검증 및 정규화
- 캐시 조회
- 캐시 미스 시 LLM 호출
- 결과 검증 및 캐싱
- 응답 반환

주요 로직:
1. Request Body 파싱
2. `lib/config/mapper.ts`로 정규화
3. `lib/utils/cache-key.ts`로 캐시 키 생성
4. `lib/cache/memory.ts`로 캐시 조회
5. 캐시 미스 시 `lib/llm/client.ts` 호출
6. `lib/llm/validator.ts`로 검증
7. 검증 통과 시 캐싱 후 반환

15.2.3 Config 로더 (`src/lib/config/loader.ts`)

역할:
- Config JSON 파일 로드
- 서버 시작 시 또는 요청 시 로드
- 타입 안전성 보장

15.2.4 Config 매퍼 (`src/lib/config/mapper.ts`)

역할:
- 원본 입력값 → Config ID 매핑
- 연차 → 커리어 단계 ID
- 월평균소득 → 소득 구간 ID
- 순자산 → 자산 구간 ID
- LLM 전달용 정규화 Context 생성 (섹션 6 참조)

주요 함수:
- `mapCareerStage(years: number): CareerStage`
- `mapIncomeBand(amount: number): IncomeBand`
- `mapAssetBand(amount: number): AssetBand`
- `normalizeInput(input: RawInput): NormalizedInput`

15.2.5 캐시 구현 (`src/lib/cache/memory.ts`)

역할:
- Phase 1: 서버 메모리 기반 캐시
- Phase 2: Redis로 확장 가능한 인터페이스

주요 함수:
- `get(key: string): DiagnosisResult | null`
- `set(key: string, value: DiagnosisResult): void`
- `clear(): void` (개발/테스트용)

캐시 키 형식: `{job_type_code}:{career_stage_id}:{income_band_id}:{asset_band_id}` (섹션 9 참조)

15.2.6 LLM 클라이언트 (`src/lib/llm/client.ts`)

역할:
- OpenAI API 호출
- 환경 변수에서 API Key 읽기
- Temperature, max_tokens 설정 (섹션 12.4 참조)
- JSON 응답 강제

주요 함수:
- `generateDiagnosis(context: NormalizedInput): Promise<DiagnosisResult>`

15.2.7 LLM 프롬프트 (`src/lib/llm/prompt.ts`)

역할:
- 정규화된 Context를 기반으로 프롬프트 생성
- JSON 출력 강제 (섹션 7.2 참조)
- 감정적 위로 금지 지시 (섹션 8.2 참조)
- 사고 패턴 중심 서술 지시

주요 함수:
- `buildPrompt(context: NormalizedInput): string`

15.2.8 LLM 검증기 (`src/lib/llm/validator.ts`)

역할:
- JSON 파싱 검증
- 필수 키 존재 확인 (common_concerns, current_capabilities, learning_points)
- 문장 수 제한 검증 (섹션당 3~7문장, 섹션 8.3 참조)
- 재요청 로직 (JSON 파싱 실패 시만)

주요 함수:
- `validateResponse(json: string): ValidationResult`
- `countSentences(text: string): number`

15.2.9 캐시 키 생성 (`src/lib/utils/cache-key.ts`)

역할:
- 정규화된 입력값으로 캐시 키 생성
- 형식: `{job_type_code}:{career_stage_id}:{income_band_id}:{asset_band_id}`

주요 함수:
- `generateCacheKey(input: NormalizedInput): string`

15.2.10 프론트엔드 컴포넌트

- `src/components/form/DiagnosisForm.tsx`: 메인 입력 폼 컨테이너, 폼 상태 관리, API 호출 및 결과 페이지로 리다이렉트
- `src/components/result/ResultDisplay.tsx`: 진단 결과 메인 표시 컴포넌트, 세 개의 섹션 컴포넌트 조합

15.3 기술 스택 추천

필수:
- 프레임워크: Next.js 14+ (App Router)
- 언어: TypeScript
- LLM SDK: OpenAI SDK (`openai` 패키지)
- 스타일링: Tailwind CSS (또는 CSS Modules)

선택:
- 폼 관리: React Hook Form
- 상태 관리: React Context API (또는 Zustand)
- 유효성 검증: Zod

15.4 환경 변수 설정

`.env.local` 파일:
```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_NAME=생각 마라톤
```

주의: `.env.local`은 반드시 `.gitignore`에 포함되어야 함 (섹션 12.2 참조)

15.5 Phase 2 확장 고려사항

Phase 2로 전환 시 다음 파일/폴더 추가:
- `src/lib/cache/redis.ts` - Redis 캐시 구현
- `src/lib/db/` - 데이터베이스 연동 (Config 저장)
- `src/lib/monitoring/` - 비용/로그 모니터링
- `prisma/` 또는 `drizzle/` - ORM 설정 (선택)

15.6 파일 구조 설계 원칙

1. 보안
   - `.env.local`은 반드시 `.gitignore`에 포함
   - API Key는 서버 사이드에서만 사용
   - 클라이언트 코드에 OpenAI SDK 사용 금지 (섹션 12.5 참조)

2. 일관성
   - 모든 숫자 입력은 Config 기반으로 정규화
   - LLM에는 원본 숫자 전달 금지 (섹션 6 참조)
   - 캐시 키는 정규화된 값으로만 생성 (섹션 9 참조)

3. 비용 통제
   - 캐시 우선 조회
   - Temperature 0~0.3 고정 (섹션 10 참조)
   - max_tokens 제한 설정
   - 재시도 최소화

4. 확장성
   - Phase 1 MVP 구조를 유지하면서 Phase 2로 자연스럽게 확장 가능
   - Config, Cache, DB 등 각 레이어가 독립적으로 교체 가능한 구조

16. 프로젝트 구현 체크리스트

16.1 프로젝트 초기 설정

#### 환경 설정
- [x] Node.js 및 npm/yarn 설치 확인
- [x] Next.js 14+ 프로젝트 생성
- [x] TypeScript 설정
- [ ] Git 저장소 초기화
- [x] `.gitignore` 파일 설정 (`.env.local` 포함 확인)
- [ ] `.env.local` 파일 생성 및 OpenAI API Key 설정
- [x] `package.json` 의존성 확인

#### 필수 라이브러리 설치
- [x] `next` (프레임워크)
- [x] `react`, `react-dom` (React)
- [x] `typescript` (타입스크립트)
- [x] `openai` (OpenAI SDK)
- [x] `tailwindcss` (스타일링)
- [x] `react-hook-form` (폼 관리)
- [x] `zod` (유효성 검증)
- [x] `@hookform/resolvers` (React Hook Form + Zod 연동)

#### 프로젝트 구조 생성
- [x] `config/` 디렉토리 생성
- [x] `src/app/` 디렉토리 생성
- [x] `src/lib/` 디렉토리 생성
- [x] `src/components/` 디렉토리 생성
- [x] `src/types/` 디렉토리 생성
- [ ] `public/` 디렉토리 생성

16.2 Config 파일 생성

- [x] `config/career-stages.json` 생성 및 데이터 입력
- [x] `config/income-bands.json` 생성 및 데이터 입력
- [x] `config/asset-bands.json` 생성 및 데이터 입력
- [x] `config/job-types.json` 생성 및 데이터 입력
- [x] Config 파일 형식 검증

16.3 서버 개발 (Backend)

#### Phase 1: Config 관리
- [x] `src/lib/config/types.ts` - Config 타입 정의
- [x] `src/lib/config/loader.ts` - Config 로더 구현
- [x] 서버 시작 시 Config 로드 테스트
- [x] Config 캐싱 구현

#### Phase 2: Config 매퍼
- [x] `src/lib/config/mapper.ts` - 매핑 함수 구현
- [x] `mapCareerStage()` 함수
- [x] `mapIncomeBand()` 함수
- [x] `mapAssetBand()` 함수
- [x] `normalizeInput()` 통합 함수
- [ ] 매핑 로직 단위 테스트

#### Phase 3: 입력값 검증
- [x] `src/lib/validation/input-validator.ts` 구현
- [x] 필수 필드 검증
- [x] 타입 검증
- [x] 범위 검증 (연차 0-30, 소득/자산 0 이상)
- [x] 에러 메시지 정의

#### Phase 4: 캐시 구현
- [x] `src/lib/cache/types.ts` - 캐시 타입 정의
- [x] `src/lib/cache/memory.ts` - 메모리 캐시 구현
- [x] `CacheInterface` 정의
- [x] `get()`, `set()`, `has()`, `clear()` 메서드
- [x] LRU 캐시 또는 최대 크기 제한
- [x] 동시성 처리 (쓰기 락)
- [x] `src/lib/utils/cache-key.ts` - 캐시 키 생성 함수

#### Phase 5: LLM 통합
- [x] `src/lib/llm/types.ts` - LLM 타입 정의
- [x] `src/lib/llm/client.ts` - OpenAI 클라이언트 설정
- [x] 환경 변수에서 API Key 읽기
- [x] 모델 설정 (gpt-4o-mini 또는 gpt-4o)
- [x] Temperature, max_tokens 설정
- [x] `src/lib/llm/prompt.ts` - 프롬프트 생성 함수
- [x] 프롬프트 템플릿 작성
- [x] `src/lib/llm/validator.ts` - 응답 검증 함수
- [x] JSON 파싱 검증
- [x] 필수 키 확인
- [x] 문장 수 검증 (3-7문장)
- [x] 타임아웃 및 재시도 로직
- [x] LLM Rate Limiter 구현 (동시 호출 제한)

#### Phase 6: API 엔드포인트
- [x] `src/app/api/diagnose/route.ts` 구현
- [x] 요청 파싱
- [x] 입력값 검증 통합
- [x] Config 기반 정규화 통합
- [x] 캐시 조회 로직
- [x] 캐시 미스 시 LLM 호출
- [x] 응답 검증 및 캐싱
- [x] 에러 처리
- [x] `src/lib/errors/error-handler.ts` 구현
- [x] 에러 코드 정의
- [x] 에러 응답 포맷

#### Phase 7: 로깅 및 모니터링
- [x] `src/lib/logger/logger.ts` 구현
- [x] 요청/응답 로깅
- [x] 에러 로깅
- [x] 성능 메트릭 수집 (Phase 1 기본)
- [x] 캐시 히트율 추적

16.4 프론트엔드 개발 (Frontend)

#### Phase 1: 기본 UI 컴포넌트
- [x] `src/components/ui/Button.tsx` - 버튼 컴포넌트
- [x] `src/components/ui/Input.tsx` - 입력 컴포넌트
- [x] `src/components/ui/Select.tsx` - 셀렉트 컴포넌트
- [x] `src/components/ui/Card.tsx` - 카드 컴포넌트
- [x] 공통 스타일 및 테마 설정
- [x] Tailwind CSS 설정

#### Phase 2: 입력 폼 컴포넌트
- [x] `src/components/form/DiagnosisForm.tsx` - 메인 폼 컴포넌트
- [x] `src/components/form/JobTypeSelect.tsx` - 직업 선택
- [x] `src/components/form/CareerYearsInput.tsx` - 연차 입력
- [x] `src/components/form/IncomeInput.tsx` - 소득 입력
- [x] `src/components/form/AssetInput.tsx` - 자산 입력
- [x] React Hook Form 통합
- [x] Zod 스키마 정의 및 검증
- [x] 에러 메시지 표시
- [x] 실시간 검증

#### Phase 3: 메인 페이지
- [x] `src/app/page.tsx` - 메인 페이지 구현
- [x] `src/app/layout.tsx` - 루트 레이아웃
- [x] 서비스 소개 섹션
- [x] 입력 폼 통합
- [ ] 진행 표시 (선택)
- [x] 반응형 디자인 적용

#### Phase 4: 결과 페이지
- [x] `src/app/result/page.tsx` - 결과 페이지 구현
- [x] `src/components/result/ResultDisplay.tsx` - 메인 결과 컴포넌트
- [x] `src/components/result/ResultHeader.tsx` - 입력 정보 요약
- [x] `src/components/result/CommonConcerns.tsx` - 공통고민 섹션
- [x] `src/components/result/CurrentCapabilities.tsx` - 현재역량 섹션
- [x] `src/components/result/LearningPoints.tsx` - 학습포인트 섹션
- [x] 결과 페이지 스타일링
- [ ] 애니메이션 효과 (선택)

#### Phase 5: API 통신
- [x] API 호출 함수 작성
- [x] `src/lib/api/diagnose.ts` - 진단 API 호출 함수
- [x] 에러 처리
- [x] 타임아웃 처리
- [x] 로딩 상태 관리
- [x] 제출 중 로딩 UI
- [x] 결과 로딩 UI (스켈레톤 또는 스피너)

#### Phase 6: 상태 관리
- [x] 전역 상태 관리 설정 (Context API 또는 Zustand)
- [x] 진단 결과 상태 관리
- [x] 로딩 상태 관리
- [x] 에러 상태 관리

16.5 타입 정의

- [x] `src/types/input.ts` - 입력 타입 정의
- [x] `src/types/output.ts` - 출력 타입 정의
- [x] `src/types/config.ts` - Config 타입 정의
- [x] `src/types/api.ts` - API 요청/응답 타입 정의

16.6 통합 및 테스트

#### 단위 테스트
- [ ] Config 로더 테스트
- [ ] Config 매퍼 테스트
- [ ] 입력값 검증 테스트
- [ ] 캐시 테스트
- [ ] LLM 검증 테스트
- [ ] 컴포넌트 단위 테스트

#### 통합 테스트
- [ ] API 엔드포인트 테스트
- [ ] 전체 플로우 테스트 (입력 → 정규화 → 캐시 → LLM → 결과)
- [ ] 동시성 테스트
- [ ] 폼 제출 플로우 테스트

#### 성능 테스트
- [ ] 부하 테스트 (동시 요청)
- [ ] 응답 시간 측정
- [ ] 캐시 히트율 측정
- [ ] 메모리 사용량 측정

#### 사용자 시나리오 테스트
- [ ] 정상 플로우 테스트
- [ ] 에러 케이스 테스트
- [ ] 엣지 케이스 테스트
- [ ] 모바일/태블릿/데스크톱 테스트

16.7 UX/UI 개선

- [ ] 접근성 개선 (키보드 네비게이션, ARIA 레이블)
- [ ] 색상 대비 확인 (WCAG AA 기준)
- [ ] 반응형 디자인 최종 확인
- [ ] 애니메이션 및 인터랙션 추가
- [ ] 크로스 브라우저 테스트 (Chrome, Firefox, Safari, Edge)

16.8 성능 최적화

- [ ] 코드 스플리팅 확인
- [ ] 이미지 최적화
- [ ] 번들 크기 분석 및 최적화
- [ ] 로딩 성능 측정
- [ ] 캐시 최적화

16.9 배포 준비

- [ ] 환경 변수 최종 확인
- [ ] Config 파일 최종 확인
- [ ] 빌드 테스트 (`npm run build`)
- [ ] 프로덕션 빌드 최적화
- [ ] README.md 작성
- [ ] 배포 문서 작성

16.10 문서화

- [ ] 코드 주석 작성
- [ ] API 문서 작성 (선택)
- [ ] 컴포넌트 문서화 (선택)
- [ ] README.md 업데이트

17. 상세 파일 구조

17.1 전체 디렉토리 구조

```
cursor_think_marathon/
├── prd.md                          # 프로젝트 요구사항 문서
├── frontend.md                     # 프론트엔드 구현 계획서
├── server.md                       # 서버 구현 계획서
├── file-structure.md               # 파일 구조 설계 문서
│
├── package.json                    # 프로젝트 의존성 및 스크립트
├── package-lock.json               # 의존성 잠금 파일
├── tsconfig.json                   # TypeScript 설정
├── next.config.js                  # Next.js 설정
├── tailwind.config.js              # Tailwind CSS 설정
├── postcss.config.js               # PostCSS 설정
├── .env.local                      # 환경 변수 (OPENAI_API_KEY 등, .gitignore에 포함)
├── .env.example                    # 환경 변수 예시 파일
├── .gitignore                      # Git 제외 파일 목록
├── .eslintrc.json                  # ESLint 설정 (선택)
├── README.md                       # 프로젝트 설명 및 실행 가이드
│
├── config/                         # Config 파일 (Phase 1: 로컬 JSON)
│   ├── career-stages.json          # 커리어 단계 Config
│   ├── income-bands.json           # 월평균소득 구간 Config
│   ├── asset-bands.json            # 순자산 구간 Config
│   └── job-types.json              # 직업 타입 Config
│
├── src/                            # 소스 코드
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # 루트 레이아웃
│   │   ├── page.tsx                # 메인 페이지 (입력 폼)
│   │   ├── globals.css             # 전역 스타일
│   │   ├── result/                 # 진단 결과 페이지
│   │   │   └── page.tsx            # 결과 표시 페이지
│   │   └── api/                    # API 라우트
│   │       └── diagnose/            # 진단 API 엔드포인트
│   │           └── route.ts        # POST /api/diagnose
│   │
│   ├── lib/                        # 공통 유틸리티 및 로직
│   │   ├── config/                 # Config 로더 및 매퍼
│   │   │   ├── loader.ts           # Config 파일 로드
│   │   │   ├── mapper.ts           # 입력값 → Config ID 매핑
│   │   │   └── types.ts            # Config 타입 정의
│   │   │
│   │   ├── cache/                  # 캐싱 로직 (Phase 1: 메모리)
│   │   │   ├── memory.ts           # 메모리 캐시 구현
│   │   │   └── types.ts            # 캐시 타입 정의
│   │   │
│   │   ├── llm/                    # LLM 연동
│   │   │   ├── client.ts           # OpenAI 클라이언트 설정
│   │   │   ├── prompt.ts           # 프롬프트 생성
│   │   │   ├── validator.ts        # LLM 응답 검증
│   │   │   ├── rate-limiter.ts     # LLM 호출 Rate Limiter
│   │   │   └── types.ts            # LLM 타입 정의
│   │   │
│   │   ├── validation/             # 입력값 검증
│   │   │   └── input-validator.ts  # 입력값 검증 로직
│   │   │
│   │   ├── errors/                 # 에러 처리
│   │   │   └── error-handler.ts    # 에러 핸들러
│   │   │
│   │   ├── logger/                 # 로깅
│   │   │   └── logger.ts           # 로거 구현
│   │   │
│   │   ├── api/                    # API 클라이언트 (프론트엔드용)
│   │   │   └── diagnose.ts         # 진단 API 호출 함수
│   │   │
│   │   └── utils/                  # 기타 유틸리티
│   │       ├── normalize.ts        # 입력값 정규화
│   │       └── cache-key.ts        # 캐시 키 생성
│   │
│   ├── components/                 # React 컴포넌트
│   │   ├── ui/                     # 기본 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Card.tsx
│   │   │
│   │   ├── form/                   # 입력 폼 컴포넌트
│   │   │   ├── DiagnosisForm.tsx   # 메인 진단 입력 폼
│   │   │   ├── JobTypeSelect.tsx   # 직업 선택
│   │   │   ├── CareerYearsInput.tsx # 연차 입력
│   │   │   ├── IncomeInput.tsx     # 월평균소득 입력
│   │   │   └── AssetInput.tsx      # 순자산 입력
│   │   │
│   │   └── result/                 # 결과 표시 컴포넌트
│   │       ├── ResultDisplay.tsx   # 진단 결과 메인 컴포넌트
│   │       ├── ResultHeader.tsx   # 입력 정보 요약
│   │       ├── CommonConcerns.tsx  # 공통고민 섹션
│   │       ├── CurrentCapabilities.tsx # 현재역량 섹션
│   │       └── LearningPoints.tsx  # 학습포인트 섹션
│   │
│   └── types/                      # TypeScript 타입 정의
│       ├── input.ts                # 입력 타입
│       ├── output.ts               # 출력 타입
│       ├── config.ts                # Config 타입
│       └── api.ts                   # API 요청/응답 타입
│
└── public/                         # 정적 파일
    ├── favicon.ico
    └── images/                     # 이미지 리소스
```

17.2 주요 파일 상세

#### 17.2.1 설정 파일
- `package.json`: 프로젝트 의존성 및 스크립트 정의
- `tsconfig.json`: TypeScript 컴파일러 설정
- `next.config.js`: Next.js 빌드 및 런타임 설정
- `tailwind.config.js`: Tailwind CSS 커스터마이징
- `.env.local`: 환경 변수 (로컬 개발용, Git 제외)
- `.env.example`: 환경 변수 예시 (Git 포함)

#### 17.2.2 Config 파일
- `config/career-stages.json`: 커리어 단계 정의 (섹션 5.1)
- `config/income-bands.json`: 월평균소득 구간 정의 (섹션 5.2)
- `config/asset-bands.json`: 순자산 구간 정의 (섹션 5.3)
- `config/job-types.json`: 직업 타입 정의

#### 17.2.3 서버 사이드 파일
- `src/app/api/diagnose/route.ts`: 진단 API 엔드포인트
- `src/lib/config/loader.ts`: Config 파일 로드
- `src/lib/config/mapper.ts`: 입력값 → Config ID 매핑
- `src/lib/cache/memory.ts`: 메모리 캐시 구현
- `src/lib/llm/client.ts`: OpenAI 클라이언트
- `src/lib/llm/prompt.ts`: 프롬프트 생성
- `src/lib/llm/validator.ts`: LLM 응답 검증
- `src/lib/validation/input-validator.ts`: 입력값 검증
- `src/lib/errors/error-handler.ts`: 에러 처리
- `src/lib/logger/logger.ts`: 로깅

#### 17.2.4 클라이언트 사이드 파일
- `src/app/page.tsx`: 메인 페이지 (입력 폼)
- `src/app/result/page.tsx`: 결과 페이지
- `src/components/form/DiagnosisForm.tsx`: 메인 폼 컴포넌트
- `src/components/result/ResultDisplay.tsx`: 결과 표시 컴포넌트
- `src/lib/api/diagnose.ts`: API 호출 함수

#### 17.2.5 타입 정의 파일
- `src/types/input.ts`: 입력 데이터 타입
- `src/types/output.ts`: 출력 데이터 타입
- `src/types/config.ts`: Config 데이터 타입
- `src/types/api.ts`: API 요청/응답 타입

17.3 파일 생성 순서 (권장)

1. **프로젝트 초기 설정**
   - package.json, tsconfig.json, next.config.js 등

2. **Config 파일**
   - config/ 디렉토리의 모든 JSON 파일

3. **타입 정의**
   - src/types/ 디렉토리의 모든 타입 파일

4. **서버 사이드 로직**
   - Config 로더 → Config 매퍼 → 입력값 검증 → 캐시 → LLM

5. **API 엔드포인트**
   - src/app/api/diagnose/route.ts

6. **기본 UI 컴포넌트**
   - src/components/ui/ 디렉토리

7. **폼 컴포넌트**
   - src/components/form/ 디렉토리

8. **메인 페이지**
   - src/app/page.tsx

9. **결과 컴포넌트**
   - src/components/result/ 디렉토리

10. **결과 페이지**
    - src/app/result/page.tsx

17.4 파일 네이밍 규칙

- **컴포넌트**: PascalCase (예: `DiagnosisForm.tsx`)
- **유틸리티 함수**: camelCase (예: `cache-key.ts` → `generateCacheKey()`)
- **타입 파일**: kebab-case (예: `input.ts`, `api.ts`)
- **설정 파일**: kebab-case (예: `tsconfig.json`, `next.config.js`)
- **디렉토리**: kebab-case (예: `src/lib/config/`)

17.5 파일 구조 설계 원칙

1. **관심사 분리**: 각 파일은 단일 책임을 가짐
2. **재사용성**: 공통 로직은 `lib/` 디렉토리에 배치
3. **확장성**: Phase 2로 확장 시 구조 변경 최소화
4. **타입 안전성**: 모든 파일에 TypeScript 타입 정의
5. **테스트 용이성**: 각 모듈이 독립적으로 테스트 가능하도록 설계

