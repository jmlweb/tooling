---
'@jmlweb/tsconfig-nextjs': patch
---

Resolve the `@/*` path alias against the consumer's project root. The alias now maps to `${configDir}/*` instead of `./*`, which TypeScript resolved inside `node_modules/@jmlweb/tsconfig-nextjs/` and failed with TS2307. The `typescript` peer dependency now requires `>=5.5.0`, the first version that supports `${configDir}`.
