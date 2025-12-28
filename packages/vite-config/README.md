# @jmlweb/vite-config

[![npm version](https://img.shields.io/npm/v/@jmlweb/vite-config)](https://www.npmjs.com/package/@jmlweb/vite-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0%2B-646CFF.svg)](https://vite.dev/)

> Base Vite configuration for jmlweb projects. Provides sensible defaults for TypeScript support, build optimization, and development server settings.

## ✨ Features

- 🎯 **Sensible Defaults**: Pre-configured with optimized build and dev server settings
- 📦 **TypeScript Support**: Works seamlessly with TypeScript projects
- ⚛️ **React Ready**: Optional React integration via plugin injection
- 📁 **Path Aliases**: Easy configuration for module path resolution
- 🔧 **Clean API**: Simple functions to create configurations
- 🛠️ **Fully Typed**: Complete TypeScript support with exported types

## 📦 Installation

```bash
npm install --save-dev @jmlweb/vite-config vite
```

For React projects, also install the React plugin:

```bash
npm install --save-dev @vitejs/plugin-react
```

## 🚀 Quick Start

Create a `vite.config.ts` file in your project root:

```typescript
import { createViteConfig } from '@jmlweb/vite-config';

export default createViteConfig();
```

## 💡 Examples

### Basic Setup

```typescript
// vite.config.ts
import { createViteConfig } from '@jmlweb/vite-config';

export default createViteConfig();
```

### With Path Aliases

```typescript
// vite.config.ts
import { createViteConfig } from '@jmlweb/vite-config';
import { resolve } from 'path';

export default createViteConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
});
```

### With React Plugin

```typescript
// vite.config.ts
import { createViteConfig } from '@jmlweb/vite-config';
import react from '@vitejs/plugin-react';

export default createViteConfig({
  plugins: [react()],
});
```

### Using the React-Specific Helper

```typescript
// vite.config.ts
import { createReactViteConfig } from '@jmlweb/vite-config';
import react from '@vitejs/plugin-react';

export default createReactViteConfig({
  reactPlugin: react(),
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
```

### With Custom Build Settings

```typescript
// vite.config.ts
import { createViteConfig } from '@jmlweb/vite-config';

export default createViteConfig({
  build: {
    sourcemap: true,
    target: ['es2020', 'chrome87', 'firefox78', 'safari14'],
    outDir: 'build',
  },
});
```

### With Custom Server Settings

```typescript
// vite.config.ts
import { createViteConfig } from '@jmlweb/vite-config';

export default createViteConfig({
  server: {
    port: 3000,
    open: true,
    host: true, // Listen on all addresses
  },
});
```

### With Multiple Plugins

```typescript
// vite.config.ts
import { createViteConfig } from '@jmlweb/vite-config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default createViteConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
```

### Full Configuration Example

```typescript
// vite.config.ts
import { createViteConfig } from '@jmlweb/vite-config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default createViteConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    target: 'es2020',
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4000,
  },
});
```

## 📋 Configuration Details

### Default Settings

| Category | Setting      | Default Value | Description                     |
| -------- | ------------ | ------------- | ------------------------------- |
| Build    | `outDir`     | `'dist'`      | Output directory for production |
| Build    | `sourcemap`  | `false`       | Source map generation           |
| Build    | `minify`     | `'esbuild'`   | Minification strategy           |
| Build    | `target`     | `'esnext'`    | Build target environment        |
| Server   | `port`       | `5173`        | Development server port         |
| Server   | `strictPort` | `false`       | Fail if port is in use          |
| Server   | `open`       | `false`       | Open browser on start           |
| Server   | `host`       | `'localhost'` | Host to bind to                 |
| Preview  | `port`       | `4173`        | Preview server port             |

### API Reference

#### `createViteConfig(options?: ViteConfigOptions): UserConfig`

Creates a Vite configuration with sensible defaults.

**Parameters:**

| Option    | Type                      | Description                      |
| --------- | ------------------------- | -------------------------------- |
| `plugins` | `Plugin[]`                | Vite plugins to include          |
| `resolve` | `{ alias?: Record<...> }` | Module resolution configuration  |
| `build`   | `BuildOptions`            | Build configuration options      |
| `server`  | `ServerOptions`           | Development server configuration |
| `preview` | `PreviewOptions`          | Preview server configuration     |
| `options` | `Partial<UserConfig>`     | Additional Vite options to merge |

**Returns:** A complete Vite `UserConfig` object.

#### `createReactViteConfig(options: ViteConfigOptions & { reactPlugin: Plugin }): UserConfig`

Creates a Vite configuration optimized for React applications.

**Parameters:**

| Option        | Type                | Description                          |
| ------------- | ------------------- | ------------------------------------ |
| `reactPlugin` | `Plugin`            | The React plugin instance (required) |
| ...           | `ViteConfigOptions` | All options from `createViteConfig`  |

**Returns:** A complete Vite `UserConfig` object with React plugin included.

#### Exported Constants

- `BASE_DEFAULTS` - Default configuration values for reference
- `UserConfig`, `Plugin` - Re-exported from Vite

## 🎯 When to Use

Use this configuration when you want:

- ✅ Consistent Vite configuration across multiple projects
- ✅ Optimized build settings out of the box
- ✅ Easy integration with React and other plugins
- ✅ Type-safe configuration with full TypeScript support
- ✅ A clean, simple API for customization

## 🔧 Extending the Configuration

You can extend the configuration for your specific needs:

### Adding Custom Plugins

```typescript
// vite.config.ts
import { createViteConfig } from '@jmlweb/vite-config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';

export default createViteConfig({
  plugins: [react(), svgr(), visualizer({ open: true })],
});
```

### Overriding Build Settings

```typescript
// vite.config.ts
import { createViteConfig } from '@jmlweb/vite-config';

export default createViteConfig({
  build: {
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
```

### Environment-Specific Configuration

```typescript
// vite.config.ts
import { createViteConfig } from '@jmlweb/vite-config';
import react from '@vitejs/plugin-react';

export default createViteConfig({
  plugins: [react()],
  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
```

## 📝 Usage with Scripts

Add build scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

Then run:

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **Vite** >= 5.0.0

## 📦 Peer Dependencies

This package requires the following peer dependency:

- `vite` (>=5.0.0)

Optional peer dependency for React projects:

- `@vitejs/plugin-react` (for React integration)

## 🔗 Related Packages

- [`@jmlweb/tsconfig-react`](../tsconfig-react) - TypeScript config for React projects
- [`@jmlweb/eslint-config-react`](../eslint-config-react) - ESLint config for React projects
- [`@jmlweb/vitest-config`](../vitest-config) - Vitest configuration for testing
- [`@jmlweb/prettier-config-base`](../prettier-config-base) - Prettier config for consistent formatting

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## 📄 License

MIT
