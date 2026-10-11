# CI/CD Setup

CI/CD configuration for the monorepo: workflows, caching and optimization. Failures and fixes: [`CI-TROUBLESHOOTING.md`](./CI-TROUBLESHOOTING.md).

## Overview

The project uses GitHub Actions for continuous integration and deployment. The CI pipeline includes:

- **Validation**: Code quality checks (formatting, linting, dependency checks)
- **Build**: Package builds with PR filtering and validation
- **Test Pack**: Package publishing validation
- **Publish**: Automated npm publishing via Changesets

### CI Scripts

The CI workflow uses dedicated scripts for complex operations, making them testable locally and easier to maintain:

- **`scripts/validate-all-packages.mjs`**: Validates all package.json files in the monorepo
- **`scripts/ci-build.mjs`**: Handles PR filtering and build strategy (filtered builds for PRs, full builds for main)
- **`scripts/test-pack.mjs`**: Validates package tarballs for publishing readiness
- **`scripts/validate-package.mjs`**: Validates individual package.json files (with GitHub Actions annotations support)

## Turborepo Remote Caching

The CI workflows are configured to use Turborepo remote caching to significantly speed up builds by sharing cache across runs and team members.

### How It Works

Turborepo remote caching stores build artifacts in a remote cache (Vercel by default). When a task runs:

1. Turborepo checks the remote cache for matching task outputs
2. If a cache hit is found, the task is skipped and outputs are restored
3. If no cache hit, the task runs and outputs are uploaded to the cache
4. Subsequent runs (including other team members) can reuse the cached outputs

### Setup Instructions

To enable remote caching, you need to configure a Turborepo token:

#### Option 1: Vercel Remote Cache (Recommended)

