import { corsHeaders, json, parseJson, sendEmail } from '../_utils/email.js';

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

export async function onRequestPost({ request, env }) {
  const body = await parseJson(request);
  if (!body?.name || !body?.email) {
    return json({ error: 'Name and email are required' }, 400);
  }

  try {
    await sendEmail(env, {
      subject: `Profit guide request — ${body.name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
        <p>Requested the Car Wash Profit Guide from the site popup.</p>
      `,
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
