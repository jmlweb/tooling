import type { OxlintConfig } from 'oxlint';

import eslintReact from '@eslint-react/eslint-plugin';
import baseConfig from '@jmlweb/oxlint-config-base';

type Rules = NonNullable<OxlintConfig['rules']>;

/**
 * Rules of eslint-plugin-react-hooks' `recommended` preset, including the React
 * Compiler ones. Oxlint implements them natively in its `react` plugin, so the
 * ESLint plugin is not needed. `config` and `gating` only validate compiler
 * options and have no Oxlint equivalent.
 */
const reactHooksRules: Rules = {
  'react/rules-of-hooks': 'error',
  'react/exhaustive-deps': 'warn',
  'react/static-components': 'error',
  'react/use-memo': 'error',
  'react/preserve-manual-memoization': 'error',
  'react/incompatible-library': 'warn',
  'react/immutability': 'error',
  'react/globals': 'error',
  'react/refs': 'error',
  'react/set-state-in-effect': 'error',
  'react/error-boundaries': 'error',
  'react/purity': 'error',
  'react/set-state-in-render': 'error',
  'react/unsupported-syntax': 'warn',
};

/**
 * @eslint-react's `recommended-typescript` rules, run as an Oxlint JS plugin.
 * Its ports of eslint-plugin-react-hooks' rules are dropped because Oxlint runs
 * the originals natively. Derived from @eslint-react's own presets so it
 * follows new releases.
 */
const reactHooksPorts = new Set(
  Object.keys(
    eslintReact.configs['disable-conflict-eslint-plugin-react-hooks'].rules ??
      {},
  ).map((rule) => rule.replace(/^react-hooks\//, '@eslint-react/')),
);

const eslintReactRules = Object.fromEntries(
  Object.entries(
    eslintReact.configs['recommended-typescript'].rules ?? {},
  ).filter(([rule]) => !reactHooksPorts.has(rule)),
) as Rules;

/**
 * React Oxlint configuration that extends @jmlweb/oxlint-config-base.
 * Mirrors @jmlweb/eslint-config-react.
 */
const config: OxlintConfig = {
  extends: [baseConfig],
  plugins: ['typescript', 'import', 'react'],
  jsPlugins: ['@eslint-react/eslint-plugin', 'eslint-plugin-perfectionist'],
  // Hooks and React Compiler rules apply to every file, since custom hooks
  // usually live in .ts files
  rules: {
    ...eslintReactRules,
    ...reactHooksRules,
  },
  overrides: [
    {
      files: ['**/*.{tsx,jsx}'],
      rules: {
        // Not in @eslint-react's recommended set, or stricter than its default
        '@eslint-react/jsx-no-children-prop': 'error',
        '@eslint-react/dom-no-unknown-property': 'error',
        '@eslint-react/dom-no-unsafe-target-blank': 'error',
        '@eslint-react/jsx-no-useless-fragment': 'error',

        // JSX style rules that @eslint-react leaves to other plugins
        'react/jsx-pascal-case': 'error',
        'react/self-closing-comp': 'error',
        'react/jsx-curly-brace-presence': [
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
  ],
};

export default config;
