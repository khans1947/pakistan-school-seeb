# Optimizations applied (this package)

## Performance
- Compressed `assets/campus-photo.jpg` (~178 KB → ~117 KB)
- Removed heavy duplicate assets (`logo.svg`, `favicon.svg` ~70 KB each, duplicate `logo-new.png`)
- Favicon switched to lightweight `favicon-32.png`
- Deferred `particles.js`, `chatbot.js`, `i18n.js` on homepage
- Deduplicated Google Fonts URL
- `prefers-reduced-motion` disables animations & particles
- Images constrained with `max-width: 100%`

## Security
- `SECURITY.md` + production `firestore.rules` template
- Admin login rate limit (8 fails → 15 min cooldown)
- Contact form honeypot (`website` field)
- Admissions: file type whitelist (images/PDF), max 6 files, 2 MB
- Input length limits on contact inquiry fields
- Fixed incomplete contact-form handler in `main.js`
- Referrer policy meta on homepage
- XSS escaping retained in admin detail views

## Reliability / UX
- Admissions receipt modal always forced after successful submit
- Fallback `alert` with tracking ID if modal missing

## What you still configure outside the zip
1. Change `ADMIN_PASSWORD_HASH` in `admin.html` (SHA-256 of password)
2. Restrict Firebase API key by HTTP referrer
3. Publish `firestore.rules` (adjust write flags when using admin without Auth)
4. Optional: re-export campus as WebP for another ~30–40% saving
