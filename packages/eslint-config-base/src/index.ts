import type { Linter } from 'eslint';

import baseConfig from '@jmlweb/eslint-config-base-js';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const TYPESCRIPT_FILES = ['**/*.ts', '**/*.tsx'];

/**
 * Type-checked presets ship without a `files` glob, so they would also run on
 * JavaScript files, where `projectService` is not enabled and ESLint throws.
 */
const scopeToTypeScript = (configs: Linter.Config[]): Linter.Config[] =>
  configs.map((presetConfig) => ({
    ...presetConfig,
    files: presetConfig.files ?? TYPESCRIPT_FILES,
  }));

/**
 * TypeScript ESLint configuration that extends the base config.
 * Includes strict type checking, stylistic rules, and best practices.
 * For non-strict projects, override the strict rules in your eslint.config.js.
 */
const config = [
  ...baseConfig,
  ...tseslint.configs.recommended,
  ...scopeToTypeScript(tseslint.configs.strictTypeChecked),
  ...scopeToTypeScript(tseslint.configs.stylisticTypeChecked),
  {
    files: TYPESCRIPT_FILES,
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      ...prettierConfig.rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      // TypeScript strict rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

      // Import rules
      '@typescript-eslint/no-require-imports': 'error',

      // Naming conventions
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
        {
          selector: 'variable',
          modifiers: ['const', 'exported'],
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        { selector: 'function', format: ['camelCase'] },
      ],

      // Prevent enum usage (prefer const maps)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Use const maps instead of enums',
        },
      ],

      // Encourage immutability (functional programming)
      'no-param-reassign': ['error', { props: true }],

      // Enforce named exports only (no default exports)
      'no-restricted-exports': [
        'error',
        {
          restrictDefaultExports: {
            direct: true,
            named: true,
            defaultFrom: true,
            namedFrom: true,
            namespaceFrom: true,
          },
        },
      ],
    },
  },
] as Linter.Config[];

export default config;
