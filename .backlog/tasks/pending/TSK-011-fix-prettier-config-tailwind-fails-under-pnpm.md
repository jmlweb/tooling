---
id: TSK-011
title: Fix: prettier-config-tailwind fails under pnpm: prettier-plugin-tailwindcss cannot be resolved from the consumer
status: pending
priority: P2
tags: []
created: 2026-11-23
source: report/RPT-011
depends-on: []
---

# Fix: prettier-config-tailwind fails under pnpm: prettier-plugin-tailwindcss cannot be resolved from the consumer

## Description

### Context

From RPT-011. `packages/prettier-config-tailwind/src/index.ts:7` passes `prettier-plugin-tailwindcss` as a bare string. Prettier resolves it from the consumer, and pnpm does not hoist the dependency, so prettier fails with "Cannot find package 'prettier-plugin-tailwindcss'". The README says no separate install is needed.

### Approach

Resolve the plugin from the config package (imported module or absolute resolved path), for both ESM and CJS builds. Add a pnpm consumer integration test.

## Acceptance Criteria

- [ ] A pnpm consumer that installs only the packed @jmlweb/prettier-config-tailwind and prettier formats a file without the Cannot find package prettier-plugin-tailwindcss error
- [ ] Tailwind classes are sorted in that consumer, proving the plugin loads
- [ ] Both the ESM and CJS builds of the config resolve the plugin from the config package
- [ ] An integration test covers the pnpm consumer case
- [ ] README install notes match the actual behaviour
- [ ] Changeset added for @jmlweb/prettier-config-tailwind

## Notes

## Learnings

## Progress Log

- [2026-11-23] Created