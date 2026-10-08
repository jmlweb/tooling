import type { Linter } from 'eslint';

import eslintReact from '@eslint-react/eslint-plugin';
import baseConfig from '@jmlweb/eslint-config-base';
import stylistic from '@stylistic/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/**
 * @eslint-react ships ports of eslint-plugin-react-hooks' rules. The official
 * plugin owns those, so turn the ports off instead of running both. Derived
 * from @eslint-react's own conflict list so it follows new releases.
 */
const reactHooksPortsOff = Object.fromEntries(
  Object.keys(
    eslintReact.configs['disable-conflict-eslint-plugin-react-hooks'].rules ??
      {},
  ).map((rule) => [rule.replace(/^react-hooks\//, '@eslint-react/'), 'off']),
);

/**
 * React ESLint configuration that extends the base TypeScript config.
 * Includes React-specific rules, hooks rules, and JSX best practices.
 * For React library development with TypeScript.
 */
const config = [
  ...baseConfig,
  eslintReact.configs['recommended-typescript'],
  { rules: reactHooksPortsOff },
  // Hooks and React Compiler rules from the official plugin, for every file
  // (custom hooks usually live in .ts files)
  reactHooks.configs.flat.recommended,
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      '@stylistic': stylistic,
      perfectionist,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        JSX: 'readonly',
      },
    },
    rules: {
      ...prettierConfig.rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Override naming convention to allow PascalCase for React components
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
        {
          selector: 'variable',
          modifiers: ['const', 'exported'],
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        // Allow PascalCase for functions (React components)
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
      ],

      // Not in @eslint-react's recommended set, or stricter than its default
      '@eslint-react/jsx-no-children-prop': 'error',
      '@eslint-react/dom-no-unknown-property': 'error',
      '@eslint-react/dom-no-unsafe-target-blank': 'error',
      '@eslint-react/jsx-no-useless-fragment': 'error',

      // JSX style rules that @eslint-react leaves to other plugins
      '@stylistic/jsx-pascal-case': 'error',
      '@stylistic/jsx-self-closing-comp': 'error',
      '@stylistic/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],
      // Reserved props first, then shorthand props, callbacks last
      'perfectionist/sort-jsx-props': [
        'error',
        {
          type: 'alphabetical',
          ignoreCase: true,
          groups: ['reserved', 'shorthand-prop', 'unknown', 'callback'],
          customGroups: [
            {
              groupName: 'reserved',
              elementNamePattern:
                '^(children|dangerouslySetInnerHTML|key|ref)$',
            },
            { groupName: 'callback', elementNamePattern: '^on[A-Z]' },
          ],
        },
      ],
    },
  },
] as Linter.Config[];

export default config;
