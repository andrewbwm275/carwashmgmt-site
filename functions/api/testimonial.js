import { corsHeaders, json, parseJson, sendEmail } from '../_utils/email.js';

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

export async function onRequestPost({ request, env }) {
  const body = await parseJson(request);
  if (!body?.name || !body?.email) {
    return json({ error: 'Name and email are required' }, 400);
  }

  const html = `
    <h2>New testimonial submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(body.name || '')}</p>
    <p><strong>Company:</strong> ${escapeHtml(body.company || '')}</p>
    <p><strong>Email:</strong> ${escapeHtml(body.email || '')}</p>
    <p><strong>Location:</strong> ${escapeHtml(body.location || '')}</p>
    <p><strong>Testimonial:</strong></p>
    <p>${escapeHtml(body.testimonial || body.message || '')}</p>
  `;

  try {
    await sendEmail(env, {
      subject: `Testimonial from ${body.name || 'carwashmgmt.com'}`,
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
