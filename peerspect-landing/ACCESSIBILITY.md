# Site rule — Ginko's Prototype Playground

**Rule, Nov 22, 2026 (Ginko): every page on this site must be user-friendly and WCAG 2.2 AA accessible, while keeping Ginko's Webflow branding intact.**

**Rule, Nov 23, 2026 (Ginko): accessibility is a rule across the board. Every colour, theme, font, and interaction in PEERSPECT — and every prototype — must be accessible, not just checked afterwards. WCAG 2.2 AA minimum, verified by contrast calculation, in both light and dark themes. No palette, logo, or interaction ships if it fails AA.**

This is not a nice-to-have. It applies to the landing page, the prototypes index, and every prototype subpage, including placeholders. If a new prototype breaks the rule, it does not ship until it is fixed.

## 1. WCAG 2.2 AA — the bar

- Target: WCAG 2.2 AA. Aim for AAA where it costs nothing, but AA is the pass mark.
- Text contrast: at least 4.5:1 for normal text, 3:1 for large text (18pt+ / 14pt bold+).
- Non-text contrast: at least 3:1 for icons, borders that carry meaning, and focus indicators.
- Never use colour alone to mean something. Always pair it with text, an icon with a label, or a shape.
- Keyboard: everything usable by keyboard alone, in a sensible order, with no keyboard trap. Escape closes menus and dialogs.
- Focus: a visible focus indicator on every interactive element.
- Motion: respect `prefers-reduced-motion` — no smooth scrolling, no animation, no auto-playing movement when the user asks for reduced motion.
- Names: every button, link, image and form field has a clear accessible name. No empty `title=""`, no icon-only button without a label.
- Structure: one `h1` per page, headings in order, `lang="en"`, a descriptive `<title>`, and a skip link.
- Live updates: dynamic results use `aria-live="polite"` / `role="status"`, so screen-reader users hear what changed.
- Touch / pointer: interactive targets at least 44 × 44 px.

## 2. Colour, fonts — accessible, branding intact

Branding comes from https://mindfullydesign.webflow.io/ — Krona One headings, Poppins body, egg / earth / sun / tangerine / forest / rust palette. The bright brand colours stay, but they are **not** used for small text.

