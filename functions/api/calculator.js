import { corsHeaders, json, parseJson, sendEmail } from '../_utils/email.js';

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

export async function onRequestPost({ request, env }) {
  const body = await parseJson(request);
  if (!body?.name || !body?.email) {
    return json({ error: 'Name and email are required' }, 400);
  }

  const r = body.results || {};
  const html = `
    <h2>New ROI calculator lead</h2>
    <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(body.phone || 'Not provided')}</p>
    <p><strong>City/State:</strong> ${escapeHtml(body.city_state || 'Not provided')}</p>
    <p><strong>Locations:</strong> ${escapeHtml(String(body.locations || '1'))}</p>
    <h3>Inputs</h3>
    <ul>
      <li>Monthly washes: ${escapeHtml(String(body.cars || ''))}</li>
      <li>Water bill: ${escapeHtml(String(body.water || ''))}</li>
      <li>Chemical cost: ${escapeHtml(String(body.chem || ''))}</li>
      <li>Pit cleaning: ${escapeHtml(String(body.pit || ''))}</li>
      <li>Maintenance: ${escapeHtml(String(body.maint || ''))}</li>
    </ul>
    <h3>Estimated savings</h3>
    <ul>
      <li>Annual: $${escapeHtml(String(r.total_annual ?? ''))}</li>
      <li>Monthly: $${escapeHtml(String(r.total_monthly ?? ''))}</li>
      <li>Water/mo: $${escapeHtml(String(r.water_savings ?? ''))}</li>
      <li>Chemical/mo: $${escapeHtml(String(r.chemical_savings ?? ''))}</li>
      <li>Maintenance/mo: $${escapeHtml(String(r.maintenance_savings ?? ''))}</li>
      <li>ROI months: ${escapeHtml(String(r.roi ?? ''))}</li>
      <li>Confidence: ${escapeHtml(String(r.conf ?? ''))}%</li>
    </ul>
  `;

  try {
    await sendEmail(env, {
      subject: `Calculator lead: ${body.name} — $${r.total_annual ?? '?'}/yr`,
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
