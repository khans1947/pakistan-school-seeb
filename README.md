# Pakistan School Seeb — Official Web Portal

Next-generation, futuristic web portal for **Pakistan School Seeb** (Al Seeb, Muscat, Oman), a branch of Pakistan School Muscat (PSM).

## Features

- **Interactive particle mesh background** with cursor repulsion, aurora glow, and grid ripples (desktop); ambient gradient mesh on mobile/touch
- **Glassmorphism UI** with Pakistani flag green (#01411C / #00A859), white, slate, and gold accents
- **Dark / Light mode** toggle with persistent preference
- **Multi-step admissions wizard** with localStorage draft persistence, validation, document dropzone, tracking ID generation, and printable receipt
- **Fee calculator** (tuition + transport by grade & route)
- **Application status tracker** (client-side mock)
- **Filterable noticeboard** with instant search and .ics calendar export
- **Faculty directory** with department filters
- **Multimedia gallery** with category filters and lightbox
- **Leaflet / OpenStreetMap** campus location embed
- **Responsive** mobile-first design (375px → 1440px+)
- **Accessibility**: semantic HTML, keyboard navigation, ARIA labels
- **SEO**: Schema.org School markup, Open Graph meta

## Pages

| File | Description |
|------|-------------|
| `index.html` | Landing portal — hero, about, streams, facilities, notices, testimonials, network |
| `admissions.html` | Application wizard, fee calculator, status tracker |
| `academics.html` | Faculty directory, academic calendar, curriculum pathways |
| `gallery.html` | Student life gallery & clubs |
| `contact.html` | Contact info, inquiry form, interactive map |

## Run Locally

Open any HTML file in a modern browser, or serve the folder:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

## Tech Stack

- Vanilla HTML5 / CSS3 / ES6+ JavaScript
- Canvas 2D particle system
- Leaflet.js (map)
- Google Fonts (Space Grotesk + Inter)
- localStorage for form drafts & mock applications

## Brand Colours

| Token | Hex |
|-------|-----|
| Pakistani Green | `#01411C` |
| Mid Green | `#00662B` |
| Emerald Accent | `#00A859` |
| Gold | `#D4AF37` |
| Slate | `#0F172A` |
| White | `#FFFFFF` |

## Notes

- Backend LMS / Parent Portal links redirect to the main Pakistan School Muscat site (placeholders).
- Document uploads are simulated client-side; production would use cloud storage.
- Email dispatch is simulated via toast notifications.
- Principal video is a placeholder modal ready for YouTube/Vimeo embed.

---

© 2026 Pakistan School Seeb · Pakistan Schools Oman  
*"Light the Torch for Knowledge"*
