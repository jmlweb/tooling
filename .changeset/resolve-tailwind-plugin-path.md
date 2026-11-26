---
'@jmlweb/prettier-config-tailwind': patch
---

Resolve `prettier-plugin-tailwindcss` from this package and pass Prettier its absolute path. The config previously listed the plugin by bare name, which Prettier resolves from the consumer project, so pnpm projects (which do not hoist this package's dependencies) failed with "Cannot find package 'prettier-plugin-tailwindcss'". Both the ESM and CJS builds now load the bundled plugin, so no separate install is needed with any package manager.
