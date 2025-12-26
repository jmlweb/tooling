import type { Options } from 'tsup';

/**
 * Options for creating a base tsup configuration
 */
export interface TsupConfigOptions {
  /**
   * Entry points for the build
   * @default ['src/index.ts']
   */
  entry?: string[];

  /**
   * Output formats
   * @default ['cjs', 'esm']
   */
  format?: ('cjs' | 'esm' | 'iife')[];

  /**
   * Generate TypeScript declaration files
   * @default true
   */
  dts?: boolean;

  /**
   * Clean output directory before build
   * @default true
   */
  clean?: boolean;

  /**
   * Output directory
   * @default 'dist'
   */
  outDir?: string;

  /**
   * External packages to exclude from the bundle
   * Typically includes peer dependencies and internal workspace packages
   * @default []
   */
  external?: (string | RegExp)[];

  /**
   * Additional tsup options to merge with the base configuration
   */
  options?: Omit<
    Options,
    'entry' | 'format' | 'dts' | 'clean' | 'outDir' | 'external'
  >;
}

/**
 * Base tsup configuration defaults used across all @jmlweb packages
 */
const BASE_DEFAULTS = {
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'] as ('cjs' | 'esm')[],
  dts: true,
  clean: true,
  outDir: 'dist',
} satisfies Partial<Options>;

/**
 * Creates a base tsup configuration with sensible defaults
 *
 * @example
 * ```typescript
 * // Simple usage without externals
 * import { createTsupConfig } from '@jmlweb/tsup-config-base';
 * export default createTsupConfig();
 * ```
 *
 * @example
 * ```typescript
 * // With external dependencies
 * import { createTsupConfig } from '@jmlweb/tsup-config-base';
 * export default createTsupConfig({
 *   external: ['eslint', 'typescript-eslint', '@eslint/js'],
 * });
 * ```
 *
 * @example
 * ```typescript
 * // With additional options
 * import { createTsupConfig } from '@jmlweb/tsup-config-base';
 * export default createTsupConfig({
 *   external: ['vitest'],
 *   options: {
 *     minify: true,
 *     sourcemap: true,
 *   },
 * });
 * ```
 */
export const createTsupConfig = (config: TsupConfigOptions = {}): Options => {
  const {
    entry = BASE_DEFAULTS.entry,
    format = BASE_DEFAULTS.format,
    dts = BASE_DEFAULTS.dts,
    clean = BASE_DEFAULTS.clean,
    outDir = BASE_DEFAULTS.outDir,
    external = [],
    options = {},
  } = config;

  return {
    entry,
    format,
    dts,
    clean,
    outDir,
    ...(external.length > 0 && { external }),
    ...options,
  };
};

/**
 * Re-export the base defaults for reference
 */
export { BASE_DEFAULTS };

/**
 * Re-export tsup's Options type for convenience
 */
export type { Options } from 'tsup';
