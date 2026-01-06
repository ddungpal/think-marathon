# Server 구현 계획서

## 1. 서버 설계 철학

### 1.1 성능 우선 원칙
- **캐시 우선**: 캐시 히트율 최대화로 LLM 호출 최소화
- **비동기 처리**: 블로킹 작업 최소화, 비동기 처리 최대화
- **동시성 보장**: 동시접속자 증가 시에도 응답 시간 유지
- **리소스 효율**: 메모리 및 CPU 사용 최적화

### 1.2 안정성 원칙
- **일관성**: 같은 입력은 항상 같은 결과 (PRD 핵심 목표)
- **에러 복구**: 부분 실패 시에도 서비스 지속 가능
- **검증 강화**: 입력값 및 LLM 응답 검증 철저
- **로깅**: 모든 중요한 이벤트 로깅

### 1.3 확장성 원칙
- **Phase 1 → Phase 2**: 자연스러운 확장 경로
- **모듈화**: 각 레이어가 독립적으로 교체 가능
- **설정 외부화**: Config, 환경 변수 등 외부 관리

## 2. 아키텍처 개요

### 2.1 전체 플로우
```
Client Request
    ↓
API Route Handler (/api/diagnose)
    ↓
Input Validation
    ↓
Config-based Normalization
    ↓
Cache Lookup (Memory Cache)
    ├─ Cache Hit → Return Result (즉시)
    └─ Cache Miss → Continue
        ↓
LLM Call (OpenAI API)
    ↓
Response Validation
    ↓
Cache Store
    ↓
Return Result
```

### 2.2 핵심 컴포넌트
1. **API Route Handler**: 요청 수신 및 응답 반환
2. **Input Validator**: 입력값 검증
3. **Config Loader**: Config 파일 로드 및 캐싱
4. **Config Mapper**: 입력값 → Config ID 매핑
5. **Cache Manager**: 메모리 캐시 관리 (Phase 1)
6. **LLM Client**: OpenAI API 호출
7. **LLM Validator**: LLM 응답 검증
8. **Error Handler**: 에러 처리 및 로깅

## 3. API 엔드포인트 설계

### 3.1 POST /api/diagnose

#### 3.1.1 요청 스펙
**Endpoint**: `POST /api/diagnose`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```typescript
{
  job_type: string;          // "직장인" | "프리랜서/사업자"
  career_years: number;       // 0-30
  monthly_income: number;    // 만 원 단위, 0 이상
  net_worth: number;         // 만 원 단위, 0 이상
}
```

**요청 예시**:
```json
{
  "job_type": "직장인",
  "career_years": 5,
  "monthly_income": 400,
  "net_worth": 5000
}
```

#### 3.1.2 응답 스펙

**성공 응답 (200 OK)**:
```typescript
{
  success: true;
  data: {
    common_concerns: string;
    current_capabilities: string;
    learning_points: string;
  };
  cached: boolean;  // 캐시에서 가져온 결과인지 여부
}
```

**에러 응답 (400 Bad Request)**:
```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**에러 응답 (500 Internal Server Error)**:
```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

#### 3.1.3 에러 코드 정의
- `INVALID_INPUT`: 입력값 검증 실패
- `INVALID_JOB_TYPE`: 직업 타입이 유효하지 않음
- `INVALID_CAREER_YEARS`: 연차가 0-30 범위를 벗어남
- `INVALID_INCOME`: 월평균소득이 유효하지 않음
- `INVALID_NET_WORTH`: 순자산이 유효하지 않음
- `LLM_ERROR`: LLM 호출 실패
- `LLM_VALIDATION_ERROR`: LLM 응답 검증 실패
- `INTERNAL_ERROR`: 내부 서버 오류

### 3.2 GET /api/health (선택)

**목적**: 서버 상태 확인

**응답**:
```typescript
{
  status: "healthy" | "unhealthy";
  timestamp: string;
  cache_size?: number;  // 캐시 크기 (Phase 1)
}
```

## 4. 입력값 검증 및 정규화

### 4.1 입력값 검증

