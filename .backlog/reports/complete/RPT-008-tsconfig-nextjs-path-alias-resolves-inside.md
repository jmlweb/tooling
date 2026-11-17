---
id: RPT-008
title: tsconfig-nextjs @/* path alias resolves inside node_modules, not the project root
type: bug
severity: high
status: triaged
created: 2026-11-17
triaged: 2026-11-17
task-id: TSK-008
---

## Summary

`packages/tsconfig-nextjs/tsconfig.json:12-13` sets `"paths": { "@/*": ["./*"] }`. TypeScript resolves relative `paths` entries against the directory of the tsconfig file that declares them. That file is `node_modules/@jmlweb/tsconfig-nextjs/tsconfig.json`, so `./*` points into the package folder, not the consumer's project root.

The README documents the alias as pointing to the project root (`packages/tsconfig-nextjs/README.md:9`, `:15`, `:73`). Any consumer who extends the config without overriding `paths` gets an alias that does not work.

## Reproduction (tsc 6.0.3, the repo's version)

Layout:

```text
tmp/
  node_modules/@jmlweb/{tsconfig-base,tsconfig-react,tsconfig-nextjs}   (copied from packages/)
  lib/answer.ts        export const answer = 42;
  page.ts              import { answer } from '@/lib/answer';
  tsconfig.json        {"extends":"@jmlweb/tsconfig-nextjs","compilerOptions":{"noEmit":true,"plugins":[]},"include":["page.ts"]}
```

Observed output of `tsc -p .`:

```text
page.ts(1,24): error TS2307: Cannot find module '@/lib/answer' or its corresponding type declarations.
```

`tsc -p . --traceResolution` shows the pattern matched, but the substitution fails, and TypeScript falls back to node_modules:

```text
Module name '@/lib/answer', matched pattern '@/*'.
Trying substitution './*', candidate module location: './lib/answer'.
Loading module '@/lib/answer' from 'node_modules' folder, ...
```

## Fix verified

Change the entry to `"@/*": ["${configDir}/*"]`. With that change, the same repro passes: `tsc` exits 0. `packages/tsconfig-internal/tsconfig.json` already uses `${configDir}`.

## Caveats

- `${configDir}` needs TypeScript 5.5 or later. The package declares `typescript: ">=5.0.0"` in `peerDependencies`, so the peer range or the README must change too.
- This was verified with tsc only. Next.js's own tsconfig path resolver was not tested.
