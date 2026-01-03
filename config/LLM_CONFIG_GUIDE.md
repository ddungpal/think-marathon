# LLM 프롬프트 Config 사용 가이드

## 개요

`config/llm-prompt-config.json` 파일을 통해 ChatGPT에 전달되는 학습 조건과 프롬프트를 관리할 수 있습니다. 이 파일을 수정하면 서버를 재시작한 후 새로운 조건이 적용됩니다.

## 파일 위치

```
config/llm-prompt-config.json
```

## ChatGPT 학습 포인트 문서 활용

프로젝트 루트에 있는 `ChatGPT-Learning-Point.md` 파일을 사용하여 학습 포인트를 체계적으로 정리하고, 이를 `config/llm-prompt-config.json`에 반영할 수 있습니다.

### 사용 워크플로우

1. **학습 포인트 작성**
   - `ChatGPT-Learning-Point.md` 파일을 열어 각 섹션에 학습 포인트 작성
   - 각 섹션은 `llm-prompt-config.json`의 해당 필드와 매핑됨

2. **검증 (선택사항)**
   - `npm run validate:learning-points` 명령어로 파일 구조 검증
   - 필수 섹션 누락 여부 및 Config 파일과의 일관성 확인

3. **Config 파일에 반영**
   - 작성한 내용을 아래 매핑 가이드를 참고하여 `config/llm-prompt-config.json`에 반영
   - 매핑 가이드의 예시를 참고하여 정확하게 반영

4. **서버 재시작**
   - 변경사항 적용을 위해 서버 재시작

### ChatGPT-Learning-Point.md → llm-prompt-config.json 매핑 가이드

| ChatGPT-Learning-Point.md 섹션 | llm-prompt-config.json 필드 | 반영 방법 |
|-------------------------------|---------------------------|----------|
| 1. 역할 및 전문성 → 역할 설명 | `role.description` | 직접 복사 |
| 1. 역할 및 전문성 → 전문 분야 | `role.expertise` | 배열 항목으로 추가 |
| 2. 진단 원칙 → 핵심 철학 | `diagnosis_principles.core_philosophy` | 배열 항목으로 추가 |
| 2. 진단 원칙 → 사고 패턴 | `diagnosis_principles.thinking_patterns` | 배열 항목으로 추가 |
| 3. 작성 가이드라인 → 스타일 | `writing_guidelines.style` | 객체 값으로 설정 |
| 3. 작성 가이드라인 → 금지 사항 | `writing_guidelines.prohibited` | 배열 항목으로 추가 |
| 3. 작성 가이드라인 → 필수 사항 | `writing_guidelines.required` | 배열 항목으로 추가 |
| 4. 섹션별 가이드라인 → 공통고민 | `section_guidelines.common_concerns` | 객체로 설정 |
| 4. 섹션별 가이드라인 → 현재역량 | `section_guidelines.current_capabilities` | 객체로 설정 |
| 4. 섹션별 가이드라인 → 학습포인트 | `section_guidelines.learning_points` | 객체로 설정 |
| 5. 좋은 예시 → 공통고민 예시 | `examples.good_example.common_concerns` | 문자열로 설정 |
| 5. 좋은 예시 → 현재역량 예시 | `examples.good_example.current_capabilities` | 문자열로 설정 |
| 5. 좋은 예시 → 학습포인트 예시 | `examples.good_example.learning_points` | 문자열로 설정 |
| 6. 나쁜 예시 → 피해야 할 표현 | `examples.bad_example.examples` | 배열 항목으로 추가 |
| 7. 컨텍스트 사용 규칙 → 규칙 | `context_usage.rules` | 배열 항목으로 추가 |
| 8. 출력 형식 검증 → 금지 단어 | `output_format.validation.prohibited_words` | 배열 항목으로 추가 |
| 8. 출력 형식 검증 → 문장 수 제한 | `output_format.validation.sentence_count_per_section` | 객체로 설정 |

### 매핑 예시

#### 예시 1: 금지 사항 추가

**ChatGPT-Learning-Point.md:**
```markdown
### 금지 사항 (prohibited)
- 감정적 위로
- 추상적 동기부여
- [추가] "당신은 특별합니다"
```

**llm-prompt-config.json:**
```json
{
  "writing_guidelines": {
    "prohibited": [
      "감정적 위로",
      "추상적 동기부여",
      "당신은 특별합니다"  // ← 추가
    ]
  }
}
```

#### 예시 2: 섹션별 집중 포인트 추가

