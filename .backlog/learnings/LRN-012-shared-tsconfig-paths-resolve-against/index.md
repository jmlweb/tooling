---
id: LRN-012
title: Shared tsconfig paths resolve against the declaring file; use ${configDir} (TS >=5.5)
status: active
tags: [typescript, tsconfig, paths, integration-tests]
task: TSK-008
created: 2026-11-19
---

Relative `paths` entries (`"./*"`) in a published tsconfig resolve against `node_modules/<pkg>/`, not the consumer project, so the alias silently fails with TS2307. Use `"${configDir}/*"`, which TypeScript substitutes with the directory of the consumer's tsconfig. It needs TypeScript 5.5 or later, so raise the `typescript` peer floor with it.

The integration tsconfig suite used to only parse the JSON and never ran tsc, so it could not catch this. A runtime check (pack, install, `npx tsc -p` on a fixture importing the alias) is what proves path behaviour. Set `plugins: []` and `incremental: false` in the fixture config because the Next.js plugin is not installed.
