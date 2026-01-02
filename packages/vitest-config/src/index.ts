import { defineConfig } from 'vitest/config';

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
 * - Optimized test execution settings
 *
 * Note: Type checking should be run separately using `vitest typecheck` command
 * for better performance, rather than enabling it in the test configuration.
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
const config = defineConfig({
  test: {
    // Enable globals for cleaner test syntax (e.g., describe, it, expect without imports)
    globals: true,

    // Use Node.js environment by default
    environment: 'node',

    // Test timeout (5 seconds default, can be overridden)
    testTimeout: 5000,

    // Hook timeout (10 seconds for setup/teardown)
    hookTimeout: 10000,

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

      // Coverage reporters (HTML is valid here for coverage reports)
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

    // Test reporter configuration (HTML is only for coverage, not test reporters)
    // Use 'verbose' for detailed output, 'basic' for minimal, 'dot' for dots, 'json' for CI/CD
    reporters: ['verbose'],

    // Pool configuration for test execution
    // threads: faster but may have issues with shared state
    // forks: more isolated but slower
    // Use threads by default for better performance
    pool: 'threads',

    // Note: poolOptions.threads.minThreads and maxThreads were removed in Vitest 4
    // Vitest now automatically manages thread pool based on available CPUs
  },
});

export default config;

