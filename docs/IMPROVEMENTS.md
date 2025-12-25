# Improvement Opportunities

This document outlines pragmatic improvement opportunities for the jmlweb-tooling monorepo. These are actionable suggestions that would add value to the project.

## High Priority

### ~~1. Complete Package Metadata~~ ✅

**Status**: Completed

All package.json files now include:

- `author`: "jmlweb"
- `repository.url`: pointing to GitHub monorepo
- `bugs.url`: link to GitHub issues
- `homepage`: link to each package's README

### ~~2. Testing & Validation Setup~~ ✅

**Status**: Completed

A test app has been created in `apps/test-app/` with validation scripts that verify:

- Packages can be installed and imported correctly
- Configuration inheritance works as expected
- Formatting/linting actually applies the rules

The `test` script has been added to root package.json and turbo.json pipeline.

### ~~3. CI/CD Pipeline~~ ✅

**Status**: Completed

GitHub Actions workflows have been set up:

- **CI workflow** (`.github/workflows/ci.yml`):
  - Runs linting and formatting checks on PRs
  - Validates package.json files
  - Builds and tests packages
  - Validates package publishing readiness

- **Publish workflow** (`.github/workflows/publish.yml`):
  - Automatically detects packages that need publishing
  - Supports dry-run mode for testing
  - Publishes packages to npm on version bumps
  - Creates git tags for releases

### ~~4. Update README Package Table~~ ✅

**Status**: Completed

`@jmlweb/tsconfig-base` has been added to the packages table in README.md.

## Medium Priority

### 5. Versioning & Publishing Automation

**Current State**: Manual versioning and publishing process.

**Impact**: Risk of version inconsistencies and manual errors.

**Suggestion**:

- Consider using tools like:
  - `changesets` for coordinated versioning across packages
  - `release-please` for automated version bumps and changelogs
- Add npm scripts for version bumping and publishing
- Document the publishing workflow

### 6. Pre-publish Validation

**Current State**: No checks before publishing packages.

**Impact**: Could publish broken or incomplete packages.

**Suggestion**:

- Add `prepublishOnly` script to each package that:
  - Validates package.json structure
  - Ensures required files are included
  - Runs any package-specific validation
- Add root-level script to validate all packages before publishing

### 7. Changelog Management

**Current State**: No changelog or version history tracking.

**Impact**: Users can't easily see what changed between versions.

**Suggestion**:

- Add CHANGELOG.md files (per package or root-level)
- Use conventional commits to auto-generate changelogs
- Document breaking changes clearly

### 8. Package Documentation Consistency

**Current State**: Each package has a README, but structure may vary.

**Impact**: Inconsistent developer experience when using packages.

**Suggestion**:

- Standardize README structure across all packages:
  - Installation instructions
  - Usage examples
  - Configuration options
  - Migration guides (for breaking changes)
- Consider a README template

## Low Priority

### ~~9. Development Scripts Enhancement~~ ✅

**Status**: Completed

All suggested scripts have been implemented:

- `npm run validate` - Run all validation checks ✅
- `npm run clean` - Clean build artifacts ✅
- `npm run check` - Type check ✅
- `npm run prepare` - Setup hooks for git/npm ✅

### 10. TypeScript Support for Config Files

**Current State**: Config files are TypeScript (`.ts`) and compiled to JavaScript/CJS.

**Impact**: Type safety is already implemented for configuration exports.

**Status**: ✅ Implemented - All config packages use TypeScript source files with proper type definitions.

### 11. Package Size Optimization

**Current State**: Packages include README.md in `files` field.

**Impact**: README is good for npm, but could optimize what's published.

**Suggestion**:

- Review `files` field in each package.json
- Ensure only necessary files are published
- Consider `.npmignore` if needed (though `files` is preferred)

### 12. Node.js Version Documentation

**Current State**: Different packages have different Node.js requirements (18.0.0 vs 20.11.0).

**Impact**: Users might be confused about which Node version to use.

**Suggestion**:

- Document Node.js version requirements clearly in README
- Explain why different packages have different requirements
- Consider a compatibility matrix

## Future Considerations

### 13. Package Examples

**Current State**: No example projects showing how to use the packages.

**Impact**: Users need to figure out usage from README alone.

**Suggestion**:

- Create example projects in `examples/` directory
- Show real-world usage patterns
- Include examples for different frameworks (React, Node.js, etc.)

### 14. Automated Dependency Updates

**Current State**: Manual dependency management.

**Impact**: Dependencies can become outdated.

**Suggestion**:

- Consider Dependabot or Renovate for automated PRs
- Set up update policies (patch/minor automatically, major with review)

### 15. Package Health Monitoring

**Current State**: No visibility into package usage or issues.

**Impact**: Can't track if packages are being used or if there are issues.

**Suggestion**:

- Set up npm package analytics (if available)
- Monitor GitHub issues/discussions
- Consider adding a "Support" section to README

---

**Note**: Prioritize based on your immediate needs. High priority items address core functionality and maintainability, while lower priority items focus on developer experience and polish.
