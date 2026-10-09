---
'@jmlweb/commitlint-config': patch
'@jmlweb/jest-config': patch
'@jmlweb/tsdown-config-base': patch
'@jmlweb/tsup-config-base': patch
'@jmlweb/vite-config': patch
---

Declare the exported options types with `type` instead of `interface`. Their shape is unchanged; only declaration merging into them is no longer possible. `@jmlweb/jest-config` also omits `setupFilesAfterEnv` and `moduleNameMapper` without deleting keys, with the same resulting config.
