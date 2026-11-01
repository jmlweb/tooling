---
id: RPT-002
title: createTsdownCliConfig silently drops the shebang when the user sets banner
type: bug
severity: medium
status: triaged
created: 2026-11-01
triaged: 2026-11-01
task-id: TSK-002
---

## Observed

`createTsdownCliConfig` builds the shebang through tsdown's `banner` option, then spreads the user's remaining options after it:

- `packages/tsdown-config-base/src/index.ts:401` `...resolveShebang(shebang, plugins),`
- `packages/tsdown-config-base/src/index.ts:403` `...rest,`

A user `banner` in `rest` replaces the shebang banner function. The CLI output then has no `#!/usr/bin/env node` line, so the published `bin` does not run. No error or warning is raised.

The README documents the opposite: "Every tsdown option goes at the top level; the presets only add defaults" (`packages/tsdown-config-base/README.md:13`), and `shebang` defaults to `true` (`README.md:120`).

## Reproduction

```sh
pnpm --filter @jmlweb/tsdown-config-base build
cd packages/tsdown-config-base
node -e "import('./dist/index.js').then(m=>{const c=m.createTsdownCliConfig({banner:{js:'/* (c) me */'}});console.log(JSON.stringify(c.banner))})"
```

Output: `{"js":"/* (c) me */"}`. The shebang banner function is gone, though `shebang` is still `true`.

The legacy `@jmlweb/tsup-config-base` has the same pattern: `options` is spread after `banner: { js: SHEBANG }` (`packages/tsup-config-base/src/index.ts:312-314`).

## Expected

The shebang is kept and the user banner is combined with it (shebang first), or a conflicting `banner` throws `TsdownConfigError` like the other conflicts.
