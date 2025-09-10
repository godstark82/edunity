import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setup.ts',
    passWithNoTests: true,

    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
