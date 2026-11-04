---
id: LRN-005
title: Unit tests in config packages: node:test .mjs under test/, not .ts in src
status: active
tags: [testing, node-test, oxlint, tsdown-config-base]
task: TSK-002
created: 2026-11-04
---

No package had unit tests. A `src/*.test.ts` fails tsc (no @types/node, `.ts` import needs allowImportingTsExtensions) and is linted type-aware. A `test/*.test.mjs` importing `../src/index.ts` runs on Node >=22.18 type stripping with no new deps. Root lint:root covers it and `no-floating-promises` fires on bare describe/it: use top-level `await test(...)` with `await t.test(...)` subtests. turbo's test inputs needed `test/**`. CI does not run `pnpm test`, only integration tests.