**ChatGPT-Learning-Point.md:**
```markdown
### 공통고민 (common_concerns)

**집중 포인트:**
- 커리어 단계별 특성
- [추가] 연령대별 특성
```

**llm-prompt-config.json:**
```json
{
  "section_guidelines": {
    "common_concerns": {
      "focus": [
        "커리어 단계별 특성",
        "연령대별 특성"  // ← 추가
      ]
    }
  }
}
```

### 상세 매핑 가이드

#### 1. 역할 및 전문성 매핑

**ChatGPT-Learning-Point.md 구조:**
```markdown
## 1. 역할 및 전문성 (role)

### 역할 설명
```
당신은 사고 패턴 중심의 진단 전문가입니다.
```

### 전문 분야
- 커리어 분석
- 재무 상황 분석
- 사고 패턴 진단

**추가할 전문 분야:**
- 새로운 전문 분야
```

**llm-prompt-config.json 반영:**
```json
{
  "role": {
    "description": "당신은 사고 패턴 중심의 진단 전문가입니다.",
    "expertise": [
      "커리어 분석",
      "재무 상황 분석",
      "사고 패턴 진단",
      "새로운 전문 분야"  // ← 추가
    ]
  }
}
```

#### 2. 진단 원칙 매핑

**ChatGPT-Learning-Point.md 구조:**
```markdown
### 핵심 철학 (core_philosophy)
- 숫자를 해석하지 않고 구간 정보만 사용한다
- 판단 기준은 흔들리지 않는다
- [추가] 새로운 핵심 철학
```

**llm-prompt-config.json 반영:**
```json
{
  "diagnosis_principles": {
    "core_philosophy": [
      "숫자를 해석하지 않고 구간 정보만 사용한다",
      "판단 기준은 흔들리지 않는다",
      "새로운 핵심 철학"  // ← 추가
    ]
  }
}
```

#### 3. 작성 가이드라인 매핑

**ChatGPT-Learning-Point.md 구조:**
```markdown
### 스타일 (style)
- **톤**: 객관적이고 전문적
- **관점**: 사고 패턴 중심
- **집중**: 구체적이고 실행 가능한 내용

**수정할 스타일:**
- 톤: 더 전문적인 톤
```

**llm-prompt-config.json 반영:**
```json
{
  "writing_guidelines": {
    "style": {
      "tone": "더 전문적인 톤",  // ← 수정
      "perspective": "사고 패턴 중심",
      "focus": "구체적이고 실행 가능한 내용"
    }
  }
}
```

#### 4. 섹션별 가이드라인 매핑

**ChatGPT-Learning-Point.md 구조:**
```markdown
### 공통고민 (common_concerns)

**집중 포인트:**
- 커리어 단계별 특성
- 소득 구간별 특성
- [추가] 연령대별 특성

**접근 방식:**
객관적 사실과 일반적 패턴 중심

**문장 수:**
- 최소: 3문장
- 최대: 7문장
```

**llm-prompt-config.json 반영:**
```json
{
  "section_guidelines": {
    "common_concerns": {
      "description": "해당 프로필에서 일반적으로 겪는 고민",
      "focus": [
        "커리어 단계별 특성",
        "소득 구간별 특성",
        "연령대별 특성"  // ← 추가
      ],
      "approach": "객관적 사실과 일반적 패턴 중심",
      "sentence_count": {
        "min": 3,
        "max": 7
      }
    }
  }
}
```

#### 5. 좋은 예시 매핑

**ChatGPT-Learning-Point.md 구조:**
```markdown
### 공통고민 예시
```
이 커리어 단계에서는...
```

**수정할 예시:**
```
더 구체적이고 개선된 예시 내용...
```
```

**llm-prompt-config.json 반영:**
```json
{
  "examples": {
    "good_example": {
      "common_concerns": "더 구체적이고 개선된 예시 내용..."  // ← 수정
    }
  }
}
```

#### 6. 나쁜 예시 매핑

**ChatGPT-Learning-Point.md 구조:**
```markdown
### 피해야 할 표현
- 당신은 충분히 잘하고 있습니다 (감정적 위로)
- [추가] 당신은 특별합니다 (과도한 긍정)
```

**llm-prompt-config.json 반영:**
```json
{
  "examples": {
    "bad_example": {
      "description": "다음과 같은 표현은 피해야 합니다",
      "examples": [
        "당신은 충분히 잘하고 있습니다",
        "당신은 특별합니다"  // ← 추가
      ]
    }
  }
}
```

