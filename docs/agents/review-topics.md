# Code Review Topics

Custom review rules for the Static Builder project.

## Astro Components

- [ ] Use `.astro` extension for Astro components
- [ ] Prefer scoped styles over global CSS when possible
- [ ] Use Content Collections for typed content access
- [ ] Avoid client-side JavaScript unless necessary (progressive enhancement)

## Content Collections

- [ ] Define schemas in `src/content.config.ts` using Zod
- [ ] Use `getCollection()` and `getEntry()` for type-safe content access
- [ ] Keep frontmatter minimal and well-documented

## Decap CMS

- [ ] Keep `public/admin/config.yml` in sync with content collection schemas
- [ ] Use appropriate widgets for field types
- [ ] Test CMS locally with `npm run dev:cms` before pushing

## Cloudflare Functions

- [ ] Type all function parameters with `EventContext<Env, string, unknown>`
- [ ] Handle errors gracefully with appropriate HTTP status codes
- [ ] Keep functions minimal - prefer static generation

## TypeScript

- [ ] No `any` types - use proper typing or `unknown`
- [ ] Export types for shared interfaces
- [ ] Use strict mode (already configured)

## Performance

- [ ] Prefer static generation over SSR
- [ ] Use passthrough image service (Cloudflare handles optimization)
- [ ] Minimize client-side JavaScript bundle

## Security

- [ ] Never commit `.dev.vars` or secrets
- [ ] Validate all user input in functions
- [ ] Use HTTPS for all external requests
