# @jmlweb/tsconfig-internal

Internal TypeScript configuration for building packages in the monorepo.

## Usage

In your package's `tsconfig.json`:

```json
{
  "extends": "@jmlweb/tsconfig-internal",
  "include": ["src"]
}
```

## Purpose

This config is optimized for:

- Building packages with tsup/esbuild
- Dual CJS/ESM output
- Type declaration generation

**Note:** This is a private package, not published to npm. For consuming projects, use `@jmlweb/tsconfig-base` instead.
