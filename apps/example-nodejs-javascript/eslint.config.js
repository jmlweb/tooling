import baseJsConfig from '@jmlweb/eslint-config-base-js';
import globals from 'globals';

export default [
  ...baseJsConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: ['node_modules/'],
  },
];
