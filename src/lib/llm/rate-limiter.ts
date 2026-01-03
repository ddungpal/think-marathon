class LLMRateLimiter {
  private semaphore: number;
  private queue: Array<() => void>;

  constructor(maxConcurrent: number = 10) {
    this.semaphore = maxConcurrent;
    this.queue = [];
  }

  async acquire(): Promise<void> {
    if (this.semaphore > 0) {
      this.semaphore--;
      return;
    }

    return new Promise((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next?.();
    } else {
      this.semaphore++;
    }
  }
}

// 싱글톤 인스턴스
export const llmRateLimiter = new LLMRateLimiter(10);

