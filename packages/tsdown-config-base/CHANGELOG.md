# @jmlweb/tsdown-config-base

## 0.2.2

### Patch Changes

- 8c18e15: Declare the exported options types with `type` instead of `interface`. Their shape is unchanged; only declaration merging into them is no longer possible. `@jmlweb/jest-config` also omits `setupFilesAfterEnv` and `moduleNameMapper` without deleting keys, with the same resulting config.

## 0.2.1

### Patch Changes

- 10953eb: Fix `createTsdownCliConfig` emitting two shebang lines (a syntax error) when an entry's source file already starts with one. Such entries now keep their own shebang and the preset no longer adds another.

## 0.2.0

### Minor Changes

- 8788263: Accept every tsdown option at the top level of `createTsdownConfig` and `createTsdownCliConfig`, so a config reads like a plain tsdown config (`deps`, `sourcemap`, `target`, ...). The `options` field keeps working but is deprecated; setting the same key both at the top level and in `options` throws a `TsdownConfigError`.
- 8788263: Align the presets with the supported Node.js versions and with tsdown's own option names:

  - `createTsdownCliConfig` no longer defaults `target` to `node18`. tsdown now infers it from `engines.node`, like the base preset. Pass `target` to pin a version.
  - Both presets set `checks.legacyCjs: false`, since dual CJS/ESM output is intentional and every supported Node.js version triggers the warning. Pass `options: { checks: { legacyCjs: true } }` to restore it.
  - Deprecate the `external` option in favor of tsdown's own `options.deps.neverBundle`, which is now accepted. `external` keeps working and is still mapped to `deps.neverBundle`, but passing both throws a `TsdownConfigError`.

## 0.1.1

### Patch Changes

- 4e175ad: Build with tsdown via `@jmlweb/tsdown-config-base` instead of tsup. The published output is equivalent: same files, exports and type declarations.

## 0.1.0

### Minor Changes

- 561285e: Add `@jmlweb/tsdown-config-base`, the tsdown successor to `@jmlweb/tsup-config-base`. It exposes `createTsdownConfig` and `createTsdownCliConfig` with the same options as the tsup helpers, maps `external` to tsdown's `deps.neverBundle`, and keeps tsup's output file names (`.js`/`.cjs`/`.d.ts`/`.d.cts`) by disabling `fixedExtension`.
