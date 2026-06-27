import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 30000,
    hookTimeout: 30000,
    // ✅ Correct options for Vitest 4
    pool: 'forks',
    maxWorkers: 1,
    env: {
      PORT: '5178',
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret-key',
      BASE_PATH: '/',
      DATABASE_URL: 'postgresql://postgres:kt@localhost:5432/owc_test',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/__tests__/**',
        '**/*.config.ts',
      ],
    },
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['**/__tests__/**/*.test.ts'],
  },
});