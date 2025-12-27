import type { Config } from 'jest';

/**
 * Options for creating a Jest configuration
 */
export interface JestConfigOptions {
  /**
   * Test environment (node, jsdom, etc.)
   * @default 'node'
   */
  testEnvironment?: 'node' | 'jsdom' | string;

  /**
   * Array of file extensions Jest will look for
   * @default ['ts', 'tsx', 'js', 'jsx']
   */
  moduleFileExtensions?: string[];

  /**
   * Array of file patterns for test files
   * @default ['**\/*.{test,spec}.{ts,tsx,js,jsx}']
   */
  testMatch?: string[];

  /**
   * Array of patterns to skip when looking for test files
   * @default ['**\/node_modules\/**', '**\/dist\/**', '**\/build\/**']
   */
  testPathIgnorePatterns?: string[];

  /**
   * Coverage thresholds
   * @default { global: { lines: 80, functions: 80, branches: 80, statements: 80 } }
   */
  coverageThreshold?: Config['coverageThreshold'];

  /**
   * Array of patterns to include in coverage
   * @default ['src\/**\/*.{ts,tsx,js,jsx}']
   */
  collectCoverageFrom?: string[];

  /**
   * Array of patterns to exclude from coverage
   * @default ['**\/*.d.ts', '**\/*.config.{ts,js}', '**\/dist\/**', '**\/build\/**', '**\/node_modules\/**', '**\/coverage\/**', '**\/*.test.{ts,tsx,js,jsx}', '**\/*.spec.{ts,tsx,js,jsx}']
   */
  coveragePathIgnorePatterns?: string[];

  /**
   * Array of reporters for coverage
   * @default ['text', 'json', 'html']
   */
  coverageReporters?: Config['coverageReporters'];

  /**
   * Array of setup files to run before each test file
   * @default []
   */
  setupFilesAfterEnv?: string[];

  /**
   * Module name mapper for path aliases
   * @default {}
   */
  moduleNameMapper?: Record<string, string | string[]>;

  /**
   * Transform configuration
   * @default { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { esModuleInterop: true, allowSyntheticDefaultImports: true } }] }
   */
  transform?: Record<string, string | [string, Record<string, unknown>]>;

  /**
   * Test timeout in milliseconds
   * @default 5000
   */
  testTimeout?: number;
}

/**
 * Creates a Jest configuration with TypeScript support, coverage settings, and sensible defaults.
 * This configuration provides a solid foundation for testing TypeScript projects.
 *
 * Features:
 * - TypeScript support via ts-jest
 * - Coverage configuration with 80% thresholds
 * - Node.js environment by default
 * - Standard test file patterns
 * - Optimized for modern TypeScript projects
 *
 * @example
 * ```typescript
 * import { createJestConfig } from '@jmlweb/jest-config';
 *
 * export default createJestConfig({
 *   testEnvironment: 'jsdom',
 *   setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
 * });
 * ```
 */
export const createJestConfig = (options: JestConfigOptions = {}): Config => {
  const {
    testEnvironment = 'node',
    moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json'],
    testMatch = ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
    testPathIgnorePatterns = [
      '/node_modules/',
      '/dist/',
      '/build/',
      '/.git/',
      '/.cache/',
    ],
    coverageThreshold = {
      global: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    collectCoverageFrom = ['src/**/*.{ts,tsx,js,jsx}'],
    coveragePathIgnorePatterns = [
      '/node_modules/',
      '/dist/',
      '/build/',
      '/coverage/',
      '.*\\.d\\.ts$',
      '.*\\.config\\.(ts|js)$',
      '.*\\.test\\.(ts|tsx|js|jsx)$',
      '.*\\.spec\\.(ts|tsx|js|jsx)$',
    ],
    coverageReporters = ['text', 'json', 'html'],
    setupFilesAfterEnv = [],
    moduleNameMapper = {},
    transform = {
      '^.+\\.tsx?$': [
        'ts-jest',
        {
          tsconfig: {
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
          },
        },
      ],
    },
    testTimeout = 5000,
  } = options;

  const config: Config = {
    // Test environment
    testEnvironment,

    // Module file extensions
    moduleFileExtensions,

    // Test file patterns
    testMatch,

    // Paths to ignore when looking for test files
    testPathIgnorePatterns,

    // Coverage configuration
    collectCoverage: false, // Disable by default, enable with --coverage flag
    collectCoverageFrom,
    coveragePathIgnorePatterns,
    coverageThreshold,
    coverageReporters,

    // Setup files
    setupFilesAfterEnv: setupFilesAfterEnv.length > 0 ? setupFilesAfterEnv : undefined,

    // Module name mapping for path aliases
    moduleNameMapper: Object.keys(moduleNameMapper).length > 0 ? moduleNameMapper : undefined,

    // Transform configuration for TypeScript
    transform,

    // Test timeout
    testTimeout,

    // Verbose output for clearer test results
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks after each test
    restoreMocks: true,

    // Reset modules between tests
    resetModules: false,
  };

  // Remove undefined values to keep config clean
  Object.keys(config).forEach((key) => {
    if (config[key as keyof Config] === undefined) {
      delete config[key as keyof Config];
    }
  });

  return config;
};

/**
 * Base Jest configuration with TypeScript support, coverage settings, and sensible defaults.
 * This configuration provides a solid foundation for testing TypeScript projects.
 *
 * Features:
 * - TypeScript support via ts-jest
 * - Coverage configuration with 80% thresholds
 * - Node.js environment by default
 * - Standard test file patterns
 * - Optimized for modern TypeScript projects
 *
 * @example
 * ```typescript
 * import jestConfig from '@jmlweb/jest-config';
 *
 * export default jestConfig;
 * ```
 *
 * @example
 * ```typescript
 * import jestConfig from '@jmlweb/jest-config';
 *
 * export default {
 *   ...jestConfig,
 *   testEnvironment: 'jsdom',
 *   setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
 * };
 * ```
 */
const config: Config = createJestConfig();

export default config;

