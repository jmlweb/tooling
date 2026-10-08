---
'@jmlweb/tsdown-config-base': minor
---

Align the presets with the supported Node.js versions and with tsdown's own option names:

- `createTsdownCliConfig` no longer defaults `target` to `node18`. tsdown now infers it from `engines.node`, like the base preset. Pass `target` to pin a version.
- Both presets set `checks.legacyCjs: false`, since dual CJS/ESM output is intentional and every supported Node.js version triggers the warning. Pass `options: { checks: { legacyCjs: true } }` to restore it.
- Deprecate the `external` option in favor of tsdown's own `options.deps.neverBundle`, which is now accepted. `external` keeps working and is still mapped to `deps.neverBundle`, but passing both throws a `TsdownConfigError`.
