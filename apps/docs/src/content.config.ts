import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const collections: Record<string, any> = {
  docs: defineCollection({ schema: docsSchema() }),
};
