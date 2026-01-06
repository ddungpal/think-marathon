# 500 에러 디버깅 가이드

## 🔍 문제 상황

Netlify에 `OPENAI_API_KEY` 환경 변수를 설정했는데도 500 에러가 발생하는 경우의 디버깅 방법입니다.

---

## 📋 단계별 디버깅

### 1단계: Netlify 로그 확인 (가장 중요!)

Netlify에서 실제 에러 메시지를 확인하세요.

#### 방법 A: Functions 로그 확인
1. Netlify 대시보드 → **"Functions"** 탭
2. **"View logs"** 또는 **"Logs"** 클릭
3. 최근 로그에서 에러 메시지 확인
4. 다음 키워드로 검색:
   - `OPENAI_API_KEY`
   - `Error`
   - `Diagnosis failed`

#### 방법 B: Deploy 로그 확인
1. **"Deploys"** 탭 → 최신 배포 클릭
2. 빌드 로그 확인
3. 에러 메시지 확인

#### 확인할 내용
로그에서 다음을 확인하세요:
- `OPENAI_API_KEY is not set` - 환경 변수가 로드되지 않음
- `OPENAI_API_KEY is empty` - 환경 변수는 있지만 빈 값
- `API key` 관련 에러 - API 키가 잘못됨
- `401`, `403` - 인증 실패
- `429` - Rate limit 초과

---

### 2단계: 환경 변수 확인

#### Netlify 대시보드에서 확인
1. **"Site configuration"** → **"Environment variables"**
2. `OPENAI_API_KEY` 변수 확인:
   - 변수가 존재하는지 ✅
   - 값이 올바른지 (눈 아이콘으로 확인) ✅
   - 모든 Deploy context에 설정되어 있는지 ✅

#### 확인 사항
- [ ] 변수 이름: 정확히 `OPENAI_API_KEY` (대문자, 언더스코어)
- [ ] API 키 형식: `sk-proj-` 또는 `sk-`로 시작
- [ ] 앞뒤 공백: 값에 공백이 없는지
- [ ] 모든 Context: Production, Deploy Previews 등에 모두 설정

---

### 3단계: 재배포 확인

환경 변수를 추가/수정한 후 반드시 재배포해야 합니다.

1. **"Deploys"** 탭
2. **"Trigger deploy"** → **"Deploy site"** 클릭
3. 배포 완료 대기
4. 다시 테스트

---

### 4단계: API 키 유효성 확인

OpenAI API 키가 유효한지 확인하세요.

1. [OpenAI Platform](https://platform.openai.com) 접속
2. **"API keys"** 메뉴
3. 사용 중인 API 키 확인:
   - 키가 활성화되어 있는지 ✅
   - 키가 삭제되지 않았는지 ✅
   - 키가 만료되지 않았는지 ✅

---

## 🛠️ 일반적인 원인 및 해결 방법

### 원인 1: 환경 변수가 로드되지 않음

**증상:**
- 로그에 `OPENAI_API_KEY is not set` 메시지
- `envCheck.hasKey: false`

**해결 방법:**
1. 환경 변수 재설정
2. 재배포
3. 모든 Deploy context에 값 설정 확인

---

### 원인 2: API 키가 잘못됨

**증상:**
- 로그에 `401`, `403`, `authentication` 관련 에러
- `OPENAI_API_KEY format is invalid` 메시지

**해결 방법:**
1. OpenAI 대시보드에서 새 API 키 생성
2. Netlify 환경 변수에 새 키 설정
3. 재배포

---

### 원인 3: API 키 형식 오류

**증상:**
- `OPENAI_API_KEY format is invalid` 메시지
- API 키가 `sk-`로 시작하지 않음

**해결 방법:**
1. API 키 값 확인 (앞뒤 공백 제거)
2. 올바른 형식인지 확인 (`sk-proj-xxxxx` 또는 `sk-xxxxx`)
3. 환경 변수 재설정 후 재배포

---

### 원인 4: 빈 문자열

**증상:**
- `OPENAI_API_KEY is set but empty` 메시지
- `envCheck.keyLength: 0`

**해결 방법:**
1. 환경 변수 값 확인
2. 공백이 아닌 실제 API 키 입력
3. 재배포

---

### 원인 5: OpenAI API 에러

**증상:**
- 로그에 OpenAI API 관련 에러
- `429` (Rate limit), `500` (서버 에러) 등

**해결 방법:**
1. OpenAI 상태 확인: https://status.openai.com
2. API 사용량 확인: OpenAI 대시보드
3. 잠시 후 재시도

---

## 📊 로그 분석 예시

### 정상적인 로그
```json
{
  "level": "INFO",
  "message": "LLM call successful",
  "cacheKey": "...",
  "responseTime": 2500
}
```

### 환경 변수 에러
```json
{
  "level": "ERROR",
  "message": "Diagnosis failed",
  "error": "OPENAI_API_KEY is not set...",
  "envCheck": {
    "hasKey": false,
    "keyLength": 0,
    "nodeEnv": "production"
  }
}
```

### API 키 에러
```json
{
  "level": "ERROR",
  "message": "Diagnosis failed",
  "error": "Incorrect API key provided",
  "isOpenAIError": true,
  "envCheck": {
    "hasKey": true,
    "keyLength": 51,
    "keyPrefix": "sk-proj"
  }
}
```

---

## 🔧 빠른 체크리스트

에러 발생 시 다음을 확인하세요:

- [ ] Netlify Functions 로그 확인
- [ ] 환경 변수 `OPENAI_API_KEY` 존재 확인
- [ ] API 키 값이 올바른지 확인 (눈 아이콘)
- [ ] 모든 Deploy context에 값 설정 확인
- [ ] 재배포 실행
- [ ] OpenAI API 키 유효성 확인
- [ ] API 키 형식 확인 (`sk-`로 시작)

---

## 💡 추가 팁

### 로그에서 환경 변수 확인

로그에서 다음 정보를 확인할 수 있습니다:
- `envCheck.hasKey`: 환경 변수가 설정되어 있는지
- `envCheck.keyLength`: API 키 길이
- `envCheck.keyPrefix`: API 키 앞부분 (보안상 일부만)

### 테스트 방법

1. **로컬에서 테스트**: `.env.local` 파일에 API 키 설정 후 `npm run dev`
2. **Netlify Functions 로그**: 실시간 로그 확인
3. **에러 응답**: 브라우저 개발자 도구에서 응답 확인

---

## 📞 도움이 필요한 경우

1. **Netlify 로그 확인**: 가장 먼저 확인할 것
2. **에러 메시지 공유**: 정확한 에러 메시지를 기록
3. **환경 변수 상태 확인**: `envCheck` 정보 확인

---

**대부분의 경우 로그를 확인하면 정확한 원인을 파악할 수 있습니다!** 🔍

