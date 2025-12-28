# Agent Guidelines

> **Note for Cursor**: Cursor automatically reads this `AGENTS.md` file. All rules and guidelines in this document are automatically applied when working in this project.

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
3. **Version Consistency**: Use syncpack to enforce consistent versions across the monorepo (see Version Syntax and Automation Tools below)
4. **Regular Updates**: Periodically review and update dependencies to maintain current stable versions (see Update Cadence below)
5. **Security**: Latest stable versions often include security patches, so staying current is important

#### Version Syntax

This project uses **syncpack** to enforce consistent versioning across the monorepo. The following rules are configured in `.syncpackrc.json`:

- **Caret ranges** (enforced by syncpack): `"dependency": "^1.2.3"`
  - Allows patch and minor updates (`>=1.2.3 <2.0.0`)
  - Used for all dev and prod dependencies
  - Provides automatic security patches and bug fixes
  - Maintains consistency across all packages in the monorepo

- **Workspace protocol**: `"dependency": "workspace:*"`
  - Used for internal package references (e.g., `@jmlweb/*` packages)
  - Automatically resolves to local workspace versions
  - Ignored by syncpack version checks

- **Peer dependencies**: `"peerDependency": "^1.2.3"` (broader ranges allowed)
  - Intentionally more flexible for compatibility with consumers
  - Ignored by syncpack to allow package-specific compatibility requirements

**Important**: Do not manually set version ranges. Syncpack automatically enforces the correct format when you run `pnpm syncpack:fix`.

#### Update Cadence

Maintain dependencies on a regular schedule to avoid large, risky updates:

- **Monthly**: Check for and apply patch version updates
  - Low risk, often security fixes
  - Run `pnpm outdated` and update patch versions

- **Quarterly**: Review and apply minor version updates
  - Medium risk, may include new features and deprecations
  - Test thoroughly before merging

- **As needed**: Evaluate major version updates
  - High risk, likely breaking changes
  - Plan dedicated time for testing and migration
  - Review changelog and migration guides

- **Immediately**: Apply critical security updates
  - Monitor security advisories
  - Use automated tools for vulnerability scanning

#### Automation Tools

This project uses **syncpack** to maintain version consistency across the monorepo. Use these commands:

```bash
# Check for version mismatches (runs in CI)
pnpm syncpack:check

# Fix version mismatches and format package.json files
pnpm syncpack:fix

# List all dependency mismatches
pnpm exec syncpack list-mismatches

# Update all dependencies to latest versions
pnpm exec syncpack update

# Check for outdated packages (fallback to pnpm)
pnpm outdated

# Check for security vulnerabilities
pnpm audit

# Fix security vulnerabilities automatically
pnpm audit --fix
```

**Recommended workflow for updating dependencies**:

1. Run `pnpm outdated` to see available updates
2. Review changelogs for major version changes
3. Update versions in package.json files manually or use `pnpm exec syncpack update`
4. Run `pnpm syncpack:fix` to ensure consistency across all packages
5. Run `pnpm build` and `pnpm test` to verify nothing broke
6. Run `pnpm validate` to ensure all checks pass
7. Commit changes with descriptive message

**Important**: Always run `pnpm syncpack:fix` after manually updating dependencies to ensure version consistency across the monorepo.

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

## File Organization Rules

### Descriptive File Names

File names must be descriptive and written in uppercase.

#### Requirements

- **Descriptive Names**: File names should clearly indicate their purpose and content
- **Uppercase Convention**: Use uppercase letters for file names (e.g., `AGENTS.md`, `SPECS.md`, `README.md`)
- **Clarity**: Avoid abbreviations unless they are widely understood and documented

#### Examples

- ✅ `AGENTS.md` - Clear and descriptive
- ✅ `SPECS.md` - Clear and descriptive
- ✅ `README.md` - Standard convention
- ❌ `agents.md` - Not uppercase
- ❌ `rules.md` - Not descriptive enough
- ❌ `doc.md` - Too generic

### File Size Management

When a file becomes very large, it must be divided into smaller, more manageable files.

#### Guidelines

1. **Size Threshold**: Consider splitting files when they exceed approximately 500-1000 lines or become difficult to navigate
2. **Logical Division**: Split files based on logical sections, topics, or functionality
3. **Maintain Structure**: Ensure the file structure remains organized and easy to navigate
4. **Update References**: Update any references or links to the split content

#### Process

When dividing a large file:

1. Identify logical sections that can be separated
2. Create new files with descriptive, uppercase names
3. Move content to appropriate new files
4. Update the original file to reference the new files
5. Update any cross-references in other files

### Avoid Duplicate Content

Duplicate content must be avoided. Instead, link to the content that needs to be referenced in another file.

#### Principles

1. **Single Source of Truth**: Maintain content in one location only
2. **Use Links**: Reference content using markdown links or file references
3. **Keep Updated**: When content changes, update it in the single source location

#### Best Practices

- **Cross-References**: Use markdown links to reference content in other files

  ```markdown
  For details, see [File Organization Rules](#file-organization-rules)
  ```

- **Include Statements**: For code or configuration, use import/export mechanisms rather than duplicating code

- **Documentation Links**: Link to relevant sections rather than copying content

#### Link Examples

