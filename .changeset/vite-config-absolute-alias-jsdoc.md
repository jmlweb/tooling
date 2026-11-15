---
'@jmlweb/vite-config': patch
---

Fix the `resolve.alias` JSDoc examples on `ViteConfigOptions` and `createReactViteConfig`, which showed a relative `'./src'` path. Vite passes relative alias values through unchanged, so `@/util` imported from a nested file fails to load. The examples now use `resolve(import.meta.dirname, 'src')`, matching the README.
