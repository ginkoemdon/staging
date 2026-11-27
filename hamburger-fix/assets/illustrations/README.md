# Cover illustrations — what each one shows

All covers are SVG code (not generated images), in Ginko's palette, mid-century geometric style. Edit the `.svg` file directly to change a shape or colour.

Each cover is illustrative of its prototype, not random:

- **peerspect.svg** — PEERSPECT: two peers (sun circle + forest circle, two viewpoints) overlapping, with one shared eye in the middle. Peer + perspective.
- **alt-text-studio.svg** — Alt-Text Studio: the actual demo image — a person with smart glasses reading a book by a window — with alt-text lines below it.
- **plain-language-gov.svg** — Plain-Language Government AI: dense grey lines on the left (the original government text), an orange arrow, and short clear lines on the right (the plain-language version).
- **co-design-synthesis.svg** — Co-Design Synthesis: people around a workshop table, with sticky notes above, grouped into three theme bars below.
- **voice-first-low-vision.svg** — Voice-First AI for Low Vision: a speaker on the left, sound waves going out, and a large readable text line at the bottom.
- **accessibility-auditor.svg** — AI Accessibility Auditor: a mock page with a checklist, a magnifier over it, and ticks where fixes were approved.
- **consent-research.svg** — Consent-Aware Research Assistant: a shareable note with a tick on the left, a private note with redacted bars on the right, both feeding a synthesis bar below.
- **all-prototypes.svg** — All prototypes: a collage of shapes from the other covers, because it links to all of them.
- **from-form-to-function.svg** — From Form to Function (chosen Nov 25, 2026, option A "Shatter"): on a warm apricot background, tints of tangerine (Nov 27, 2026: the dark navy felt too heavy against the egg landing, then the pale sage sat too close to it and to the sun PEERSPECT cover), a dense form panel tears apart with a clear gap, a curved tangerine arrow carries the pieces across, and they reassemble as three clean step cards. Dramatic, contemporary geometric abstract style, no faces or doodles.

Accessibility: covers are decorative on the cards (`alt=""` in the HTML), because the card title already names the prototype. Each SVG file itself has a `<title>` describing what it shows, for anyone opening the file directly.

## Backgrounds — each one pops, none is the site background

Nov 22, 2026 (Ginko): covers must not be the same colour as the site background (egg #e3e0d8). Each cover has a different background colour, all from the palette:

- **peerspect.svg** — sun #f8c05e
- **alt-text-studio.svg** — forest #184b44
- **plain-language-gov.svg** — lizard #c9c972
- **co-design-synthesis.svg** — tangerine #e26c00
- **voice-first-low-vision.svg** — brown #372c1f
- **accessibility-auditor.svg** — lime #afa477
- **consent-research.svg** — earth #3b342f
- **all-prototypes.svg** — cream #fafafa
- **from-form-to-function.svg** — warm apricot #fbd9a8 (tints of tangerine; Nov 27, 2026, was dark navy #1e293b, then pale sage #dcead9)

9 covers, 9 different backgrounds, none egg. Where a foreground shape used the new background colour, it was changed to a contrasting palette colour (e.g. PEERSPECT's left peer is now tangerine on sun).

## Buttons — View prototype

"View prototype" is not a JS button. Each card is a plain `<a class="card" href="./prototypes/<slug>/">` link, with the "View prototype" text inside it, so clicking anywhere on the card navigates instantly to that prototype by normal browser behaviour. No script intercepts card clicks — the only `preventDefault` in the site is the Enter key in Voice-First's typed-answer field. Verified Nov 22, 2026: 9 cards on the landing page and 8 on the prototypes index, every href resolves to an existing prototype page returning 200 locally.
