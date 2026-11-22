---
id: LRN-014
title: babel-jest only instruments files inside process.cwd(): chdir into temp projects for runCLI coverage tests
status: active
tags: [jest, jest-config, babel-jest, testing, node-test, pnpm]
task: TSK-005
created: 2026-11-21
---

Once `.js` files go through babel-jest, a `runCLI` coverage test on a temp project outside the repo reports zero covered files while its tests pass. babel-jest passes `cwd: config.cwd` to babel-plugin-istanbul, and files outside that directory are not instrumented. `config.cwd` comes from `process.cwd()`, and passing `cwd` in the JSON config is ignored. Fix: `process.chdir(projectDir)` around `runCLI`, restored in `finally`. Jest's own instrumentation (no transformer) did not have this limit, so ts-jest-only configs never showed it.

Also: under pnpm, `babel-jest` is only a transitive dependency of Jest, so a bare `'babel-jest'` transform entry does not resolve from a consumer (or from this package) unless it is declared. It must be a peer and a devDependency. In tests, resolve every transform entry by its own module name, because the string entries break `[, options]` destructuring.
