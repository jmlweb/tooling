---
'@jmlweb/tsdown-config-base': minor
---

Add `@jmlweb/tsdown-config-base`, the tsdown successor to `@jmlweb/tsup-config-base`. It exposes `createTsdownConfig` and `createTsdownCliConfig` with the same options as the tsup helpers, maps `external` to tsdown's `deps.neverBundle`, and keeps tsup's output file names (`.js`/`.cjs`/`.d.ts`/`.d.cts`) by disabling `fixedExtension`.
