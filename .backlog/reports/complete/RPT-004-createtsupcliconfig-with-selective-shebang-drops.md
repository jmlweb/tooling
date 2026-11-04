---
id: RPT-004
title: createTsupCliConfig with selective shebang drops array entries that share a basename
type: bug
severity: low
status: triaged
created: 2026-11-04
triaged: 2026-11-04
task-id: TSK-004
---

## Location

- `packages/tsup-config-base/src/index.ts:385-396`: `normalizeEntry` keys array entries by file basename (`'src/admin/cli.ts'` becomes `'cli'`)
- `packages/tsup-config-base/src/index.ts:333-345`: the selective-shebang path (`shebang` is a string or string[]) splits that object into the with/without-shebang configs

## Problem

When `entry` is an array and `shebang` names specific entries, two paths with the same basename collapse into one key in `Object.fromEntries`. The earlier entry is silently dropped from the build. The same keying also flattens nested outputs (`src/admin/run.ts` is emitted as `dist/run.js` instead of tsup's usual `dist/admin/run.js`), but only on the selective path. `shebang: true` and `shebang: false` pass the array through unchanged.

## Reproduction

From `packages/tsup-config-base` after `pnpm build`:

```sh
node -e "import('./dist/index.js').then(m=>console.log(JSON.stringify(m.createTsupCliConfig({entry:['src/cli.ts','src/admin/cli.ts'],shebang:'cli'}).entry)))"
```

Observed output:

```text
{"cli":"src/admin/cli.ts"}
```

`src/cli.ts` is gone. No error or warning is produced.

## Suggested fix

Key array entries by their path relative to the common source directory without extension (e.g. `admin/cli`), and throw on a remaining key collision. Alternatively, throw when an array entry is combined with a selective shebang and ask for the object form.
