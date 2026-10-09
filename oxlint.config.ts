import baseConfig from '@jmlweb/oxlint-config-base';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [baseConfig],
  options: {
    typeAware: true,
  },
  env: {
    node: true,
  },
  ignorePatterns: [
    '**/dist/**',
    '.husky/**',
    // Linted by their own ESLint setup
    'apps/example-*/**/*.{ts,tsx,mts,cts}',
    // Intentionally invalid inputs for the test app
    'apps/test-app/fixtures/**/*.{ts,tsx,mts,cts}',
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
    {
      // A default export is the public API of the config packages
      files: ['packages/*/src/**'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
});
