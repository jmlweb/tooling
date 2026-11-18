import react from '@vitejs/plugin-react';
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createReactViteConfig } from '../src/index.ts';

await test('createReactViteConfig places the React plugins first', () => {
  const reactPlugins = react();
  const extraPlugin = { name: 'extra-plugin' };

  const config = createReactViteConfig({
    reactPlugin: reactPlugins,
    plugins: [extraPlugin],
  });

  assert.deepEqual(config.plugins, [reactPlugins, extraPlugin]);
});
