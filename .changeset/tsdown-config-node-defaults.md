---
'@jmlweb/tsdown-config-base': minor
---

Align the presets with the supported Node.js versions:

- `createTsdownCliConfig` no longer defaults `target` to `node18`. tsdown now infers it from `engines.node`, like the base preset. Pass `target` to pin a version.
- Both presets set `checks.legacyCjs: false`, since dual CJS/ESM output is intentional and every supported Node.js version triggers the warning. Pass `options: { checks: { legacyCjs: true } }` to restore it.
