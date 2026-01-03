#!/usr/bin/env ts-node

/**
 * ChatGPT-Learning-Point.md 파일의 구조를 검증하고
 * llm-prompt-config.json과의 매핑을 확인하는 유틸리티 스크립트
 */

import fs from 'fs';
import path from 'path';

const LEARNING_POINT_FILE = path.join(process.cwd(), 'ChatGPT-Learning-Point.md');
const CONFIG_FILE = path.join(process.cwd(), 'config/llm-prompt-config.json');

interface ValidationResult {
  section: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
}

function validateLearningPointFile(): ValidationResult[] {
  const results: ValidationResult[] = [];

  if (!fs.existsSync(LEARNING_POINT_FILE)) {
    results.push({
      section: '파일 존재',
      status: 'error',
      message: 'ChatGPT-Learning-Point.md 파일이 존재하지 않습니다.',
    });
    return results;
  }

  const content = fs.readFileSync(LEARNING_POINT_FILE, 'utf-8');

  // 필수 섹션 확인
  const requiredSections = [
    '## 1. 역할 및 전문성',
    '## 2. 진단 원칙',
    '## 3. 작성 가이드라인',
    '## 4. 섹션별 가이드라인',
    '## 5. 좋은 예시',
    '## 6. 나쁜 예시',
    '## 7. 컨텍스트 사용 규칙',
    '## 8. 출력 형식 검증',
  ];

  requiredSections.forEach((section) => {
    if (content.includes(section)) {
      results.push({
        section: section.replace('## ', ''),
        status: 'ok',
        message: '섹션이 존재합니다.',
      });
    } else {
      results.push({
        section: section.replace('## ', ''),
        status: 'warning',
        message: '섹션이 누락되었습니다.',
      });
    }
  });

  // 추가 내용 확인 (빈 섹션 체크)
  const emptySectionPattern = /## \d+\.\s+[^\n]+\n\n\*\*추가할[^\n]+\*\*\n-[\s\n]*$/gm;
  const emptyMatches = content.match(emptySectionPattern);
  if (emptyMatches && emptyMatches.length > 0) {
    results.push({
      section: '추가 내용',
      status: 'warning',
      message: `${emptyMatches.length}개의 섹션에 추가 내용이 비어있습니다.`,
    });
  }

  return results;
}

function compareWithConfig(): ValidationResult[] {
  const results: ValidationResult[] = [];

  if (!fs.existsSync(CONFIG_FILE)) {
    results.push({
      section: 'Config 파일',
      status: 'error',
      message: 'config/llm-prompt-config.json 파일이 존재하지 않습니다.',
    });
    return results;
  }

  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));

    // Config 구조 검증
    const requiredFields = [
      'role',
      'diagnosis_principles',
      'writing_guidelines',
      'section_guidelines',
      'examples',
      'context_usage',
      'output_format',
    ];

    requiredFields.forEach((field) => {
      if (config[field]) {
        results.push({
          section: `Config: ${field}`,
          status: 'ok',
          message: '필드가 존재합니다.',
        });
      } else {
        results.push({
          section: `Config: ${field}`,
          status: 'error',
          message: '필드가 누락되었습니다.',
        });
      }
    });
  } catch (error) {
    results.push({
      section: 'Config 파싱',
      status: 'error',
      message: `JSON 파싱 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
    });
  }

  return results;
}

function main() {
  console.log('🔍 ChatGPT-Learning-Point.md 검증 시작...\n');

  const learningPointResults = validateLearningPointFile();
  const configResults = compareWithConfig();

  const allResults = [...learningPointResults, ...configResults];

  // 결과 출력
  allResults.forEach((result) => {
    const icon = result.status === 'ok' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} [${result.section}] ${result.message}`);
  });

  // 요약
  const okCount = allResults.filter((r) => r.status === 'ok').length;
  const warningCount = allResults.filter((r) => r.status === 'warning').length;
  const errorCount = allResults.filter((r) => r.status === 'error').length;

  console.log('\n📊 검증 요약:');
  console.log(`  ✅ 성공: ${okCount}`);
  console.log(`  ⚠️  경고: ${warningCount}`);
  console.log(`  ❌ 오류: ${errorCount}`);

  if (errorCount > 0) {
    console.log('\n❌ 오류가 발견되었습니다. 위의 오류를 수정해주세요.');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('\n⚠️  경고가 있습니다. 확인해주세요.');
    process.exit(0);
  } else {
    console.log('\n✅ 모든 검증을 통과했습니다!');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

export { validateLearningPointFile, compareWithConfig };

