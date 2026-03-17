import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

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

export const collections = { settings };
