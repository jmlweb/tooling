---
id: LRN-013
title: Local verification on hustle: turbo spawn fails and NODE_ENV=production breaks React tests
status: active
tags: [turbo, ci, testing, environment]
task: TSK-008
created: 2026-11-19
---

On the hustle maintainer machine, `pnpm build` (turbo 2.11.11) fails for tsdown-config-base and docs with "unable to spawn child process: Exec format error (os error 8)". `pnpm -r run build` builds every package fine, so the failure is turbo's process spawn, not the code.

The shell also exports NODE_ENV=production. That makes React load its production build, and @testing-library fails with "TypeError: React.act is not a function" in apps/example-react-typescript-app. Run tests with `env -u NODE_ENV` before treating that as a regression.

To run only the tsconfig integration suite without the full turbo build: import packPackages, createTestEnvironment, cleanupTestEnvironment from scripts/utils.mjs and call testTSConfigs(packed) from a scratch script.
