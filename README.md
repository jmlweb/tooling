# jmlweb-tooling

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Turborepo](https://img.shields.io/badge/Built%20with-Turborepo-EF4444.svg)](https://turbo.build/repo)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)

Centralized configuration packages for development tools. One source of truth for consistent formatting, linting, and code quality across all projects.

## Packages

| Package                                                                   | Description                                                             | Version                                                                      |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Formatting**                                                            |                                                                         |                                                                              |
| [`@jmlweb/prettier-config-base`](./packages/prettier-config-base)         | Base Prettier configuration                                             | ![npm](https://img.shields.io/npm/v/@jmlweb/prettier-config-base?label=)     |
| [`@jmlweb/prettier-config-tailwind`](./packages/prettier-config-tailwind) | Prettier + Tailwind CSS plugin                                          | ![npm](https://img.shields.io/npm/v/@jmlweb/prettier-config-tailwind?label=) |
| **Linting**                                                               |                                                                         |                                                                              |
| [`@jmlweb/eslint-config-base`](./packages/eslint-config-base)             | ESLint for TypeScript (strict)                                          | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-base?label=)       |
| [`@jmlweb/eslint-config-base-js`](./packages/eslint-config-base-js)       | ESLint for JavaScript                                                   | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-base-js?label=)    |
| [`@jmlweb/eslint-config-react`](./packages/eslint-config-react)           | ESLint for React libraries with TypeScript, extending base config       | ![npm](https://img.shields.io/npm/v/@jmlweb/eslint-config-react?label=)      |
| **TypeScript**                                                            |                                                                         |                                                                              |
| [`@jmlweb/tsconfig-base`](./packages/tsconfig-base)                       | Base TypeScript configuration                                           | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-base?label=)            |
| [`@jmlweb/tsconfig-node`](./packages/tsconfig-node)                       | TypeScript configuration for Node.js and CLI projects                   | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-node?label=)            |
| [`@jmlweb/tsconfig-react`](./packages/tsconfig-react)                     | TypeScript configuration for React libraries with JSX support           | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-react?label=)           |
| [`@jmlweb/tsconfig-nextjs`](./packages/tsconfig-nextjs)                   | TypeScript configuration for Next.js applications                       | ![npm](https://img.shields.io/npm/v/@jmlweb/tsconfig-nextjs?label=)          |
| **Testing**                                                               |                                                                         |                                                                              |
| [`@jmlweb/vitest-config`](./packages/vitest-config)                       | Base Vitest configuration with TypeScript support and coverage settings | ![npm](https://img.shields.io/npm/v/@jmlweb/vitest-config?label=)            |
| **Build Tools**                                                           |                                                                         |                                                                              |
| [`@jmlweb/tsup-config-base`](./packages/tsup-config-base)                 | Base tsup configuration for building TypeScript packages                | ![npm](https://img.shields.io/npm/v/@jmlweb/tsup-config-base?label=)         |
| [`@jmlweb/vite-config`](./packages/vite-config)                           | Base Vite configuration for frontend projects                           | ![npm](https://img.shields.io/npm/v/@jmlweb/vite-config?label=)              |
| **Commit Linting**                                                        |                                                                         |                                                                              |
| [`@jmlweb/commitlint-config`](./packages/commitlint-config)               | Commitlint configuration for Conventional Commits                       | ![npm](https://img.shields.io/npm/v/@jmlweb/commitlint-config?label=)        |

## Quick Start

### Prettier

```bash
pnpm add -D @jmlweb/prettier-config-base prettier
```

```json
{
  "prettier": "@jmlweb/prettier-config-base"
}
```

### ESLint (TypeScript)

```bash
pnpm add -D @jmlweb/eslint-config-base eslint typescript-eslint
```

```javascript
// eslint.config.js
import baseConfig from '@jmlweb/eslint-config-base';

export default [...baseConfig];
```

## Package Hierarchy

```text
prettier-config-base ─────► prettier-config-tailwind
                                    │
                                    └── + Tailwind CSS plugin

eslint-config-base-js ────► eslint-config-base ────► eslint-config-react
                                    │                        │
                                    └── + TypeScript        └── + React rules
                                        strict rules

tsconfig-base ────► tsconfig-node
              │            │
              │            └── + Node.js types only
              │                (excludes DOM)
              │
              └──► tsconfig-react ────► tsconfig-nextjs
                            │                    │
                            └── + JSX            └── + Next.js plugin
                                support               & path aliases

Standalone packages (no inheritance):
├── vitest-config      - Testing configuration
├── tsup-config-base   - Package bundling
├── vite-config        - Frontend build tool
└── commitlint-config  - Commit message linting
```

## Development

```bash
# Install dependencies
pnpm install

# Format code
pnpm format

# Run linting
pnpm lint

# Run tests (validates all packages)
pnpm test

# Validate everything (format + lint + syncpack)
pnpm validate

# Check dependency version consistency
pnpm syncpack:check

# Fix dependency version mismatches
pnpm syncpack:fix
```

## Examples

See [`apps/`](./apps) directory for test applications and real-world usage examples. The [`apps/README.md`](./apps/README.md) provides detailed documentation for:

- **Test App** - Validates all configuration packages work correctly
- **Node.js TypeScript API** - Express.js API with TypeScript, ESLint, Prettier, and Vitest
- **React TypeScript App** - React app with Tailwind CSS, TypeScript, ESLint, and Vitest
- **Node.js JavaScript** - Pure JavaScript Express.js API with ESLint and Prettier

Each example includes complete setup instructions and demonstrates best practices for using the packages.

## Node.js Compatibility

Different packages in this monorepo have different Node.js version requirements. Most packages work with Node.js >= 18.0.0, while some TypeScript ESLint configurations require Node.js >= 20.11.0 due to the use of `import.meta.dirname`, which was introduced in Node.js 20.11.0.

### Compatibility Matrix

| Package                            | Node.js Requirement | Reason                                      |
| ---------------------------------- | ------------------- | ------------------------------------------- |
| `@jmlweb/prettier-config-base`     | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/prettier-config-tailwind` | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/eslint-config-base-js`    | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/eslint-config-base`       | >= 20.11.0          | Uses `import.meta.dirname` for config files |
| `@jmlweb/eslint-config-react`      | >= 20.11.0          | Uses `import.meta.dirname` for config files |
| `@jmlweb/vitest-config`            | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/tsconfig-base`            | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/tsconfig-node`            | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/tsconfig-react`           | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/tsconfig-nextjs`          | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/tsup-config-base`         | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/vite-config`              | >= 18.0.0           | Standard compatibility                      |
| `@jmlweb/commitlint-config`        | >= 18.0.0           | Standard compatibility                      |

### Why Different Requirements?

**Node.js >= 18.0.0 (Most Packages)**

- Most packages use standard JavaScript/TypeScript features available in Node.js 18.0.0
- These packages are compatible with all Node.js LTS versions

**Node.js >= 20.11.0 (TypeScript ESLint Configs)**

- `@jmlweb/eslint-config-base` and `@jmlweb/eslint-config-react` require Node.js >= 20.11.0
- These packages use `import.meta.dirname` in their configuration files, which was introduced in Node.js 20.11.0
- This feature enables better path resolution for ESLint configuration files in the flat config format

### Choosing the Right Node.js Version

- **If you're using TypeScript ESLint configs** (`@jmlweb/eslint-config-base` or `@jmlweb/eslint-config-react`):
  - Use **Node.js >= 20.11.0**
  - Recommended: Use the latest Node.js LTS version

- **If you're only using other packages** (Prettier, Vitest, or TypeScript configs):
  - Use **Node.js >= 18.0.0**
  - Recommended: Use Node.js 18 LTS or later for security updates

### Checking Your Node.js Version

```bash
node --version
```

To install or update Node.js, visit [nodejs.org](https://nodejs.org/) or use a version manager like [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm).

## Requirements

- **Node.js** >= 18.0.0 (see [Node.js Compatibility](#nodejs-compatibility) for package-specific requirements)
- **ESLint** >= 9.0.0 (flat config format, required for ESLint config packages)
- **Prettier** >= 3.0.0 (required for Prettier config packages)

## Dependency Version Consistency

This project uses [syncpack](https://jamiemason.github.io/syncpack/) to ensure consistent dependency versions across all packages in the monorepo.

### Available Commands

```bash
# Check for version mismatches (included in `validate`)
pnpm syncpack:check

# Fix version mismatches automatically
pnpm syncpack:fix
```

### Configuration

The syncpack configuration (`.syncpackrc.json`) enforces:

- **Version consistency**: All dev and prod dependencies use the same version across packages
- **Semver ranges**: All dependencies use caret (`^`) ranges for flexibility
- **Formatting**: Package.json files are sorted consistently

Peer dependencies are intentionally excluded from version matching since they specify broader compatibility ranges.

### CI Integration

Syncpack checks run automatically in the CI pipeline. PRs with version mismatches will fail the `validate` job.

## Dependency Updates

This project uses [Dependabot](https://docs.github.com/en/code-security/dependabot) to automatically keep dependencies up to date.

### Update Policies

- **Patch and Minor Updates**: Dependabot creates pull requests for patch and minor version updates automatically. These can typically be merged after CI passes.
- **Major Updates**: Major version updates are ignored by default and require manual review. To update a dependency to a major version:
  1. Manually create a PR with the update
  2. Review breaking changes in the dependency's changelog
  3. Test thoroughly before merging

### Update Schedule

- **Weekly**: Dependabot checks for updates every Monday at 9:00 AM
- **GitHub Actions**: Updates for GitHub Actions workflows are checked weekly as well

### Handling Update PRs

1. **Review the PR**: Check what changed and why
2. **Verify CI**: Ensure all CI checks pass
3. **Test Locally** (if needed): For significant updates, test locally
4. **Merge**: Merge when ready, using a conventional commit message if squashing

### Auto-merge (Optional)

You can enable auto-merge for patch/minor updates in GitHub repository settings:

- Go to Settings → General → Pull Requests
- Enable "Allow auto-merge"
- Configure auto-merge rules for Dependabot PRs

Major version updates should always be reviewed manually.

## Support

### Getting Help

- **Bug Reports**: [Open an issue](https://github.com/jmlweb/tooling/issues/new?labels=bug) with detailed reproduction steps
- **Feature Requests**: [Open an issue](https://github.com/jmlweb/tooling/issues/new?labels=enhancement) with your use case
- **Questions**: [Open an issue](https://github.com/jmlweb/tooling/issues/new?labels=question) or check existing issues

### Response Times

This is an open-source project maintained in spare time. While we aim to respond to issues promptly, response times may vary. Critical bugs are prioritized.

## Package Analytics

Track package usage and health through npm statistics:

### Download Statistics

| Package                            | Weekly Downloads                                                                               | Total Downloads                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `@jmlweb/prettier-config-base`     | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/prettier-config-base?label=)     | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/prettier-config-base?label=)     |
| `@jmlweb/prettier-config-tailwind` | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/prettier-config-tailwind?label=) | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/prettier-config-tailwind?label=) |
| `@jmlweb/eslint-config-base-js`    | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/eslint-config-base-js?label=)    | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/eslint-config-base-js?label=)    |
| `@jmlweb/eslint-config-base`       | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/eslint-config-base?label=)       | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/eslint-config-base?label=)       |
| `@jmlweb/eslint-config-react`      | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/eslint-config-react?label=)      | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/eslint-config-react?label=)      |
| `@jmlweb/tsconfig-base`            | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/tsconfig-base?label=)            | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/tsconfig-base?label=)            |
| `@jmlweb/tsconfig-node`            | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/tsconfig-node?label=)            | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/tsconfig-node?label=)            |
| `@jmlweb/tsconfig-react`           | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/tsconfig-react?label=)           | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/tsconfig-react?label=)           |
| `@jmlweb/tsconfig-nextjs`          | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/tsconfig-nextjs?label=)          | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/tsconfig-nextjs?label=)          |
| `@jmlweb/vitest-config`            | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/vitest-config?label=)            | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/vitest-config?label=)            |
| `@jmlweb/tsup-config-base`         | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/tsup-config-base?label=)         | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/tsup-config-base?label=)         |
| `@jmlweb/vite-config`              | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/vite-config?label=)              | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/vite-config?label=)              |
| `@jmlweb/commitlint-config`        | ![npm weekly downloads](https://img.shields.io/npm/dw/@jmlweb/commitlint-config?label=)        | ![npm downloads](https://img.shields.io/npm/dt/@jmlweb/commitlint-config?label=)        |

### Viewing Detailed Statistics

- **npm Stats**: Visit [npmjs.com/package/@jmlweb/PACKAGE_NAME](https://www.npmjs.com/package/@jmlweb/prettier-config-base) (replace with package name)
- **npm-stat**: Visit [npm-stat.com](https://npm-stat.com/charts.html?package=@jmlweb/prettier-config-base) for historical download charts

## Security

### Vulnerability Monitoring

This project uses multiple layers of security monitoring:

1. **Dependabot**: Automatically monitors dependencies for known vulnerabilities and creates PRs to update affected packages (see [Dependency Updates](#dependency-updates))

2. **pnpm audit**: Run locally to check for vulnerabilities:

   ```bash
   pnpm audit
   ```

3. **GitHub Security Advisories**: Security alerts are enabled on this repository

### Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public issue
2. Email the maintainer directly or use GitHub's private vulnerability reporting
3. Include a detailed description and reproduction steps

## Contributing

Contributions are welcome! This project thrives on community involvement, whether you're fixing bugs, proposing features, improving documentation, or helping others.

### Ways to Contribute

- **🐛 Report Bugs**: [Open a bug report](https://github.com/jmlweb/tooling/issues/new?labels=bug) with detailed reproduction steps
- **💡 Request Features**: [Open a feature request](https://github.com/jmlweb/tooling/issues/new?labels=enhancement) describing your use case
- **📖 Improve Documentation**: [Open a documentation issue](https://github.com/jmlweb/tooling/issues/new?labels=documentation) or submit a PR
- **🔧 Submit Pull Requests**: [View open PRs](https://github.com/jmlweb/tooling/pulls) or create your own

### Getting Started

1. **Fork the repository** and clone your fork
2. **Install dependencies**: `pnpm install`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Make your changes** following our [development guidelines](#development)
5. **Test your changes**: `pnpm validate` (runs format, lint, and tests)
6. **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/)
7. **Push to your fork** and submit a pull request

### Pull Request Guidelines

- **Clear description**: Explain what changes you made and why
- **Reference issues**: Link related issues with `Fixes #123` or `Relates to #456`
- **Follow conventions**: Use Conventional Commits format for commit messages
- **Ensure CI passes**: All tests, linting, and format checks must pass
- **Keep it focused**: One feature or fix per PR when possible
- **Update documentation**: If your changes affect usage, update relevant READMEs

### Development Workflow

See the [Development](#development) section for available commands. Key commands:

```bash
pnpm validate    # Run all checks (format, lint, syncpack)
pnpm format      # Format code with Prettier
pnpm lint        # Run ESLint checks
pnpm test        # Run all tests
```

### Questions or Need Help?

- Browse [existing issues](https://github.com/jmlweb/tooling/issues) to see if your question has been answered
- [Open a question issue](https://github.com/jmlweb/tooling/issues/new?labels=question) for support

This is an open-source project maintained in spare time. We appreciate your patience and understanding.

## License

MIT
