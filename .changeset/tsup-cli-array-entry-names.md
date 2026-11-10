---
'@jmlweb/tsup-config-base': patch
---

Fix `createTsupCliConfig` dropping array entries that share a basename when `shebang` names specific entries. Array entries are now named by their path relative to the directory all entries share, without extension, so `['src/cli.ts', 'src/admin/cli.ts']` with `shebang: 'cli'` builds both `dist/cli.js` and `dist/admin/cli.js`, the same paths tsup produces for the array form.

Nested array entries keep their folder on this path: `['src/bin/cli.ts', 'src/index.ts']` now builds `dist/bin/cli.js` instead of `dist/cli.js`, and the shebang targets it as `'bin/cli'`. A `TsupConfigError` is now thrown when two entries map to the same name, when an array entry is a glob, or when a `shebang` name matches no entry, instead of silently dropping an entry or the shebang.