#### 4.1.1 검증 규칙
- **job_type**: 필수, "직장인" 또는 "프리랜서/사업자"만 허용
- **career_years**: 필수, 0-30 범위의 정수
- **monthly_income**: 필수, 0 이상의 숫자
- **net_worth**: 필수, 0 이상의 숫자

#### 4.1.2 검증 구현
```typescript
// src/lib/validation/input-validator.ts
export function validateInput(input: RawInput): ValidationResult {
  // 1. 필수 필드 확인
  // 2. 타입 확인
  // 3. 범위 확인
  // 4. 비즈니스 로직 검증
}
```

### 4.2 Config 기반 정규화

#### 4.2.1 정규화 프로세스
1. **직업 타입 매핑**: "직장인" → "EMPLOYEE", "프리랜서/사업자" → "FREELANCER"
2. **커리어 단계 매핑**: 연차 → CAREER_XX ID
3. **소득 구간 매핑**: 월평균소득 → INCOME_XX ID
4. **자산 구간 매핑**: 순자산 → ASSET_XX ID

#### 4.2.2 정규화 결과
```typescript
{
  job_type_code: "EMPLOYEE",
  career_stage: { id: "CAREER_02", label: "중간" },
  income_band: { id: "INCOME_01", label: "500만 원 이하" },
  asset_band: { id: "ASSET_02", label: "1억~3억" }
}
```

## 5. 캐싱 전략

### 5.1 캐시 키 생성

#### 5.1.1 키 형식
```
{job_type_code}:{career_stage_id}:{income_band_id}:{asset_band_id}
```

**예시**:
```
EMPLOYEE:CAREER_02:INCOME_01:ASSET_02
```

#### 5.1.2 키 생성 로직
```typescript
// src/lib/utils/cache-key.ts
export function generateCacheKey(normalized: NormalizedInput): string {
  return `${normalized.job_type_code}:${normalized.career_stage.id}:${normalized.income_band.id}:${normalized.asset_band.id}`;
}
```

### 5.2 메모리 캐시 구현 (Phase 1)

#### 5.2.1 데이터 구조
```typescript
// Map<string, DiagnosisResult>
const cache = new Map<string, DiagnosisResult>();
```

#### 5.2.2 캐시 인터페이스
```typescript
interface CacheInterface {
  get(key: string): Promise<DiagnosisResult | null>;
  set(key: string, value: DiagnosisResult): Promise<void>;
  has(key: string): Promise<boolean>;
  clear(): Promise<void>;
  size(): Promise<number>;
}
```

#### 5.2.3 동시성 처리
- **읽기**: 동시 읽기 허용 (Map은 thread-safe하지 않지만 Node.js는 single-threaded)
- **쓰기**: 동시 쓰기 방지 (Promise 기반 큐 또는 락 사용)
- **메모리 관리**: LRU 캐시 또는 최대 크기 제한 고려

#### 5.2.4 메모리 캐시 구현
```typescript
// src/lib/cache/memory.ts
class MemoryCache implements CacheInterface {
  private cache: Map<string, DiagnosisResult>;
  private maxSize: number;
  
  constructor(maxSize: number = 10000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  async get(key: string): Promise<DiagnosisResult | null> {
    return this.cache.get(key) || null;
  }
  
  async set(key: string, value: DiagnosisResult): Promise<void> {
    // 최대 크기 초과 시 LRU 제거
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  // ... 기타 메서드
}
```

### 5.3 Redis 캐시 (Phase 2)

#### 5.3.1 Redis 인터페이스
- Phase 1의 `CacheInterface`와 동일한 인터페이스 사용
- 구현체만 교체하여 확장

#### 5.3.2 Redis 설정
- **TTL**: 무제한 (캐시 키는 영구 보관)
- **연결 풀**: 연결 재사용으로 성능 최적화
- **에러 처리**: Redis 장애 시 메모리 캐시로 폴백 (선택)

## 6. Config 관리

### 6.1 Config 로딩 전략

