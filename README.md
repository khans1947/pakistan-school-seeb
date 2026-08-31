# Pakistan School Seeb — Enterprise School Platform

Multilingual (EN / AR / UR) school website with Firebase cloud sync, admissions pipeline, live inventory, notices, and admin dashboard.

## Quick start

1. Unzip and open `index.html` via a local server (`python3 -m http.server 8080`).
2. Admin: open `admin.html` (default password in SETUP — change it).
3. For **live multi-device sync**, follow `SETUP-LIVE.md` (Firebase).

## Public pages

| Page | Purpose |
|------|---------|
| `index.html` | Home, notices ticker, network, CTAs |
| `admissions.html` | Multi-step application + fees calculator |
| `track.html` | Parent application status (ID + phone/email) |
| `books.html` | Books + uniforms + stationery stock (OMR) |
| `notices.html` | Searchable circulars archive |
| `academics.html` | Curriculum & faculty |
| `gallery.html` | Student life |
| `contact.html` | Map, inquiry form |
| `privacy.html` / `terms.html` | Compliance |

## Admin

- Stats, ticker, notices
- Admissions status updates (Submitted → Review → Interview → Accepted / Waitlisted / Rejected)
- Public notes visible on parent tracking
- Books / content editing
- Inquiries

## Data model (Firestore / local)

- `applications` — trackingId, status, timeline, publicNotes
- `inventory` / `data/inventory.json` — books, uniforms, stationery
- `content` — stats, ticker, notices
- `inquiries` — contact form

## Notifications

Set `window.PSS_NOTIFY_WEBHOOK = 'https://your-endpoint'` before cloud init to receive admission_submitted events (email/WhatsApp provider).

## Languages

Navbar **EN | ع | اردو** — preference in `localStorage` (`pss-lang`). Expand strings in `js/i18n.js`.

## Security

- Restrict Firebase API key by HTTP referrer
- Replace open Firestore test rules before production
- Change admin password
