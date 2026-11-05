---
version: 1
slug: "scripts-rockstar-js"
primary_target: "scripts/rockstar.js"
related_targets: ["styles/rockstar.css","blocks/rockstar-hero/rockstar-hero.js"]
---

# Rockstar 11 homepage

Target: `scripts/rockstar.js`, `styles/rockstar.css`, `blocks/rockstar-hero/`.
Mode: Persuade. Primary outcome: excitement and attendance. Entry: the existing English homepage, using its `home` theme.

The user selected The Gig Poster and requested implementation in the repository. Keep the AEM Rockstar name and Adobe connection. The old XI plan was discarded and is not authority.

## Direction contract

THESIS: AEM practitioners are the headliners. The page is an electric concert bill, not a corporate hero followed by equal cards.

OWN-WORLD: Committed electric-yellow and royal-blue fields, ink-black lettering, white replay imagery. Anton display type and existing Roboto body text. Large rectangular ticket-like actions, unboxed editorial sections, deliberate rules and clear links. A visitor browsing a bright conference lobby should read it instantly.

STORY: Recognize Rockstar 11, understand that real people share practical AEM demos, watch actual finalists, and explore the community's history. Upcoming logistics remain unannounced unless the content owner supplies them.

FIRST VIEWPORT: A full-width yellow poster with a large two-line AEM Rockstar title; edition 11 occupies the right-hand title space. A short invitation and a blue replay ticket anchor the poster's foot. The next royal-blue section begins with actual 2026 replay content. Mobile preserves title, invitation, action, then historical proof. Signature interaction: focused or hovered replay tickets shift an arrow toward their real destination; no autoplay or endless motion.

FORM: The Gig Poster, candidate 1 of seven grounded directions, selected by the user over assigned candidate 3 (The Main Event). Other grounded candidates: backstage laminate, fan zine, record sleeve, demo fair, and concert lightbox. `seed:ec3d1bc95c21797e`. Code-led; no generated comp is owed.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Scope and implementation

Transform the existing homepage through a theme-scoped preparation step, retaining authored recap, news, topics, rules, and winner material. Reuse existing blocks wherever possible. Isolate sitewide header/footer overrides to the new homepage body class. Add no framework, build step, backend, fake event date, registration destination, lineup, or testimonials. Preserve the AEM library.

Facts to confirm later: actual Rockstar 11 dates, registration URL, and submission-opening status. The historical 2026 recording is the working primary action for now; label it explicitly as a replay.