#### 6.1.1 서버 시작 시 로드
- Next.js 서버 시작 시 Config 파일을 메모리에 로드
- 이후 요청 시 파일 I/O 없이 메모리에서 읽기

#### 6.1.2 Config 캐싱
```typescript
// src/lib/config/loader.ts
let configCache: ConfigData | null = null;

export async function loadConfig(): Promise<ConfigData> {
  if (configCache) {
    return configCache;
  }
  
  // Config 파일 로드
  const careerStages = await loadJSON('config/career-stages.json');
  const incomeBands = await loadJSON('config/income-bands.json');
  const assetBands = await loadJSON('config/asset-bands.json');
  const jobTypes = await loadJSON('config/job-types.json');
  
  configCache = {
    careerStages,
    incomeBands,
    assetBands,
    jobTypes,
  };
  
  return configCache;
}
```

#### 6.1.3 Config 핫 리로드 (개발 환경)
- 개발 환경에서만 Config 파일 변경 감지
- 프로덕션에서는 서버 재시작 필요

### 6.2 Config 매핑 로직

#### 6.2.1 커리어 단계 매핑
```typescript
// src/lib/config/mapper.ts
export function mapCareerStage(
  years: number,
  config: ConfigData
): CareerStage {
  const stage = config.careerStages.find(
    s => years >= s.min_year && years <= s.max_year
  );
  
  if (!stage) {
    throw new Error(`Invalid career years: ${years}`);
  }
  
  return stage;
}
```

#### 6.2.2 소득 구간 매핑
```typescript
export function mapIncomeBand(
  amount: number,
  config: ConfigData
): IncomeBand {
  const band = config.incomeBands.find(
    b => amount >= b.min && (b.max === null || amount <= b.max)
  );
  
  if (!band) {
    throw new Error(`Invalid income: ${amount}`);
  }
  
  return band;
}
```

#### 6.2.3 자산 구간 매핑
```typescript
export function mapAssetBand(
  amount: number,
  config: ConfigData
): AssetBand {
  const band = config.assetBands.find(
    b => amount >= b.min && (b.max === null || amount <= b.max)
  );
  
  if (!band) {
    throw new Error(`Invalid net worth: ${amount}`);
  }
  
  return band;
}
```

## 7. LLM 통합

### 7.1 OpenAI 클라이언트 설정

#### 7.1.1 클라이언트 초기화
```typescript
// src/lib/llm/client.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30초 타임아웃
  maxRetries: 1,  // 재시도 1회만
});
```

#### 7.1.2 모델 설정
- **Model**: `gpt-4o-mini` 또는 `gpt-4o` (비용과 성능 고려)
- **Temperature**: 0.2 (일관성 확보)
- **Max Tokens**: 1000 (비용 통제)
- **Response Format**: JSON 강제

### 7.2 프롬프트 생성

#### 7.2.1 프롬프트 구조
```typescript
// src/lib/llm/prompt.ts
export function buildPrompt(context: NormalizedInput): string {
  return `
당신은 사고 패턴 중심의 진단 전문가입니다.
다음 정보를 바탕으로 진단 결과를 제공해주세요.

직업: ${context.job_type}
커리어 단계: ${context.career_stage.label}
월평균소득 구간: ${context.income_band.label}
순자산 구간: ${context.asset_band.label}

다음 형식의 JSON으로만 응답하세요:
{
  "common_concerns": "...",
  "current_capabilities": "...",
  "learning_points": "..."
}

주의사항:
- 감정적 위로나 추상적 동기부여는 하지 마세요
- 객관적이고 구체적인 사고 패턴 중심으로 서술하세요
- 각 섹션은 3-7문장으로 작성하세요
- 숫자는 해석하지 말고 구간 정보만 사용하세요
`;
}
```

### 7.3 LLM 호출 최적화

#### 7.3.1 비동기 처리
- 모든 LLM 호출은 비동기로 처리
- Promise 기반으로 동시 요청 처리 가능

#### 7.3.2 타임아웃 및 재시도
```typescript
async function callLLM(prompt: string): Promise<DiagnosisResult> {
  try {
    const response = await Promise.race([
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 30000)
      ),
    ]);
    
    return parseResponse(response);
  } catch (error) {
    // 재시도 로직 (최대 1회)
    // ...
  }
}
```

