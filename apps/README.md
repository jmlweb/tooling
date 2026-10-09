# Apps Directory

This directory contains applications and examples demonstrating how to use `@jmlweb` tooling packages.

## Applications

### Test App

**Location:** [`test-app/`](./test-app)

**Purpose:** Test application for validating configuration packages work correctly.

**Packages Tested:**

- [`@jmlweb/prettier-config-base`](../packages/prettier-config-base) - Code formatting
- [`@jmlweb/prettier-config-tailwind`](../packages/prettier-config-tailwind) - Prettier with Tailwind CSS plugin
- [`@jmlweb/eslint-config-base`](../packages/eslint-config-base) - TypeScript linting
- [`@jmlweb/eslint-config-base-js`](../packages/eslint-config-base-js) - JavaScript linting
- [`@jmlweb/tsconfig-base`](../packages/tsconfig-base) - TypeScript configuration

**Usage:**

```bash
cd apps/test-app
pnpm test
```

**Test Scripts:**

- `test` - Run all tests
- `test:prettier-base` - Test base Prettier config
- `test:prettier-tailwind` - Test Tailwind Prettier config
- `test:eslint-js` - Test JavaScript ESLint config
- `test:eslint-ts` - Test TypeScript ESLint config
- `test:tsconfig` - Test TypeScript config

## Example Applications

Example projects demonstrating how to use `@jmlweb` tooling packages in real-world scenarios.

### 1. Node.js TypeScript API

**Location:** [`example-nodejs-typescript-api/`](./example-nodejs-typescript-api)

**Packages Demonstrated:**

- [`@jmlweb/oxfmt-config-base`](../packages/oxfmt-config-base) - Code formatting and import sorting
- [`@jmlweb/oxlint-config-node`](../packages/oxlint-config-node) - Node.js and strict TypeScript linting
- [`@jmlweb/tsconfig-base`](../packages/tsconfig-base) - TypeScript configuration
- [`@jmlweb/vitest-config`](../packages/vitest-config) - Testing configuration

**Use Case:** Node.js API server with Express.js, TypeScript, and testing setup.

**Key Features:**

- Strict TypeScript configuration
- Oxlint with type-aware TypeScript rules and Node.js rules
- Oxfmt for consistent formatting
- Vitest for testing with coverage

### 2. React TypeScript App

**Location:** [`example-react-typescript-app/`](./example-react-typescript-app)

**Packages Demonstrated:**

- [`@jmlweb/oxfmt-config-base`](../packages/oxfmt-config-base) - Code formatting with Tailwind class sorting
- [`@jmlweb/oxlint-config-react`](../packages/oxlint-config-react) - React + TypeScript linting with strict rules
- [`@jmlweb/tsconfig-react`](../packages/tsconfig-react) - TypeScript configuration for React
- [`@jmlweb/vitest-config`](../packages/vitest-config) - Testing configuration

**Use Case:** React application with TypeScript, Tailwind CSS, and Vite.

**Key Features:**

- React 19 with TypeScript
- Tailwind CSS 4 with automatic class sorting
- Oxlint with React, React Compiler and type-aware TypeScript rules
- Vitest for component testing with jsdom

### 3. Node.js JavaScript

**Location:** [`example-nodejs-javascript/`](./example-nodejs-javascript)

**Packages Demonstrated:**

- [`@jmlweb/oxfmt-config-base`](../packages/oxfmt-config-base) - Code formatting and import sorting
- [`@jmlweb/oxlint-config-node`](../packages/oxlint-config-node) - Node.js linting

**Use Case:** Node.js API server with pure JavaScript (no TypeScript).

**Key Features:**

- Pure JavaScript (no TypeScript)
- Oxlint with ESLint's recommended rules and Node.js rules
- Oxfmt for consistent formatting
- Automatic import sorting

## Getting Started

Each example includes:

- ✅ Complete `package.json` with all dependencies
- ✅ Configuration files showing how to use each package
- ✅ Working code demonstrating real-world patterns
- ✅ README with setup instructions
- ✅ Scripts for development, testing, and formatting

## Running Examples

1. Navigate to an example directory:

```bash
cd apps/example-nodejs-typescript-api
```

2. Install dependencies:

```bash
pnpm install
```

3. Follow the example-specific README for instructions

## Choosing the Right Example

- **TypeScript API?** → Use [`example-nodejs-typescript-api/`](./example-nodejs-typescript-api)
- **React App?** → Use [`example-react-typescript-app/`](./example-react-typescript-app)
- **JavaScript Only?** → Use [`example-nodejs-javascript/`](./example-nodejs-javascript)

## Contributing

These examples are kept up-to-date with the latest package versions and best practices. When updating packages, ensure examples are updated accordingly.
