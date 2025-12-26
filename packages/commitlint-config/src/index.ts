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

export type CommitType = (typeof COMMIT_TYPES)[number];

/**
 * Options for creating a commitlint configuration
 */
export interface CommitlintConfigOptions {
  /**
   * Additional commit types to allow (merged with defaults)
   * @default []
   */
  additionalTypes?: string[];

  /**
   * Scopes to allow. When provided, completely replaces any base scopes.
   * Use this when you want full control over allowed scopes.
   * @default undefined (no scope restrictions)
   */
  scopes?: string[];

  /**
   * Additional scopes to allow (merged with base scopes if any).
   * Only used when `scopes` is not provided.
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

  /**
   * Custom function to ignore certain commits (e.g., merge commits, dependabot)
   * Return true to skip validation for a commit
   */
  ignores?: ((commit: string) => boolean)[];
}

/**
 * Creates a commitlint configuration with sensible defaults.
 * By default, no scope restrictions are applied - any scope is allowed.
 *
 * @example
 * ```typescript
 * // Simple usage - any scope is allowed
 * import { createCommitlintConfig } from '@jmlweb/commitlint-config';
 * export default createCommitlintConfig();
 * ```
 *
 * @example
 * ```typescript
 * // Define allowed scopes for your project
 * import { createCommitlintConfig } from '@jmlweb/commitlint-config';
 * export default createCommitlintConfig({
 *   scopes: ['api', 'ui', 'database', 'auth'],
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Strict configuration with required scope
 * import { createCommitlintConfig } from '@jmlweb/commitlint-config';
 * export default createCommitlintConfig({
 *   scopes: ['core', 'utils', 'deps'],
 *   scopeRequired: true,
 *   headerMaxLength: 72,
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Ignore merge commits and dependabot
 * import { createCommitlintConfig } from '@jmlweb/commitlint-config';
 * export default createCommitlintConfig({
 *   ignores: [
 *     (commit) => commit.startsWith('Merge'),
 *     (commit) => /^chore\(deps\)/.test(commit),
 *   ],
 * });
 * ```
 */
export const createCommitlintConfig = (
  options: CommitlintConfigOptions = {},
  baseScopes?: readonly string[],
): UserConfig => {
  const {
    additionalTypes = [],
    scopes,
    additionalScopes = [],
    headerMaxLength = 100,
    scopeRequired = false,
    bodyRequired = false,
    ignores,
  } = options;

  const allTypes = [...COMMIT_TYPES, ...additionalTypes];

  // Determine scopes:
  // 1. If `scopes` is provided, use it (complete override)
  // 2. Otherwise, merge baseScopes (if any) with additionalScopes
  // 3. If no scopes defined at all, disable scope-enum check
  let finalScopes: string[] | undefined;
  if (scopes !== undefined) {
    finalScopes = scopes;
  } else if (baseScopes !== undefined || additionalScopes.length > 0) {
    finalScopes = [...(baseScopes ?? []), ...additionalScopes];
  }

  const config: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      // Type rules
      'type-enum': [2, 'always', allTypes],
      'type-case': [2, 'always', 'lower-case'],
      'type-empty': [2, 'never'],

      // Scope rules - only enforce enum if scopes are defined
      'scope-enum': finalScopes ? [2, 'always', finalScopes] : [0],
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

  // Add custom ignores if provided
  if (ignores && ignores.length > 0) {
    config.ignores = ignores;
  }

  return config;
};

/**
 * Default commitlint configuration
 * Generic configuration with no scope restrictions - suitable for any project.
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
