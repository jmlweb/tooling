---
'@jmlweb/commitlint-config': major
'@jmlweb/eslint-config-astro': major
'@jmlweb/eslint-config-base-js': major
'@jmlweb/eslint-config-base': major
'@jmlweb/eslint-config-node': major
'@jmlweb/eslint-config-react': major
'@jmlweb/jest-config': major
'@jmlweb/prettier-config-base': major
'@jmlweb/prettier-config-tailwind': major
'@jmlweb/tsconfig-astro': major
'@jmlweb/tsconfig-base': major
'@jmlweb/tsconfig-nextjs': major
'@jmlweb/tsconfig-node': major
'@jmlweb/tsconfig-react': major
'@jmlweb/tsup-config-base': major
'@jmlweb/vite-config': major
'@jmlweb/vitest-config': major
---

Require Node.js >= 22.12.0. Node.js 18 and 20 are end-of-life, and 22.12.0 is the first Node.js 22 release that can `require()` ES modules without a flag, which the CommonJS builds need to load ESM-only plugins.
