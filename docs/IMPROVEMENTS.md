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

### 2. Testing & Validation Setup

**Current State**: SPECS.md mentions testing as a step, but no testing infrastructure exists.

**Impact**: No way to validate that packages work correctly before publishing.

**Suggestion**:
- Create a test app in `apps/test-app/` that uses all configuration packages
- Add validation scripts that verify:
  - Packages can be installed and imported correctly
  - Configuration inheritance works as expected
  - Formatting/linting actually applies the rules
- Add `test` script to root package.json and turbo.json pipeline

### 3. CI/CD Pipeline

**Current State**: No continuous integration setup.

**Impact**: Manual testing and no automated checks before publishing.

**Suggestion**:
- Add GitHub Actions workflow (or similar) to:
  - Run linting and formatting checks on PRs
  - Validate package.json files
  - Test package installation in different Node.js versions
  - Optionally automate publishing on version bumps

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

### 9. Development Scripts Enhancement

**Current State**: Basic scripts exist (format, lint, build).

**Impact**: Could improve developer experience with more helpful scripts.

**Suggestion**:
- Add scripts like:
  - `npm run validate` - Run all validation checks
  - `npm run clean` - Clean build artifacts
  - `npm run check` - Type check (if applicable)
  - `npm run prepare` - Setup hooks for git/npm

### 10. TypeScript Support for Config Files

**Current State**: Config files are JavaScript (`.js`).

**Impact**: No type safety for configuration exports.

**Suggestion**:
- Consider TypeScript for config files if it adds value
- Or add JSDoc type annotations for better IDE support
- Evaluate if the added complexity is worth it

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

