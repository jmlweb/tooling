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

## 🤔 Why Use This?

> **Philosophy**: Internal monorepo packages need consistent build configuration optimized for dual CJS/ESM output and fast bundler-based compilation.

This is a specialized internal configuration for building packages within this monorepo. It's designed specifically for packages that are compiled with tsup/esbuild and need to generate both CommonJS and ESM outputs with type declarations.

### Design Decisions

**Bundler-Optimized (`moduleResolution: "bundler"`)**: Designed for build tools

- **Why**: Internal packages are built with tsup (which uses esbuild), not executed directly by Node.js. Bundler resolution matches how esbuild resolves modules, preventing mismatches between TypeScript and the actual build output
- **Trade-off**: TypeScript output can't be run directly in Node.js. But internal packages are always compiled before use
- **When to override**: Never for internal packages - they're always bundled before publishing or consumption

**No File Inclusion Patterns**: Keeps configuration minimal

- **Why**: Each package in the monorepo has its own structure (some in src/, some in lib/). Not prescribing include/exclude patterns keeps this config flexible and minimal - each package specifies its own files
- **Trade-off**: Must define include in each package's tsconfig.json. But packages need custom includes anyway
- **When to override**: Never - add include patterns in individual package tsconfigs

**Declaration Generation Enabled**: Produces type definitions

- **Why**: Internal packages consumed by other packages or published to npm need TypeScript declaration files. Declaration generation is inherited from the base config
- **Trade-off**: Slightly slower builds due to .d.ts generation. But type safety for consumers is essential
- **When to override**: Never for internal packages meant to be consumed by TypeScript projects

## Purpose

This config is optimized for:

- Building packages with tsup/esbuild
- Dual CJS/ESM output
- Type declaration generation

**Note:** This is a private package, not published to npm. For consuming projects, use `@jmlweb/tsconfig-base` instead.

## 🔄 Migration Guide

### Upgrading to a New Version

> **Note:** If no breaking changes were introduced in a version, it's safe to upgrade without additional steps.

**No breaking changes have been introduced yet.** This package follows semantic versioning. When breaking changes are introduced, detailed migration instructions will be provided here.

For version history, see the [Changelog](./CHANGELOG.md).

**Need Help?** If you encounter issues during migration, please [open an issue](https://github.com/jmlweb/tooling/issues/new).

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
