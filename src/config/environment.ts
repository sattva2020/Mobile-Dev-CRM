/**
 * 🎭 Environment Configuration for OnlyTests Approach
 * Конфигурация окружения для OnlyTests подхода
 */

export const env = {
  getBaseUrl(): string {
    return process.env.BASE_URL || 'http://localhost:3000';
  },

  getApiUrl(): string {
    return process.env.API_URL || 'http://localhost:3000/api';
  },

  getTimeout(): number {
    return parseInt(process.env.TIMEOUT || '30000');
  },

  getRetries(): number {
    return parseInt(process.env.RETRIES || '2');
  },

  isHeadless(): boolean {
    return process.env.HEADLESS === 'true';
  }
};
