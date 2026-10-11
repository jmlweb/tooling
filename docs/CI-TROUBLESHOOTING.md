# CI Troubleshooting

Fixes for common CI failures. Pipeline overview, workflows and caching setup: [`CI.md`](./CI.md).

# Common issues

## Build Failures

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

1. Match Node.js version locally with CI (`.nvmrc`, e.g. `nvm use`)
2. Ensure dependencies are correctly categorized in `package.json`
3. Check for case-sensitive file path issues

## Cache Issues

**Problem**: Turborepo cache not working in CI

**Solutions**:

1. Verify `TURBO_TOKEN` secret is set correctly
2. Check token hasn't expired
3. Ensure token has correct permissions
4. Review Turborepo output for cache hit/miss messages

Note: Turborepo cache artifacts are no longer uploaded to GitHub Actions artifacts. All caching is handled via Turborepo remote cache (Vercel).

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

## Filtering Issues

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

## Publishing Issues

**Problem**: Publishing fails with `E404 Not Found - PUT` or another authentication error

Publishing uses npm trusted publishing (OIDC), not an `NPM_TOKEN` secret. npm answers a rejected publish credential with a 404.

**Solutions**:

1. Check the package has a trusted publisher on npmjs.com (package **Settings** → **Trusted publishing**) for repository `jmlweb/tooling` and workflow `publish.yml`, with `npm publish` allowed
2. Configure missing ones with `node scripts/setup-trusted-publishing.mjs <package...>` (needs `npm login`). Pass only the packages to enable, with or without the `@jmlweb/` scope; with no arguments it processes every public package
3. A brand-new package must be published once by hand before a trusted publisher can be added to it, then passed to the script
4. Ensure the publish job keeps `id-token: write` and installs npm >= 11.5.1

**Problem**: Package published but missing files

**Solutions**:

1. Check `files` array in `package.json`
2. Ensure build ran before publish
3. Verify `.npmignore` isn't excluding needed files
4. Test locally: `node scripts/test-pack.mjs` or `pnpm pack` and inspect tarball

**Problem**: Version already exists on npm

**Solutions**:

1. This is expected behavior - CI detects and skips
2. If you need to publish changes, create a new changeset
3. Check if changeset was applied: `git log -1`

## Performance Issues

**Problem**: CI runs taking too long

**Solutions**:

1. Enable Turborepo remote caching (see [CI.md](./CI.md#turborepo-remote-caching))
2. Use package filtering for PRs (already implemented)
3. Review job parallelization - independent jobs should run in parallel
4. Check for unnecessary work (e.g., rebuilding unchanged packages)

**Problem**: Out of memory errors during build

**Solutions**:

1. Check for memory leaks in build scripts
2. Reduce parallelism: `turbo run build --concurrency=1`
3. Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=4096"`
4. Split large packages into smaller ones

# Workflow-specific issues

## CI Workflow

**Problem**: `validate-format` job fails (Oxfmt)

**Solutions**:

1. Run locally: `pnpm turbo run format:check` (builds `@jmlweb/oxfmt-config-base` first, which `oxfmt.config.ts` loads)
2. Fix formatting: `pnpm format` (on a fresh clone, run `pnpm build` once before)
3. Commit changes and push

**Problem**: `build` job fails with package validation errors

**Solutions**:

1. Run locally: `node scripts/validate-all-packages.mjs`
2. Fix reported errors in package.json files
3. Common issues: missing required fields (name, version, description, author, license, repository)
4. For detailed validation of a single package: `node scripts/validate-package.mjs packages/your-package`

**Problem**: `validate-lint` job fails (Oxlint)

**Solutions**:

1. Run locally: `pnpm lint:root && pnpm lint` (build `@jmlweb/oxlint-config-base` first on a fresh clone)
2. Fix linting errors (some auto-fixable with `--fix`)
3. Adjust the Oxlint config (`oxlint.config.ts`) if a rule needs changing

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

## Publish Workflow

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

## Getting help

If you encounter an issue not covered here:

1. Check GitHub Actions logs for detailed error messages
2. Search existing GitHub issues
3. Open a new issue with:
   - Error message and full logs
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node.js version, etc.)

## Related

- [`CI.md`](./CI.md): workflows, caching, optimization
- [`PUBLISHING-GUIDELINES.md`](./PUBLISHING-GUIDELINES.md): release flow
