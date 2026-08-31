# Security checklist — Pakistan School Seeb

## Done in this build
- [x] XSS escaping for admin detail views (`esc` / `escAttr`)
- [x] File upload limits: 2MB, images/PDF only, max 6 files
- [x] Input validation on admissions (required, email, phone)
- [x] Client-side admin login rate limit (8 attempts / 15 min)
- [x] HTTPS via GitHub Pages
- [x] No service-account private keys in repo
- [x] Receipt always shown after successful application submit
- [x] Compressed campus image; removed heavy duplicate logo/favicon assets
- [x] Lightweight PNG favicon instead of 70KB SVG

## You must do in Firebase / Google Cloud
1. **API key restriction**  
   [Google Cloud → Credentials](https://console.cloud.google.com/apis/credentials?project=panel-e3ee1)  
   → your Browser key → Application restrictions → HTTP referrers:  
   - `https://khans1947.github.io/*`  
   - `http://localhost/*` (optional, for testing)

2. **Firestore rules**  
   Copy `firestore.rules` into Firebase Console → Firestore → Rules → Publish.  
   Note: with `content` write locked, admin cloud save needs Firebase Auth or temporary `allow write: if true` while testing.

3. **Change admin password** in `admin.html` (`ADMIN_PASSWORD`). Password is stored as SHA-256 hash only (not plaintext). Set your own hash in admin.html.

4. **Before 21 Sep 2026** — replace any remaining open test-mode rules.

## Architecture notes
| Item | Status |
|------|--------|
| Firebase web API key in frontend | Expected — not a private secret |
| Server-side password hashing | N/A without custom server; use Firebase Auth for real admin accounts later |
| Session cookies | Not used; admin uses sessionStorage flag |
| SQL injection | N/A (Firestore) |

## Optional next upgrades
- Firebase Authentication for admin only
- Cloudflare Turnstile on contact + admissions
- Netlify/Firebase Hosting security headers (CSP, X-Frame-Options)
