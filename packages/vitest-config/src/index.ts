import type { UserConfig } from 'vitest/config';

/**
 * Base Vitest configuration with TypeScript support, coverage settings, and sensible defaults.
 * This configuration provides a solid foundation for testing TypeScript projects.
 *
 * Features:
 * - TypeScript support out of the box
 * - Coverage configuration with v8 provider
 * - Standard coverage thresholds (80% for lines, functions, branches, statements)
 * - Node.js environment by default
 * - Globals enabled for cleaner test syntax
 * - Standard reporter configuration
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vitest/config';
 * import baseConfig from '@jmlweb/vitest-config';
 *
 * export default defineConfig({
 *   ...baseConfig,
 *   // Add your project-specific overrides here
 * });
 * ```
 */
const config: UserConfig = {
  test: {
    // Enable globals for cleaner test syntax (e.g., describe, it, expect without imports)
    globals: true,

    // Use Node.js environment by default
    environment: 'node',

    // Coverage configuration
    coverage: {
      // Use v8 provider for coverage (default, but explicit for clarity)
      provider: 'v8',

      // Coverage thresholds - enforce 80% coverage
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },

      // Files to include in coverage
      include: ['src/**/*.{ts,tsx,js,jsx}'],

      // Files to exclude from coverage
      exclude: [
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/dist/**',
        '**/build/**',
        '**/node_modules/**',
        '**/coverage/**',
        '**/*.test.{ts,tsx,js,jsx}',
        '**/*.spec.{ts,tsx,js,jsx}',
      ],

      // Coverage reporters
      reporter: ['text', 'json', 'html'],
    },

    // Test file patterns
    include: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],

    // Files to exclude from test runs
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
    ],

    // Reporter configuration
    reporters: ['verbose', 'json', 'html'],

    // TypeScript configuration
    typecheck: {
      enabled: true,
    },
  },
};

export default config;

