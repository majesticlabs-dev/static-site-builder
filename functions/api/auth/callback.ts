/**
 * GitHub OAuth callback handler for Decap CMS
 */

interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string, unknown>) => {
  const { request, env } = context;
  const url = new URL(request.url);

  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(`Authentication error: ${error}`, { status: 400 });
  }

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json() as {
      access_token?: string;
      token_type?: string;
      error?: string;
      error_description?: string;
    };

    if (tokenData.error) {
      return new Response(`Token error: ${tokenData.error_description || tokenData.error}`, {
        status: 400
      });
    }

    // Return the token to the CMS via postMessage
    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage %o", e);
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({
                token: tokenData.access_token,
                provider: 'github'
              })}',
              e.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })();
      </script>
    `;

    return new Response(script, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    console.error('OAuth callback error:', err);
    return new Response('Authentication failed', { status: 500 });
  }
};
