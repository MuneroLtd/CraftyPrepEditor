import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: './tests/setup.ts',
      testTimeout: 15000, // 15 seconds for image processing tests
      // Run tests sequentially to prevent hanging
      fileParallelism: false,
      // Use forks pool with single fork to prevent hanging worker threads
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true,
        },
      },
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/e2e/**',
        '**/.{idea,git,cache,output,temp}/**',
      ],
    },
  })
);
