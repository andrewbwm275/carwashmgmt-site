const TO_EMAIL = 'info@carwashmgmt.com';
const FROM_EMAIL = 'Car Wash Services <noreply@carwashmgmt.com>';

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function sendEmail(env, { subject, html, replyTo }) {
  if (!env.RESEND_API_KEY) {
    throw new Error('Email service not configured. Set RESEND_API_KEY in Cloudflare Pages environment variables.');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: replyTo,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Email send failed: ${err}`);
  }

  return res.json();
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

export async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
