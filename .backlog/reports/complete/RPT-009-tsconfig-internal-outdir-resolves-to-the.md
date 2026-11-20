---
id: RPT-009
title: tsconfig-internal outDir resolves to the shared config package, not each consuming package
type: bug
severity: low
status: triaged
created: 2026-11-19
triaged: 2026-11-19
task-id: TSK-009
---

## Problem

`packages/tsconfig-internal/tsconfig.json:17` sets `"outDir": "dist"` as a plain relative path. TypeScript resolves relative paths in an extended config against the file that declares them, so every package that extends `@jmlweb/tsconfig-internal` gets `outDir` pointing at `packages/tsconfig-internal/dist`, not its own `dist/`. Line 16 already uses `${configDir}` for `rootDir`; `outDir` was left out.

The README says otherwise: `packages/tsconfig-internal/README.md` ("`rootDir` and `outDir` resolve per package"). That documented behaviour is broken.

## Reproduction

```sh
cd packages/vitest-config
npx tsc --showConfig -p tsconfig.json | jq -c '{rootDir:.compilerOptions.rootDir,outDir:.compilerOptions.outDir}'
```

Observed:

```json
{"rootDir":"./src","outDir":"../tsconfig-internal/dist"}
```

Expected `outDir` to be `./dist`. Any emitting `tsc -p packages/<pkg>` would write every package's output into the same `packages/tsconfig-internal/dist` folder. Today builds run through tsdown, which writes `dist/` itself, so the build is not affected yet. The README and the config disagree, and anyone using `tsc` to emit or check declarations hits the shared folder.

## Suggested fix

Change `outDir` to `"${configDir}/dist"` in `packages/tsconfig-internal/tsconfig.json`. Update the README table to match. Check with `tsc --showConfig` on one package. The package is private, so no changeset is needed.
