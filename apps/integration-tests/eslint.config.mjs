import eslintConfig from '@jmlweb/eslint-config-base-js';
import globals from 'globals';

export default [
  ...eslintConfig,
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
];