- ✅ Link to existing content: `See [Package Naming Convention](#package-naming-convention)`
- ✅ Reference a section: `As specified in [General Rules](#general-rules)`
- ❌ Copying entire sections into multiple files
- ❌ Duplicating code examples across multiple documentation files

#### Enforcement

When creating or editing files:

- Check if similar content already exists before adding new content
- Use links to reference existing content instead of duplicating it
- If content must be duplicated for context, clearly mark it as a reference and link to the original source
- Regularly review files for duplicate content and consolidate when found

## Code Style and Formatting

This project uses shared configuration packages for consistent code style:

- **Prettier**: Use `@jmlweb/prettier-config-base` or `@jmlweb/prettier-config-tailwind` for formatting
- **ESLint**: Use `@jmlweb/eslint-config-base` for TypeScript projects (default) or `@jmlweb/eslint-config-base-js` for JavaScript-only projects

Follow the configurations defined in these packages. Do not override or modify formatting rules unless explicitly requested.

## Project Structure

This is a Turborepo monorepo with the following structure:

```text
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

## Package Development

For detailed guidelines on creating, developing, and maintaining packages, see [`docs/PACKAGE-GUIDELINES.md`](docs/PACKAGE-GUIDELINES.md).

**Key Points:**

- Follow naming convention: `@jmlweb/{tool}-config-{variant}`
- Use semantic versioning (semver)
- Extend base packages rather than duplicating
- Follow package.json structure guidelines
- Use tsup for TypeScript packages
- Extend `@jmlweb/tsconfig-internal` for TypeScript configs
- Create README following standard structure (see [`packages/AGENTS.md`](packages/AGENTS.md))

For detailed package development guidelines including package.json structure, build system, dependency management, TypeScript configuration, and pre-publish validation, see [`docs/PACKAGE-GUIDELINES.md`](docs/PACKAGE-GUIDELINES.md).

## README Standards

All package READMEs must follow a standardized structure for consistency and maintainability.

### Standard Structure

Package READMEs follow a specific section order and formatting. For complete guidelines, see [`packages/AGENTS.md`](packages/AGENTS.md).

**Key Requirements:**

- Use standardized section order (Title, Description, Features, Installation, etc.)
- Include all required sections
- Use consistent emoji prefixes for sections
- Provide complete, runnable code examples
- Link to related packages using relative paths
- Document peer dependencies clearly
- Include Node.js version requirements

### Creating READMEs

When creating a new package README:

1. Reference [`packages/AGENTS.md`](packages/AGENTS.md) for the complete structure
2. Use existing package READMEs as examples
3. Ensure all code examples are tested and working
4. Verify all links are correct
5. Match formatting style of other packages

## Publishing and Versioning

For detailed guidelines on publishing packages, versioning, changelog management, and commit conventions, see [`docs/PUBLISHING-GUIDELINES.md`](docs/PUBLISHING-GUIDELINES.md).

**Key Points:**

- Use Changesets for versioning and changelog generation
- Follow Conventional Commits format
- Publishing is handled automatically by CI
- Create changesets before merging PRs

## Documentation Maintenance

When making changes to the codebase, documentation must be kept up to date. This is a critical rule to ensure the project remains well-documented and maintainable.

### When to Update Documentation

Documentation updates are **required** when:

1. **Creating a new package**: Update all relevant documentation:
   - Add package to `README.md` (packages table, compatibility matrix, analytics table)
   - Add package to `docs/SPECS.md` (packages section, project structure, future considerations)
   - Add package scope to `commitlint-config` if not already present
   - Update `apps/README.md` if the package is used in any example app

2. **Modifying an existing package**: Update affected documentation:
   - Update package README if functionality changes
   - Update related example apps if usage patterns change
   - Update root README if package description changes

3. **Adding example applications**: Update `apps/README.md` with the new example

4. **Changing project configuration**: Update relevant documentation files

### Documentation Files Checklist

When creating a new package, ensure these files are updated:

| File                                      | Update Required                                        |
| ----------------------------------------- | ------------------------------------------------------ |
| `README.md`                               | Add to packages table, compatibility matrix, analytics |
| `docs/SPECS.md`                           | Add package description, update structure              |
| `packages/commitlint-config/src/index.ts` | Add package scope                                      |
| `packages/commitlint-config/README.md`    | Add scope to documentation                             |
| `apps/README.md`                          | If package is used in examples                         |

### Enforcement

- Before marking a package as complete, verify all documentation is updated
- PR reviewers should check that documentation changes accompany code changes
- Stale documentation creates confusion and maintenance burden

## Additional Guidelines

- Always check existing packages before creating new ones to avoid duplication
- Extend base configurations rather than duplicating them
- Maintain consistency across all packages
- Update documentation when making changes (see [Documentation Maintenance](#documentation-maintenance))
- Test packages before publishing

## Related Documentation

For more detailed information, see:

- **Package Development**: [`docs/PACKAGE-GUIDELINES.md`](docs/PACKAGE-GUIDELINES.md) - Creating packages, structure, build system, dependencies
- **Publishing**: [`docs/PUBLISHING-GUIDELINES.md`](docs/PUBLISHING-GUIDELINES.md) - Versioning, changelogs, commits
- **README Standards**: [`packages/AGENTS.md`](packages/AGENTS.md) - Package README structure and formatting
- **Rules Index**: [`docs/RULES-INDEX.md`](docs/RULES-INDEX.md) - Overview of all rules and guidelines
