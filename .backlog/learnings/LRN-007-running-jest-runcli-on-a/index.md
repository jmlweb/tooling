---
id: LRN-007
title: Running jest runCLI on a temp project: resolve ts-jest absolutely and drop global-only options
status: active
tags: [jest, jest-config, testing, node-test]
task: TSK-003
created: 2026-11-07
---

A temp project outside the repo has no node_modules, so the default `ts-jest` transform fails validation ("Module ts-jest in the transform option was not found"). Pass `createRequire(import.meta.url).resolve('ts-jest')` as the transform path. `runCLI(argv, [projectDir])` treats the config as a project config and warns about `coverageThreshold` and `coverageReporters`; strip them from the config object. Also: `pnpm build` (turbo) failed here with "Exec format error (os error 8)" when spawning tasks; `pnpm -r --filter './packages/*' run build` works.
