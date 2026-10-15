# AI Skills and Design Generation

## 1. Scope

This document describes the project's current design-generation behavior and the capabilities required of a future AI-backed experience. "AI" in the current page title is product wording; the browser implementation is deterministic procedural drawing rather than a machine-learning model.

## 2. Current capability inventory

| Capability | Current implementation | Limit |
|---|---|---|
| Accept a design idea | Free-text prompt in `design-generator.html`; gallery descriptions can prefill it. | There is no prompt understanding service or structured validation. |
| Select nail shape | Shape dropdown changes the rendered outline. | Supported shapes map to a limited set of canvas paths; unrecognized/empty values use the default outline. |
| Reflect color/style words | Keyword matching chooses from hard-coded palettes and adds flowers, dots, stripes, gems, or glow. | Matches are a finite set of keywords and decorative primitives, not an interpretation of arbitrary natural language. |
| Produce a visual | Browser Canvas API produces a 512x512 PNG data URL using a seeded pseudo-random sequence. | Output is a stylized illustration and can diverge from the requested details or resemble other prompts. |
| Estimate cost and time | Prompt keyword rules and a budget slider produce indicative ranges. | These are heuristics; no service catalog, technician availability, or actual quote is consulted. |
| Remote image generation experiment | `generate_image.py` calls Pollinations and falls back to a Pillow drawing. | This is a separate optional server path; it is not the generator used by the website. The fallback is also procedural, not AI inference. |

## 3. Prompting guidance for visitors

For the best current illustration, describe concrete visual attributes that map to supported behavior:

- Include one or two color terms such as pink, rose, gold, silver, blue, purple, green, or red.
- Name recognizable motifs such as floral, polka dots, stripes, rhinestones, glitter, ombre, chrome, or gradient.
- Choose nail shape in the shape control rather than relying on prompt text.
- Keep the description concise. The rendered image is a mood illustration, not a faithful or photorealistic preview.

This guidance describes current deterministic behavior and must be updated if a real model becomes the source of generated images.

## 4. Future AI service capability requirements

Any production model integration should:

1. Convert the user prompt and selected shape into a clear nail-art concept request while retaining user intent.
2. Produce an image that visibly reflects the selected shape, palette, motifs, and finish, or clearly report why generation failed.
3. Keep generated imagery distinct from real portfolio photographs and label it as AI-generated.
4. Use a server-side provider integration so private credentials are never shipped to the browser.
5. Enforce request size, rate limits, acceptable-use policy, timeouts, and provider cost controls.
6. Avoid sending personal or appointment data to an image provider unless the user has been informed and there is a documented need.
7. Return a predictable result contract with image, generation status, and user-safe error details.
8. Have representative quality tests across shapes, color descriptions, motifs, empty prompts, malformed inputs, and provider failures.

## 5. Suggested prompt composition

For a future model-backed service, construct the provider request from explicit fields rather than concatenating unbounded input:

```text
Subject: a manicure concept with five visible nails
Shape: {validated nail shape}
Palette: {requested colors}
Motifs: {requested decorative elements}
Finish: {glossy, matte, chrome, or other requested finish}
Style: polished nail-art concept illustration, clear details, uncluttered background
Constraints: original concept art; do not present as a photograph of completed client work
```

The server should validate and normalize fields, cap prompt length, and avoid promising exact physical appearance or service feasibility.

## 6. Evaluation checklist

- Does the image show the selected shape and requested colors?
- Are explicitly requested motifs represented without unrelated embellishments?
- Is the output clearly labeled as a concept rather than a completed service?
- Do loading, timeout, provider failure, and rate-limit states give honest next steps?
- Are image dimensions, file types, and size limits enforced?
- Are accessibility alternatives available for generated content?
- Are provider cost, retention, privacy, and acceptable-use terms documented before release?

## 7. Development skills and guardrails

- Prefer local, reproducible tests for prompt normalization and fallback behavior.
- Use mock provider responses in automated tests; do not make routine CI depend on an external image service.
- Keep provider selection and credentials out of static frontend code.
- Do not silently substitute a procedural image after a model failure while claiming AI generation succeeded.
- Treat prompts, provider responses, and generated media as untrusted input.
- Keep descriptions and price/time estimates visibly separate from the generated image and identify estimates as indicative.
