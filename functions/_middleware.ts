interface Env {
  BASIC_AUTH_ENABLED?: string;
  BASIC_AUTH_USERNAME?: string;
  BASIC_AUTH_PASSWORD?: string;
}

const ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on']);
const AUTH_REALM = 'Review Access';

function isBasicAuthEnabled(env: Env): boolean {
  const value = env.BASIC_AUTH_ENABLED?.trim().toLowerCase();
  return value !== undefined && ENABLED_VALUES.has(value);
}

function unauthorized(): Response {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${AUTH_REALM}", charset="UTF-8"`,
    },
  });
}

function parseBasicAuthHeader(authHeader: string | null): { username: string; password: string } | null {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }

  const encoded = authHeader.slice('Basic '.length).trim();
  if (!encoded) {
    return null;
  }

  let decoded: string;
  try {
    decoded = atob(encoded);
  } catch {
    return null;
  }

  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex === -1) {
    return null;
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  };
}

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string, unknown>) => {
  const { request, env } = context;

  if (!isBasicAuthEnabled(env)) {
    return context.next();
  }

  if (!env.BASIC_AUTH_USERNAME || !env.BASIC_AUTH_PASSWORD) {
    return new Response(
      'Basic auth is enabled but BASIC_AUTH_USERNAME or BASIC_AUTH_PASSWORD is not configured.',
      { status: 500 }
    );
  }

  const credentials = parseBasicAuthHeader(request.headers.get('Authorization'));
  if (!credentials) {
    return unauthorized();
  }

  const isAuthorized =
    credentials.username === env.BASIC_AUTH_USERNAME &&
    credentials.password === env.BASIC_AUTH_PASSWORD;

  if (!isAuthorized) {
    return unauthorized();
  }

  return context.next();
};
