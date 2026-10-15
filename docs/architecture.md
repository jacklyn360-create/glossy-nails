# Glossy Nails Architecture

## 1. Current system overview

Glossy Nails is a static multi-page website. GitHub Pages serves the repository content; there is no application server or database in the deployed path.

```text
Visitor's browser
  ├── HTML pages: index, portfolio, inspiration, generator, booking
  ├── styles.css: shared visual styles
  ├── script.js: gallery, slideshow, browser storage, shared interactions
  ├── design-generator.html: generator UI and canvas rendering logic
  ├── images/: portfolio and inspiration assets
  └── Third parties: Google Fonts, Calendly, EmailJS (booking page)

Optional local experiment:
  Browser / direct caller -> generate_image.py HTTP server -> Pollinations
                                                   └──────> Pillow fallback
```

The optional Python server is not wired into the browser generator. The current generator creates an illustration locally in a browser canvas and returns a PNG data URL.

## 2. Components and responsibilities

| Component | Responsibility |
|---|---|
| `index.html`, `portfolio.html`, `inspo-gallery.html`, `design-generator.html`, `book-now.html` | Page markup and page-specific content / interaction code. |
| `styles.css` | Shared navigation, page, gallery, portfolio, modal, and responsive styles. Some page-specific styles are inline in the corresponding HTML. |
| `script.js` | Shared DOM-ready setup, gallery filtering, portfolio slideshow, saved-design cart, and local browser storage. |
| `config.js` | Client-side EmailJS configuration values. Values included in a static file are visible to site visitors and must not be treated as secrets. |
| `images/` | Static portfolio and inspiration image assets. |
| `generate_image.py` | Optional Python HTTP server: GET `/health` and GET `/generate?prompt=...`; tries Pollinations and falls back to a locally drawn Pillow illustration. |
| `.github/workflows/deploy.yml` | Python syntax and required-file checks, then GitHub Pages deployment from repository root on `main`. |

## 3. Data flow

1. Gallery filtering and search operate on card metadata embedded in `inspo-gallery.html`.
2. Sending inspiration stores the description under `glossyInspoPrompt` in `localStorage`, then navigates to the generator.
3. The generator reads that value and draws a 512x512 canvas image from the prompt, selected shape, and budget. The prompt affects a finite set of palettes and decorative motifs; it is not sent to an AI model.
4. Saved gallery and generated designs use `glossyBookingCart` in browser `localStorage`. This is device/browser-local, not shared across devices or accounts.
5. Booking is embedded through Calendly. The page also loads EmailJS and reads a `glossySelectedDesign` storage value on a scheduled event; the saved-cart flow and this selected-design handoff should be reconciled and tested as one complete user journey.
6. If started independently, `generate_image.py` accepts an HTTP prompt, contacts Pollinations, and on failure attempts a Pillow-based procedural illustration. It returns image bytes or an HTTP error.

## 4. Deployment and runtime

- **Website runtime:** A modern browser; no build step is currently required.
- **Local development:** Open the HTML files directly or serve the repository with a local static server.
- **Production hosting:** GitHub Pages deployment is automated by the `deploy` job after the `test` job passes on pushes to `main`.
- **Python service:** For local experimentation only. Requires Python and Pillow. It is not deployed by the current GitHub Pages workflow as a running service.
- **External dependencies:** Google Fonts, Calendly, EmailJS, and Pollinations (only for the optional Python server).

## 5. Boundaries and risks

- Static assets, source, and client-side configuration are public. Never put private credentials in HTML, JavaScript, or `config.js`.
- Browser storage may be unavailable, cleared, or edited by the visitor; handle it as optional client-side state rather than authoritative booking data.
- The Python server currently uses the standard HTTP server, accepts a prompt through a GET query, and sends wildcard CORS headers. It is not production-hardened. Before public hosting, add bounded input and output sizes, origin restrictions, request throttling, robust timeouts, content-type validation, and explicit error logging.
- Remote image data and user prompts require defensive validation and documented privacy handling before a production model integration.
- Third-party booking and email widgets can be unavailable independently of the static website.
- CI currently syntax-checks the Python file and checks selected required files; it does not test JavaScript behavior, HTML accessibility, external integrations, or Python runtime dependencies.

## 6. Evolution path

Keep the current static frontend until product requirements call for server-side persistence or protected integrations. If genuine model inference is adopted, place provider calls behind a server-side API, keep secrets on the server, define request limits and error semantics, and expose a versioned interface to the frontend. Keep the canvas renderer clearly labeled as a local preview or fallback, not as equivalent model-generated output.
