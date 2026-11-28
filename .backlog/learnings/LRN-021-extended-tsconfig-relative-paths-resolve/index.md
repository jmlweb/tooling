---
id: LRN-021
title: Extended tsconfig relative paths resolve to the base file; use ${configDir}
status: active
tags: [typescript, tsconfig, outdir]
task: TSK-009
created: 2026-11-27
---

Relative paths in an extended tsconfig (`outDir`, `rootDir`, `include`) resolve against the file that declares them, not the extending project. A shared base with `"outDir": "dist"` points every consumer at `<base-package>/dist`; `tsc --showConfig` reveals it as `../tsconfig-internal/dist`. Use the `${configDir}` template (TS 5.5+) so the path resolves per consuming project. tsdown builds were unaffected because tsdown sets its own output dir, which is why the bug went unnoticed.
Regression test: packages/tsconfig-internal/test/config-dir.test.mjs runs `tsc --showConfig` on a fixture that extends the base.
