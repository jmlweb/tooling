---
'@jmlweb/vite-config': patch
---

Fix production builds on Vite 8. The config no longer sets `minify: 'esbuild'`, which fails on Vite 8 unless `esbuild` is installed; Vite's own default minifier is used instead (esbuild up to Vite 7, Oxc from Vite 8). The `minify` option now accepts every value of the installed Vite, including `'oxc'`. A no-op `rollupOptions` block (deprecated in Vite 8) is removed.
