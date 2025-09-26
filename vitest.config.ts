import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'lcov'],
    },
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}']
  }
});


