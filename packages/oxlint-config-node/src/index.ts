import type { OxlintConfig } from 'oxlint';

import baseConfig from '@jmlweb/oxlint-config-base';
import eslintPluginN from 'eslint-plugin-n';

type Rules = NonNullable<OxlintConfig['rules']>;

/** Stricter or extra eslint-plugin-n rules, as in @jmlweb/eslint-config-node */
const nodeBestPracticeRules: Rules = {
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
};

/** eslint-plugin-n rules that Oxlint implements natively in its `node` plugin */
const NATIVE_NODE_RULES = new Set([
  'no-exports-assign',
  'no-new-require',
  'no-path-concat',
]);

/**
 * eslint-plugin-n's `flat/recommended` rules plus the extra ones, run as an
 * Oxlint JS plugin. Rules Oxlint implements natively use the faster `node/*`
 * version instead. Derived from eslint-plugin-n's own preset so it follows new
 * releases.
 */
const nodeRules = Object.fromEntries(
  Object.entries({
    ...eslintPluginN.configs['flat/recommended'].rules,
    ...nodeBestPracticeRules,
  }).map(([rule, value]) => {
    const name = rule.replace(/^n\//, '');
    return [NATIVE_NODE_RULES.has(name) ? `node/${name}` : rule, value];
  }),
) as Rules;

/**
 * Node.js Oxlint configuration that extends @jmlweb/oxlint-config-base.
 * Mirrors @jmlweb/eslint-config-node.
 */
const config: OxlintConfig = {
  extends: [baseConfig],
  plugins: ['typescript', 'import', 'node'],
  jsPlugins: ['eslint-plugin-n'],
  rules: nodeRules,
  overrides: [
    {
      // Oxlint drops a top-level `env` from configs loaded through `extends`,
      // but keeps it inside overrides
      files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
      env: {
        node: true,
      },
    },
  ],
};

export default config;
