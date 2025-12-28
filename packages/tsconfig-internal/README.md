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
