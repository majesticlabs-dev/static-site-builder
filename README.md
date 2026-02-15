# Static Builder

A static site built with Astro, Decap CMS, and Cloudflare Pages.

## Quick Start

```bash
# Install dependencies
bun install

# Run development server with CMS
bun run dev:cms

# Or just the dev server
bun run dev
```

Visit `http://localhost:4321` for the site and `http://localhost:4321/admin` for the CMS.

## Deployment to Cloudflare Pages

### 1. Connect Repository

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
3. Create a new project and connect your GitHub repo
4. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`

### 2. Set Up GitHub OAuth (for CMS)

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - Homepage URL: `https://your-site.pages.dev`
   - Authorization callback URL: `https://your-site.pages.dev/api/auth/callback`
3. Copy the Client ID and generate a Client Secret

### 3. Add Environment Variables

In Cloudflare Pages dashboard → Settings → Environment variables:

| Variable | Value |
|----------|-------|
| `GITHUB_CLIENT_ID` | Your GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth Client Secret |
| `BASIC_AUTH_ENABLED` | `true` to enable temporary Basic Auth gate (optional) |
| `BASIC_AUTH_USERNAME` | Review username (required when Basic Auth enabled) |
| `BASIC_AUTH_PASSWORD` | Review password (required when Basic Auth enabled) |

### 4. Update Configuration

Edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: your-username/your-repo
  branch: main
  base_url: https://your-site.pages.dev
  auth_endpoint: /api/auth

site_url: https://your-site.pages.dev
```

### Temporary Review Protection (Basic Auth)

Use this when you want the entire site blocked behind a username/password during review.

1. In Cloudflare Pages, open your project and go to **Settings → Environment variables**.
2. Set:
   - `BASIC_AUTH_ENABLED=true`
   - `BASIC_AUTH_USERNAME=<review-username>`
   - `BASIC_AUTH_PASSWORD=<strong-random-password>`
3. Redeploy (or trigger a new deployment) so the function reads the new values.

Verify protection is active:

```bash
curl -I https://your-site.pages.dev
```

You should see `401 Unauthorized` and a `WWW-Authenticate: Basic ...` header when not authenticated.

After review, remove the gate:

1. Set `BASIC_AUTH_ENABLED=false` (or delete the variable).
2. Redeploy again.

## Project Structure

```
├── src/
│   ├── content/         # Markdown content (blog posts, pages)
│   ├── layouts/         # Astro layouts
│   ├── pages/           # Astro pages and routes
│   ├── components/      # Reusable components
│   └── styles/          # Global CSS
├── public/
│   ├── admin/           # Decap CMS files
│   └── images/          # Uploaded media
├── functions/           # Cloudflare Pages Functions (OAuth)
└── astro.config.mjs     # Astro configuration
```

## Content Management

### Adding Blog Posts

1. Go to `/admin` on your site
2. Click "Blog Posts" → "New Blog Post"
3. Fill in the fields and save
4. The CMS creates a PR (editorial workflow) or commits directly

### Local Development

The CMS works locally with `npm run dev:cms`:
- Changes are saved to local files
- No GitHub auth needed
- Great for testing content changes

## Customization

### Adding New Collections

Edit `public/admin/config.yml` and `src/content/config.ts` to add new content types.

### Styling

Edit `src/styles/global.css` or add component-scoped styles in `.astro` files.

### SSR Mode

For server-side rendering, uncomment the adapter in `astro.config.mjs`:

```js
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server', // or 'hybrid'
  adapter: cloudflare(),
});
```

## License

MIT
