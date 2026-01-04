import { LLMPromptConfig } from '@/types/llm-config';
import fs from 'fs';
import path from 'path';

let llmConfigCache: LLMPromptConfig | null = null;

async function loadJSON<T>(filePath: string): Promise<T> {
  // Netlify 배포 환경을 고려하여 경로 처리
  // public 디렉토리의 파일은 빌드 출력에 포함됨
  let fullPath: string;
  
  // public 디렉토리에서 먼저 시도 (배포 환경)
  const publicPath = path.join(process.cwd(), 'public', filePath);
  // 원래 경로도 시도 (개발 환경)
  const originalPath = path.join(process.cwd(), filePath);
  
  // 파일 존재 여부 확인
  try {
    if (fs.existsSync(publicPath)) {
      fullPath = publicPath;
    } else if (fs.existsSync(originalPath)) {
      fullPath = originalPath;
    } else {
      // 둘 다 없으면 public 경로 사용 (에러 발생시 명확한 메시지)
      fullPath = publicPath;
    }
  } catch {
    fullPath = publicPath;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(fileContents) as T;
}

export async function loadLLMConfig(): Promise<LLMPromptConfig> {
  if (llmConfigCache) {
    return llmConfigCache;
  }

  try {
    llmConfigCache = await loadJSON<LLMPromptConfig>('config/llm-prompt-config.json');
    return llmConfigCache;
  } catch (error) {
    console.error('Failed to load LLM config:', error);
    throw new Error('LLM config loading failed');
  }
}

export function getLLMConfig(): LLMPromptConfig {
  if (!llmConfigCache) {
    throw new Error('LLM config not loaded. Call loadLLMConfig() first.');
  }
  return llmConfigCache;
}

// Config 파일 변경 감지 (개발 환경에서만)
export function clearLLMConfigCache(): void {
  llmConfigCache = null;
}

