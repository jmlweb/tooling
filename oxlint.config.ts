import baseConfig from '@jmlweb/oxlint-config-base';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [baseConfig],
  // Keep the import order the ESLint setup enforced, so files linted by both stay stable
  jsPlugins: ['eslint-plugin-simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  env: {
    node: true,
  },
  ignorePatterns: [
    '**/dist/**',
    '.husky/**',
    // Root linting covers JavaScript files only; TypeScript is linted by each workspace
    '**/*.{ts,tsx,mts,cts}',
  ],
  overrides: [
    {
      files: [
        'scripts/**/*.mjs',
        'apps/test-app/scripts/**/*.mjs',
        'apps/integration-tests/scripts/**/*.mjs',
      ],
      rules: {
        'eslint/no-unused-vars': 'off',
      },
    },
  ],
});
