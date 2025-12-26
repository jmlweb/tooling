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
   ├── src/
   │   └── index.ts   # Configuration export (TypeScript)
   ├── package.json   # Package metadata
   ├── tsconfig.json # TypeScript configuration
   ├── tsup.config.ts # Build configuration (if needed)
   └── README.md      # Usage documentation
   ```

4. **Set appropriate `engines.node`** based on features used
5. **Use `workspace:*`** for internal dependencies
6. **Add peer dependencies** for tools the config requires
7. **Follow package.json structure guidelines** (see below)
8. **Configure build system** if package requires compilation (see below)
9. **Set up TypeScript configuration** (see below)
10. **Create README** following standard structure (see [README Standards](#readme-standards))

## Package.json Structure

All packages must follow a consistent `package.json` structure to ensure proper publishing and consumption.

### Required Fields

The following fields are required for all published packages:

- `name`: Must follow `@jmlweb/{tool}-config-{variant}` pattern
- `version`: Must follow semantic versioning (e.g., `1.0.0`)
- `description`: Clear, concise description of the package
- `author`: Package author (use `"jmlweb"`)
- `license`: Always `"MIT"`
- `repository`: Object with `type: "git"` and `url` pointing to GitHub repository
- `files`: Array of files/directories to include in published package (typically `["dist", "README.md", "CHANGELOG.md"]`)

### Recommended Fields

These fields are recommended but not strictly required:

- `engines.node`: Minimum Node.js version (e.g., `">=18.0.0"`)
- `keywords`: Array of keywords for npm search
- `bugs`: Object with `url` pointing to GitHub issues
- `homepage`: URL to package README on GitHub

### Package Exports

All packages that export code must use the modern `exports` field for dual ESM/CJS support:

```json
{
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      },
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  }
}
```

This structure ensures:

- CommonJS compatibility via `require`
- ESM compatibility via `import`
- TypeScript type definitions for both module systems
- Proper resolution for both `.js` and `.ts` consumers

### Files Field

The `files` field controls what gets published to npm. Always include:

- `dist`: Built output directory (if package requires building)
- `README.md`: Package documentation
- `CHANGELOG.md`: Version history (auto-generated by Changesets)

Do not include:

- Source files (`src/`)
- Build configuration (`tsup.config.ts`, `tsconfig.json`)
- Development dependencies
- Test files

### Publish Configuration

All packages must include:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

This ensures packages are published as public packages under the `@jmlweb` scope.

## Build System

Packages that require TypeScript compilation or bundling use `tsup` as the build tool.

### When to Use tsup

Use `tsup` when:

- Package is written in TypeScript
- Package needs to support both ESM and CommonJS
- Package needs type definitions generated

Do not use `tsup` when:

- Package is pure JavaScript with no compilation needed
- Package is a configuration file (e.g., `tsconfig.json`)

### tsup Configuration

Create a `tsup.config.ts` file in the package root:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  external: [
    // List all peer dependencies and workspace dependencies
    '@jmlweb/related-package',
    'peer-dependency',
  ],
});
```

**Key Configuration Options:**

- `entry`: Source file(s) to build
- `format`: Output formats (`['cjs', 'esm']` for dual support)
- `dts`: Generate TypeScript declaration files
- `clean`: Clean output directory before building
- `outDir`: Output directory (always `dist`)
- `external`: Dependencies that should not be bundled (always include peer dependencies and workspace dependencies)

### Build Scripts

All packages with a build step should include:

```json
{
  "scripts": {
    "build": "tsup",
    "clean": "rm -rf dist",
    "prepublishOnly": "node ../../scripts/validate-package.mjs && pnpm build"
  }
}
```

The `prepublishOnly` hook ensures:

- Package validation runs before publishing
- Build step executes before publishing
- Only valid, built packages are published

## Dependency Management

Understanding when to use `dependencies`, `devDependencies`, and `peerDependencies` is crucial for proper package configuration.

### Dependencies

Use `dependencies` for:

- **Workspace dependencies**: Other packages in this monorepo (use `workspace:*`)
- **Runtime dependencies**: Packages that are bundled with your package

**Example:**

```json
{
  "dependencies": {
    "@jmlweb/eslint-config-base-js": "workspace:*"
  }
}
```

### DevDependencies

Use `devDependencies` for:

- **Build tools**: `tsup`, `typescript`
- **Development tools**: `prettier`, `eslint` (when used for development)
- **Type definitions**: `@types/*` packages
- **Testing tools**: Test frameworks and utilities
- **Peer dependencies**: Include peer dependencies here for development/testing

**Example:**

```json
{
  "devDependencies": {
    "@jmlweb/tsconfig-internal": "workspace:*",
    "tsup": "^8.5.1",
    "typescript": "^5.9.3",
    "eslint": "^9.0.0"
  }
}
```

### Peer Dependencies

Use `peerDependencies` for:

- **Required runtime dependencies**: Tools that consumers must install (e.g., `prettier`, `eslint`, `typescript`)
- **Version ranges**: Use caret (`^`) to allow compatible versions

**Example:**

```json
{
  "peerDependencies": {
    "prettier": "^3.0.0",
    "eslint": "^9.0.0"
  }
}
```

**Important:**

- Peer dependencies are not installed automatically
- Consumers must install peer dependencies themselves
- Always include peer dependencies in `devDependencies` for local development
- Document peer dependencies in package README

### Workspace Dependencies

For internal dependencies within the monorepo, use `workspace:*`:

```json
{
  "dependencies": {
    "@jmlweb/base-package": "workspace:*"
  },
  "devDependencies": {
    "@jmlweb/tsconfig-internal": "workspace:*"
  }
}
```

This ensures:

- Packages reference the local workspace version during development
- CI/CD handles version resolution during publishing
- No version conflicts in the monorepo

## TypeScript Configuration

All TypeScript packages should extend `@jmlweb/tsconfig-internal` for consistent configuration.

### tsconfig.json Structure

```json
{
  "extends": "@jmlweb/tsconfig-internal/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Key Points:**

- Always extend `@jmlweb/tsconfig-internal` for consistency
- Set `outDir` to `./dist` to match build output
- Include only source files in `include` (typically `src/**/*`)
- Exclude `node_modules` and `dist` directories

### TypeScript as DevDependency

TypeScript should be a `devDependency`, not a peer dependency, since:

- TypeScript is only needed for building the package
- Consumers don't need TypeScript to use the compiled package
- Type definitions are included in the published package

## Pre-publish Validation

All packages are validated before publishing using the `validate-package.mjs` script.

### Validation Checks

The validation script verifies:

- **Required fields**: All required `package.json` fields are present
- **Name format**: Package name follows `@jmlweb/` pattern
- **Version format**: Version follows semantic versioning
- **File existence**: Files listed in `files` field exist
- **README**: README.md exists
- **Build outputs**: Main, module, and types files exist (or will be created by build)
- **Exports structure**: Exports field is properly structured
- **Repository structure**: Repository field has correct format

### Using Validation

Validation runs automatically via the `prepublishOnly` hook:

```json
{
  "scripts": {
    "prepublishOnly": "node ../../scripts/validate-package.mjs && pnpm build"
  }
}
```

You can also run validation manually:

```bash
node scripts/validate-package.mjs packages/package-name
```

### Validation Errors

If validation fails:

- Fix all errors before publishing
- Warnings are informational but don't block publishing
- Common issues: missing fields, incorrect file paths, invalid version format

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
