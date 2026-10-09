import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import starlightLlmsTxt from 'starlight-llms-txt';

// https://astro.build/config
export default defineConfig({
  site: 'https://jmlweb.github.io',
  base: '/tooling',
  integrations: [
    starlight({
      title: 'jmlweb-tooling',
      description:
        'Shared configuration packages for modern JavaScript and TypeScript projects',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/jmlweb/tooling',
        },
      ],
      plugins: [
        starlightLlmsTxt({
          projectName: 'jmlweb-tooling',
        }),
      ],
      sidebar: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Getting Started',
          link: '/getting-started',
        },
        {
          label: 'Oxfmt',
          items: [
            {
              label: 'base',
              link: '/oxfmt/base',
            },
          ],
        },
        {
          label: 'Prettier',
          items: [
            {
              label: 'base',
              link: '/prettier/base',
            },
            {
              label: 'tailwind',
              link: '/prettier/tailwind',
            },
          ],
        },
        {
          label: 'Oxlint',
          items: [
            {
              label: 'base',
              link: '/oxlint/base',
            },
            {
              label: 'react',
              link: '/oxlint/react',
            },
            {
              label: 'node',
              link: '/oxlint/node',
            },
          ],
        },
        {
          label: 'ESLint',
          items: [
            {
              label: 'base-js',
              link: '/eslint/base-js',
            },
            {
              label: 'base',
              link: '/eslint/base',
            },
            {
              label: 'react',
              link: '/eslint/react',
            },
            {
              label: 'node',
              link: '/eslint/node',
            },
            {
              label: 'astro',
              link: '/eslint/astro',
            },
          ],
        },
        {
          label: 'TypeScript',
          items: [
            {
              label: 'base',
              link: '/typescript/base',
            },
            {
              label: 'node',
              link: '/typescript/node',
            },
            {
              label: 'react',
              link: '/typescript/react',
            },
            {
              label: 'nextjs',
              link: '/typescript/nextjs',
            },
            {
              label: 'astro',
              link: '/typescript/astro',
            },
          ],
        },
        {
          label: 'Testing',
          items: [
            {
              label: 'vitest',
              link: '/testing/vitest',
            },
            {
              label: 'jest',
              link: '/testing/jest',
            },
          ],
        },
        {
          label: 'Build Tools',
          items: [
            {
              label: 'tsup',
              link: '/build-tools/base',
            },
            {
              label: 'tsdown',
              link: '/build-tools/tsdown',
            },
            {
              label: 'vite',
              link: '/build-tools/vite',
            },
          ],
        },
        {
          label: 'Commit',
          items: [
            {
              label: 'commitlint',
              link: '/commit/commitlint',
            },
          ],
        },
      ],
      customCss: [],
    }),
  ],
});
