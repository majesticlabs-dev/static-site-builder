/**
 * Email capture function for the CPA-Safe Claude Quickstart Pack freebie.
 *
 * Required environment variables (set in Cloudflare Pages dashboard or .dev.vars):
 * - RESEND_API_KEY: API key from resend.com
 * - FROM_EMAIL: Verified sender address (e.g. hello@yourdomain.com)
 * - SITE_URL: Public URL of the site (e.g. https://yoursite.pages.dev)
 *
 * Optional:
 * - RESEND_AUDIENCE_ID: Audience/list ID to add the contact to in Resend
 */

interface Env {
  RESEND_API_KEY: string;
  FROM_EMAIL: string;
  SITE_URL: string;
  RESEND_AUDIENCE_ID?: string;
}

const DOWNLOAD_PATH = '/downloads/cpa-safe-claude-quickstart-pack.zip';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const missingVars = ['RESEND_API_KEY', 'FROM_EMAIL', 'SITE_URL'].filter(
    (k) => !env[k as keyof Env],
  );
  if (missingVars.length > 0) {
    console.error('Missing env vars:', missingVars);
    return json({ error: 'Server configuration error. Please try again later.' }, 500);
  }

  let name: string;
  let email: string;

  const contentType = request.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    const body = await request.json<{ name?: string; email?: string }>();
    name = (body.name ?? '').trim();
    email = (body.email ?? '').trim().toLowerCase();
  } else {
    const formData = await request.formData();
    name = ((formData.get('name') as string) ?? '').trim();
    email = ((formData.get('email') as string) ?? '').trim().toLowerCase();
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'A valid email address is required.' }, 400);
  }

  const downloadUrl = `${env.SITE_URL}${DOWNLOAD_PATH}`;
  const firstName = name.split(' ')[0] || 'there';

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#1f2833;background:#f7f4ed;margin:0;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #d7d2c8;border-radius:16px;padding:32px">
    <p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:#14532d;font-weight:700;margin:0 0 12px">Free Pack</p>
    <h1 style="font-size:1.5rem;margin:0 0 16px;line-height:1.2">Your CPA-Safe Claude Quickstart Pack</h1>
    <p style="color:#4b5563;margin:0 0 24px">Hi ${firstName},</p>
    <p style="color:#4b5563;margin:0 0 24px">
      Here's your free pack. Use the prompts. Steal a few easy wins. See where Claude helps and where it needs a leash.
    </p>
    <div style="text-align:center;margin:28px 0">
      <a href="${downloadUrl}"
         style="display:inline-block;background:#0f766e;color:#ffffff;font-weight:700;font-size:1rem;padding:14px 28px;border-radius:999px;text-decoration:none">
        Download Your Free Pack
      </a>
    </div>
    <p style="color:#4b5563;font-size:0.92rem;margin:0 0 16px">
      If you want the full version — with the complete prompt vault, workflow playbook, rollout plan,
      and review system — that's <strong>Claude Cowork for CPAs: Busy-Season Workflow Kit</strong>.
    </p>
    <hr style="border:none;border-top:1px solid #d7d2c8;margin:24px 0">
    <p style="color:#4b5563;font-size:0.82rem;margin:0">
      You signed up at ${env.SITE_URL}. No spam. Unsubscribe anytime by replying "unsubscribe".
    </p>
  </div>
</body>
</html>`;

  const emailText = `Hi ${firstName},

Here's your CPA-Safe Claude Quickstart Pack.

Download link: ${downloadUrl}

Use the prompts. Steal a few easy wins. See where Claude helps and where it needs a leash.

If you want the full version — Claude Cowork for CPAs: Busy-Season Workflow Kit — visit ${env.SITE_URL}.

---
You signed up at ${env.SITE_URL}. No spam. Reply "unsubscribe" to opt out.`;

  const sendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: [email],
      subject: 'Your CPA-Safe Claude Quickstart Pack',
      html: emailHtml,
      text: emailText,
    }),
  });

  if (!sendRes.ok) {
    const body = await sendRes.text();
    console.error('Resend error:', sendRes.status, body);
    return json({ error: 'Failed to send email. Please try again.' }, 502);
  }

  // Optionally add contact to Resend audience
  if (env.RESEND_AUDIENCE_ID) {
    await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, first_name: firstName }),
    }).catch((err) => console.warn('Audience sync failed (non-fatal):', err));
  }

  return json({ ok: true, downloadUrl });
};

// Return 405 for non-POST requests
export const onRequest: PagesFunction<Env> = async () => {
  return json({ error: 'Method not allowed.' }, 405);
};
