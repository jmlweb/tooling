---
id: RPT-011
title: prettier-config-tailwind fails under pnpm: prettier-plugin-tailwindcss cannot be resolved from the consumer
type: bug
severity: high
status: triaged
created: 2026-11-23
triaged: 2026-11-23
task-id: TSK-011
---

## Location

- `packages/prettier-config-tailwind/src/index.ts:7` sets `plugins: ['prettier-plugin-tailwindcss']`, a bare string.
- `packages/prettier-config-tailwind/README.md:15` and `:123` claim the plugin is bundled as a regular dependency and "needs no separate install".

## Problem

Prettier resolves a bare plugin string from the consumer project, not from the config package. pnpm's strict layout installs `prettier-plugin-tailwindcss` only under `node_modules/.pnpm/`, so the consumer cannot resolve it. Prettier then aborts on every file. npm hoisting masks the bug.

## Reproduction

```sh
T=$(mktemp -d)
(cd packages/prettier-config-base && pnpm pack --pack-destination $T)
(cd packages/prettier-config-tailwind && pnpm pack --pack-destination $T)
cd $T
# package.json: {"type":"module","prettier":"@jmlweb/prettier-config-tailwind",
#   "pnpm":{"overrides":{"@jmlweb/prettier-config-base":"file:./jmlweb-prettier-config-base-2.0.2.tgz"}}}
pnpm add prettier@3 ./jmlweb-prettier-config-tailwind-2.0.2.tgz ./jmlweb-prettier-config-base-2.0.2.tgz
echo '<div class="p-4 flex">x</div>' > a.html
npx prettier a.html
```

Observed output (prettier 3.10.1):

```text
[error] Cannot find package 'prettier-plugin-tailwindcss' imported from /tmp/tmp.4QzzYWypRs/noop.js
```

`ls node_modules/.pnpm` shows `prettier-plugin-tailwindcss@0.8.1_prettier@3.10.1` is installed. It is only missing from the top-level `node_modules`.

## Fix direction

Resolve the plugin from the config package itself rather than from the consumer. For example, pass the imported plugin module or an absolute path resolved with `import.meta.resolve`/`require.resolve`. Both the ESM and the CJS build must work. Add a pnpm consumer check (integration test) that formats a file with the packed config.
