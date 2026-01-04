import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

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
      sidebar: [
        {
          label: 'Home',
          link: '/',
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
