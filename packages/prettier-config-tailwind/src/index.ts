import type { Config } from 'prettier';

import baseConfig from '@jmlweb/prettier-config-base';

const config: Config = {
  ...baseConfig,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
