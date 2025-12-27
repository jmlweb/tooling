import type { Linter } from 'eslint';

import baseConfig from '@jmlweb/eslint-config-base';
import prettierConfig from 'eslint-config-prettier';
import astro from 'eslint-plugin-astro';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/**
 * Astro ESLint configuration that extends the base TypeScript config.
 * Includes Astro-specific rules and best practices for .astro files.
 * For Astro project development with TypeScript.
 */
const config = [
  ...baseConfig,
  // Astro recommended config
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    plugins: {
      astro,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {
      ...prettierConfig.rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  // Also apply to TypeScript files in Astro projects
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...prettierConfig.rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
] as Linter.Config[];

export default config;


