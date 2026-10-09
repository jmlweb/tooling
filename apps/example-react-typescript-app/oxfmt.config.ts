import baseConfig from '@jmlweb/oxfmt-config-base';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...baseConfig,
  sortTailwindcss: {
    stylesheet: './src/index.css',
  },
});
