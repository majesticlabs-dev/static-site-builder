import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const settings = defineCollection({
  loader: file('./src/content/settings/general.json'),
  schema: z.object({
    siteTitle: z.string(),
    siteDescription: z.string(),
    logo: z.string().nullable().optional(),
    socialLinks: z.array(z.object({
      platform: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

export const collections = { blog, pages, settings };
