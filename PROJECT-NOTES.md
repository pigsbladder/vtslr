# VTS redesign: project notes (read this first)

Last updated: 2026-11-07. This file is the "where were we" record. If you come back after a while, start here.

## What this project is

A **redesign demo** of vtslr.com (Vital Technology Solutions, Benton AR, an outsourced IT / managed services company). It is being hosted on **GitHub Pages** and shown to the company owner to demonstrate what a modern site could look like and to help win the redesign work. It is a sales demo first, a launch-ready site second.

The live site (https://vtslr.com) is WordPress.com-hosted and looks generic. The redesign is dark, editorial and animated: Geist / Geist Mono / Instrument Serif type, charcoal + signal red (`#E2412E`), an animated Arkansas map on Home and a layered-defense diagram on Cybersecurity.

## How we got here (history)

1. Designed in **Claude Design** as a 12-slide deck (round one: Home, About, Services overview). Two versions exist in `_design-source/`: `VTS Redesign.dc.html` (navy + green) and `VTS Redesign v2.dc.html` (charcoal + red). **v2 is the one that shipped.** They are slide decks, not site designs.
2. Handoff converted the deck to three real pages: `index.html`, `about.html`, `cybersecurity.html`.
3. Plan changed from "present 3 pages" to "redo the whole site in the new design" for the demo. Page-by-page iteration on animations and graphics is expected next.
4. **Audit of the live site** (`audit/AUDIT.md`): 40 URLs, bloated by 14 overlapping service pages, 5 narrow industry pages, 7 near-duplicate "Benton AR" blog posts. Proposed a ~17-page site. Nothing was cut from the live site; this is only a plan.
5. **Demo set decided**: not all 17 pages, a smaller set is enough ("something for him to look forward to if I sell him").

## Current page set (8 pages, all built)

| File | Page | Notes |
|---|---|---|
| `index.html` | Home | Animated Arkansas map, problem rotator, guide download, CTA stripes |
| `about.html` | About | Story, values, certifications |
| `cybersecurity.html` | Cybersecurity | Layered-defense diagram. **Used as the template for the other service pages** |
| `services.html` | Services hub | Index of 6 services; 3 are live links, 3 are "Coming soon" |
| `managed-it-support.html` | Managed IT Support | Signature graphic: animated response-time radar (5 min / 1 hr / 24-7-365) |
| `backup-recovery.html` | Backup & Disaster Recovery | Signature graphic: animated backup-flow diagram |
| `who-we-serve.html` | Industries | One page, four anchored sections (`#manufacturing`, `#lumber`, `#nonprofits`, `#camps`). Foundations merged into Nonprofits |
| `contact.html` | Contact | Info + form. **Form is a preview only**: it opens the visitor's email app (mailto). No backend on GitHub Pages |

Deliberately NOT built (shown as "Coming soon" in nav/footer): Blog, Privacy Policy, Cloud Computing, Computer Networking, IT Consulting. Those are the next candidates if the owner wants more.

## Copy source

Copy for the new pages was condensed from the live site (service/industry pages), keeping its facts: 5-minute response and 1-hour emergency commitments, 24/7/365 network monitoring, in-house support Mon-Fri 8AM-5PM Central, 10-50 workstation sweet spot, flat-rate managed/cloud services, office at 1306 Military Rd STE 7, Benton AR 72015, 501-904-8080, info@vtslr.com. Earlier commits already softened some claims (e.g. no promise of complete ransomware prevention) and changed "CST" to "Central". Keep that tone.

## How the site is built

- Plain HTML/CSS/JS, **no build step**. `README.md` has the layout and the local preview command (`python -m http.server 8000`).
- `css/styles.css` is numbered by section. Section 11 (inner pages) sits *before* section 10 (Responsive) on purpose so media queries can override it.
- Themes: `theme-black`, `theme-charcoal` (dark), `theme-paper`, `theme-sand` (light). Reusable pieces: `cyber-hero`, `cyber-problem(s)`, `approach-card`, `faq`, `service-index`, `industry`, `sla-panel`, `flow`.
- Entrance animation: `data-intro` (on load) and `data-reveal` (on scroll) in `js/main.js`. Reduced-motion is respected.
- **Header and footer are duplicated in every HTML file.** To change navigation, edit the templates in `tools/sync_chrome.py` and run `python tools/sync_chrome.py` from the repo root. Do not hand-edit the header/footer in individual pages (the script will overwrite them).
- `<meta name="robots" content="noindex">` is on every page so the preview stays out of search. Remove before any real launch.
- `.claude/launch.json` defines the local preview server for Claude Code (`vtslr-preview`, port 8000).

## Known gaps / things to remember

- Contact form is mailto-only (see above).
- **Text width policy:** the owner prefers no `max-width` / `ch` caps on text; text fills its column or the 1320px container. The only text caps kept are on the Home hero title and intro (`.home-hero__title`, `.home-hero__intro`), because that text sits over the animated map. Graphic columns (diagram, radar, flow, service index) keep their own widths.
- The screenshot tool in the Claude preview pane can catch pages mid-entrance-animation and show blank hero areas. That is a capture timing quirk, not a bug.
- No traffic data was available for the audit. Before any real consolidation or redirects, get Search Console data.
- Mobile: home and service heroes used to be full-viewport height with centered content, leaving big empty black bands on tall phones. Fixed at 900px and below (`min-height: 0` plus tighter top/bottom padding, in the Responsive section). Rest of mobile only spot-checked.
- Not yet checked: full mobile pass of the new pages, Lighthouse/accessibility pass.
- Redirect map and 301 plan live in `audit/AUDIT.md` (only relevant if this ever replaces the live site).

## Likely next steps

1. Review the new pages in the browser on desktop and phone; iterate on look, animation and graphics page by page (that was the stated plan).
2. Give Home and Services the most polish, since the owner sees them first.
3. Add more pages only if the owner wants them: Blog index, remaining services, Privacy.
4. Site is live on GitHub Pages (pigsbladder.github.io/vtslr), pushed from `main`. Commit and push after each batch of changes.
