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

```
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

## Related Documentation

- [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Remote Caching](https://vercel.com/docs/monorepos/remote-caching)
