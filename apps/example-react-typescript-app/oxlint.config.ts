import reactConfig from '@jmlweb/oxlint-config-react';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig],
  options: {
    typeAware: true,
  },
  ignorePatterns: [
    'dist/**',
    'coverage/**',
    // Outside tsconfig.json, so type-aware rules cannot resolve their imports
    '*.config.ts',
  ],
});
