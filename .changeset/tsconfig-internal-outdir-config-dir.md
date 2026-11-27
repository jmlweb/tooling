---
'@jmlweb/tsconfig-internal': patch
---

Resolve `outDir` per consuming package with `${configDir}/dist`. It was `dist`, which resolved against `@jmlweb/tsconfig-internal` itself, so every extending package pointed at `packages/tsconfig-internal/dist`.