#### 7. 컨텍스트 사용 규칙 매핑

**ChatGPT-Learning-Point.md 구조:**
```markdown
### 규칙
- 직업 유형은 직업 특성과 일반적 패턴을 파악하는 데만 사용
- [추가] 새로운 규칙
```

**llm-prompt-config.json 반영:**
```json
{
  "context_usage": {
    "rules": [
      "직업 유형은 직업 특성과 일반적 패턴을 파악하는 데만 사용",
      "새로운 규칙"  // ← 추가
    ]
  }
}
```

#### 8. 출력 형식 검증 매핑

**ChatGPT-Learning-Point.md 구조:**
```markdown
### 금지 단어 (prohibited_words)
- 당신은 충분히
- [추가] 새로운 금지 단어
```

**llm-prompt-config.json 반영:**
```json
{
  "output_format": {
    "validation": {
      "prohibited_words": [
        "당신은 충분히",
        "새로운 금지 단어"  // ← 추가
      ]
    }
  }
}
```

---

## Config 파일 구조 설명

### 1. role (역할 정의)

```json
{
  "role": {
    "description": "당신은 사고 패턴 중심의 진단 전문가입니다.",
    "expertise": [
      "커리어 분석",
      "재무 상황 분석",
      "사고 패턴 진단"
    ]
  }
}
```

**설명:**
- `description`: ChatGPT에게 부여할 역할 설명
- `expertise`: 전문 분야 목록

**수정 방법:**
- 역할을 변경하려면 `description` 수정
- 전문 분야를 추가/제거하려면 `expertise` 배열 수정

---

### 2. diagnosis_principles (진단 원칙)

```json
{
  "diagnosis_principles": {
    "core_philosophy": [
      "숫자를 해석하지 않고 구간 정보만 사용한다",
      "판단 기준은 흔들리지 않는다",
      "같은 입력은 항상 같은 결과를 만든다",
      "결과는 정보가 아니라 사고를 촉발하는 진단이어야 한다"
    ],
    "thinking_patterns": [
      "현재 상황의 객관적 분석",
      "일반적인 고민과 특수한 고민 구분",
      "현재 보유한 역량의 구체적 파악",
      "향후 학습 방향의 명확한 제시"
    ]
  }
}
```

**설명:**
- `core_philosophy`: 진단의 핵심 철학 (PRD의 핵심 목표 반영)
- `thinking_patterns`: 사고 패턴 분석 방법

**수정 방법:**
- 원칙을 추가/수정하려면 배열에 항목 추가
- 각 항목은 간결하고 명확하게 작성

---

### 3. writing_guidelines (작성 가이드라인)

```json
{
  "writing_guidelines": {
    "style": {
      "tone": "객관적이고 전문적",
      "perspective": "사고 패턴 중심",
      "focus": "구체적이고 실행 가능한 내용"
    },
    "prohibited": [
      "감정적 위로",
      "추상적 동기부여",
      "일반적인 조언",
      "숫자에 대한 직접적 해석",
      "과도한 긍정적 표현",
      "모호한 표현"
    ],
    "required": [
      "구체적인 사고 패턴 제시",
      "실행 가능한 학습 포인트",
      "객관적 사실 기반 서술",
      "사용자가 스스로 생각할 수 있는 질문 유도"
    ]
  }
}
```

**설명:**
- `style`: 작성 스타일 정의
- `prohibited`: 사용 금지 표현 목록
- `required`: 필수 포함 사항

**수정 방법:**
- 금지 표현을 추가하려면 `prohibited` 배열에 추가
- 필수 사항을 추가하려면 `required` 배열에 추가
- 스타일을 변경하려면 `style` 객체 수정

---

### 4. section_guidelines (섹션별 가이드라인)

각 출력 섹션(공통고민, 현재역량, 학습포인트)에 대한 상세 가이드라인입니다.

```json
{
  "section_guidelines": {
    "common_concerns": {
      "description": "해당 프로필에서 일반적으로 겪는 고민",
      "focus": [
        "커리어 단계별 특성",
        "소득 구간별 특성",
        "자산 구간별 특성",
        "직업 유형별 특성"
      ],
      "approach": "객관적 사실과 일반적 패턴 중심",
      "sentence_count": {
        "min": 3,
        "max": 7
      }
    }
  }
}
```

**설명:**
- `description`: 섹션의 목적 설명
- `focus`: 집중해야 할 포인트 목록
- `approach`: 접근 방식
- `sentence_count`: 문장 수 제한

