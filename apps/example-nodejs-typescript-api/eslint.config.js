import baseConfig from '@jmlweb/eslint-config-base';

export default [
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      'eslint.config.js',
      'vitest.config.ts',
    ],
  },
  ...baseConfig,
];
