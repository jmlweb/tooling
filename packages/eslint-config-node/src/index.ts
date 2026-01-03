import type { Linter } from 'eslint';

import baseConfig from '@jmlweb/eslint-config-base';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginN from 'eslint-plugin-n';
import globals from 'globals';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/**
 * Node.js ESLint configuration that extends the base TypeScript config.
 * Includes Node.js-specific rules, globals, and best practices for Node.js development.
 * For Node.js library and application development with TypeScript.
 */
const config = [
  ...baseConfig,
  // Node.js recommended config (includes plugin and recommended rules)
  eslintPluginN.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.js', '**/*.mjs', '**/*.cjs'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...prettierConfig.rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Node.js best practices (override/extend recommended rules)
      'n/no-process-exit': 'error',
      'n/no-missing-import': 'error',
      'n/no-missing-require': 'error',
      'n/no-unpublished-import': 'error',
      'n/no-unpublished-require': 'error',
      'n/no-extraneous-import': 'error',
      'n/no-extraneous-require': 'error',
      'n/no-deprecated-api': 'warn',
      'n/process-exit-as-throw': 'error',
      'n/no-callback-literal': 'error',
      'n/no-new-require': 'error',
      'n/no-path-concat': 'error',
      'n/prefer-global/buffer': ['error', 'always'],
      'n/prefer-global/console': ['error', 'always'],
      'n/prefer-global/process': ['error', 'always'],
      'n/prefer-global/url-search-params': ['error', 'always'],
      'n/prefer-global/url': ['error', 'always'],
      'n/prefer-promises/dns': 'error',
      'n/prefer-promises/fs': 'error',
      'n/prefer-node-protocol': 'error',
    },
  },
] as Linter.Config[];

export default config;
