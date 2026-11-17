import type { UserConfig } from 'vite';

import react from '@vitejs/plugin-react';

import { createReactViteConfig, createViteConfig } from '../../src/index';

// Documented README usage: react() returns Plugin[] in @vitejs/plugin-react 6
export const readmeConfig: UserConfig = createReactViteConfig({
  reactPlugin: react(),
});

// Documented JSDoc usage with plugin options and extra plugins
export const configuredReactConfig: UserConfig = createReactViteConfig({
  reactPlugin: react({ jsxImportSource: '@emotion/react' }),
  plugins: [{ name: 'extra-plugin' }],
  build: { sourcemap: true },
});

// Documented JSDoc usage of the base factory with the React plugin
export const baseConfigWithReact: UserConfig = createViteConfig({
  plugins: [react()],
});
