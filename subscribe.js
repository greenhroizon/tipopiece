// Vercel serverless function. The API key stays on the server, never in the browser.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID } = process.env;
  if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID)
    return res.status(500).json({ error: 'Server is not configured.' });

  const { email, company, utm_source, utm_medium, utm_campaign, referring_site } = req.body || {};
  if (company) return res.status(200).json({ ok: true }); // honeypot caught a bot
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Please enter a valid email.' });

  try {
    const r = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${BEEHIIV_API_KEY}` },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: utm_source || 'landing_page',
          utm_medium, utm_campaign, referring_site,
        }),
      }
    );
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      console.error('beehiiv error', r.status, d);
      return res.status(502).json({ error: 'Could not subscribe right now. Please try again.' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