Measured Nov 22, 2026 (on egg #e3e0d8):

| Use | Colour | Contrast on egg | Result |
|---|---|---|---|
| Body text | earth #3b342f | 9.27:1 | Pass AA |
| Secondary text | muted #49433d | 7.39:1 | Pass AA |
| Headings / links | forest #184b44 | 7.48:1 | Pass AA |
| Small text, tangerine hue | **dark tangerine #9a4a00** (not bright #e26c00) | 4.75:1 | Pass AA |
| Small text, rust hue | **dark rust #8c4a24** (not #a35f3c) | 5.10:1 | Pass AA |
| Bright tangerine #e26c00 on egg | — | 2.50:1 | **Fail — never for text** |
| Rust #a35f3c on egg | — | 3.74:1 | **Fail for normal text — large text / graphics only** |

Rules that follow from this:

- Bright tangerine #e26c00 and rust #a35f3c are for large graphics, backgrounds, borders and large display type only — never for body, labels, links or buttons at normal size.
- For text in those hues, use the darker variants: `--tangerine-text: #9a4a00`, `--rust-text: #8c4a24`. They keep the same hue, so the branding reads the same, just darker.
- White text on tangerine fails too — hover / active states that used white on #e26c00 now use forest #184b44 (white on forest: 9.86:1).
- Sun yellow #f8c05e is a highlight / background only, with dark brown #372c1f text on it (8.23:1).
- Fonts: Poppins body at least 16px, line-height at least 1.6. Krona One is for headings only, never for long body copy.
- Never convey meaning by colour alone — e.g. a "flagged" item also says "Flagged: …", a score also shows its number, a consent state also says "Private" / "Shareable" in words.

## 2a. Product identity — each prototype is its own product

Nov 22, 2026 (Ginko): each prototype should feel like its own product, not just a page on Ginko's site. Ginko is a product designer, showing products — not just branded portfolio pages.

- The Playground (landing page, nav, footer) keeps Ginko's Webflow branding.
- Inside a prototype, the product has its own name, tagline, mark and accent — e.g. Alt-Text Studio, with its own product header and "How to use this product" box — so it reads as an app, not a portfolio case study.
- The Playground frame stays thin: a back link ("Back to Ginko's Prototype Playground") and the shared footer. The product itself does not repeat the Playground hero.
- Product accents must still pass the colour rule in §2: use a dark text variant for small text, bright colours only for large graphics / backgrounds. A product can have a different hue, but it must still pass 4.5:1 for text.
- Exemplar: Alt-Text Studio, product accent deep teal #0b4f47, product shell + How to use box, Nov 22, 2026. Other prototypes follow the same pattern.

## 3. User-friendly — the content rule

Every prototype must, on its own page, answer in plain language:

1. **What is this?** — one sentence, no jargon.
2. **How do I try it?** — 3 steps or fewer, with the first step obvious.
3. **What happens when I do it?** — what changes, and what does *not* happen (no data sent, no account, sample data only).
4. **What if I get stuck?** — a clear back link ("Back to Ginko's Prototype Playground" / "All prototypes"), and a reset / start-again button where the demo has state.

Other user-friendly rules:

- Plain language first. Explain any specialist term the first time it appears.
- One clear next step per screen. No dead ends.
- Sample data is labelled as sample data. No invented quotes, names or results presented as real.
- AI output is labelled as a draft / suggestion, with confidence or uncertainty shown, never presented as fact.
- Nothing auto-plays, auto-submits, or moves without the user asking.
- Works without sound, without a mouse, and at 200% zoom without horizontal scrolling.
- Every page links back to the Playground and to Ginko's Portfolio.

## 4. How to check a new page

Before a page is linked from the landing page, check:

- [ ] All text passes 4.5:1 (large text 3:1) — re-run the contrast check in `css/style.css` if a colour changed.
- [ ] Tab through the whole page — every control reachable, focus visible, Escape closes menus.
- [ ] No empty `title=""`, no unnamed button, no image without `alt` (or `alt=""` only if truly decorative).
- [ ] Dynamic results announced with `aria-live` / `role="status"`.
- [ ] Reduced motion honoured.
- [ ] "What is this / How do I try it / What happens" is on the page in plain language.
- [ ] Page loads locally with `python3 -m http.server` — 200, CSS loads, links resolve.

## 5. What changed Nov 22, 2026

Audit found: tangerine #e26c00 as link / CTA text (2.50:1 on egg, 3.15:1 on cream — fail), rust #a35f3c as small labels (3.74:1 on egg — fail), no global focus style, no reduced-motion handling, and one empty `title=""` on an icon button in the Accessibility Auditor demo.

Fixed in `css/style.css`: added `--tangerine-text #9a4a00` and `--rust-text #8c4a24` and switched all small text to them; bright tangerine / rust kept only for graphics and large display; hover states now use forest green with white text; added a global `:focus-visible` outline, a skip link, `prefers-reduced-motion` rules, and a 44px minimum target. Fixed the empty-title button. Added a "How to use this prototype" block to every prototype page.

Still local only — nothing pushed live to ginkoemdon.github.io.

## 6. Product accents — final, verified Nov 22, 2026

Each prototype has a distinct dark accent (all ≥4.5:1 on egg #e3e0d8, used for the product mark / How-to border, never as small text unless it passes):
- Alt-Text Studio #0b4f47 (exemplar)
- Plain-Language Government AI #1e3a5f (8.72:1 on egg)
- Co-Design Synthesis #5c2340 (9.00:1 on egg)
- Voice-First AI for Low Vision #2f2a6b (9.57:1 on egg)
- AI Accessibility Auditor #1d5c3a (6.02:1 on egg) — changed from plum #5b2a4a in verification, which duplicated Co-Design's plum
- Consent-Aware Research Assistant #5b21b6 (6.81:1 on egg) — changed from plum #5c2340 in verification, which duplicated Co-Design's plum
- PEERSPECT #9a4a00 (4.75:1 on egg) — changed from plum #5c2340 in verification, which duplicated Co-Design's plum
- AI prototype for Kate #7c2d12 (7.10:1 on egg) — changed from navy #24365e in verification, which was too close to Plain-Language's navy #1e3a5f

Verification Nov 22, 2026: all 10 pages + css return 200 locally; every prototype page contains product-shell and "How to use"; no empty title="" in any HTML file; no bright tangerine/rust as small text in css/prototypes. One known exception: Accessibility Auditor contains a second h1, "Welcome to Bloom Studio", inside the mock sample page being audited — that is deliberate broken sample content, not a page heading.