#### 7.3.3 동시 호출 제한
- **세마포어 패턴**: 동시 LLM 호출 수 제한 (예: 최대 10개)
- **큐잉**: 초과 요청은 큐에 추가하여 순차 처리

```typescript
// src/lib/llm/rate-limiter.ts
class LLMRateLimiter {
  private semaphore: number;
  private queue: Array<() => void>;
  
  constructor(maxConcurrent: number = 10) {
    this.semaphore = maxConcurrent;
    this.queue = [];
  }
  
  async acquire(): Promise<void> {
    if (this.semaphore > 0) {
      this.semaphore--;
      return;
    }
    
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }
  
  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next?.();
    } else {
      this.semaphore++;
    }
  }
}
```

### 7.4 응답 검증

#### 7.4.1 검증 규칙
1. **JSON 파싱**: 유효한 JSON인지 확인
2. **필수 키**: common_concerns, current_capabilities, learning_points 존재 확인
3. **문장 수**: 각 섹션당 3-7문장 확인
4. **타입**: 모든 값이 문자열인지 확인

#### 7.4.2 검증 구현
```typescript
// src/lib/llm/validator.ts
export function validateResponse(
  json: string
): { valid: boolean; data?: DiagnosisResult; error?: string } {
  try {
    const data = JSON.parse(json);
    
    // 필수 키 확인
    if (!data.common_concerns || !data.current_capabilities || !data.learning_points) {
      return { valid: false, error: 'Missing required keys' };
    }
    
    // 문장 수 확인
    const concernsSentences = countSentences(data.common_concerns);
    const capabilitiesSentences = countSentences(data.current_capabilities);
    const learningSentences = countSentences(data.learning_points);
    
    if (concernsSentences < 3 || concernsSentences > 7 ||
        capabilitiesSentences < 3 || capabilitiesSentences > 7 ||
        learningSentences < 3 || learningSentences > 7) {
      return { valid: false, error: 'Invalid sentence count' };
    }
    
    return { valid: true, data };
  } catch (error) {
    return { valid: false, error: 'Invalid JSON' };
  }
}
```

## 8. 동시성 및 성능 최적화

### 8.1 동시 요청 처리

#### 8.1.1 Next.js App Router 특성
- Next.js는 기본적으로 비동기 요청을 잘 처리
- 각 API Route는 독립적으로 실행

#### 8.1.2 캐시 동시성
- **읽기**: 동시 읽기 허용 (Map은 thread-safe하지 않지만 Node.js는 single-threaded)
- **쓰기**: 동시 쓰기 방지 필요 (Promise 기반 락 또는 큐)

```typescript
// 쓰기 락 구현
class WriteLock {
  private locked = false;
  private queue: Array<() => void> = [];
  
  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }
    
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }
  
  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next?.();
    } else {
      this.locked = false;
    }
  }
}
```

### 8.2 성능 최적화 전략

#### 8.2.1 캐시 히트율 최대화
- **목표**: 캐시 히트율 80% 이상
- **방법**: 
  - 동일 입력에 대한 캐시 우선 조회
  - 캐시 크기 최적화

#### 8.2.2 LLM 호출 최소화
- **캐시 우선**: 캐시 히트 시 LLM 호출 완전 차단
- **배치 처리**: 여러 요청이 동시에 같은 키를 요청할 경우, 첫 번째만 LLM 호출하고 나머지는 대기

```typescript
// 동일 키에 대한 중복 호출 방지
class LLMCallManager {
  private pendingCalls: Map<string, Promise<DiagnosisResult>> = new Map();
  
  async getOrCall(
    key: string,
    callFn: () => Promise<DiagnosisResult>
  ): Promise<DiagnosisResult> {
    // 이미 진행 중인 호출이 있으면 대기
    if (this.pendingCalls.has(key)) {
      return this.pendingCalls.get(key)!;
    }
    
    // 새로운 호출 시작
    const promise = callFn().finally(() => {
      this.pendingCalls.delete(key);
    });
    
    this.pendingCalls.set(key, promise);
    return promise;
  }
}
```

