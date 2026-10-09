import nodeConfig from '@jmlweb/oxlint-config-node';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nodeConfig],
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
