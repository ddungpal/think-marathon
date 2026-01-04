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
## 추가 학습 자료 (PDF 문서)

다음 문서들을 참고하여 진단을 수행하세요. 문서의 내용을 바탕으로 더 정확하고 깊이 있는 진단을 제공할 수 있습니다.

${pdfSections.join('\n')}

**중요**: PDF 문서의 내용을 참고하되, 문서 내용을 그대로 복사하지 말고 사용자의 상황에 맞게 해석하여 적용하세요.`;
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

### 스타일
- 톤: ${llmConfig.writing_guidelines.style.tone}
- 관점: ${llmConfig.writing_guidelines.style.perspective}
- 집중: ${llmConfig.writing_guidelines.style.focus}

### 금지 사항
${llmConfig.writing_guidelines.prohibited.map(item => `- ${item}`).join('\n')}

### 필수 사항
${llmConfig.writing_guidelines.required.map(item => `- ${item}`).join('\n')}`;

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
  "learning_points": "여기에 ${llmConfig.output_format.keys.learning_points} 내용을 작성하세요"
}

### 필수 사항
1. JSON 키 이름은 정확히 "common_concerns", "current_capabilities", "learning_points"를 사용해야 합니다.
2. 각 값은 문자열(string)이어야 합니다.
3. JSON 형식만 반환하고, 마크다운 코드 블록이나 다른 텍스트는 포함하지 마세요.
4. 각 섹션은 ${llmConfig.output_format.validation.sentence_count_per_section.min}~${llmConfig.output_format.validation.sentence_count_per_section.max}문장으로 작성하세요.
5. 다음 단어 사용 금지: ${llmConfig.output_format.validation.prohibited_words.join(', ')}`;

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