#### 8.2.3 Config 로딩 최적화
- **서버 시작 시 로드**: 요청 시 파일 I/O 제거
- **메모리 캐싱**: Config는 메모리에 상주

#### 8.2.4 응답 시간 목표
- **캐시 히트**: < 10ms
- **캐시 미스 (LLM 호출)**: < 30초 (LLM 응답 시간 포함)

### 8.3 리소스 관리

#### 8.3.1 메모리 관리
- **캐시 크기 제한**: 최대 10,000개 항목 (LRU)
- **메모리 모니터링**: 캐시 크기 추적

#### 8.3.2 CPU 관리
- **비동기 처리**: 블로킹 작업 최소화
- **작업 분산**: 무거운 작업은 워커 스레드로 분리 (선택)

## 9. 에러 처리 및 로깅

### 9.1 에러 처리 전략

#### 9.1.1 에러 분류
- **클라이언트 에러 (4xx)**: 입력값 검증 실패 등
- **서버 에러 (5xx)**: LLM 호출 실패, 내부 오류 등

#### 9.1.2 에러 핸들링
```typescript
// src/lib/errors/error-handler.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  // 예상치 못한 에러
  console.error('Unexpected error:', error);
  return new AppError('INTERNAL_ERROR', 'Internal server error', 500);
}
```

### 9.2 로깅 전략

#### 9.2.1 로그 레벨
- **INFO**: 일반적인 요청/응답
- **WARN**: 경고 (예: 캐시 미스, 재시도)
- **ERROR**: 에러 (예: LLM 호출 실패)

#### 9.2.2 로그 내용
```typescript
// 요청 로그
{
  timestamp: string;
  method: string;
  path: string;
  input: RawInput;
  normalized: NormalizedInput;
  cacheKey: string;
  cacheHit: boolean;
  responseTime: number;
  llmCallTime?: number;
  error?: string;
}
```

#### 9.2.3 로깅 구현
```typescript
// src/lib/logger/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(JSON.stringify({ level: 'INFO', message, ...data }));
  },
  warn: (message: string, data?: any) => {
    console.warn(JSON.stringify({ level: 'WARN', message, ...data }));
  },
  error: (message: string, error?: any) => {
    console.error(JSON.stringify({ level: 'ERROR', message, error }));
  },
};
```

## 10. 보안

### 10.1 API Key 보안
- **환경 변수**: API Key는 환경 변수로만 관리
- **Git 제외**: `.env.local`은 `.gitignore`에 포함
- **서버 사이드만**: 클라이언트 코드에 노출 금지

### 10.2 입력값 검증
- **타입 검증**: 모든 입력값 타입 확인
- **범위 검증**: 숫자 범위 확인
- **SQL Injection 방지**: DB 사용 시 (Phase 2)

### 10.3 Rate Limiting (Phase 2)
- **IP 기반**: IP별 요청 수 제한
- **세션 기반**: 세션별 요청 수 제한

## 11. 모니터링 및 메트릭

### 11.1 주요 메트릭 (Phase 1)
- **캐시 히트율**: 캐시 히트 / 전체 요청
- **평균 응답 시간**: 캐시 히트/미스별
- **LLM 호출 수**: 시간당 LLM 호출 횟수
- **에러율**: 에러 발생 비율

### 11.2 모니터링 구현 (Phase 1)
```typescript
// src/lib/monitoring/metrics.ts
class Metrics {
  private cacheHits = 0;
  private cacheMisses = 0;
  private llmCalls = 0;
  private errors = 0;
  
  recordCacheHit() { this.cacheHits++; }
  recordCacheMiss() { this.cacheMisses++; }
  recordLLMCall() { this.llmCalls++; }
  recordError() { this.errors++; }
  
  getStats() {
    const total = this.cacheHits + this.cacheMisses;
    return {
      cacheHitRate: total > 0 ? this.cacheHits / total : 0,
      llmCalls: this.llmCalls,
      errorRate: total > 0 ? this.errors / total : 0,
    };
  }
}
```

