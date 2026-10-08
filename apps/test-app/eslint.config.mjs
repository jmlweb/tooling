import eslintConfig from '@jmlweb/eslint-config-base';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  ...eslintConfig,
  {
    ...tseslint.configs.disableTypeChecked,
    files: ['**/*.mjs'],
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
