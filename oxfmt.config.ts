import baseConfig from '@jmlweb/oxfmt-config-base';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...baseConfig,
  overrides: [
    {
      files: [
        // Intentionally unsorted fixtures and "before" examples
        'apps/test-app/fixtures/**',
        '**/*.md',
      ],
      options: {
        sortImports: false,
      },
    },
  ],
});