### 11.3 Phase 2 확장
- **프로메테우스**: 메트릭 수집
- **그라파나**: 대시보드 시각화
- **알림**: 에러율 임계값 초과 시 알림

## 12. 작업 단계별 계획

### Phase 1: 기반 설정 및 Config 관리 (1-2일)

#### 작업 항목
1. **프로젝트 초기 설정**
   - [ ] Next.js API Route 구조 확인
   - [ ] TypeScript 설정
   - [ ] 환경 변수 설정 (.env.local)
   - [ ] 필수 라이브러리 설치 (openai 등)

2. **Config 파일 생성**
   - [ ] `config/career-stages.json` 생성
   - [ ] `config/income-bands.json` 생성
   - [ ] `config/asset-bands.json` 생성
   - [ ] `config/job-types.json` 생성

3. **Config 로더 구현**
   - [ ] `src/lib/config/loader.ts` 구현
   - [ ] Config 타입 정의 (`src/lib/config/types.ts`)
   - [ ] 서버 시작 시 Config 로드
   - [ ] Config 캐싱 구현

4. **Config 매퍼 구현**
   - [ ] `src/lib/config/mapper.ts` 구현
   - [ ] 커리어 단계 매핑 함수
   - [ ] 소득 구간 매핑 함수
   - [ ] 자산 구간 매핑 함수
   - [ ] 정규화 함수 통합

#### 완료 기준
- Config 파일이 정상적으로 로드됨
- 입력값이 Config 기반으로 정규화됨
- 단위 테스트 통과

### Phase 2: 입력값 검증 및 API 엔드포인트 (1-2일)

#### 작업 항목
1. **입력값 검증 구현**
   - [ ] `src/lib/validation/input-validator.ts` 구현
   - [ ] 필수 필드 검증
   - [ ] 타입 검증
   - [ ] 범위 검증
   - [ ] 에러 메시지 정의

2. **API 엔드포인트 구현**
   - [ ] `src/app/api/diagnose/route.ts` 기본 구조
   - [ ] 요청 파싱
   - [ ] 입력값 검증 통합
   - [ ] 정규화 통합
   - [ ] 에러 응답 처리

3. **에러 처리 구현**
   - [ ] `src/lib/errors/error-handler.ts` 구현
   - [ ] 에러 코드 정의
   - [ ] 에러 응답 포맷

#### 완료 기준
- API 엔드포인트가 정상 작동
- 입력값 검증이 올바르게 동작
- 에러 응답이 적절히 반환됨

### Phase 3: 캐싱 구현 (1-2일)

#### 작업 항목
1. **캐시 키 생성**
   - [ ] `src/lib/utils/cache-key.ts` 구현
   - [ ] 캐시 키 생성 함수

2. **메모리 캐시 구현**
   - [ ] `src/lib/cache/memory.ts` 구현
   - [ ] CacheInterface 정의
   - [ ] Map 기반 캐시 구현
   - [ ] LRU 캐시 (선택)
   - [ ] 동시성 처리 (쓰기 락)

3. **캐시 통합**
   - [ ] API 엔드포인트에 캐시 통합
   - [ ] 캐시 히트/미스 로직
   - [ ] 캐시 저장 로직

#### 완료 기준
- 캐시가 정상 작동
- 캐시 히트 시 즉시 응답 반환
- 동시 요청 시에도 안정적으로 작동

### Phase 4: LLM 통합 (2-3일)

#### 작업 항목
1. **OpenAI 클라이언트 설정**
   - [ ] `src/lib/llm/client.ts` 구현
   - [ ] OpenAI SDK 초기화
   - [ ] 환경 변수에서 API Key 읽기
   - [ ] 모델 설정

2. **프롬프트 생성**
   - [ ] `src/lib/llm/prompt.ts` 구현
   - [ ] 프롬프트 템플릿 작성
   - [ ] 정규화된 Context 기반 프롬프트 생성

