# 파일 구조 설계

## 프로젝트 구조 개요

```
cursor_think_marathon/
├── prd.md                          # 프로젝트 요구사항 문서
├── file-structure.md               # 파일 구조 설계 문서 (본 파일)
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

## 주요 파일 상세 설명

### 1. Config 파일 (`config/`)

#### `config/career-stages.json`
```json
{
  "career_stages": [
    { "id": "CAREER_01", "label": "초기", "min_year": 0, "max_year": 3 },
    { "id": "CAREER_02", "label": "중간", "min_year": 4, "max_year": 9 },
    { "id": "CAREER_03", "label": "숙련", "min_year": 10, "max_year": 20 },
    { "id": "CAREER_04", "label": "고연차", "min_year": 21, "max_year": 30 }
  ]
}
```

#### `config/income-bands.json`
```json
{
  "income_bands": [
    { "id": "INCOME_01", "label": "500만 원 이하", "min": 0, "max": 500 },
    { "id": "INCOME_02", "label": "500만~1,500만", "min": 501, "max": 1500 },
    { "id": "INCOME_03", "label": "1,500만~3,000만", "min": 1501, "max": 3000 },
    { "id": "INCOME_04", "label": "3,000만~5,000만", "min": 3001, "max": 5000 },
    { "id": "INCOME_05", "label": "5,000만~1억", "min": 5001, "max": 10000 },
    { "id": "INCOME_06", "label": "1억 이상", "min": 10001", "max": null }
  ]
}
```

#### `config/asset-bands.json`
```json
{
  "asset_bands": [
    { "id": "ASSET_01", "label": "1억 이하", "min": 0, "max": 10000 },
    { "id": "ASSET_02", "label": "1억~3억", "min": 10001, "max": 30000 },
    { "id": "ASSET_03", "label": "3억~10억", "min": 30001, "max": 100000 },
    { "id": "ASSET_04", "label": "10억~30억", "min": 100001, "max": 300000 },
    { "id": "ASSET_05", "label": "30억 이상", "min": 300001, "max": null }
  ]
}
```

#### `config/job-types.json`
```json
{
  "job_types": [
    { "code": "EMPLOYEE", "label": "직장인" },
    { "code": "FREELANCER", "label": "프리랜서/사업자" }
  ]
}
```

### 2. API 라우트 (`src/app/api/diagnose/route.ts`)

**역할:**
- 클라이언트 요청 수신
- 입력값 검증 및 정규화
- 캐시 조회
- 캐시 미스 시 LLM 호출
- 결과 검증 및 캐싱
- 응답 반환

**주요 로직:**
1. Request Body 파싱
2. `lib/config/mapper.ts`로 정규화
3. `lib/utils/cache-key.ts`로 캐시 키 생성
4. `lib/cache/memory.ts`로 캐시 조회
5. 캐시 미스 시 `lib/llm/client.ts` 호출
6. `lib/llm/validator.ts`로 검증
7. 검증 통과 시 캐싱 후 반환

### 3. Config 로더 (`src/lib/config/loader.ts`)

**역할:**
- Config JSON 파일 로드
- 서버 시작 시 또는 요청 시 로드
- 타입 안전성 보장

### 4. Config 매퍼 (`src/lib/config/mapper.ts`)

**역할:**
- 원본 입력값 → Config ID 매핑
- 연차 → 커리어 단계 ID
- 월평균소득 → 소득 구간 ID
- 순자산 → 자산 구간 ID
- LLM 전달용 정규화 Context 생성

**함수:**
- `mapCareerStage(years: number): CareerStage`
- `mapIncomeBand(amount: number): IncomeBand`
- `mapAssetBand(amount: number): AssetBand`
- `normalizeInput(input: RawInput): NormalizedInput`

### 5. 캐시 구현 (`src/lib/cache/memory.ts`)

**역할:**
- Phase 1: 서버 메모리 기반 캐시
- Phase 2: Redis로 확장 가능한 인터페이스

**함수:**
- `get(key: string): DiagnosisResult | null`
- `set(key: string, value: DiagnosisResult): void`
- `clear(): void` (개발/테스트용)

### 6. LLM 클라이언트 (`src/lib/llm/client.ts`)

**역할:**
- OpenAI API 호출
- 환경 변수에서 API Key 읽기
- Temperature, max_tokens 설정
- JSON 응답 강제

**함수:**
- `generateDiagnosis(context: NormalizedInput): Promise<DiagnosisResult>`

### 7. LLM 프롬프트 (`src/lib/llm/prompt.ts`)

**역할:**
- 정규화된 Context를 기반으로 프롬프트 생성
- JSON 출력 강제
- 감정적 위로 금지 지시
- 사고 패턴 중심 서술 지시

**함수:**
- `buildPrompt(context: NormalizedInput): string`

### 8. LLM 검증기 (`src/lib/llm/validator.ts`)

**역할:**
- JSON 파싱 검증
- 필수 키 존재 확인 (common_concerns, current_capabilities, learning_points)
- 문장 수 제한 검증 (섹션당 3~7문장)
- 재요청 로직 (JSON 파싱 실패 시만)

**함수:**
- `validateResponse(json: string): ValidationResult`
- `countSentences(text: string): number`

### 9. 캐시 키 생성 (`src/lib/utils/cache-key.ts`)

**역할:**
- 정규화된 입력값으로 캐시 키 생성
- 형식: `{job_type_code}:{career_stage_id}:{income_band_id}:{asset_band_id}`

**함수:**
- `generateCacheKey(input: NormalizedInput): string`

### 10. 프론트엔드 컴포넌트

#### `src/components/form/DiagnosisForm.tsx`
- 메인 입력 폼 컨테이너
- 폼 상태 관리
- API 호출 및 결과 페이지로 리다이렉트

#### `src/components/result/ResultDisplay.tsx`
- 진단 결과 메인 표시 컴포넌트
- 세 개의 섹션 컴포넌트 조합

## 기술 스택 추천

### 필수
- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **LLM SDK**: OpenAI SDK (`openai` 패키지)
- **스타일링**: Tailwind CSS (또는 CSS Modules)

### 선택
- **폼 관리**: React Hook Form
- **상태 관리**: React Context API (또는 Zustand)
- **유효성 검증**: Zod

## 환경 변수 설정

`.env.local` 파일:
```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_NAME=생각 마라톤
```

## Phase 2 확장 고려사항

Phase 2로 전환 시 다음 파일/폴더 추가:
- `src/lib/cache/redis.ts` - Redis 캐시 구현
- `src/lib/db/` - 데이터베이스 연동 (Config 저장)
- `src/lib/monitoring/` - 비용/로그 모니터링
- `prisma/` 또는 `drizzle/` - ORM 설정 (선택)

## 주의사항

1. **보안**
   - `.env.local`은 반드시 `.gitignore`에 포함
   - API Key는 서버 사이드에서만 사용
   - 클라이언트 코드에 OpenAI SDK 사용 금지

2. **일관성**
   - 모든 숫자 입력은 Config 기반으로 정규화
   - LLM에는 원본 숫자 전달 금지
   - 캐시 키는 정규화된 값으로만 생성

3. **비용 통제**
   - 캐시 우선 조회
   - Temperature 0~0.3 고정
   - max_tokens 제한 설정
   - 재시도 최소화

