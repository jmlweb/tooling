---
id: LRN-020
title: Bumping @types/node in the lockfile breaks jest-dom matcher types
status: active
tags: [pnpm, types, vitest, lockfile]
task: TSK-011
created: 2026-11-25
---

Adding @types/node with pnpm add pulled 26.6.7 and re-resolved every peer variant that includes @types/node (vitest, vite, jest-config). After that, type-aware lint in apps/example-react-typescript-app reported no-unsafe-call on toBeInTheDocument (jest-dom augmentation no longer matched the vitest instance). Using the version already in the lockfile (^26.6.5) kept the lockfile diff to 5 lines and lint green. Also: this machine exports NODE_ENV=production, which makes React tests fail with "React.act is not a function"; run tests with NODE_ENV= locally.
