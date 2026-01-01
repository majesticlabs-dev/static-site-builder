/**
 * GitHub OAuth handler for Decap CMS on Cloudflare Pages
 *
 * Required environment variables (set in Cloudflare Pages dashboard):
 * - GITHUB_CLIENT_ID: Your GitHub OAuth App client ID
 * - GITHUB_CLIENT_SECRET: Your GitHub OAuth App client secret
 */

interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string, unknown>) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // Handle the initial OAuth redirect
  if (url.searchParams.has('provider') && url.searchParams.get('provider') === 'github') {
    const scope = url.searchParams.get('scope') || 'repo,user';
    const authUrl = new URL(GITHUB_AUTHORIZE_URL);
    authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', `${url.origin}/api/auth/callback`);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('state', crypto.randomUUID());

    return Response.redirect(authUrl.toString(), 302);
  }

  return new Response('OAuth endpoint. Use ?provider=github to start auth flow.', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
};
