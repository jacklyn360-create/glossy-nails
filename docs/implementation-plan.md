# Glossy Nails Implementation Plan

## Planning principles

- Preserve the lightweight static-site workflow for the existing business showcase.
- Complete and verify the core discovery-to-booking journey before expanding capabilities.
- Separate required release work from optional product investments.
- Do not expose private credentials or deploy the experimental Python server as-is.

## Phase 1: Establish a dependable baseline

**Goal:** Make the existing experience verifiable and keep the documented behavior accurate.

- [ ] Fix and verify broken portfolio image paths and confirm all tracked image assets load.
- [ ] Exercise responsive layouts, keyboard navigation, form labels, modal focus, and status announcements across all pages.
- [ ] Add automated checks for gallery filtering, inspiration handoff, cart persistence/removal, and generator empty/success/error states.
- [ ] Ensure CI validates the files and behavior the release depends on; avoid requiring external services for routine tests.
- [ ] Review all third-party URLs, contact details, Calendly configuration, and EmailJS public configuration before deployment.

**Exit criteria:** All internal navigation and local image references resolve; core interactions pass repeatable tests; CI catches regressions in core browser behavior.

## Phase 2: Complete booking and saved-design handoff

**Goal:** Make booking actions coherent and reliable.

- [ ] Decide whether the booking page should receive one selected design, the saved cart, or only a reference link.
- [ ] Implement a deliberate handoff from saved/generated designs to the booking flow and show visitors what will be shared.
- [ ] Verify Calendly scheduling events and EmailJS payloads in a non-production/test configuration.
- [ ] Provide a clear fallback contact/scheduling route when third-party widgets fail.
- [ ] Define what the home-page email form does; connect it to a consent-aware service or change its copy so it does not claim to save or subscribe an address when it does not.

**Exit criteria:** A user can complete the documented booking journey, with accurate confirmation and no misleading success message when an integration fails.

## Phase 3: Decide the design-generation product direction

**Goal:** Select a documented and supportable experience before investing in a model.

- [ ] Decide whether the procedural canvas illustration is sufficient, or whether a real image-generation provider is needed.
- [ ] If retaining canvas, rename or label it clearly as a generated illustration and align the UI copy with its actual capabilities.
- [ ] If adopting a provider, compare quality, cost, latency, data retention, licensing, and acceptable-use terms.
- [ ] Specify prompt fields, supported styles, shape behavior, image quality expectations, failure cases, and estimate disclaimers.
- [ ] Define retention and deletion behavior for prompts and generated images.

**Exit criteria:** Product owner approves a clear scope, user-facing claims, provider/renderer choice, and measurable acceptance criteria.

## Phase 4: Build a production AI integration (conditional)

**Goal:** Provide genuine model-backed output only if Phase 3 selects it.

- [ ] Implement a server-side generation endpoint with input validation, authentication or abuse controls appropriate to the exposure, rate limits, timeouts, and bounded payloads.
- [ ] Store provider credentials in the hosting platform's secret manager; never in client-side assets.
- [ ] Return stable success and error responses; distinguish provider output from any illustrative fallback.
- [ ] Add mocked unit/integration tests, provider outage tests, and basic cost/usage monitoring.
- [ ] Update the browser generator with accessible progress, results, and retry behavior.
- [ ] Keep the local renderer only as an explicitly labeled fallback if its output quality and failure semantics are approved.

**Exit criteria:** Security and privacy review is complete; no private key is exposed; behavior is tested against success, invalid input, timeout, and provider failure.

## Phase 5: Release and maintain

**Goal:** Keep production behavior observable and documentation current.

- [ ] Test a GitHub Pages preview and production deployment, including static asset paths.
- [ ] Verify third-party integrations in production without sending test appointments to real clients.
- [ ] Monitor broken links, image load failures, booking failures, and generation errors using privacy-conscious telemetry if adopted.
- [ ] Revisit the requirements, architecture, and AI capability documents when runtime behavior or external services change.

**Exit criteria:** Release checklist passes and project documentation reflects the deployed system.

## Deferred ideas

Accounts, a database, payments, an admin dashboard, client notifications, and saved designs synchronized across devices are not prerequisites for the current static site. Prioritize them only after a validated business need and a separate decision about hosting, data ownership, privacy, and ongoing maintenance.
