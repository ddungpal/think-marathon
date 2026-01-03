export interface LLMPromptConfig {
  role: {
    description: string;
    expertise: string[];
  };
  diagnosis_principles: {
    core_philosophy: string[];
    thinking_patterns: string[];
  };
  writing_guidelines: {
    style: {
      tone: string;
      perspective: string;
      focus: string;
    };
    prohibited: string[];
    required: string[];
  };
  section_guidelines: {
    common_concerns: SectionGuideline;
    current_capabilities: SectionGuideline;
    learning_points: SectionGuideline;
  };
  examples: {
    good_example: {
      common_concerns: string;
      current_capabilities: string;
      learning_points: string;
    };
    bad_example: {
      description: string;
      examples: string[];
    };
  };
  context_usage: {
    rules: string[];
  };
  output_format: {
    required: string;
    keys: {
      common_concerns: string;
      current_capabilities: string;
      learning_points: string;
    };
    validation: {
      sentence_count_per_section: {
        min: number;
        max: number;
      };
      prohibited_words: string[];
    };
  };
}

interface SectionGuideline {
  description: string;
  focus: string[];
  approach: string;
  sentence_count: {
    min: number;
    max: number;
  };
}

