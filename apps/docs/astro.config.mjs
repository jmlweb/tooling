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
          label: 'Start Here',
          items: [{ label: 'Introduction', slug: 'index' }],
        },
      ],
      customCss: [],
    }),
  ],
});
