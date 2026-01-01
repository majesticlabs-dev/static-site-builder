import { defineConfig, passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
// Uncomment for SSR on Cloudflare Pages:
// import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Replace with your actual domain
  site: 'https://your-site.pages.dev',

  // Use 'static' for pure SSG, 'server' or 'hybrid' for SSR
  output: 'static',

  // Uncomment for SSR on Cloudflare Pages (also uncomment import above)
  // adapter: cloudflare(),

  // Use passthrough image service (no build-time processing)
  // Images will be served as-is, relying on Cloudflare's edge optimization
  image: {
    service: passthroughImageService(),
  },

  integrations: [
    mdx(),
    sitemap(),
  ],

  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
