import baseConfig from '@jmlweb/eslint-config-base-js';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '.husky/**'],
  },
  ...baseConfig,
  {
    files: ['**/*.cjs', '.prettierrc.js', 'packages/prettier-*/index.js'],
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
];