**수정 방법:**
- 각 섹션의 `focus` 배열에 항목 추가/수정
- `approach` 문구 수정
- `sentence_count` 범위 조정

---

### 5. examples (예시)

좋은 예시와 나쁜 예시를 제공하여 ChatGPT가 올바른 방향으로 응답하도록 유도합니다.

```json
{
  "examples": {
    "good_example": {
      "common_concerns": "이 커리어 단계에서는...",
      "current_capabilities": "현재 커리어 단계에서...",
      "learning_points": "다음 단계로의 전환을 위해서는..."
    },
    "bad_example": {
      "description": "다음과 같은 표현은 피해야 합니다",
      "examples": [
        "당신은 충분히 잘하고 있습니다",
        "노력하면 모든 것이 가능합니다"
      ]
    }
  }
}
```

**설명:**
- `good_example`: 각 섹션별 좋은 예시
- `bad_example`: 피해야 할 표현 목록

**수정 방법:**
- 좋은 예시를 추가/수정하여 원하는 톤과 스타일을 보여줌
- 나쁜 예시에 금지하고 싶은 표현 추가

---

### 6. context_usage (컨텍스트 사용 규칙)

사용자 입력 정보를 어떻게 사용해야 하는지에 대한 규칙입니다.

```json
{
  "context_usage": {
    "rules": [
      "직업 유형은 직업 특성과 일반적 패턴을 파악하는 데만 사용",
      "커리어 단계는 경력 발전 단계와 획득 역량을 파악하는 데 사용",
      "소득 구간은 재무 상황과 생활 패턴을 파악하는 데 사용",
      "자산 구간은 재무 안정성과 투자 여력을 파악하는 데 사용",
      "절대 구체적인 숫자를 언급하지 않음"
    ]
  }
}
```

**수정 방법:**
- 규칙을 추가/수정하여 컨텍스트 사용 방법 명확화

---

### 7. output_format (출력 형식)

JSON 출력 형식과 검증 규칙입니다.

```json
{
  "output_format": {
    "required": "JSON 형식",
    "keys": {
      "common_concerns": "공통고민 (필수)",
      "current_capabilities": "현재역량 (필수)",
      "learning_points": "학습포인트 (필수)"
    },
    "validation": {
      "sentence_count_per_section": {
        "min": 3,
        "max": 7
      },
      "prohibited_words": [
        "당신은 충분히",
        "노력하면",
        "모든 것이 가능",
        "좋은 결과",
        "괜찮습니다"
      ]
    }
  }
}
```

**수정 방법:**
- `prohibited_words`에 금지 단어 추가
- `sentence_count_per_section` 범위 조정

---

## Config 수정 후 적용 방법

### ChatGPT-Learning-Point.md를 사용하는 경우

1. **학습 포인트 작성**
   - `ChatGPT-Learning-Point.md` 파일에 학습 포인트 작성

2. **검증 (권장)**
   ```bash
   npm run validate:learning-points
   ```
   - 파일 구조와 필수 섹션 확인
   - Config 파일과의 일관성 검증

3. **Config 파일에 반영**
   - 위의 매핑 가이드를 참고하여 `config/llm-prompt-config.json`에 수동 반영
   - 또는 직접 수정

4. **서버 재시작**
   - 개발 환경: `npm run dev` 재시작
   - 프로덕션: 서버 재시작

5. **캐시 초기화 (선택)**
   - 기존 캐시된 결과를 무효화하려면 서버 재시작
   - 메모리 캐시는 서버 재시작 시 자동 초기화됨

### 직접 Config 파일을 수정하는 경우

1. **Config 파일 수정**
   - `config/llm-prompt-config.json` 파일을 편집기로 열어 수정

2. **JSON 형식 검증**
   - JSON 문법 오류가 없는지 확인
   - 온라인 JSON 검증 도구 사용 가능

3. **서버 재시작**
   - 개발 환경: `npm run dev` 재시작
   - 프로덕션: 서버 재시작

4. **캐시 초기화 (선택)**
   - 기존 캐시된 결과를 무효화하려면 서버 재시작
   - 메모리 캐시는 서버 재시작 시 자동 초기화됨

---

## Config 작성 시 주의사항

### ✅ 권장 사항

1. **명확하고 구체적으로 작성**
   - 모호한 표현보다는 구체적인 지시사항 사용
   - 예: "객관적으로 분석하세요" (O) vs "잘 분석하세요" (X)

