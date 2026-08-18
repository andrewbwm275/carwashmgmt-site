import { corsHeaders, json, parseJson, sendEmail } from '../_utils/email.js';

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

export async function onRequestPost({ request, env }) {
  const body = await parseJson(request);
  if (!body?.name || !body?.email) {
    return json({ error: 'Name and email are required' }, 400);
  }
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) {
    return json({ error: 'Quote cart is empty' }, 400);
  }

  const rows = items
    .map(
      (it) =>
        `<tr><td>${escapeHtml(it.name)}</td><td>${escapeHtml(it.size)}</td><td>${escapeHtml(
          it.price != null ? `$${Number(it.price).toFixed(2)}` : 'Quote'
        )}</td></tr>`
    )
    .join('');

  try {
    await sendEmail(env, {
      subject: `Chemical quote request — ${body.name}`,
      html: `
        <h2>New chemical quote request</h2>
        <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(body.phone || 'Not provided')}</p>
        <p><strong>Company:</strong> ${escapeHtml(body.company || 'Not provided')}</p>
        <p><strong>Notes:</strong> ${escapeHtml(body.notes || '')}</p>
        <table border="1" cellpadding="6" cellspacing="0">
          <thead><tr><th>Product</th><th>Size</th><th>Price</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
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
