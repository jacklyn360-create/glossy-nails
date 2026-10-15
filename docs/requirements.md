# Glossy Nails Project Requirements

## 1. Purpose

Glossy Nails is a responsive web presence for a nail technician. It helps prospective clients discover the business, browse completed work and design inspiration, explore a nail-design concept, and proceed to appointment scheduling.

This document distinguishes the current implementation from intended improvements. It is not a claim that every planned capability is already available.

## 2. Users and goals

- **Prospective client:** Understand the service, browse styles, and find a way to book.
- **Returning client:** Revisit saved design ideas and continue toward booking.
- **Nail technician / site owner:** Present work, communicate brand information, and receive appointment requests through the configured booking service.

## 3. Functional requirements

### Website and discovery

| ID | Requirement | Current status / acceptance |
|---|---|---|
| FR-01 | Provide a homepage with business introduction and navigation to the main site sections. | Implemented in `index.html`; links lead to Home, Portfolio, Inspo Gallery, Design Generator, and Book Now. |
| FR-02 | Present portfolio work with supporting descriptions and allow visitors to view multiple images for a set. | Implemented in `portfolio.html` and `script.js`; portfolio assets and slideshow paths should be verified as part of asset maintenance. |
| FR-03 | Let visitors browse inspiration by category and search descriptions or keywords. | Implemented in `inspo-gallery.html` and `script.js`. |
| FR-04 | Let visitors send a gallery idea to the design generator. | Implemented using browser `localStorage`; the selected idea is loaded into the generator prompt. |
| FR-05 | Provide consistent business contact and social links. | Contact and social links appear on the site pages. |

### Design exploration and booking

| ID | Requirement | Current status / acceptance |
|---|---|---|
| FR-06 | Let a visitor enter a description, choose a nail shape, and set a budget. | Implemented in `design-generator.html`. |
| FR-07 | Generate a visual concept and show indicative price and time information. | Implemented as a browser-side canvas illustration with keyword-based palettes and motifs. Estimates are guidance, not a quote or confirmed service duration. |
| FR-08 | Let a visitor save gallery or generated design ideas for later. | Implemented with browser `localStorage`; saved data is local to that browser and is not an account or server-side record. |
| FR-09 | Provide a path from a design idea to appointment scheduling. | The booking page embeds Calendly. Transfer of a saved/generated design into the Calendly appointment is not established as a complete, reliable flow and needs verification. |
| FR-10 | Show useful feedback while a design is generated and when input or generation fails. | The generator has loading, empty-prompt validation, and error states. |

### Operations and quality

| ID | Requirement | Current status / acceptance |
|---|---|---|
| FR-11 | Publish the static website from the repository. | GitHub Actions checks required files and deploys the repository root to GitHub Pages on pushes to `main`. |
| FR-12 | Keep an optional image-generation HTTP server available for local experimentation. | `generate_image.py` provides `/health` and `/generate`; this server is not called by the current browser generator. |
| FR-13 | Give site owners documentation for the product, design, architecture, AI-related behavior, and delivery sequence. | Defined by the documents in this directory. |

## 4. Non-functional requirements

- **Responsive:** Core pages and interactions should remain usable on mobile, tablet, and desktop viewport sizes.
- **Accessible:** Use semantic structure, associated form labels, keyboard-operable controls, descriptive image alternatives, visible focus, and status feedback that assistive technology can identify.
- **Performance:** Keep the static experience lightweight; avoid blocking the main thread during image creation and optimize image assets for delivery.
- **Reliability:** User-visible failures from external services must be explained; do not present a local approximation as a successful remote AI result.
- **Privacy:** Do not collect, transmit, or retain a visitor's personal information without a clearly defined purpose and disclosure. Browser storage remains on the user's device.
- **Security:** Do not put private service credentials in client-side files. Treat prompt input and external image data as untrusted. Restrict cross-origin access and request size before exposing any backend publicly.
- **Maintainability:** Preserve the current no-build static-site workflow unless a documented requirement justifies introducing a server or framework.
- **Compatibility:** Verify supported browsers for the Canvas API, `localStorage`, and currently used JavaScript / CSS features.

## 5. Constraints and assumptions

- The deployed website is currently static HTML, CSS, JavaScript, and image assets.
- Calendly and EmailJS are third-party integrations; their availability and configuration are external dependencies.
- `generate_image.py` uses Python's standard HTTP server and Pillow, and can contact Pollinations. It is an optional local service, not part of the GitHub Pages runtime.
- The current browser-side renderer is procedural canvas drawing, not a model inference service.
- Appointment availability, pricing, and final design feasibility are ultimately determined by the nail technician, not by the generated estimate.

## 6. Out of scope for the current baseline

User accounts, server-side persistence, payment processing, appointment administration, automated client messaging, and production AI inference are not present requirements for the current static release. They require separate product, privacy, operational, and integration decisions before implementation.
