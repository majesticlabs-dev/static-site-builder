# Static Builder

Load config: @.agents.yml

A static site generator using Astro, Decap CMS, and Cloudflare Pages.

## Project Overview

This is a static site builder that combines:
- **Astro** (v5) - Static site generation with content collections
- **Decap CMS** - Git-based headless CMS for content management
- **Cloudflare Pages** - Deployment platform with edge functions

## Architecture

```
src/
├── content/           # Markdown content managed by Decap CMS
│   ├── blog/          # Blog posts
│   ├── pages/         # Static pages
│   └── settings/      # Site configuration (JSON)
├── layouts/           # Astro layouts (BaseLayout, BlogPost)
├── pages/             # Astro page routes
├── styles/            # Global CSS
└── content.config.ts  # Content collection schemas

public/
└── admin/             # Decap CMS admin interface
    ├── index.html     # CMS entry point
    └── config.yml     # CMS collections config

functions/             # Cloudflare Pages Functions
└── api/auth/          # GitHub OAuth for CMS authentication
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Astro dev server |
| `npm run dev:cms` | Start with local CMS backend |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |

## Content Management

### Adding Content

Content is managed through Decap CMS at `/admin` or by editing markdown files directly:

- **Blog posts**: `src/content/blog/*.md` with frontmatter (title, description, pubDate, tags)
- **Pages**: `src/content/pages/*.md` with frontmatter (title, description)
- **Settings**: `src/content/settings/general.json` for site-wide config

### Content Collections

Defined in `src/content.config.ts` using Astro's Content Collections API with Zod schemas for type safety.

## Cloudflare Pages

### Static Build

Default configuration uses static output. Build settings:
- Build command: `npm run build`
- Output directory: `dist`

### OAuth Functions

GitHub OAuth handlers in `functions/api/auth/` require environment variables:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

## Code Style

- TypeScript with strict mode
- Astro components use `.astro` extension
- CSS uses BEM-like naming in component styles
- Markdown content uses frontmatter for metadata

## Testing

Currently no test framework configured. Consider adding:
- Playwright for E2E testing
- Vitest for unit tests

## Deployment

1. Push to GitHub
2. Connect to Cloudflare Pages
3. Configure GitHub OAuth app
4. Set environment variables in Cloudflare dashboard