1. **Create a Vercel account** (if you don't have one):
   - Go to [vercel.com](https://vercel.com) and sign up
   - The free tier includes remote caching

2. **Link your repository** (optional but recommended):
   - Import your GitHub repository to Vercel
   - This enables team-based caching

3. **Get your Turborepo token**:
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Create a new token or use an existing one
   - Copy the token value

4. **Add token to GitHub Secrets**:
   - Go to your repository settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `TURBO_TOKEN`
   - Value: Paste your Vercel token
   - Click "Add secret"

5. **Add team ID (optional, for team-based caching)**:
   - If you want team-based caching, get your team ID from Vercel
   - Go to repository settings → Variables → Actions
   - Click "New repository variable"
   - Name: `TURBO_TEAM`
   - Value: Your Vercel team ID
   - Click "Add variable"

#### Option 2: Custom Remote Cache

If you prefer to use a custom remote cache server, you'll need to:

1. Set up your own remote cache server
2. Configure the cache endpoint in `turbo.json`
3. Set `TURBO_TOKEN` to your custom cache authentication token

### Verification

After setting up remote caching:

1. **Check CI logs**: Look for cache hit/miss messages in Turborepo output
2. **Monitor build times**: Subsequent builds should be faster when cache hits occur
3. **Cache indicators**: Turborepo will show `FULL TURBO` when using cached outputs

Example log output:

```text
• Packages in scope: 15
• Running build in 15 packages
• Remote caching enabled
  →  Using remote cache
  →  Cache hit, replaying logs...
```

Cache misses or auth failures: [CI-TROUBLESHOOTING.md](./CI-TROUBLESHOOTING.md#cache-issues).

## Workflow Files

### `.github/workflows/ci.yml`

Main CI workflow that runs on every push and pull request:

- **validate-format**: `pnpm format:check` (Oxfmt)
- **validate-lint**: `pnpm lint:root` and `pnpm lint` (Oxlint)
- **validate-deps**: `pnpm syncpack:check`
- **build**: Package builds with intelligent PR filtering
  - Uses `scripts/ci-build.mjs` for PR filtering logic
  - Validates packages with `pnpm validate:packages`
- **test-pack**: Package publishing validation
  - Uses `scripts/test-pack.mjs` to pack and validate tarballs
  - Runs `pnpm check:exports` (publint in strict mode and Are The Types Wrong) on every built package
- **integration-test**: `pnpm integration:test`
- **status-check**: Final status aggregation

### `.github/workflows/security.yml`

Supply-chain checks on pushes, pull requests, and a weekly schedule:

- **dependency-review**: Fails pull requests that introduce dependencies with high-severity advisories
- **codeql**: CodeQL analysis of the JavaScript/TypeScript sources and the workflow files

All third-party actions are pinned to full commit SHAs with the version tag in a trailing comment. Dependabot keeps both up to date.

### `.github/workflows/publish.yml`

Publishing workflow. Runs after the `CI` workflow succeeds on `main`, or manually (`workflow_dispatch`, optional dry-run):

- **version**: Version packages using Changesets
- **detect-changes**: Detect which packages need publishing
- **publish**: Publish packages to npm in parallel via trusted publishing (OIDC); setup in [CI-TROUBLESHOOTING.md](./CI-TROUBLESHOOTING.md#publishing-issues)

### `.github/workflows/deploy-docs.yml`

Builds `apps/docs` and deploys it to GitHub Pages. Runs on pushes to `main` that touch `apps/docs/**`, package READMEs or `package.json` files, or manually.

## Optimization Strategies

### Cache Persistence

The workflows use Turborepo remote caching to persist build artifacts between CI runs. This significantly reduces build times when:

- Re-running failed jobs
- Building on different branches with similar changes
- Team members trigger builds with overlapping changes

### Job Dependencies

Jobs are structured to maximize parallelization:

- Independent jobs run in parallel
- Dependent jobs wait for prerequisites
- Artifacts are shared between jobs when needed

### Dependency Caching

The workflows use GitHub Actions' built-in caching for:

- **pnpm dependencies**: Cached via `setup-node` action
- **Node.js**: Cached via `setup-node` action

### Build Artifacts

Build outputs are uploaded as artifacts for:

- Debugging failed builds
- Sharing between jobs (test-pack downloads build artifacts)
- Manual inspection when needed

Note: Turborepo cache artifacts are no longer uploaded separately as Turborepo remote caching (via `TURBO_TOKEN` and `TURBO_TEAM`) handles cache persistence across workflow runs.

## Best Practices

1. **Keep cache keys stable**: Ensure inputs in `turbo.json` are specific enough to catch changes but stable enough to enable cache hits

2. **Monitor cache hit rates**: Track how often cache hits occur to optimize task configurations

3. **Clean up old caches**: Vercel automatically manages cache retention, but monitor usage

4. **Use appropriate cache scopes**: Configure cache scopes in `turbo.json` to avoid unnecessary cache invalidations

5. **Test CI scripts locally**: All CI scripts can be run locally for faster debugging:

   ```bash
   # Validate all packages
   node scripts/validate-all-packages.mjs

   # Test build (push scenario)
   GITHUB_EVENT_NAME=push node scripts/ci-build.mjs

   # Test build (PR scenario - requires git history)
   GITHUB_EVENT_NAME=pull_request GITHUB_BASE_REF=main node scripts/ci-build.mjs

   # Test package packing (requires build first)
   pnpm build && node scripts/test-pack.mjs

   # Validate single package
   node scripts/validate-package.mjs packages/your-package
   ```

## GitHub Actions Annotations

When validation errors occur in CI, GitHub Actions annotations are automatically added to the workflow output and appear inline in pull request diffs. This makes it easier to identify and fix issues without having to dig through logs.

The following scripts support annotations:

- `validate-package.mjs`: Errors and warnings appear on the relevant package.json file
- `ci-build.mjs`: Build failures are annotated with helpful error messages
- `test-pack.mjs`: Package validation failures are annotated on the package.json file

## Related Documentation

- [`CI-TROUBLESHOOTING.md`](./CI-TROUBLESHOOTING.md)
- [`PUBLISHING-GUIDELINES.md`](./PUBLISHING-GUIDELINES.md)
- [`DEPENDENCIES.md`](./DEPENDENCIES.md)

- [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Remote Caching](https://vercel.com/docs/monorepos/remote-caching)
