# Agent Guidelines

This document contains guidelines and rules for AI agents working on this project. These rules apply to all AI assistants including Claude Code, Cursor, and other development agents.

## Project Overview

This is a monorepo built with Turborepo to centralize and share personal configuration packages for development tools. The goal is to maintain consistent code formatting, linting, and TypeScript configuration across multiple projects by publishing reusable configuration packages.

## General Rules

### Documentation Language

All documentation in this project must be written in English.

#### Scope

This rule applies to:

- README files (README.md, README.txt, etc.)
- Specification documents (SPECS.md, SPEC.md, etc.)
- Documentation files in the `docs/` directory
- Code comments within documentation files
- Any other markdown or text documentation files

#### Exceptions

Code comments within source code files (`.ts`, `.js`, `.tsx`, `.jsx`, etc.) may be in any language, though English is preferred for consistency.

#### Enforcement

When creating or editing documentation files, ensure all content is in English. This applies to both human-written and AI-generated documentation.

### Use Latest Stable Versions

Always use the latest stable versions of tools and packages for internal development and dependencies.

#### Scope

This rule applies to:

- Node.js and runtime versions
- Package dependencies (in `package.json` files)
- Development tools (Turborepo, Prettier, ESLint, TypeScript, etc.)
- Build tools and bundlers
- Testing frameworks
- Any other development dependencies

#### Guidelines

1. **Check for Updates**: Before adding or updating dependencies, check for the latest stable version
2. **Stable Versions Only**: Use stable releases, avoid beta, alpha, or release candidate versions unless specifically required
3. **Version Pinning**: While using latest stable versions, pin exact versions in `package.json` for reproducibility
4. **Regular Updates**: Periodically review and update dependencies to maintain current stable versions
5. **Security**: Latest stable versions often include security patches, so staying current is important

#### Published Packages Node.js Compatibility

All exported packages must be compatible with all Node.js versions that are still supported by the Node.js project.

##### Requirements

- **Check Node.js Support**: Verify which Node.js versions are currently in Active LTS, Maintenance LTS, or Current release status
- **Minimum Version**: Set the `engines.node` field in `package.json` to the oldest supported Node.js version
- **Testing**: Test packages against all supported Node.js versions to ensure compatibility
- **Documentation**: Document Node.js version requirements in package README files

##### Node.js Support Lifecycle

- **Active LTS**: Fully supported with regular updates
- **Maintenance LTS**: Security updates only
- **Current**: Latest features, but may not be stable

Packages should support at minimum all Active LTS versions, and ideally all Maintenance LTS versions as well.

#### Exceptions

- If a specific version is required for compatibility reasons, document why
- If a newer stable version introduces breaking changes that require significant refactoring, evaluate the trade-off
- For published packages, consider compatibility with consumers when updating major versions

#### Enforcement

When adding new dependencies or updating existing ones:

- Verify the latest stable version is available
- Use exact version numbers (avoid `^` or `~` unless there's a specific reason)
- Document any exceptions to this rule
- Update dependencies regularly to maintain security and compatibility

When creating or updating published packages:

- Verify Node.js compatibility requirements
- Set appropriate `engines.node` field in `package.json`
- Test against all supported Node.js versions
- Update compatibility requirements as Node.js versions reach end-of-life

## Code Style and Formatting

This project uses shared configuration packages for consistent code style:

- **Prettier**: Use `@jmlweb/prettier-config-base` or `@jmlweb/prettier-config-tailwind` for formatting
- **ESLint**: Use `@jmlweb/eslint-config-base` for TypeScript projects (default) or `@jmlweb/eslint-config-base-js` for JavaScript-only projects

Follow the configurations defined in these packages. Do not override or modify formatting rules unless explicitly requested.

## Project Structure

This is a Turborepo monorepo with the following structure:

```
jmlweb-tooling/
├── packages/          # Publishable configuration packages
├── apps/              # Test applications (e.g., test-app)
├── docs/              # Project documentation
├── turbo.json         # Turborepo configuration
├── package.json       # Root workspace configuration
└── AGENTS.md          # This file
```

Each package in `packages/` is a standalone npm package that can be published independently under the `@jmlweb` scope.

## Package Naming Convention

All packages follow the pattern: `@jmlweb/{tool}-config-{variant}`

Examples:

- `@jmlweb/prettier-config-base`
- `@jmlweb/prettier-config-tailwind`
- `@jmlweb/eslint-config-base` (TypeScript, default)
- `@jmlweb/eslint-config-base-js` (JavaScript-only)

## Versioning

All packages follow semantic versioning (semver):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Creating New Packages

When creating a new configuration package:

1. **Check for existing base packages** to extend rather than duplicate
2. **Follow naming convention**: `@jmlweb/{tool}-config-{variant}`
3. **Create minimal structure**:

   ```text
   packages/{package-name}/
   ├── index.js       # Configuration export
   ├── package.json   # Package metadata
   └── README.md      # Usage documentation
   ```

4. **Set appropriate `engines.node`** based on features used
5. **Use `workspace:*`** for internal dependencies
6. **Add peer dependencies** for tools the config requires

## Testing Guidelines

Before publishing or committing:

1. **Verify configuration works** by installing in a test project
2. **Check inheritance** works correctly for extending configs
3. **Validate peer dependencies** are correctly specified
4. **Test on minimum Node.js version** specified in `engines`

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

## Additional Guidelines

- Always check existing packages before creating new ones to avoid duplication
- Extend base configurations rather than duplicating them
- Maintain consistency across all packages
- Update documentation when making changes
- Test packages before publishing
