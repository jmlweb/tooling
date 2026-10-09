import baseConfig from '@jmlweb/oxlint-config-base';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [baseConfig],
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