2. **일관성 유지**
   - 모든 섹션에서 동일한 톤과 스타일 유지
   - 금지 사항과 필수 사항이 충돌하지 않도록 주의

3. **예시 활용**
   - 좋은 예시는 실제로 원하는 결과와 유사하게 작성
   - 나쁜 예시는 자주 발생하는 문제를 명확히 제시

4. **점진적 수정**
   - 한 번에 많은 변경보다는 작은 변경을 여러 번 테스트
   - 변경 후 실제 결과를 확인하며 조정

### ❌ 피해야 할 사항

1. **모순되는 지시사항**
   - 금지 사항과 필수 사항이 충돌하지 않도록 주의
   - 예: "감정적 표현 금지"와 "따뜻한 표현 사용" 동시 지시

2. **과도한 제약**
   - 너무 많은 금지 사항은 ChatGPT의 창의성을 제한할 수 있음
   - 핵심 원칙에 집중

3. **불명확한 표현**
   - "적절히", "충분히" 같은 모호한 표현 지양
   - 구체적인 기준 제시

---

## Config 수정 예시

### 예시 1: 금지 표현 추가

```json
{
  "writing_guidelines": {
    "prohibited": [
      "감정적 위로",
      "추상적 동기부여",
      "일반적인 조언",
      "숫자에 대한 직접적 해석",
      "과도한 긍정적 표현",
      "모호한 표현",
      "당신은 특별합니다",  // ← 새로 추가
      "모든 사람이 그런 고민을 합니다"  // ← 새로 추가
    ]
  }
}
```

### 예시 2: 섹션별 집중 포인트 추가

```json
{
  "section_guidelines": {
    "common_concerns": {
      "focus": [
        "커리어 단계별 특성",
        "소득 구간별 특성",
        "자산 구간별 특성",
        "직업 유형별 특성",
        "연령대별 특성",  // ← 새로 추가
        "산업별 특성"  // ← 새로 추가
      ]
    }
  }
}
```

### 예시 3: 좋은 예시 업데이트

```json
{
  "examples": {
    "good_example": {
      "common_concerns": "이 커리어 단계에서는 업무 역량과 전문성 확보에 대한 압박감을 느끼는 경우가 많습니다. 특히 중간 단계에서는 초기 단계에서 쌓은 경험을 바탕으로 더 깊이 있는 전문성을 요구받게 됩니다. 소득 구간을 고려할 때, 현재 수준에서의 생활비 부담과 향후 소득 증대를 위한 투자 사이의 균형을 찾는 것이 주요 고민입니다. 자산 구간에 따라 재무 안정성에 대한 인식과 투자 여력이 달라지며, 이는 향후 커리어 결정에도 영향을 미칩니다."  // ← 더 구체적으로 수정
    }
  }
}
```

---

## Config 검증

Config 파일을 수정한 후 다음을 확인하세요:

1. **JSON 형식 검증**
   - JSON 문법 오류가 없는지 확인
   - 온라인 JSON 검증 도구 사용 가능

2. **필수 필드 확인**
   - 모든 섹션이 존재하는지 확인
   - 필수 키가 누락되지 않았는지 확인

3. **값 타입 확인**
   - 배열은 배열로, 객체는 객체로, 문자열은 문자열로
   - 숫자 필드(예: sentence_count)는 숫자로

---

## 문제 해결

### Config가 적용되지 않는 경우

1. **서버 재시작 확인**
   - Config는 서버 시작 시 로드되므로 재시작 필요

2. **JSON 문법 오류 확인**
   - JSON 파일에 문법 오류가 있으면 로드 실패
   - 서버 로그에서 에러 메시지 확인

3. **파일 경로 확인**
   - `config/llm-prompt-config.json` 경로가 정확한지 확인

### 원하는 결과가 나오지 않는 경우

1. **예시 업데이트**
   - 좋은 예시를 더 구체적으로 작성
   - 나쁜 예시에 문제가 되는 표현 추가

2. **가이드라인 강화**
   - 금지 사항에 문제 표현 추가
   - 필수 사항에 원하는 내용 추가

3. **점진적 조정**
   - 한 번에 많은 변경보다는 작은 변경을 여러 번 테스트

---

## 추가 참고사항

- Config 파일은 Git에 커밋되어 버전 관리됨
- 프로덕션 배포 시 Config 변경사항도 함께 배포
- Config 변경 후 캐시된 결과는 무효화됨 (서버 재시작 시)

