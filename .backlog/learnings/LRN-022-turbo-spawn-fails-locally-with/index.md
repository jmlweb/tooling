---
id: LRN-022
title: turbo spawn fails locally with Exec format error; verify via pnpm -r
status: active
tags: [turbo, ci, local-env]
task: TSK-009
created: 2026-11-27
---

In this environment `turbo run <task>` fails with "Exec format error (os error 8)" when spawning package scripts, also on a clean main checkout. Run the same tasks with `pnpm -r --filter ... <script>` (and validate pieces format:check, lint:root, -r lint, syncpack:check) to verify locally. apps/example-react-typescript-app tests also fail on main with "React.act is not a function" (unrelated pre-existing).
