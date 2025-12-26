import { createCommitlintConfig } from './packages/commitlint-config/dist/index.js';

/**
 * Commitlint configuration for the @jmlweb/tooling monorepo.
 * Scopes are based on package names without the @jmlweb/ prefix.
 */
export default createCommitlintConfig({
  scopes: [
    // ESLint configs
    'eslint-config-base',
    'eslint-config-base-js',
    'eslint-config-node',
    'eslint-config-react',
    // Prettier configs
    'prettier-config-base',
    'prettier-config-tailwind',
    // TypeScript configs
    'tsconfig-base',
    'tsconfig-internal',
    'tsconfig-nextjs',
    'tsconfig-node',
    'tsconfig-react',
    // Build configs
    'tsup-config-base',
    'vite-config',
    'postcss-config',
    // Test configs
    'vitest-config',
    // Commitlint config
    'commitlint-config',
    // Common scopes
    'deps',
    'release',
    'scripts',
    'workspace',
  ],
});
