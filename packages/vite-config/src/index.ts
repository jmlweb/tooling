import type { UserConfig, Plugin } from 'vite';

/**
 * Options for creating a base Vite configuration
 */
export interface ViteConfigOptions {
  /**
   * Additional Vite plugins to include
   * @default []
   */
  plugins?: Plugin[];

  /**
   * Path aliases for module resolution
   * @example { '@': './src' }
   */
  resolve?: {
    alias?: Record<string, string>;
  };

  /**
   * Build configuration options
   */
  build?: {
    /**
     * Output directory for production build
     * @default 'dist'
     */
    outDir?: string;

    /**
     * Enable/disable source maps
     * @default false
     */
    sourcemap?: boolean | 'inline' | 'hidden';

    /**
     * Minification option
     * @default 'esbuild'
     */
    minify?: boolean | 'esbuild' | 'terser';

    /**
     * Target environment for build
     * @default 'esnext'
     */
    target?: string | string[];
  };

  /**
   * Development server configuration
   */
  server?: {
    /**
     * Server port
     * @default 5173
     */
    port?: number;

    /**
     * Enable strict port (fail if port is in use)
     * @default false
     */
    strictPort?: boolean;

    /**
     * Open browser on server start
     * @default false
     */
    open?: boolean;

    /**
     * Host to bind to
     * @default 'localhost'
     */
    host?: string | boolean;
  };

  /**
   * Preview server configuration (for previewing production build)
   */
  preview?: {
    /**
     * Preview server port
     * @default 4173
     */
    port?: number;
  };

  /**
   * Additional Vite configuration to merge
   */
  options?: Omit<UserConfig, 'plugins' | 'resolve' | 'build' | 'server' | 'preview'>;
}

/**
 * Base Vite configuration defaults used across all @jmlweb projects
 */
const BASE_DEFAULTS = {
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild' as const,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: false,
    host: 'localhost',
  },
  preview: {
    port: 4173,
  },
} satisfies Partial<UserConfig>;

/**
 * Creates a base Vite configuration with sensible defaults
 *
 * @example
 * ```typescript
 * // Simple usage
 * import { createViteConfig } from '@jmlweb/vite-config';
 * export default createViteConfig();
 * ```
 *
 * @example
 * ```typescript
 * // With path aliases
 * import { createViteConfig } from '@jmlweb/vite-config';
 * import { resolve } from 'path';
 *
 * export default createViteConfig({
 *   resolve: {
 *     alias: {
 *       '@': resolve(__dirname, './src'),
 *     },
 *   },
 * });
 * ```
 *
 * @example
 * ```typescript
 * // With React plugin
 * import { createViteConfig } from '@jmlweb/vite-config';
 * import react from '@vitejs/plugin-react';
 *
 * export default createViteConfig({
 *   plugins: [react()],
 * });
 * ```
 *
 * @example
 * ```typescript
 * // With custom build options
 * import { createViteConfig } from '@jmlweb/vite-config';
 *
 * export default createViteConfig({
 *   build: {
 *     sourcemap: true,
 *     target: ['es2020', 'chrome87', 'firefox78', 'safari14'],
 *   },
 *   server: {
 *     port: 3000,
 *     open: true,
 *   },
 * });
 * ```
 */
export const createViteConfig = (config: ViteConfigOptions = {}): UserConfig => {
  const {
    plugins = [],
    resolve,
    build = {},
    server = {},
    preview = {},
    options = {},
  } = config;

  return {
    plugins,
    ...(resolve && { resolve }),
    build: {
      ...BASE_DEFAULTS.build,
      ...build,
    },
    server: {
      ...BASE_DEFAULTS.server,
      ...server,
    },
    preview: {
      ...BASE_DEFAULTS.preview,
      ...preview,
    },
    ...options,
  };
};

/**
 * Creates a Vite configuration optimized for React applications
 *
 * This is a convenience function that combines the base configuration
 * with React-specific settings. You must provide the React plugin.
 *
 * @example
 * ```typescript
 * import { createReactViteConfig } from '@jmlweb/vite-config';
 * import react from '@vitejs/plugin-react';
 *
 * export default createReactViteConfig({
 *   reactPlugin: react(),
 *   resolve: {
 *     alias: {
 *       '@': './src',
 *     },
 *   },
 * });
 * ```
 *
 * @example
 * ```typescript
 * // With custom React plugin options
 * import { createReactViteConfig } from '@jmlweb/vite-config';
 * import react from '@vitejs/plugin-react';
 *
 * export default createReactViteConfig({
 *   reactPlugin: react({
 *     babel: {
 *       plugins: ['@emotion/babel-plugin'],
 *     },
 *   }),
 *   build: {
 *     sourcemap: true,
 *   },
 * });
 * ```
 */
export const createReactViteConfig = (
  config: ViteConfigOptions & { reactPlugin: Plugin }
): UserConfig => {
  const { reactPlugin, plugins = [], ...rest } = config;

  return createViteConfig({
    ...rest,
    plugins: [reactPlugin, ...plugins],
  });
};

/**
 * Re-export the base defaults for reference
 */
export { BASE_DEFAULTS };

/**
 * Re-export Vite's types for convenience
 */
export type { UserConfig, Plugin } from 'vite';
