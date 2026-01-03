import { CacheInterface } from './types';
import { DiagnosisResult } from '@/types/output';

class MemoryCache implements CacheInterface {
  private cache: Map<string, DiagnosisResult>;
  private maxSize: number;

  constructor(maxSize: number = 10000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  async get(key: string): Promise<DiagnosisResult | null> {
    return this.cache.get(key) || null;
  }

  async set(key: string, value: DiagnosisResult): Promise<void> {
    // 최대 크기 초과 시 첫 번째 항목 제거 (FIFO)
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async size(): Promise<number> {
    return this.cache.size;
  }
}

// 싱글톤 인스턴스
export const memoryCache = new MemoryCache();

