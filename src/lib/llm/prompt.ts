import { NormalizedInput } from '@/types/input';
import { LLMPromptConfig } from '@/types/llm-config';
import { getLLMConfig } from '@/lib/config/llm-config-loader';
import { getConfig } from '@/lib/config/loader';
import { mapIncomeToBracket } from '@/lib/config/bracket-mapper';
import { loadPDFContents, loadPDFConfig } from '@/lib/pdf/loader';

export async function buildPrompt(context: NormalizedInput, config?: LLMPromptConfig): Promise<string> {
  // Config가 제공되지 않으면 기본값 사용
  const llmConfig = config || getLLMConfig();

  // 역할 및 전문성
  const roleSection = `${llmConfig.role.description}
전문 분야: ${llmConfig.role.expertise.join(', ')}`;

  // 핵심 원칙
  const principlesSection = `
## 핵심 원칙
${llmConfig.diagnosis_principles.core_philosophy.map(p => `- ${p}`).join('\n')}

## 사고 패턴
${llmConfig.diagnosis_principles.thinking_patterns.map(p => `- ${p}`).join('\n')}`;

  // 구간별 학습 포인트 매핑 (서버 사이드에서만 작동)
  let bracketLearningPoint = null;
  try {
    const config = getConfig();
    const incomeBand = config.incomeBands.find((b) => b.id === context.income_band.id);
    if (incomeBand) {
      bracketLearningPoint = mapIncomeToBracket(incomeBand);
    }
  } catch (error) {
    // 학습 포인트 로드 실패 시 무시 (선택적 기능)
    console.warn('Failed to load bracket learning points:', error);
  }

  // 사용자 컨텍스트
  const contextSection = `
## 사용자 정보
직업: ${context.job_type_label}
커리어 단계: ${context.career_stage.label}
월평균소득 구간: ${context.income_band.label}
순자산 구간: ${context.asset_band.label}

## 컨텍스트 사용 규칙
${llmConfig.context_usage.rules.map(rule => `- ${rule}`).join('\n')}`;

  // 구간별 학습 포인트 섹션 (해당 구간이 있을 경우)
  const bracketLearningSection = bracketLearningPoint ? `
## 해당 소득 구간의 일반적 특성 (참고용)

이 구간에서 일반적으로 나타나는 패턴을 참고하되, 사용자의 구체적인 숫자는 언급하지 마세요.

### 일반적인 문제점 (잘못된 전제)
${bracketLearningPoint.common_problems.map((p, i) => `${i + 1}. ${p}`).join('\n')}

### 일반적인 인지 공백
${bracketLearningPoint.cognitive_gaps.map((g, i) => `${i + 1}. ${g}`).join('\n')}

### 일반적인 학습 포인트
${bracketLearningPoint.learning_points.map((l, i) => `${i + 1}. ${l}`).join('\n')}

**중요**: 위 내용은 참고용이며, 진단 결과에서는 구체적인 숫자나 구간 이름을 언급하지 않고, 사고 패턴과 학습 방향에 집중하세요.` : '';

  // PDF 내용 로드 (비동기) - 선택적 기능이므로 에러가 발생해도 계속 진행
  let pdfSection = '';
  try {
    const pdfConfig = await loadPDFConfig();
    if (pdfConfig.enabled) {
      try {
        const pdfContents = await loadPDFContents();
        if (pdfContents.size > 0) {
          const pdfSections = Array.from(pdfContents.values()).map((pdf) => `
## 참고 문서: ${pdf.title}

${pdf.text}

---
`);
          pdfSection = `
## 추가 학습 자료 (PDF 문서) - 필수 참고 및 핵심 기준

다음 문서는 진단의 절대적 기준이 되는 핵심 학습 자료입니다. **반드시 이 문서의 내용을 바탕으로 진단을 수행하세요. 이 문서 없이는 진단할 수 없습니다.**

${pdfSections.join('\n')}

**중요 지시사항 - PDF 작성자의 언어 스타일을 반영하세요**:

1. **언어 스타일과 톤**:
   - PDF 작성자가 직접 답변하는 것처럼 작성하세요. 마치 PDF를 쓴 사람이 사용자에게 직접 말하는 느낌이어야 합니다.
   - 단정적이고 확신에 찬 톤을 사용하세요: "~이다", "~다", "~해야 한다", "~해야 함"
   - 질문 형식을 활용하세요: "~란?", "~는 무엇일까?", "~는?"
   - 강조 표현을 자연스럽게 사용하세요: "절대", "반드시", "~이다", "~다"
   - 비교/대조 표현을 활용하세요: "~는 ~가 아니라", "~보다", "~와 ~의 차이"

2. **구조와 표현 방식**:
   - PDF처럼 구체적인 예시를 들어 설명하세요 (미용사, 직장인, 축구선수, 유튜버 등)
   - "~라는 것", "~라는 점", "~라는 사실" 같은 표현을 자연스럽게 사용하세요
   - "~할 것", "~해야 함", "~해야 한다" 같은 의무 표현을 사용하세요
   - "~이다", "~다" 같은 단정적 종결어미를 주로 사용하세요

3. **내용 반영 - 반드시 준수**:
   - **PDF 문서의 핵심 개념(학습자본, 학습 자본가, 부학부 빈학빈, 6단계 구간 등)을 반드시 진단에 반영하세요**
   - **사용자의 현재 구간(노동자/숙련자/실력자/전문가/시스템/브랜드)을 PDF의 6단계 정의에 정확히 맞춰 분석하세요. 각 단계별 특징을 PDF 문서에서 찾아서 정확히 반영하세요.**
   - **PDF의 "학습자본 vs 금융자본 vs 사회자본" 비교표를 참고하여 사용자의 자본 축적 상태를 평가하세요**
   - **PDF의 "새로운 돈의 정의"와 "구간별 축적해야 하는 학습자산" 내용을 진단에 적극 활용하세요**
   - **PDF 문서에서 해당 구간(노동자/숙련자/실력자/전문가/시스템/브랜드)에 대한 설명을 찾아서 그 내용을 바탕으로 진단하세요**

4. **작성 원칙**:
   - 문서 내용을 그대로 복사하지 말고, 사용자의 구체적인 상황에 맞게 해석하세요
   - PDF의 개념을 언급할 때는 설명 없이 자연스럽게 사용하세요 (예: "학습자본의 관점에서 보면...", "학습 자본가처럼...")
   - PDF 작성자의 톤과 스타일을 유지하면서도, 사용자가 공감할 수 있도록 친근하게 작성하세요
   - "~해보세요", "~할 것", "~이다" 같은 친근하면서도 단정적인 표현을 사용하세요`;
        }
      } catch (pdfError) {
        // PDF 로드 실패 시 무시 (선택적 기능)
        // pdf-parse 라이브러리가 없거나 PDF 파일을 읽을 수 없는 경우
        console.warn('PDF 내용 로드 실패 (무시됨):', pdfError instanceof Error ? pdfError.message : pdfError);
      }
    }
  } catch (error) {
    // PDF 설정 로드 실패 시 무시 (선택적 기능)
    console.warn('PDF 설정 로드 실패 (무시됨):', error instanceof Error ? error.message : error);
  }

  // 작성 가이드라인
  const writingGuidelinesSection = `
## 작성 가이드라인

### 스타일 (PDF 작성자의 언어 스타일을 반영)
- 톤: ${llmConfig.writing_guidelines.style.tone} (단정적이고 확신에 찬 톤, "~이다", "~다" 사용)
- 관점: ${llmConfig.writing_guidelines.style.perspective}
- 집중: ${llmConfig.writing_guidelines.style.focus}
- **PDF 작성자가 직접 답변하는 것처럼 작성**: 마치 PDF를 쓴 사람이 사용자에게 직접 말하는 느낌

### 언어 표현 방식 (PDF 스타일 반영)
- **단정적 종결어미**: "~이다", "~다", "~해야 한다", "~해야 함"을 주로 사용
- **질문 형식 활용**: "~란?", "~는 무엇일까?", "~는?" 같은 질문으로 시작하거나 중간에 삽입
- **강조 표현**: "절대", "반드시", "~이다", "~다" 같은 강조 표현을 자연스럽게 사용
- **비교/대조**: "~는 ~가 아니라", "~보다", "~와 ~의 차이" 같은 표현 활용
- **구체적 예시**: 미용사, 직장인, 축구선수, 유튜버 같은 구체적인 직업 예시 사용
- **친근한 단정**: "~해보세요", "~할 것", "~이다" 같은 친근하면서도 단정적인 표현
- **의무 표현**: "~해야 한다", "~해야 함", "~해야 하는 것" 같은 의무 표현 사용

### 금지 사항
${llmConfig.writing_guidelines.prohibited.map(item => `- ${item}`).join('\n')}
- 딱딱하고 공식적인 표현 사용 금지 (예: "~입니다", "~합니다", "~하시기 바랍니다")
- 과도하게 정중한 표현 사용 금지 (예: "~하시면 됩니다", "~하시는 것이 좋습니다")

### 필수 사항
${llmConfig.writing_guidelines.required.map(item => `- ${item}`).join('\n')}
- 각 내용에 이유와 해결책을 포함하세요
- 사람들이 공감할 수 있는 구체적인 예시를 사용하세요
- PDF 문서의 핵심 개념(학습자본, 학습 자본가, 부학부 빈학빈, 6단계 구간 등)을 자연스럽게 진단에 통합하세요
- PDF의 개념을 언급할 때는 설명 없이 자연스럽게 사용하세요 (예: "학습자본의 관점에서 보면...", "학습 자본가처럼...")
- **PDF 작성자의 언어 스타일을 그대로 반영**: 마치 PDF를 쓴 사람이 직접 답변하는 것처럼 작성`;

  // 섹션별 가이드라인
  const sectionGuidelinesSection = `
## 섹션별 작성 가이드라인

### 공통고민 (common_concerns)
설명: ${llmConfig.section_guidelines.common_concerns.description}
집중 포인트:
${llmConfig.section_guidelines.common_concerns.focus.map(f => `- ${f}`).join('\n')}
접근 방식: ${llmConfig.section_guidelines.common_concerns.approach}
문장 수: ${llmConfig.section_guidelines.common_concerns.sentence_count.min}~${llmConfig.section_guidelines.common_concerns.sentence_count.max}문장

### 현재역량 (current_capabilities)
설명: ${llmConfig.section_guidelines.current_capabilities.description}
집중 포인트:
${llmConfig.section_guidelines.current_capabilities.focus.map(f => `- ${f}`).join('\n')}
접근 방식: ${llmConfig.section_guidelines.current_capabilities.approach}
문장 수: ${llmConfig.section_guidelines.current_capabilities.sentence_count.min}~${llmConfig.section_guidelines.current_capabilities.sentence_count.max}문장

### 학습포인트 (learning_points)
설명: ${llmConfig.section_guidelines.learning_points.description}
집중 포인트:
${llmConfig.section_guidelines.learning_points.focus.map(f => `- ${f}`).join('\n')}
접근 방식: ${llmConfig.section_guidelines.learning_points.approach}
문장 수: ${llmConfig.section_guidelines.learning_points.sentence_count.min}~${llmConfig.section_guidelines.learning_points.sentence_count.max}문장`;

  // 좋은 예시
  const goodExampleSection = `
## 좋은 예시

### 공통고민 예시
${llmConfig.examples.good_example.common_concerns}

### 현재역량 예시
${llmConfig.examples.good_example.current_capabilities}

### 학습포인트 예시
${llmConfig.examples.good_example.learning_points}`;

  // 나쁜 예시
  const badExampleSection = `
## 피해야 할 표현
${llmConfig.examples.bad_example.description}
${llmConfig.examples.bad_example.examples.map(ex => `- ${ex}`).join('\n')}`;

  // 출력 형식
  const outputFormatSection = `
## 출력 형식

반드시 다음 형식의 JSON으로만 응답하세요. 다른 텍스트나 설명 없이 순수 JSON만 반환해야 합니다:

{
  "common_concerns": "여기에 ${llmConfig.output_format.keys.common_concerns} 내용을 작성하세요",
  "current_capabilities": "여기에 ${llmConfig.output_format.keys.current_capabilities} 내용을 작성하세요",
  "learning_points": "여기에 ${llmConfig.output_format.keys.learning_points} 내용을 작성하세요",
  "frequent_thoughts": "이 구간(노동자/숙련자/실력자/전문가/시스템/브랜드)에서 자주 하는 생각을 PDF 작성자의 언어 스타일로 작성하세요. **반드시 다음 형식으로 작성하세요: 첫 번째 문장은 핵심 문장 한 문장으로 작성하고, 그 다음 줄바꿈 후 이유에 대한 설명을 3~4줄로 구체적으로 작성하세요.** PDF 문서에서 해당 구간에 대한 설명을 찾아서 정확히 반영하되, ChatGPT의 학습력과 정리 능력을 최대한 발휘하여 핵심만 추출하세요. 단정적이고 확신에 찬 톤('~이다', '~다')을 사용하고, 질문 형식('~는 무엇일까?', '~는?')을 활용하세요. PDF의 '학습자본' 개념과 '6단계 구간' 정의를 참고하여, 사용자가 현재 구간에서 일반적으로 하는 생각의 핵심을 한 문장으로 요약하고, 왜 그런 생각을 하게 되는지 배경, 원인, 맥락을 포함하여 3~4줄로 구체적으로 설명하세요. PDF 작성자가 직접 말하는 것처럼 작성하세요.",
  "unknown_things": "이 구간(노동자/숙련자/실력자/전문가/시스템/브랜드)에서 잘 모르는 것들을 PDF 작성자의 언어 스타일로 설명하세요. **반드시 다음 형식으로 작성하세요: 첫 번째 문장은 핵심 문장 한 문장으로 작성하고, 그 다음 줄바꿈 후 이유에 대한 설명을 3~4줄로 구체적으로 작성하세요.** PDF 문서에서 해당 구간에서 모르는 것에 대한 설명을 찾아서 정확히 반영하되, ChatGPT의 학습력과 정리 능력을 최대한 발휘하여 핵심만 추출하세요. '~라는 것', '~라는 점', '~라는 사실' 같은 표현을 사용하고, 단정적 톤('~이다', '~다')을 유지하세요. PDF의 '학습자본 vs 금융자본 vs 사회자본' 비교와 '구간별 축적해야 하는 학습자산' 내용을 참고하여, 사용자가 모르고 있는 핵심 개념을 한 문장으로 요약하고, 왜 모르게 되는지 배경, 그것을 알아야 하는 이유, 모르면 어떤 문제가 생기는지 등을 포함하여 3~4줄로 구체적으로 설명하세요. PDF 작성자가 직접 설명하는 것처럼 작성하세요.",
  "must_learn": "이 구간(노동자/숙련자/실력자/전문가/시스템/브랜드)에서 반드시 배워야 하는 것들을 PDF 작성자의 언어 스타일로 구체적으로 제시하세요. **반드시 다음 형식으로 작성하세요: 첫 번째 문장은 핵심 문장 한 문장으로 작성하고, 그 다음 줄바꿈 후 이유에 대한 설명을 3~4줄로 구체적으로 작성하세요.** PDF 문서에서 해당 구간에서 배워야 하는 것에 대한 설명을 찾아서 정확히 반영하되, ChatGPT의 학습력과 정리 능력을 최대한 발휘하여 핵심만 추출하세요. '반드시', '절대', '~해야 한다', '~해야 함' 같은 강조 표현과 의무 표현을 사용하세요. PDF의 '학습자본' 개념과 '새로운 돈의 정의'를 참고하여, 학습 자본가로 성장하기 위해 필요한 학습 내용의 핵심을 한 문장으로 요약하고, 왜 배워야 하는지, 어떤 효과가 있는지, 어떻게 배워야 하는지 등을 포함하여 3~4줄로 구체적으로 설명하세요. PDF 작성자가 직접 조언하는 것처럼 작성하세요.",
  "recommended_training": "이 구간(노동자/숙련자/실력자/전문가/시스템/브랜드)에서 추천하는 생각 훈련을 PDF 작성자의 언어 스타일로 제시하세요. **반드시 다음 형식으로 작성하세요: 첫 번째 문장은 핵심 문장 한 문장으로 작성하고, 그 다음 줄바꿈 후 이유에 대한 설명을 3~4줄로 구체적으로 작성하세요.** PDF 문서에서 해당 구간에 대한 훈련 방법을 찾아서 정확히 반영하되, ChatGPT의 학습력과 정리 능력을 최대한 발휘하여 핵심만 추출하세요. '~해보세요', '~할 것', '~이다' 같은 친근하면서도 단정적인 표현을 사용하세요. PDF의 '학습 자본가의 특징'과 '부학부 빈학빈' 개념을 참고하여, 배우는 감각을 복리 개념으로 업데이트하는 훈련 방법의 핵심을 한 문장으로 요약하고, 구체적인 방법, 왜 이것이 필요한지, 어떤 효과가 있는지 등을 포함하여 3~4줄로 구체적으로 설명하세요. PDF 작성자가 직접 추천하는 것처럼 작성하세요.",
  "avoid_studies": "이 구간(노동자/숙련자/실력자/전문가/시스템/브랜드)에서 피해야 할 공부를 PDF 작성자의 언어 스타일로 제시하세요. **반드시 다음 형식으로 작성하세요: 첫 번째 문장은 핵심 문장 한 문장으로 작성하고, 그 다음 줄바꿈 후 이유에 대한 설명을 3~4줄로 구체적으로 작성하세요.** PDF 문서에서 해당 구간에서 피해야 할 것에 대한 설명을 찾아서 정확히 반영하되, ChatGPT의 학습력과 정리 능력을 최대한 발휘하여 핵심만 추출하세요. '~는 ~가 아니라' 같은 비교/대조 표현을 활용하고, 단정적 톤('~이다', '~다')을 유지하세요. PDF의 '기존의 학습 vs 학습 자본가의 학습' 비교를 참고하여, 정답을 맞히는데 편향된 학습을 피하고, 자신이 만들고 싶은 세계를 만들어가기 위한 학습으로 전환해야 함의 핵심을 한 문장으로 요약하고, 왜 피해야 하는지, 어떤 문제가 생기는지, 대신 무엇을 해야 하는지 등을 포함하여 3~4줄로 구체적으로 설명하세요. PDF 작성자가 직접 경고하는 것처럼 작성하세요."
}

### 필수 사항
1. JSON 키 이름은 정확히 위 형식을 사용해야 합니다.
2. 각 값은 문자열(string)이어야 합니다.
3. JSON 형식만 반환하고, 마크다운 코드 블록이나 다른 텍스트는 포함하지 마세요.
4. **핵심 문장 + 이유 설명 구조**: 각 섹션(frequent_thoughts, unknown_things, must_learn, recommended_training, avoid_studies)은 반드시 다음 형식으로 작성하세요:
   - 첫 번째 문장: 핵심 문장 한 문장 (ChatGPT의 학습력과 정리 능력을 최대한 발휘하여 PDF 내용을 바탕으로 핵심만 추출)
   - 줄바꿈 (\\n)
   - 나머지: 이유에 대한 설명을 **3~4줄로 구체적으로** 작성 (왜 그런지, 어떤 배경인지, 원인은 무엇인지, 어떻게 해야 하는지, 어떤 효과가 있는지 등 구체적인 내용을 포함하여 이해도를 높이세요)
5. **PDF 작성자의 언어 스타일을 반영**: 단정적이고 확신에 찬 톤('~이다', '~다')을 사용하고, 질문 형식('~란?', '~는 무엇일까?')을 활용하며, 강조 표현('절대', '반드시')을 자연스럽게 사용하세요.
6. 다음 단어 사용 금지: ${llmConfig.output_format.validation.prohibited_words.join(', ')}
7. **딱딱한 공식 표현 금지**: "~입니다", "~합니다", "~하시기 바랍니다" 같은 과도하게 정중한 표현은 사용하지 마세요. 대신 "~이다", "~다", "~해야 한다" 같은 단정적이고 친근한 표현을 사용하세요.
8. **PDF 작성자가 직접 답변하는 느낌**: 마치 PDF를 쓴 사람이 사용자에게 직접 말하는 것처럼 작성하세요.`;

  // 최종 프롬프트 조합
  return `${roleSection}
${principlesSection}
${contextSection}
${bracketLearningSection}
${pdfSection}
${writingGuidelinesSection}
${sectionGuidelinesSection}
${goodExampleSection}
${badExampleSection}
${outputFormatSection}`;
}
