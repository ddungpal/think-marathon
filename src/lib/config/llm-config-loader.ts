import { LLMPromptConfig } from '@/types/llm-config';
import fs from 'fs';
import path from 'path';

let llmConfigCache: LLMPromptConfig | null = null;

async function loadJSON<T>(filePath: string): Promise<T> {
  const fullPath = path.join(process.cwd(), filePath);
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

