---
'@jmlweb/commitlint-config': patch
'@jmlweb/eslint-config-astro': patch
'@jmlweb/eslint-config-base-js': patch
'@jmlweb/eslint-config-node': patch
'@jmlweb/eslint-config-react': patch
'@jmlweb/jest-config': patch
'@jmlweb/prettier-config-base': patch
'@jmlweb/prettier-config-tailwind': patch
'@jmlweb/tsdown-config-base': patch
'@jmlweb/tsup-config-base': patch
'@jmlweb/vite-config': patch
'@jmlweb/vitest-config': patch
---

Build with tsdown via `@jmlweb/tsdown-config-base` instead of tsup. The published output is equivalent: same files, exports and type declarations.
