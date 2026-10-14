# The Money Grid – landing page + beehiiv signup

Files: index.html (signup), thank-you.html, style.css, api/subscribe.js (server function)

## Deploy (Vercel, free)
1. Put this folder in a GitHub repo (or run `vercel` in the folder).
2. In Vercel > Project > Settings > Environment Variables add:
   - BEEHIIV_API_KEY (beehiiv: Settings > Integrations > API)
   - BEEHIIV_PUBLICATION_ID (starts with `pub_`, same page)
3. Redeploy. Test with a real email.

Never paste the API key into the HTML files; anyone could read it.
Netlify works too: move api/subscribe.js to netlify/functions and adapt the handler signature.
