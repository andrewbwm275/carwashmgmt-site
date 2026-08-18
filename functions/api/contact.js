import { corsHeaders, json, parseJson, sendEmail } from '../_utils/email.js';

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

export async function onRequestPost({ request, env }) {
  const body = await parseJson(request);
  if (!body?.name || !body?.email) {
    return json({ error: 'Name and email are required' }, 400);
  }

  const help = Array.isArray(body.help) ? body.help.join(', ') : '';
  const html = `
    <h2>New contact request from carwashmgmt.com</h2>
    <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(body.phone || 'Not provided')}</p>
    <p><strong>Company:</strong> ${escapeHtml(body.company_name || 'Not provided')}</p>
    <p><strong>City/State:</strong> ${escapeHtml(body.city_state || 'Not provided')}</p>
    <p><strong>Wash type:</strong> ${escapeHtml(body.wash_type || 'Not provided')}</p>
    <p><strong>Locations:</strong> ${escapeHtml(body.locations || 'Not provided')}</p>
    <p><strong>How can we help:</strong> ${escapeHtml(help || 'Not specified')}</p>
    <p><strong>Urgency:</strong> ${escapeHtml(body.urgency || 'Not specified')}</p>
    <p><strong>Preferred follow-up:</strong> ${escapeHtml(body.followup || 'Not specified')}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(body.message || '')}</p>
  `;

  try {
    await sendEmail(env, {
      subject: `New contact from ${body.name}`,
      html,
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
