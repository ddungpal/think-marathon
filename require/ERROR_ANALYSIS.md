# 500 에러 원인 분석

## 🔍 문제 상황

Input 값을 입력하고 "진단하기" 버튼을 클릭했을 때 500 에러가 발생합니다.

## 📋 가능한 원인 분석

### 1. 환경 변수 문제 (OPENAI_API_KEY) ⚠️ 가장 가능성 높음

**발생 단계:** `llm_call` 또는 `llm_generation`

**증상:**
- 환경 변수가 설정되지 않음
- 환경 변수는 설정되었지만 재배포하지 않음
- API 키 형식이 잘못됨
- API 키가 유효하지 않음

**확인 방법:**
- Netlify Functions 로그에서 `errorStage: "llm_call"` 또는 `errorStage: "llm_generation"` 확인
- `isEnvError: true` 확인
- `envCheck.hasKey: false` 확인

---

### 2. Config 파일 로드 실패

**발생 단계:** `config_loading`

**증상:**
- Config 파일이 존재하지 않음
- Config 파일 형식이 잘못됨
- 파일 읽기 권한 문제

**확인 방법:**
- 로그에서 `errorStage: "config_loading"` 확인
- `isConfigError: true` 확인
- 에러 메시지에 "Config" 또는 "config loading failed" 포함

**가능한 Config 파일:**
- `config/career-stages.json`
- `config/income-bands.json`
- `config/asset-bands.json`
- `config/job-types.json`
- `config/llm-prompt-config.json`
- `config/income-bracket-learning-points.json`

---

### 3. 입력값 정규화 실패

**발생 단계:** `input_normalization`

**증상:**
- 입력값이 Config 파일의 값과 일치하지 않음
- 매핑 로직 오류

**확인 방법:**
- 로그에서 `errorStage: "input_normalization"` 확인
- 에러 메시지에 "Invalid job type" 등 포함

**예시:**
- `job_type`이 "직장인" 또는 "프리랜서/사업자"가 아님
- Config 파일의 값과 일치하지 않음

---

### 4. OpenAI API 호출 실패

**발생 단계:** `llm_generation`

**증상:**
- API 키는 있지만 인증 실패 (401, 403)
- Rate limit 초과 (429)
- OpenAI API 서버 에러 (500)
- 네트워크 타임아웃

**확인 방법:**
- 로그에서 `errorStage: "llm_generation"` 확인
- `isOpenAIError: true` 확인
- OpenAI API 에러 메시지 확인

---

### 5. JSON 파싱 실패

**발생 단계:** `request_parsing`

**증상:**
- 요청 본문이 올바른 JSON 형식이 아님
- 클라이언트에서 잘못된 데이터 전송

**확인 방법:**
- 로그에서 `errorStage: "request_parsing"` 확인
- 브라우저 개발자 도구 Network 탭에서 요청 확인

---

## 🛠️ 코드 개선 사항

### 1. 단계별 로깅 추가

각 단계마다 로그를 추가하여 어느 단계에서 에러가 발생하는지 추적 가능:

```typescript
errorStage = 'config_loading'      // Config 로드
errorStage = 'request_parsing'     // 요청 파싱
errorStage = 'input_validation'    // 입력값 검증
errorStage = 'input_normalization' // 입력값 정규화
errorStage = 'cache_key_generation'// 캐시 키 생성
errorStage = 'cache_lookup'        // 캐시 조회
errorStage = 'llm_call'            // LLM 호출 시작
errorStage = 'llm_generation'      // LLM 응답 생성
errorStage = 'cache_saving'        // 캐시 저장
```

### 2. 에러 타입 구분

에러 타입을 구분하여 더 명확한 메시지 제공:

- `isEnvError`: 환경 변수 관련 에러
- `isOpenAIError`: OpenAI API 에러
- `isConfigError`: Config 파일 에러

### 3. 상세한 디버깅 정보

로그에 다음 정보 포함:

- `errorStage`: 에러가 발생한 단계
- `envCheck`: 환경 변수 상태
- `originalError`: 원본 에러 정보
- `responseTime`: 응답 시간

---

## 📊 로그 분석 가이드

### Netlify Functions 로그 확인

1. **Netlify 대시보드** → **"Functions"** 탭
2. **"View logs"** 클릭
3. 최근 로그 확인

### 확인할 키워드

**에러 단계 확인:**
- `"errorStage": "config_loading"` → Config 파일 문제
- `"errorStage": "request_parsing"` → 요청 파싱 문제
- `"errorStage": "input_validation"` → 입력값 검증 문제
- `"errorStage": "input_normalization"` → 정규화 문제
- `"errorStage": "llm_call"` 또는 `"llm_generation"` → LLM 호출 문제

**에러 타입 확인:**
- `"isEnvError": true` → 환경 변수 문제
- `"isOpenAIError": true` → OpenAI API 문제
- `"isConfigError": true` → Config 파일 문제

**환경 변수 확인:**
- `"envCheck": { "hasKey": false }` → 환경 변수 미설정
- `"envCheck": { "keyLength": 0 }` → 환경 변수 빈 값
- `"envCheck": { "keyPrefix": "sk-proj" }` → 정상

---

## 🎯 단계별 해결 방법

### Step 1: 로그 확인

Netlify Functions 로그에서 `errorStage` 확인

### Step 2: 원인별 해결

#### 환경 변수 문제인 경우 (`errorStage: "llm_call"` 또는 `"llm_generation"`)

1. Netlify 환경 변수 확인
2. `OPENAI_API_KEY` 값 확인
3. 재배포 실행
4. 로그에서 `envCheck.hasKey: true` 확인

#### Config 파일 문제인 경우 (`errorStage: "config_loading"`)

1. 모든 Config 파일 존재 확인
2. Config 파일 형식 확인 (유효한 JSON)
3. 파일 경로 확인

#### 정규화 문제인 경우 (`errorStage: "input_normalization"`)

1. 입력값과 Config 파일의 값 일치 확인
2. `job_type` 값 확인 ("직장인" 또는 "프리랜서/사업자")

#### OpenAI API 문제인 경우 (`errorStage: "llm_generation"`)

1. API 키 유효성 확인
2. OpenAI 대시보드에서 API 상태 확인
3. Rate limit 확인

---

## 💡 예상 시나리오

### 시나리오 1: 환경 변수 미설정 (가장 가능성 높음)

```
로그:
{
  "errorStage": "llm_generation",
  "isEnvError": true,
  "envCheck": {
    "hasKey": false,
    "keyLength": 0
  }
}
```

**해결:** Netlify 환경 변수 설정 후 재배포

### 시나리오 2: Config 파일 누락

```
로그:
{
  "errorStage": "config_loading",
  "isConfigError": true,
  "error": "Config loading failed"
}
```

**해결:** Config 파일 확인 및 추가

### 시나리오 3: OpenAI API 인증 실패

```
로그:
{
  "errorStage": "llm_generation",
  "isOpenAIError": true,
  "envCheck": {
    "hasKey": true,
    "keyLength": 51
  }
}
```

**해결:** API 키 재생성 및 재설정

---

## 🔍 다음 단계

1. **코드 변경사항 커밋 및 푸시**
2. **Netlify 재배포**
3. **Netlify Functions 로그 확인**
4. **`errorStage` 확인하여 정확한 원인 파악**
5. **위의 해결 방법 적용**

---

**로그를 확인하면 정확한 원인을 파악할 수 있습니다!** 🔍

