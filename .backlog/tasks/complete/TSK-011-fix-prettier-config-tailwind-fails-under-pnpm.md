---
id: TSK-011
title: Fix: prettier-config-tailwind fails under pnpm: prettier-plugin-tailwindcss cannot be resolved from the consumer
status: complete
priority: P2
tags: []
created: 2026-11-23
source: report/RPT-011
depends-on: []
started: 2026-11-25
completed: 2026-11-25
---

# Fix: prettier-config-tailwind fails under pnpm: prettier-plugin-tailwindcss cannot be resolved from the consumer

## Description

### Context

From RPT-011. `packages/prettier-config-tailwind/src/index.ts:7` passes `prettier-plugin-tailwindcss` as a bare string. Prettier resolves it from the consumer, and pnpm does not hoist the dependency, so prettier fails with "Cannot find package 'prettier-plugin-tailwindcss'". The README says no separate install is needed.

### Approach

Resolve the plugin from the config package (imported module or absolute resolved path), for both ESM and CJS builds. Add a pnpm consumer integration test.

## Acceptance Criteria

- [x] A pnpm consumer that installs only the packed @jmlweb/prettier-config-tailwind and prettier formats a file without the Cannot find package prettier-plugin-tailwindcss error
- [x] Tailwind classes are sorted in that consumer, proving the plugin loads
- [x] Both the ESM and CJS builds of the config resolve the plugin from the config package
- [x] An integration test covers the pnpm consumer case
- [x] README install notes match the actual behaviour
- [x] Changeset added for @jmlweb/prettier-config-tailwind

## Notes

## Learnings

- LRN-017: In-process prettier format() masks consumer plugin resolution bugs
- LRN-018: TypeScript 6 defaults types to [], node: imports need types [node]
- LRN-019: turbo fails with Exec format error on the hustle box
- LRN-020: Bumping @types/node in the lockfile breaks jest-dom matcher types
## Progress Log

- [2026-11-23] Created
- [2026-11-25] Started
- [2026-11-25] criterion 1 — evidence: integration suite testTailwindPnpmConsumer (deps: packed tailwind config + prettier only, plugin not at consumer node_modules top level) → red before fix with "Cannot find package 'prettier-plugin-tailwindcss'", green after (2026-11-25)
- [2026-11-25] criterion 2 — evidence: node_modules/.bin/prettier index.html in pnpm consumer → output contains class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" (2026-11-25)
- [2026-11-25] criterion 3 — evidence: require('./dist/index.cjs').default.plugins and import('./dist/index.js') → both absolute path to the config's prettier-plugin-tailwindcss/dist/index.mjs; consumer test passes with .prettierrc.mjs and .prettierrc.cjs (2026-11-25)
- [2026-11-25] criterion 4 — evidence: full integration suite (run-tests.mjs, packages built with pnpm -r) → All integration tests passed, incl. pnpm consumer ESM+CJS (2026-11-25)
- [2026-11-25] criterion 5 — evidence: package README and docs site tailwind.mdx describe resolved plugin path and no separate install with npm/Yarn/pnpm; pnpm validate:docs → passed (2026-11-25)
- [2026-11-25] criterion 6 — evidence: .changeset/resolve-tailwind-plugin-path.md → '@jmlweb/prettier-config-tailwind': patch (2026-11-25)
- [2026-11-25] Completed