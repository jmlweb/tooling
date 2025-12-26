# Publishing Guidelines

> **Note for Cursor**: This file is referenced by `AGENTS.md`. For complete publishing rules, see both this file and [`AGENTS.md`](../AGENTS.md).

This document contains detailed guidelines for publishing packages to npm.

## Publishing Workflow

Packages are published to npm under the `@jmlweb` scope using [Changesets](https://github.com/changesets/changesets) for automated versioning and changelog generation.

### Versioning Process

1. **Create a changeset**: After making changes, run `pnpm changeset` to create a changeset file describing the changes
2. **Commit changes**: Commit both your code changes and the changeset file
3. **Merge PR**: When the PR is merged to `main`, the CI workflow automatically:
   - Runs `changeset version` to bump package versions and generate changelogs
   - Commits the version changes
   - Publishes packages with new versions to npm

### Manual Commands

- `pnpm changeset` - Create a new changeset interactively
- `pnpm version` - Manually version packages (usually done by CI)
- `pnpm version:snapshot` - Create a snapshot version for testing

### Publishing

Publishing is handled automatically by the GitHub Actions workflow when:

- Changes are merged to `main`
- Changesets exist
- Packages have new versions not yet published to npm

The workflow:

1. Versions packages based on changesets
2. Detects which packages need publishing
3. Builds and publishes each package to npm
4. Creates git tags for each published package version

### Workflow Documentation

For detailed information about the publishing workflow, see `.github/workflows/publish.yml`.

## Changelog Management

Changelogs are automatically generated and managed using [Changesets](https://github.com/changesets/changesets). Each package has its own `CHANGELOG.md` file that is automatically created and updated when packages are versioned.

### Automatic Changelog Generation

- **Location**: `CHANGELOG.md` files are created in each package directory (e.g., `packages/prettier-config-base/CHANGELOG.md`)
- **Generation**: Changelogs are automatically generated when running `pnpm changeset version` (done automatically by CI)
- **Format**: Uses Changesets' standard changelog format with version headers and grouped changes
- **Publishing**: CHANGELOG.md files are included in published packages (automatically included by npm)

### Documenting Changes

When creating a changeset with `pnpm changeset`:

1. **Select affected packages**: Choose which packages are affected by your changes
2. **Choose version bump type**:
   - **Patch** (bug fixes that don't change behavior)
   - **Minor** (new features, backward compatible)
   - **Major** (breaking changes)
3. **Write a summary**: Describe the changes in the changeset file

### Breaking Changes

To document breaking changes:

1. When prompted during `pnpm changeset`, select **Major** version bump
2. In the changeset description, clearly explain:
   - What changed
   - Why it changed
   - How to migrate (if applicable)

Example changeset for a breaking change:

```markdown
---
'@jmlweb/eslint-config-base': major
---

Changed TypeScript strictness rules. Some previously allowed code patterns are now flagged as errors.

Migration: Update TypeScript code to fix new ESLint errors, or temporarily disable specific rules if needed.
```

### Changelog Format

Changelogs follow this format:

```markdown
# @jmlweb/package-name

## 1.2.0

### Minor Changes

- Added new rule for consistent imports

### Patch Changes

- Fixed formatting issue in config

## 1.1.0

### Major Changes

- **BREAKING**: Changed default behavior for TypeScript strict mode
```

The changelog clearly separates:

- **Major Changes**: Breaking changes that require a major version bump
- **Minor Changes**: New features or enhancements
- **Patch Changes**: Bug fixes and non-breaking changes

### Viewing Changelogs

- **Local**: Check `packages/{package-name}/CHANGELOG.md` in the repository
- **Published**: CHANGELOG.md files are included in published npm packages
- **GitHub**: View changelog history in the repository

## Commit Conventions

Follow Conventional Commits format:

- `feat(package-name):` New features or packages
- `fix(package-name):` Bug fixes
- `docs:` Documentation changes
- `chore:` Maintenance tasks

Examples:

```text
feat(eslint-config-base): add strict type checking rules
fix(prettier-config-tailwind): resolve plugin loading issue
docs: update README with package table
```

## Pre-publish Checklist

Before publishing, ensure:

- [ ] All tests pass
- [ ] Package validation passes (`node scripts/validate-package.mjs`)
- [ ] Documentation is up to date
- [ ] Changeset is created
- [ ] Version number is correct
- [ ] Peer dependencies are documented
- [ ] README follows standard structure
- [ ] Build output is correct
- [ ] No sensitive information in published files
