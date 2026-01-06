프로젝트명
생각 마라톤 – 사전 질문 기반 진단 시스템

1. 프로젝트 목적 (Purpose)
본 프로젝트는 사용자의 직업, 커리어 단계, 월평균소득 구간, 순자산 구간을 기반으로
LLM(ChatGPT)을 활용해 사고 패턴 중심의 구조화된 진단 결과를 제공하는 웹 서비스다.

핵심 목표는 다음과 같다.
- 숫자를 해석하지 않는다
- 판단 기준은 흔들리지 않는다
- 같은 입력은 항상 같은 결과를 만든다
- 결과는 “정보”가 아니라 “사고를 촉발하는 진단”이어야 한다

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
    - 사용자가 “정확히 나를 말한다”고 느끼는가
    - 다음 질문을 스스로 떠올리는가

14. 비포함 범위 (Out of Scope)
    - 로그인/회원
    - 결제
    - 결과 이력 UI
    - 관리자 UI