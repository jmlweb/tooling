# Integration Tests

Integration tests that verify packages work correctly when installed and consumed, similar to how they would be used in real projects.

## Purpose

These tests ensure that:

- Packages can be installed from packed tarballs (as they would be from npm)
- Packages can be imported and used correctly
- Configurations work as expected with their respective tools
- Breaking changes are caught before publishing

## Running Tests

From the root of the monorepo:

```bash
pnpm test --filter @jmlweb/integration-tests
```

Or from this directory:

```bash
cd apps/integration-tests
pnpm test
```

## Test Structure

The integration tests are organized by package type:

- **Prettier Configs** (`test-prettier.mjs`) - Tests Prettier configuration packages
- **ESLint Configs** (`test-eslint.mjs`) - Tests ESLint configuration packages
- **TypeScript Configs** (`test-tsconfig.mjs`) - Tests TypeScript configuration packages
- **Testing Configs** (`test-testing-configs.mjs`) - Tests Vitest and Jest configuration packages
- **Build Tool Configs** (`test-build-tools.mjs`) - Tests tsup, Vite, and PostCSS configuration packages
- **Commitlint Config** (`test-commitlint.mjs`) - Tests Commitlint configuration package

## How It Works

1. **Pack Packages**: All packages in the monorepo are packed into tarballs (as they would be published to npm)
2. **Create Test Environment**: A temporary test project is created
3. **Install Packages**: Packed packages are installed as file dependencies
4. **Run Tests**: Each package type is tested to verify it works correctly
5. **Cleanup**: Test environment is cleaned up

## Test Coverage

The tests verify:

- ✅ Packages can be imported
- ✅ Configuration structures are valid
- ✅ Configurations work with their respective tools
- ✅ Package exports are configured correctly
- ✅ Peer dependencies are handled correctly

## CI Integration

These tests run automatically in CI to ensure packages are ready for publishing. See `.github/workflows/ci.yml` for details.
