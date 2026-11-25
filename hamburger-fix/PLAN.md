# Plan: Ginko's Prototype Playground — GitHub Pages site for Ginko

Requested by Ben (Ginko's brother) on Nov 22, 2026, via side chat.
Goal: live site at https://ginkoemdon.github.io, titled Ginko's Prototype Playground

Rename correction Nov 22, 2026: The site itself should NOT be called PEERSPECT. The site is "Ginko's Prototype Playground" (use Ginko, not Jinko). PEERSPECT is one prototype inside it, at ./prototypes/peerspect/. Earlier on Nov 22 the site was briefly titled PEERSPECT — that was superseded by this correction. Landing page title, footer and <title> say "Ginko's Prototype Playground". Subpage back-links say "Back to Ginko's Prototype Playground".

Hero update Nov 22, 2026 (voice): Ginko wants a more exciting, more specific hero, not generic. Hero tagline is "Dismantling barriers, building belonging." — that is the landing page H1. Shortened Nov 22, 2026 (voice): Ginko said the hero was a bit long with the text after, and repetitive from their main portfolio site. Cut it back — hero now ends at the tagline plus one short Playground-only line: "Prototypes in progress — test them, break them, rebuild them." Removed the seen/heard/valued lede, eSight / Tiohtià:ke detail, Created for strip, and tags from the hero. Branding stays cohesive with Webflow (same Krona One / Poppins, egg/sun/tangerine palette), but the hero copy is unique to the Playground, not redundant with mindfullydesign.webflow.io.

Direction update Nov 22, 2026 (voice call): The site will be a landing page for Ginko's prototypes, linking to other subpages which are prototypes. Local draft built: `index.html` is now a Ginko's Prototype Playground landing page with a Prototypes grid linking to `./prototypes/peerspect/` and `./prototypes/`, plus placeholder subpages `prototypes/peerspect/index.html` (PEERSPECT) and `prototypes/index.html`. Styling: Ginko asked to style it similar to their Webflow portfolio and said they will drop the link. Branding goal (Nov 22, 22:46 EST): cohesive branding so it translates seamlessly from Ginko's Webflow site to the Playground site — same look/feel across both, to be applied to landing page and all prototype subpages once the Webflow link is shared.

Styling update Nov 22, 2026, 22:46 EST: Webflow link received — https://mindfullydesign.webflow.io/ ("Ginko - Product Designer"). Brand tokens taken from that site's own CSS: background #e3e0d8 (egg), earth #3b342f, brown #372c1f, sun #f8c05e, tangerine #e26c00, forest-green #184b44, rust #a35f3c, lizard #c9c972, lime #afa477, sand #e1d8c7. Fonts: Krona One for headings, Poppins for body. Applied via shared stylesheet `css/style.css` to all pages (landing, prototypes index, peerspect), with pill tags, rounded shadowed cards, sun highlight, and a nav link back to Mindfully Design. Verified locally via http.server: /, /css/style.css, /prototypes/ all 200. Still local only — not pushed live yet. Rename applied after that check: site renamed to Ginko's Prototype Playground, PEERSPECT added as a prototype subpage — re-verify after rename.

Nav update Nov 22, 2026, 22:55 EST: nav menu and link/button styling copied from Webflow's own nav (.navbar11_component / .navbar11_menu / .navbar-menu-item-link / .flower-button). Full-width egg bar, min-height 4.5rem, 5% side padding, backdrop blur(20px) inner, 28px menu gap, Krona One menu links, uppercase, 13px, letter-spacing 1.5px, 44px min-height, 1px black underline on hover. Ginko's Portfolio link is now the Webflow flower-button: 1px solid brown border, transparent bg, 1rem 1.25rem padding, 12px, hover lizard #c9c972, with the 20px earth line to the left of the text. Applied to all four pages via css/style.css. Explore button now scrolls to #prototypes (smooth scroll) instead of navigating away.

## What Ben specified
- Use the GitHub CLI (`gh`), not the MCP server, for GitHub work
- Authenticate with Ginko's GitHub
- Create the base `<username>.github.io` site
- This will become Ginko's main site; portfolio recreation comes later, as Ginko directs

## Status check (Nov 22, 22:41-22:43 EST)
- `gh` is already installed: version 2.102.0
- `git` is installed: version 2.43.0
- `gh auth status`: not logged into any GitHub hosts
- Local Hello World files prepared in this folder: `index.html`, `README.md`
- Username provided: `ginkoemdon` — verified via public GitHub API, no login needed

## KEY FINDING: repo already exists
- User `ginkoemdon`, name Ginko Emdon, created 2020-09-09, 7 public repos
- Repo `ginkoemdon/ginkoemdon.github.io` already exists, public, created 2021-01-12, last pushed 2021-09-27, default branch `master`, has_pages true, description "My github page!"
- Live site https://ginkoemdon.github.io/ is already up (200 OK), titled "Ginko Emdon Design Portfolio"
- Contents: assets, css, index.html, readme.md, semester-2

So this is NOT a create-from-scratch job. It is a replace-or-preserve decision about the existing old portfolio.

## Steps — revised
1. Confirm Ginko's GitHub username — DONE: ginkoemdon, verified
2. Get Ginko's explicit approval to authenticate, and their decision on the existing site — BLOCKED
   - Option A: Keep old portfolio live, keep Hello World local only for now
   - Option B: Replace live site with Hello World (overwrites old portfolio — back it up first by cloning)
   - Option C: Put Hello World on a separate branch / test first
3. Authenticate: `gh auth login` (interactive, Ginko to approve / complete in browser)
4. If replacing: clone existing repo first as backup, then push Hello World to master
5. If creating: do NOT run `gh repo create ginkoemdon.github.io` — repo already exists
6. Verify: `gh api repos/ginkoemdon/ginkoemdon.github.io/pages` and open https://ginkoemdon.github.io/
7. Hand over to Ginko for next prompt (portfolio rebuild, etc.)

## Notes
- No credentials were entered, no repo was created, and nothing was pushed yet.
- Do not push Hello World over the old portfolio without Ginko's explicit say-so.

Footer update Nov 22, 2026, 23:01 EST (voice): Ginko asked to remove the ↗ that I had added to the "Ginko's Portfolio" flower button — it now reads just "Ginko's Portfolio" on all 4 pages, no arrow. Ginko also asked to copy the footer styling from their Webflow site, because it has everything they want in the footer. Done: footer on all 4 pages is now copied from mindfullydesign.webflow.io's footer (id="footer", class="footer-component"): Ginko logo (144px, green with stroke), "Hit my line", mindfullydesign@gmail.com as a click-to-copy button (2px earth border, 4px radius, 2.5rem high, with the overlapping-squares icon — lizard #c9c972 square + stroked square), LinkedIn link https://www.linkedin.com/in/ginkoemdon/ (white logo, inverted), 1px earth divider, "made mindfully in webflow / © 2026 Ginko Emdon", and "✿ thank you for your cyber frolick ✿". Footer fix Nov 22, 2026, 23:05 EST (voice): Ginko said remove "in webflow" — this site was not made in Webflow — footer now reads just "made mindfully / © 2026 Ginko Emdon" on all 4 pages. Styles copied from Webflow CSS: footer4_top-wrapper 1fr 1fr grid, 4vw gap; footer_block gap 2rem; text-up-button.pad-right; social-1-link-block 4em; line-divider; footer_copyright (light-brown #49433d); thank-you centered. The old invented footer ("Styled to match…" / "ginkoemdon.github.io") was removed entirely. Verified locally: all 4 pages + css 200, footer markers present on every page, no ↗ left.

## Card titles and descriptions rule (Nov 23, 2026, Ginko)
Studied from Ginko's Webflow portfolio Featured Works cards (mindfullydesign.webflow.io). Apply to every prototype card on the landing page and on prototypes/index.html. The rule:
- Title: an outcome, verb-led, not just the product name. Like Ginko's "Re-imagining Urban Heritage Spaces", "Part of the Club", "Text to Speech Feature". Example: PEERSPECT becomes "Finding places by how they feel", not just "PEERSPECT".
- Description: one or two sentences, active voice, first person in spirit. Start with what was done, name who it is for, end with what changed or who benefits. Specifics over generics: name the audience, the place, the outcome. No feature lists, no dry shorthand ("AI does X, with Y"), no placeholder ("details to come").
- Portfolio examples to follow: "Co-facilitated workshops with Indigenous activists, urban planners, designers, and historians to reimagine colonial monument sites in Tiohtià:ke. Together, we co-designed spaces grounded in Indigenous knowledge, care, and storytelling, transforming these sites into places of expression, healing, memory, and belonging." / "Redesigning the audio-based social media app for accessibility, so everyone can be part of the conversation." / "Led 25+ clinical user testing sessions of various optical technology prototypes to inform the design of eSight's new assistive device, eSight Go."
- Applied Nov 23, 2026 to all seven prototype cards on both pages, plus the All prototypes card. Nav dropdown labels stay short and functional; they are navigation, not cards.

## Prototype card styling rule (Nov 23, 2026, Ginko) — all future landing page prototype cards
Applies to every future landing page prototype card, Featured work and Rough drafts alike. Measured visually from Ginko's Webflow portfolio Featured Works cards (mindfullydesign.webflow.io), screenshots only, desktop 1920px and mobile 500px, Nov 23, 2026. Do not guess from the Webflow backend; re-measure from a screenshot if in doubt.
- Heading: Krona One, 700, 30px desktop (1.875rem), line-height 34-35px (1.15), colour #3e3327. Mobile: 26px (1.625rem), line-height 1.25. Correction Nov 23, 2026 (Ginko): landing page card headings are Krona, to match the portfolio site's case study cards. Poppins is only for the PEERSPECT case study cards/headings, not the landing page.
- Body: Poppins, 400, 18px (1.125rem), line-height 27px (1.5), colour #52483d.
- Year: Poppins, 500, 14px, colour #504945, top-right of the text card.
- Link: Poppins, 600, 20px (1.25rem), colour #1c1c1c, with a chevron.
- Tag pill: Poppins, 600, 14px, text #3e3327, amber background #f7bf5e, 1px dark outline, fully rounded, about 27px high, 8px gap between pills. Tags must describe what the prototype is for, like the portfolio's tags (e.g. Government, UX Design, Accessibility), not just its status: keep the status tag first (Featured work / Rough draft), then add 3-4 descriptive tags per card.
- Text card: white #fefefe, radius 12px, padding 48px desktop / 32px mobile, subtle shadow.
- Image: radius 12px; on desktop the text card overlaps the image by 60px; on mobile the image sits above the text card with a 20px gap and no overlap.
- Spacing inside the card (desktop): year to heading 35px, heading to body 38px, body to link 66px, link to divider 50px, divider to tags 40px, tags to card bottom about 35px.
- Gap between cards: 6rem on desktop and mobile (deliberate: Webflow's gap is about 200px, which would make eight rows an endless page).
- Implemented in `css/style.css` (.portfolio-card_heading, .card-content, .ch_card, .list-of-tags .tag-item, .button.is-link.is-icon, and the max-width 991px mobile block).

## Stylized H1 rule (Nov 24, 2026, Ginko) — all styled H1s on landing pages, and whenever Ginko says "stylize"
- H1: Krona One, 48px desktop (3rem, clamp down on mobile). Treatment inverted Nov 25, 2026 to match the Webflow "Multifaceted & Multidiscilpinary" title (an H2 on a light textured background, measured from screenshots, exact Webflow CSS unverified): gold fill #f8c05e + dark brown stroke #372c1f, at the original 1.2px thickness (the Multifaceted title measured about 2px, but Ginko said that looks too thick, Nov 25, 2026). The earlier dark-fill + amber-stroke version (1.2px, then 3px to match the Webflow hero H1's measured 3px outline) did not work on the egg background. Paint order: fill stroke, so the stroke sits centred on the letter edge, half inside the fill and half outside. Headline Nov 25, 2026: "AI is the terrain. I bring the map."
- Second line / subline under it: Krona One, 20px (1.25rem), brown #372c1f, no stroke: "Cultivating with intention, judgment, and an inclusive designer's vigor." The cream rgb(227, 224, 216) version is ONLY for a dark background, never on egg/light.
- Example texts Ginko gave with the rule are from her Webflow typography ("Ai is the terrain. I bring the map." / "Cultivating with intention, judgment, and an inclusive designer's vigor."); Nov 25, 2026 Ginko chose those exact texts as the Playground hero headline and subline, superseding the earlier rule that Playground hero copy stays distinct from Webflow.
- Hero senior positioning, Nov 25, 2026: Ginko wants the hero to present her as a senior, sole AI-first designer a hiring manager can trust. Headline shortened to "AI is the terrain. I map it.", eyebrow "AI design lab" (Nov 25, 2026, was "AI-first design lab", and "AI-first design" before that), subline "Directing AI with critical judgment into working prototypes you can test." (Ginko's wording, replacing "Sole designer, end to end. I direct AI with critical judgment and turn it into working prototypes you can test."), button "See the experiments" (Nov 25, 2026, was "See the work" from the senior rework, and "View experiments" before that). The point is proof, not just exploration: one designer owning it end to end, directing AI, with working prototypes to try.
- Implemented in `css/style.css` (`.hero h1`, `.hero .h1-subline`), applied to the Playground landing hero H1 with the Nov 25 headline. The old sun-highlight on "human exploration" was removed so the outline stays uniform.

## Nav update Nov 22, 2026, 22:58 EST
- Style copied from Webflow nav (mindfullydesign.webflow.io), implementation is our own simple CSS + tiny JS, no Webflow JS / no w-nav attributes.
- Source values used: navbar-component 4.5rem, padding 4%, backdrop blur 20px, fixed/sticky top, z-index 10; navbar11_container space-between; logo image 144px (full) / 32px G icon on mobile; navbar11_menu gap 28px, Krona One; nav-font .875rem, letter-spacing 1.5px, min-height 44px; underline 1px black at -3px; dropdown-list white, 1px black border, 20rem wide, 1.5rem padding; dropdown-link Poppins, gap 2rem; menu-icon1 48x48, lines 24x2px; flower-button 1px brown border, 20px left line, hover lizard.
- Nav buttons (placeholders for now, mirroring original Webflow menu): Prototypes (click dropdown), Services, About, Resumé, plus Ginko's Portfolio flower button linking to Webflow.
- Prototypes dropdown: click to slide down, lists PEERSPECT, All prototypes, with chevron rotate, close on outside click / Escape. Mobile (<991px): hamburger toggles the menu, dropdown becomes static.
- Applied to all 3 pages: index, prototypes/index, prototypes/peerspect. Verified locally: all 200, dropdown links resolve, JS syntax OK, logo image 200, no Webflow JS.
