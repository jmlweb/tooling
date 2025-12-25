import baseConfig from '@jmlweb/eslint-config-base-js';
import globals from 'globals';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '.husky/**'],
  },
  ...baseConfig,
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    files: ['scripts/**/*.mjs', 'apps/test-app/scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['apps/example-nodejs-javascript/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
