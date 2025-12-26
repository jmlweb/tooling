/**
 * Commitlint configuration for the @jmlweb/tooling monorepo.
 * Scopes are based on package names without the @jmlweb/ prefix.
 *
 * This config is self-contained to avoid build dependencies.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type rules
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'refactor',
        'test',
        'ci',
        'perf',
        'style',
        'build',
        'revert',
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],

    // Scope rules
    'scope-enum': [
      2,
      'always',
      [
        // ESLint configs
        'eslint-config-base',
        'eslint-config-base-js',
        'eslint-config-node',
        'eslint-config-react',
        // Prettier configs
        'prettier-config-base',
        'prettier-config-tailwind',
        // TypeScript configs
        'tsconfig-base',
        'tsconfig-internal',
        'tsconfig-nextjs',
        'tsconfig-node',
        'tsconfig-react',
        // Build configs
        'tsup-config-base',
        'vite-config',
        'postcss-config',
        // Test configs
        'vitest-config',
        // Commitlint config
        'commitlint-config',
        // Common scopes
        'deps',
        'release',
        'scripts',
        'workspace',
      ],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'scope-empty': [0],

    // Subject rules
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],

    // Header rules
    'header-max-length': [2, 'always', 100],

    // Body rules
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'body-empty': [0],

    // Footer rules
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
};
