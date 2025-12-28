# CI/CD Setup

This document describes the CI/CD configuration for the jmlweb-tooling monorepo, including setup instructions and optimization strategies.

## Overview

The project uses GitHub Actions for continuous integration and deployment. The CI pipeline includes:

- **Validation**: Code quality checks (formatting, linting, dependency checks)
- **Build**: Package builds and validation
- **Test Pack**: Package publishing validation
- **Publish**: Automated npm publishing via Changesets

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

### Troubleshooting

**Cache not working:**

- Verify `TURBO_TOKEN` secret is set correctly
- Check that the token has not expired
- Ensure the token has the correct permissions

**Cache hits not occurring:**

- Verify inputs/outputs are correctly configured in `turbo.json`
- Check that file hashes match between runs
- Ensure dependencies are properly declared

**Team caching not working:**

- Verify `TURBO_TEAM` variable is set (if using team-based caching)
- Check that the team ID is correct
- Ensure team members have access to the Vercel team

## Workflow Files

### `.github/workflows/ci.yml`

Main CI workflow that runs on every push and pull request:

- **validate**: Code quality checks
- **build**: Package builds
- **test-pack**: Package publishing validation
- **status-check**: Final status aggregation

### `.github/workflows/publish.yml`

Publishing workflow that runs on pushes to `main`:

- **version**: Version packages using Changesets
- **detect-changes**: Detect which packages need publishing
- **publish**: Publish packages to npm in parallel

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
- Sharing between jobs
- Manual inspection when needed

## Best Practices

1. **Keep cache keys stable**: Ensure inputs in `turbo.json` are specific enough to catch changes but stable enough to enable cache hits

2. **Monitor cache hit rates**: Track how often cache hits occur to optimize task configurations

3. **Clean up old caches**: Vercel automatically manages cache retention, but monitor usage

4. **Use appropriate cache scopes**: Configure cache scopes in `turbo.json` to avoid unnecessary cache invalidations

## Troubleshooting

### Common Issues

#### Build Failures

**Problem**: Builds fail with "Module not found" errors

**Possible Causes**:

- Dependencies not installed correctly
- Build order issues (dependencies not built before dependents)
- Stale cache causing issues

**Solutions**:

1. Clear and reinstall dependencies:

   ```bash
   rm -rf node_modules
   pnpm install
   ```

2. Clear Turborepo cache and rebuild:

   ```bash
   rm -rf .turbo
   pnpm build
   ```

3. Check `turbo.json` for correct `dependsOn` configuration

**Problem**: Build succeeds locally but fails in CI

**Possible Causes**:

- Environment differences (Node.js version, environment variables)
- Missing dependencies (devDependencies not installed)
- File system case sensitivity issues (macOS vs Linux)

**Solutions**:

1. Match Node.js version locally with CI (check `.github/workflows/ci.yml`)
2. Ensure dependencies are correctly categorized in `package.json`
3. Check for case-sensitive file path issues

#### Cache Issues

**Problem**: Turborepo cache not working in CI

**Solutions**:

1. Verify `TURBO_TOKEN` secret is set correctly
2. Check token hasn't expired
3. Ensure token has correct permissions
4. Review Turborepo output for cache hit/miss messages

**Problem**: Cache hits not occurring when expected

**Solutions**:

1. Verify inputs/outputs in `turbo.json` are correct
2. Check file hashes match between runs
3. Ensure dependencies are properly declared
4. Review git history (filters depend on commits)

**Problem**: Team caching not working

**Solutions**:

1. Verify `TURBO_TEAM` variable is set
2. Check team ID is correct
3. Ensure all team members have access to the Vercel team

#### Filtering Issues

**Problem**: Package filtering builds wrong packages

**Possible Causes**:

- Git history not available (shallow clone)
- Incorrect base branch reference
- Filter syntax error

**Solutions**:

1. Ensure `fetch-depth: 0` in checkout action
2. Verify base branch is fetched: `git fetch origin main`
3. Test filter locally: `pnpm build --filter='[HEAD^1]'`
4. Check Turborepo logs for filter interpretation

**Problem**: Filtering skips packages that should be built

**Solutions**:

1. Check if package has changes: `git diff origin/main...HEAD`
2. Verify `dependsOn` configuration in `turbo.json`
3. Ensure changed files are committed
4. Test without filter to verify build works

#### Publishing Issues

**Problem**: Publishing fails with authentication error

**Solutions**:

1. Verify `NPM_TOKEN` secret is set correctly
2. Check token hasn't expired (tokens expire after certain period)
3. Ensure token has publish permissions for the scope
4. Test token locally: `npm whoami --registry=https://registry.npmjs.org`

**Problem**: Package published but missing files

**Solutions**:

1. Check `files` array in `package.json`
2. Ensure build ran before publish
3. Verify `.npmignore` isn't excluding needed files
4. Test locally: `pnpm pack` and inspect tarball

**Problem**: Version already exists on npm

**Solutions**:

1. This is expected behavior - CI detects and skips
2. If you need to publish changes, create a new changeset
3. Check if changeset was applied: `git log -1`

#### Performance Issues

**Problem**: CI runs taking too long

**Solutions**:

1. Enable Turborepo remote caching (see setup instructions above)
2. Use package filtering for PRs (already implemented)
3. Review job parallelization - independent jobs should run in parallel
4. Check for unnecessary work (e.g., rebuilding unchanged packages)

**Problem**: Out of memory errors during build

**Solutions**:

1. Check for memory leaks in build scripts
2. Reduce parallelism: `turbo run build --concurrency=1`
3. Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=4096"`
4. Split large packages into smaller ones

### Workflow-Specific Issues

#### CI Workflow

**Problem**: `validate-format` job fails

**Solutions**:

1. Run locally: `pnpm format --check`
2. Fix formatting: `pnpm format`
3. Commit changes and push

**Problem**: `validate-lint` job fails

**Solutions**:

1. Run locally: `pnpm lint`
2. Fix linting errors (some auto-fixable with `--fix`)
3. Update ESLint config if rules need adjustment

**Problem**: `validate-deps` job fails

**Solutions**:

1. Run locally: `pnpm syncpack:check`
2. Fix version mismatches: `pnpm syncpack:fix`
3. Review changes and commit

**Problem**: `integration-test` job fails

**Solutions**:

1. Run tests locally: `pnpm integration:test`
2. Fix failing tests
3. Ensure test apps are using latest package builds

#### Publish Workflow

**Problem**: Changesets not detected

**Solutions**:

1. Create changeset: `pnpm changeset`
2. Commit changeset file
3. Push to main branch

**Problem**: Packages not publishing after versioning

**Solutions**:

1. Check if version already exists on npm
2. Verify build succeeded
3. Check publish logs for errors
4. Ensure package is not marked as `private: true`

### Getting Help

If you encounter an issue not covered here:

1. Check GitHub Actions logs for detailed error messages
2. Search existing GitHub issues
3. Open a new issue with:
   - Error message and full logs
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node.js version, etc.)

## Related Documentation

- [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Remote Caching](https://vercel.com/docs/monorepos/remote-caching)
- [CI Optimization: Package Filtering](./CI-OPTIMIZATION.md)
