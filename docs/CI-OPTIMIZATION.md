# CI Optimization: Filtering Affected Packages

## What is Package Filtering?

Turborepo can detect which packages have changed and only run tasks on those packages (and their dependencies). This dramatically speeds up CI when only a few packages change.

## How It Works

### Current Behavior (Without Filtering)

When you run `pnpm build`, Turborepo builds **all packages**:

```
packages/
├── eslint-config-base/     ← Built
├── prettier-config-base/   ← Built
├── tsconfig-base/          ← Built
└── ... (all 15+ packages)  ← All built
```

**Time**: ~2-3 minutes (all packages)

### With Filtering

If you only changed `eslint-config-base`, Turborepo builds:

```
packages/
├── eslint-config-base/     ← Built (changed)
└── (dependencies if needed) ← Built only if required
```

**Time**: ~30 seconds (only changed package)

## Filter Syntax Options

### 1. Filter by Commit Range

```bash
# Compare with previous commit
turbo run build --filter='[HEAD^1]'

# Compare with specific branch (useful for PRs)
turbo run build --filter='[origin/main...HEAD]'
```

**What it does**: Only runs on packages that changed in the specified range.

### 2. Filter by Package Name

```bash
# Build specific package
turbo run build --filter='@jmlweb/eslint-config-base'

# Build package and all its dependencies
turbo run build --filter='@jmlweb/eslint-config-base...'
```

### 3. Filter by Changed Files

```bash
# Only packages whose files changed
turbo run build --filter='[HEAD^1]'
```

## Implementation in CI

### For Pull Requests

Compare with the base branch (`main`):

```yaml
- name: Build changed packages
  run: pnpm build --filter='[origin/main...HEAD]'
```

### For Main Branch Pushes

Compare with previous commit:

```yaml
- name: Build changed packages
  run: pnpm build --filter='[HEAD^1]'
```

### Combined Approach

Handle both cases:

```yaml
- name: Build packages
  run: |
    if [ "${{ github.event_name }}" == "pull_request" ]; then
      # PR: compare with base branch
      pnpm build --filter='[origin/main...HEAD]'
    else
      # Push to main: compare with previous commit
      pnpm build --filter='[HEAD^1]'
    fi
```

## Important Considerations

### 1. Full History Required

For filtering to work, you need the full git history:

```yaml
- name: Checkout repository
  uses: actions/checkout@v6
  with:
    fetch-depth: 0 # ← Important! Get full history
```

### 2. Dependencies Are Handled Automatically

Turborepo automatically builds dependencies:

- If `eslint-config-react` depends on `eslint-config-base`
- And you change `eslint-config-react`
- Turborepo will build both (because of `dependsOn: ["^build"]`)

### 3. When NOT to Use Filtering

**Don't use filtering when:**

- You need to validate all packages (e.g., dependency checks)
- You're publishing (need all packages built)
- You want to ensure nothing broke globally

**Do use filtering when:**

- Building for CI validation
- Running tests on changed packages
- Quick feedback on PRs

## Example: Optimized CI Workflow

```yaml
jobs:
  build:
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        with:
          fetch-depth: 0 # Full history for filtering

      # ... setup steps ...

      - name: Build changed packages
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
            BASE=$(git merge-base HEAD origin/main)
            pnpm build --filter='[$BASE...HEAD]'
          else
            pnpm build --filter='[HEAD^1]'
          fi
```

## Performance Impact

### Without Filtering

- **All packages changed**: ~2-3 minutes
- **1 package changed**: ~2-3 minutes (still builds all)

### With Filtering

- **All packages changed**: ~2-3 minutes (same)
- **1 package changed**: ~30-60 seconds (only builds changed)

**Savings**: Up to 70% faster for small changes!

## Trade-offs

### Pros

✅ Much faster CI for small changes  
✅ Faster feedback on PRs  
✅ Lower GitHub Actions costs  
✅ Better developer experience

### Cons

⚠️ Requires full git history (slightly larger checkout)  
⚠️ More complex workflow logic  
⚠️ Need to handle edge cases (first commit, etc.)

## Recommendation

For this monorepo, filtering is **recommended** because:

1. Most PRs change 1-2 packages
2. Packages are independent (config packages)
3. Significant time savings possible
4. Dependencies are handled automatically

However, keep full builds for:

- Publishing workflow (needs all packages)
- Nightly/weekly full validation
- Before major releases