3. **LLM 호출 구현**
   - [ ] LLM 호출 함수
   - [ ] 타임아웃 처리
   - [ ] 재시도 로직 (최대 1회)
   - [ ] 에러 처리

4. **응답 검증**
   - [ ] `src/lib/llm/validator.ts` 구현
   - [ ] JSON 파싱 검증
   - [ ] 필수 키 확인
   - [ ] 문장 수 검증

5. **LLM 통합**
   - [ ] API 엔드포인트에 LLM 통합
   - [ ] 캐시 미스 시 LLM 호출
   - [ ] 검증 통과 시 캐싱

#### 완료 기준
- LLM 호출이 정상 작동
- 응답 검증이 올바르게 동작
- 에러 상황이 적절히 처리됨

### Phase 5: 성능 최적화 및 동시성 (1-2일)

#### 작업 항목
1. **동시성 처리**
   - [ ] 동일 키에 대한 중복 호출 방지
   - [ ] LLM 호출 Rate Limiter 구현
   - [ ] 쓰기 락 최적화

2. **성능 최적화**
   - [ ] 캐시 히트율 모니터링
   - [ ] 응답 시간 측정
   - [ ] 병목 지점 분석 및 개선

3. **로깅 구현**
   - [ ] `src/lib/logger/logger.ts` 구현
   - [ ] 요청/응답 로깅
   - [ ] 에러 로깅
   - [ ] 성능 메트릭 로깅

#### 완료 기준
- 동시 요청이 안정적으로 처리됨
- 성능 목표 달성 (캐시 히트 < 10ms)
- 로깅이 정상 작동

### Phase 6: 테스트 및 최종 검토 (1-2일)

#### 작업 항목
1. **단위 테스트**
   - [ ] Config 로더 테스트
   - [ ] Config 매퍼 테스트
   - [ ] 입력값 검증 테스트
   - [ ] 캐시 테스트
   - [ ] LLM 검증 테스트

2. **통합 테스트**
   - [ ] API 엔드포인트 테스트
   - [ ] 전체 플로우 테스트
   - [ ] 동시성 테스트

3. **성능 테스트**
   - [ ] 부하 테스트 (동시 요청)
   - [ ] 응답 시간 측정
   - [ ] 메모리 사용량 측정

4. **최종 검토**
   - [ ] 코드 리뷰
   - [ ] 문서화
   - [ ] 배포 준비

#### 완료 기준
- 모든 테스트 통과
- 성능 목표 달성
- 프로덕션 배포 준비 완료

## 13. Phase 2 확장 계획

### 13.1 Redis 캐시 전환
- [ ] Redis 클라이언트 설정
- [ ] `src/lib/cache/redis.ts` 구현
- [ ] CacheInterface 구현
- [ ] 메모리 캐시에서 Redis로 전환

### 13.2 데이터베이스 연동
- [ ] ORM 설정 (Prisma 또는 Drizzle)
- [ ] Config를 DB에 저장
- [ ] Config 조회 API

### 13.3 모니터링 강화
- [ ] 프로메테우스 연동
- [ ] 그라파나 대시보드
- [ ] 알림 설정

### 13.4 Rate Limiting
- [ ] IP 기반 Rate Limiting
- [ ] 세션 기반 Rate Limiting

## 14. 체크리스트

### 개발 전 체크리스트
- [ ] 환경 변수 설정 확인
- [ ] OpenAI API Key 발급 및 설정
- [ ] Config 파일 준비
- [ ] 개발 환경 설정

### 개발 중 체크리스트
- [ ] 각 모듈별 단위 테스트
- [ ] 통합 테스트
- [ ] 성능 테스트
- [ ] 동시성 테스트

### 배포 전 체크리스트
- [ ] 환경 변수 확인
- [ ] Config 파일 확인
- [ ] 에러 처리 확인
- [ ] 로깅 확인
- [ ] 성능 목표 달성 확인
- [ ] 보안 검토

---

**문서 버전**: 1.0  
**최종 업데이트**: 2024년  
**다음 검토 예정일**: 구현 진행에 따라 업데이트

