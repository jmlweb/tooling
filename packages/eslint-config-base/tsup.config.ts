import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  external: [
    '@jmlweb/eslint-config-base-js',
    '@eslint/js',
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-simple-import-sort',
    'typescript-eslint',
  ],
});
