import { corsHeaders, json, parseJson, sendEmail } from '../_utils/email.js';

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

export async function onRequestPost({ request, env }) {
  const body = await parseJson(request);
  if (!body?.email) {
    return json({ error: 'Email is required' }, 400);
  }

  try {
    await sendEmail(env, {
      subject: 'Newsletter signup — carwashmgmt.com',
      html: `<p>New newsletter subscriber: <strong>${escapeHtml(body.email)}</strong></p>`,
      replyTo: body.email,
    });
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
