# Glossy Nails Experience Design

## 1. Design intent

Present nail art as the primary content and make the journey from inspiration to booking feel clear, polished, and low-friction. The existing visual language is soft, feminine, and beauty-oriented, using pale pinks, rounded components, generous spacing, and Nunito typography.

## 2. Experience principles

1. **Artwork first:** Use clear, well-cropped imagery and avoid interface decoration that competes with it.
2. **Obvious next steps:** Keep navigation consistent and make booking accessible from discovery and design pages.
3. **Progressive exploration:** Visitors can browse existing examples before describing a custom idea.
4. **Honest feedback:** Distinguish illustrative concepts and estimates from actual photographs, quotes, and confirmed appointments.
5. **Small-screen usability:** Keep navigation, gallery controls, forms, and booking actions usable without horizontal scrolling.

## 3. Visual system

- **Typography:** Nunito is loaded from Google Fonts; retain a system sans-serif fallback for offline or blocked-font cases.
- **Core palette:** Soft rose/pink accents (for example `#e0b4c8` and `#c47a9a`), light neutral backgrounds, and dark readable text.
- **Components:** Rounded buttons and cards, restrained borders and shadows, and clear spacing between content groups.
- **Imagery:** Portfolio and inspiration images are organized under `images/portfolio/` and `images/inspo/`. Preserve appropriate aspect ratios and descriptive alternative text.
- **Responsive layout:** Existing stylesheet breakpoints at 768px and 480px are the baseline. Recheck full-page layouts, navigation, gallery grids, dialogs, and generator controls at those widths.

## 4. Page and interaction design

### Home

Introduce the business and technician, then offer direct routes to portfolio, inspiration, generator, booking, and social channels. The email-capture section currently displays a local confirmation; it must not be described as a functioning mailing-list subscription unless a real opt-in service and consent flow are connected.

### Portfolio

Show completed sets in a visual grid. Selecting a set opens a slideshow with previous/next and close controls and displays its description and duration. The overlay should remain keyboard-operable and have an accessible name and focus behavior.

### Inspiration gallery

Provide category filters, text search, and per-card actions to send inspiration to the generator, save an idea, or open booking. Make the active filter, empty-search result, and save confirmation easy to perceive.

### Design generator

Present controls in this order: optional inspiration preview, nail shape, design prompt, budget, generate action. During generation, disable repeat submission and show a loading status. On success, display an explicitly illustrative concept with indicative estimate and actions to save, regenerate, or book. On failure, show a clear recovery message.

Generated concepts should be labeled as illustrations until a real image-generation model is integrated. Do not imply that the browser renderer is a generative AI model.

### Booking

Embed the Calendly scheduling experience and provide a graceful fallback link or contact route if the third-party widget is unavailable. If a design is meant to accompany a booking, show what is being transferred and verify the transfer before sending any client data through EmailJS.

## 5. Accessibility and content requirements

- Every input has a persistent label; placeholders supplement labels but do not replace them.
- All actions are keyboard accessible, have visible focus indicators, and use descriptive accessible names.
- Announce generator loading, completion, and errors with appropriate live status semantics.
- Maintain adequate text and control contrast against pastel backgrounds.
- Provide meaningful alternative text for portfolio and inspiration images; use empty alternatives for purely decorative imagery.
- Respect reduced-motion preferences for animations and transitions.
- Avoid emoji as the only accessible name for navigation, social, or action controls.

## 6. Design acceptance checks

- At 320px viewport width, no core page requires horizontal scrolling.
- Navigation and all key actions remain reachable with keyboard alone.
- Search and filters can be used together and show the correct matching cards.
- Generator empty input, loading, success, and error states are distinguishable.
- The user can understand that a concept image and its price/time estimates are illustrative.
- Booking remains understandable when third-party content is blocked or unavailable.
