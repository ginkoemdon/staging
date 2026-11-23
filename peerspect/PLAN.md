# Plan: Ginko's Prototype Playground — GitHub Pages site for Ginko

Requested by Ben (Ginko's brother) on Nov 22, 2026, via side chat.
Goal: live site at https://ginkoemdon.github.io, titled Ginko's Prototype Playground

Rename correction Nov 22, 2026: The site itself should NOT be called PEERSPECT. The site is "Ginko's Prototype Playground" (use Ginko, not Jinko). PEERSPECT is one prototype inside it, at ./prototypes/peerspect/, alongside the AI prototype for Kate at ./prototypes/kate-ai/. Earlier on Nov 22 the site was briefly titled PEERSPECT — that was superseded by this correction. Landing page title, footer and <title> say "Ginko's Prototype Playground". Subpage back-links say "Back to Ginko's Prototype Playground".

Hero update Nov 22, 2026 (voice): Ginko wants a more exciting, more specific hero, not generic. Hero tagline is "Dismantling barriers, building belonging." — that is the landing page H1. Shortened Nov 22, 2026 (voice): Ginko said the hero was a bit long with the text after, and repetitive from their main portfolio site. Cut it back — hero now ends at the tagline plus one short Playground-only line: "Prototypes in progress — test them, break them, rebuild them." Removed the seen/heard/valued lede, eSight / Tiohtià:ke detail, Created for strip, and tags from the hero. Branding stays cohesive with Webflow (same Krona One / Poppins, egg/sun/tangerine palette), but the hero copy is unique to the Playground, not redundant with mindfullydesign.webflow.io.

Direction update Nov 22, 2026 (voice call): The site will be a landing page for Ginko's prototypes, linking to other subpages which are prototypes. Local draft built: `index.html` is now a Ginko's Prototype Playground landing page with a Prototypes grid linking to `./prototypes/peerspect/`, `./prototypes/kate-ai/` and `./prototypes/`, plus placeholder subpages `prototypes/peerspect/index.html` (PEERSPECT), `prototypes/kate-ai/index.html` (AI prototype for Kate) and `prototypes/index.html`. Styling: Ginko asked to style it similar to their Webflow portfolio and said they will drop the link. Branding goal (Nov 22, 22:46 EST): cohesive branding so it translates seamlessly from Ginko's Webflow site to the Playground site — same look/feel across both, to be applied to landing page and all prototype subpages once the Webflow link is shared.

Styling update Nov 22, 2026, 22:46 EST: Webflow link received — https://mindfullydesign.webflow.io/ ("Ginko - Product Designer"). Brand tokens taken from that site's own CSS: background #e3e0d8 (egg), earth #3b342f, brown #372c1f, sun #f8c05e, tangerine #e26c00, forest-green #184b44, rust #a35f3c, lizard #c9c972, lime #afa477, sand #e1d8c7. Fonts: Krona One for headings, Poppins for body. Applied via shared stylesheet `css/style.css` to all pages (landing, prototypes index, kate-ai, peerspect), with pill tags, rounded shadowed cards, sun highlight, and a nav link back to Mindfully Design. Verified locally via http.server: /, /css/style.css, /prototypes/, /prototypes/kate-ai/ all 200. Still local only — not pushed live yet. Rename applied after that check: site renamed to Ginko's Prototype Playground, PEERSPECT added as a prototype subpage — re-verify after rename.

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

## Nav update Nov 22, 2026, 22:58 EST
- Style copied from Webflow nav (mindfullydesign.webflow.io), implementation is our own simple CSS + tiny JS, no Webflow JS / no w-nav attributes.
- Source values used: navbar-component 4.5rem, padding 4%, backdrop blur 20px, fixed/sticky top, z-index 10; navbar11_container space-between; logo image 144px (full) / 32px G icon on mobile; navbar11_menu gap 28px, Krona One; nav-font .875rem, letter-spacing 1.5px, min-height 44px; underline 1px black at -3px; dropdown-list white, 1px black border, 20rem wide, 1.5rem padding; dropdown-link Poppins, gap 2rem; menu-icon1 48x48, lines 24x2px; flower-button 1px brown border, 20px left line, hover lizard.
- Nav buttons (placeholders for now, mirroring original Webflow menu): Prototypes (click dropdown), Services, About, Resumé, plus Ginko's Portfolio flower button linking to Webflow.
- Prototypes dropdown: click to slide down, lists PEERSPECT, AI prototype for Kate, All prototypes, with chevron rotate, close on outside click / Escape. Mobile (<991px): hamburger toggles the menu, dropdown becomes static.
- Applied to all 4 pages: index, prototypes/index, prototypes/kate-ai, prototypes/peerspect. Verified locally: all 200, dropdown links resolve, JS syntax OK, logo image 200, no Webflow JS.
