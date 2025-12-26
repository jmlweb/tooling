import type { UserConfig } from '@commitlint/types';

/**
 * Allowed commit types following Conventional Commits specification
 */
export const COMMIT_TYPES = [
  'feat', // New feature
  'fix', // Bug fix
  'docs', // Documentation changes
  'chore', // Maintenance tasks
  'refactor', // Code refactoring
  'test', // Adding or updating tests
  'ci', // CI/CD configuration
  'perf', // Performance improvements
  'style', // Code style changes (formatting, etc.)
  'build', // Build system changes
  'revert', // Reverting previous commits
] as const;

/**
 * Allowed scopes matching @jmlweb package names
 * These are extracted from the package names without the @jmlweb/ prefix
 */
export const COMMIT_SCOPES = [
  // ESLint configs
  'eslint-config-base',
  'eslint-config-base-js',
  'eslint-config-react',
  // Prettier configs
  'prettier-config-base',
  'prettier-config-tailwind',
  // TypeScript configs
  'tsconfig-base',
  'tsconfig-internal',
  'tsconfig-nextjs',
  'tsconfig-react',
  // Build configs
  'tsup-config-base',
  // Test configs
  'vitest-config',
  // Commitlint config
  'commitlint-config',
  // Common scopes
  'deps', // Dependency updates
  'release', // Release-related changes
  'scripts', // Build/CI scripts
  'workspace', // Workspace configuration
] as const;

export type CommitType = (typeof COMMIT_TYPES)[number];
export type CommitScope = (typeof COMMIT_SCOPES)[number];

/**
 * Options for creating a commitlint configuration
 */
export interface CommitlintConfigOptions {
  /**
   * Additional commit types to allow
   * @default []
   */
  additionalTypes?: string[];

  /**
   * Additional scopes to allow
   * @default []
   */
  additionalScopes?: string[];

  /**
   * Maximum length for the header line
   * @default 100
   */
  headerMaxLength?: number;

  /**
   * Whether to require a scope
   * @default false
   */
  scopeRequired?: boolean;

  /**
   * Whether to require body for certain commit types
   * @default false
   */
  bodyRequired?: boolean;
}

/**
 * Creates a commitlint configuration with sensible defaults
 *
 * @example
 * ```typescript
 * // Simple usage with defaults
 * import { createCommitlintConfig } from '@jmlweb/commitlint-config';
 * export default createCommitlintConfig();
 * ```
 *
 * @example
 * ```typescript
 * // With additional scopes for your project
 * import { createCommitlintConfig } from '@jmlweb/commitlint-config';
 * export default createCommitlintConfig({
 *   additionalScopes: ['api', 'ui', 'database'],
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Strict configuration with required scope
 * import { createCommitlintConfig } from '@jmlweb/commitlint-config';
 * export default createCommitlintConfig({
 *   scopeRequired: true,
 *   headerMaxLength: 72,
 * });
 * ```
 */
export const createCommitlintConfig = (
  options: CommitlintConfigOptions = {},
): UserConfig => {
  const {
    additionalTypes = [],
    additionalScopes = [],
    headerMaxLength = 100,
    scopeRequired = false,
    bodyRequired = false,
  } = options;

  const allTypes = [...COMMIT_TYPES, ...additionalTypes];
  const allScopes = [...COMMIT_SCOPES, ...additionalScopes];

  return {
    extends: ['@commitlint/config-conventional'],
    rules: {
      // Type rules
      'type-enum': [2, 'always', allTypes],
      'type-case': [2, 'always', 'lower-case'],
      'type-empty': [2, 'never'],

      // Scope rules
      'scope-enum': [2, 'always', allScopes],
      'scope-case': [2, 'always', 'kebab-case'],
      'scope-empty': scopeRequired ? [2, 'never'] : [0],

      // Subject rules
      'subject-case': [2, 'always', 'lower-case'],
      'subject-empty': [2, 'never'],
      'subject-full-stop': [2, 'never', '.'],

      // Header rules
      'header-max-length': [2, 'always', headerMaxLength],

      // Body rules
      'body-leading-blank': [2, 'always'],
      'body-max-line-length': [2, 'always', 100],
      'body-empty': bodyRequired ? [2, 'never'] : [0],

      // Footer rules
      'footer-leading-blank': [2, 'always'],
      'footer-max-line-length': [2, 'always', 100],
    },
  };
};

/**
 * Default commitlint configuration
 * Use this directly if you don't need customization
 *
 * @example
 * ```javascript
 * // commitlint.config.js
 * import commitlintConfig from '@jmlweb/commitlint-config';
 * export default commitlintConfig;
 * ```
 */
const config: UserConfig = createCommitlintConfig();

export default config;

/**
 * Re-export types for convenience
 */
export type { UserConfig } from '@commitlint/types';
