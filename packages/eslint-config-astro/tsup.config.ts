import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  external: [
    '@jmlweb/eslint-config-base',
    '@eslint/js',
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-astro',
    'eslint-plugin-simple-import-sort',
    'typescript-eslint',
  ],
});



