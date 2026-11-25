---
id: LRN-017
title: In-process prettier format() masks consumer plugin resolution bugs
status: active
tags: [prettier, pnpm, integration-tests]
task: TSK-011
created: 2026-11-25
---

The integration-tests app has prettier-plugin-tailwindcss as its own devDependency and Test 2 calls prettier's format() in-process, so a bare plugin name resolved from the integration-tests app and the pnpm bug never showed. To test consumer resolution, run the consumer's own node_modules/.bin/prettier with cwd set to the temp project, and assert the plugin is absent from the consumer's top-level node_modules. Prettier 3 resolves bare plugin names from process.cwd(), not from the config file's package.
