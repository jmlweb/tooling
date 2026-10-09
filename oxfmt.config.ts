import baseConfig from '@jmlweb/oxfmt-config-base';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...baseConfig,
  overrides: [
    {
      files: [
        // Linted by ESLint, whose simple-import-sort owns their import order
        'apps/example-*/**',
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
