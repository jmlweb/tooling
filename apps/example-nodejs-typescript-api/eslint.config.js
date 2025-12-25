import baseConfig from '@jmlweb/eslint-config-base';

export default [
  ...baseConfig,
  {
    ignores: ['dist/', 'node_modules/', 'coverage/'],
  },
];
