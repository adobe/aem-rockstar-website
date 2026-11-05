---
name: AEM Rockstar — The Gig Poster
description: The shipped homepage identity and scoped guide, masterclass, and form treatments.
colors:
  rockstar-yellow: "#fcdf38"
  rockstar-blue: "#193acc"
  rockstar-ink: "#202020"
  rockstar-white: "#f8f8f2"
typography:
  display:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(3.2rem, 12.4vw, 11rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-.025em"
  edition:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(6.5rem, 26vw, 23rem)"
    fontWeight: 400
    lineHeight: 0.87
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.12
  title:
    fontFamily: "Roboto, roboto-fallback, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Roboto, roboto-fallback, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  replay-body:
    fontFamily: "Roboto, roboto-fallback, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  action:
    fontFamily: "Roboto, roboto-fallback, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.4
  label:
    fontFamily: "Roboto, roboto-fallback, sans-serif"
    fontSize: ".875rem"
    fontWeight: 700
    lineHeight: 1.6
  winner-year:
    fontFamily: "Anton, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: ".02em"
  read-title:
    fontFamily: "Anton, sans-serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.12
  read-section:
    fontFamily: "Anton, sans-serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.2
  read-subsection:
    fontFamily: "Anton, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.25
  masterclass-title:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw, 4.5rem)"
    fontWeight: 400
  form-title:
    fontFamily: "Anton, sans-serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.2
  field-label:
    fontFamily: "Roboto, roboto-fallback, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.6
  field-input:
    fontFamily: "Roboto, roboto-fallback, sans-serif"
    fontSize: "1rem"
rounded:
  square: "0"
spacing:
  brand-gap: "12px"
  small: "16px"
  mobile-gutter: "20px"
  medium: "24px"
  large: "32px"
  wide: "48px"
  section-mobile: "56px"
  section-wide: "72px"
components:
  button-primary:
    backgroundColor: "{colors.rockstar-blue}"
    textColor: "{colors.rockstar-white}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "16px 22px"
  button-primary-hover:
    backgroundColor: "{colors.rockstar-ink}"
  button-replay:
    backgroundColor: "{colors.rockstar-yellow}"
    textColor: "{colors.rockstar-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "16px 22px"
  navigation:
    backgroundColor: "{colors.rockstar-yellow}"
    textColor: "{colors.rockstar-ink}"
    height: "72px"
  disclosure:
    padding: "18px 0"
  news-disclosure:
    padding: "12px 0"
  winner-tile:
    rounded: "{rounded.square}"
    padding: "0"
  winner-year:
    backgroundColor: "{colors.rockstar-blue}"
    textColor: "{colors.rockstar-yellow}"
    typography: "{typography.winner-year}"
    rounded: "{rounded.square}"
    padding: "8px 12px"
  page-title-band:
    backgroundColor: "{colors.rockstar-yellow}"
    textColor: "{colors.rockstar-ink}"
    typography: "{typography.read-title}"
  form-header:
    backgroundColor: "{colors.rockstar-yellow}"
    typography: "{typography.form-title}"
    padding: "24px"
  text-field:
    typography: "{typography.field-input}"
    rounded: "{rounded.square}"
    padding: "12px 16px"
  agenda-session:
    backgroundColor: "{colors.rockstar-yellow}"
    textColor: "{colors.rockstar-ink}"
    rounded: "{rounded.square}"
    padding: "4px 8px"
---

# Design System: AEM Rockstar — The Gig Poster

## Overview

**Creative North Star: "The Gig Poster"**

Electric fields, condensed lettering, rectangular tickets, and unboxed editorial content make the Rockstar surfaces feel like a concert bill. Practitioners and their real portraits supply the personality; the AEM Rockstar name and Adobe connection remain intact. Guides trade poster scale for readable hierarchy, while forms keep brand expression in compact headers and square controls.

This is a finished-build record, not an unconditional sitewide replacement. Shared branding, header, and footer use `body.rockstar-site`; the authored `home` theme retains homepage-only recomposition under `body.rockstar-home`. The submission guide, closed 2026 submission page, masterclass, and its descendants receive `body.rockstar-inner` and the sibling stylesheet without recomposing their blocks. Live voting/results and commerce, product, cart, and test pages are excluded. CMS-authored copy, IDs, imagery, form configuration, and endpoints remain authoritative; no new raster asset or animation was added.

**Key Characteristics:**
- Yellow and blue fields with high-contrast ink and paper text.
- Anton headlines paired with existing Roboto reading text.
- Square actions, hairline divisions, and unboxed people.
- Native disclosures and brief, reduced-motion-aware feedback.
- Shared identity with distinct homepage, reading, masterclass, and task-form hierarchies.

Current sibling routes: `/en/submission-guide`, `/en/submission-2026`, `/en/masterclass`, `/en/masterclass/register-nyc`, `/en/masterclass/register-ban`, `/en/masterclass/confirm-ban`, `/en/masterclass/nyc-setup`, `/en/masterclass/eds-labs-access-request`, and `/en/masterclass/demo-bbird-access-request`. The masterclass descendant matcher is broader than this nine-route inventory, not permission to retheme unrelated pages.

Evidence: `styles/rockstar.css`, `styles/rockstar-pages.css`, `blocks/rockstar-hero/rockstar-hero.css`, `scripts/rockstar.js`, `scripts/scripts.js`, and `blocks/header/header.js`; inherited values come from global styles and existing winner, agenda, registration, confirmation, and access-form blocks. Captures under `.impeccable/review/`: `desktop.png` / `mobile.png` for home; route-named `*-390.png` / `*-1440.png` for all nine siblings; `masterclass-first-viewport-390.png` / `masterclass-first-viewport-1440.png` for readable viewport views; and the registration-error, confirmation-company-email, and confirmation-success mobile captures. The homepage-specific inherited direction contract remains `.impeccable/surfaces/scripts-rockstar-js.md`, corroborated by `direction-roll.txt` (`seed:ec3d1bc95c21797e`); this was code-led, with no comp or external QUALITY BAR catalog card. `PRODUCT.md` supplies the content-truth and accessibility constraints.

## Colors

The four frontmatter colors are the shared scoped custom properties. Existing authored imagery retains its original colors, including the older masterclass logo.

### Primary
- **Electric Yellow** (`rockstar-yellow`): poster, topics, navigation, news date blocks, replay tickets on blue, sibling title bands, masterclass hero/break bands, and compact form headers.

### Secondary
- **Royal Blue** (`rockstar-blue`): replay and statistics fields, footer, edition numeral, winner-year tab fill, primary tickets, sibling prose links, form accents, and agenda times.

### Neutral
- **Ink** (`rockstar-ink`): light-field text and hairline divisions; primary ticket hover/focus fill.
- **Off-white** (`rockstar-white`): community/news canvas and text on blue.

### Named Rules
**The Field Contrast Rule.** Pair ink with yellow or off-white, and off-white with blue; the replay ticket reverses to yellow with ink on its blue field.

Homepage default prose links still inherit the site's dark link color; sibling prose links use blue and hover to ink. Replay links explicitly use off-white. Semantic form colors remain in their component CSS: red errors/required markers, amber warnings, green success, white input surfaces, and neutral borders. Placeholder and disabled-action gray (`#666`) is a specific readability/state treatment, not a fifth brand color. The system does not authorize replacing Adobe's logo colors or recoloring authored imagery.

## Typography

**Display Font:** Anton, sans-serif.
**Body Font:** Roboto, roboto-fallback, sans-serif.

Anton supplies tall poster lettering and scoped sibling headings; Roboto keeps paragraphs, controls, navigation, agenda names/times, and news titles readable. Anton is locally served with swap from `fonts/anton-latin.woff2` (approximately 12 KB), licensed in `fonts/anton-OFL.txt`. Its supplied weight is regular. Existing Roboto regular/bold files remain in use.

### Hierarchy
- **Display:** homepage-only frontmatter display role; uppercase two-line title with balanced wrapping. At widths of at least 900px the size becomes `clamp(7rem, 12.3vw, 11rem)`.
- **Edition:** frontmatter edition role; blue numeral aligned beside the title, not a background watermark.
- **Headline:** frontmatter headline role for homepage section headings, with a bottom margin (28px). Statistics headings are a smaller exception (2rem).
- **Title:** frontmatter title role; news headings deliberately use bold Roboto rather than Anton.
- **Winner name:** regular Anton, `clamp(1.3rem, 2.4vw, 2rem)`, line height (1.2). The shared heading rule overrides the incumbent block's bold weight. This is a separate observed role, not the news title.
- **Body:** frontmatter body role; replay paragraphs use the smaller replay-body role and a measure (65ch); disclosure paragraphs cap at 70ch.
- **Action / Label:** frontmatter action role for tickets; the small bold Roboto label role is not the winner-year treatment. Hero invitation uses bold Roboto, `clamp(1rem, 2vw, 1.5rem)`, line height (1.4).
- **Winner year:** frontmatter winner-year role; uppercase Anton concert tabs attached above portraits, not tiny plain Roboto labels.
- **Reading title / Section / Subsection:** fixed frontmatter read roles for the guide; title becomes 4rem at 600px, while section and subsection sizes remain fixed. Other direct authored page titles use the same yellow title-band role.
- **Masterclass title:** frontmatter masterclass-title role for the course hero. Learning/agenda/speaker section headings use regular Anton (2rem); speaker names use regular Anton (1.5rem). Agenda topics stay bold Roboto (1.0625rem); times use bold Roboto (.875rem) with tabular numerals, descriptions use Roboto (1rem).
- **Form title / Field label / Field input:** fixed frontmatter form and field roles. Form titles stay compact at every breakpoint; descriptions use Roboto (1rem). Labels and controls do not inherit poster typography.

### Named Rules
**The Scoped Voice Rule.** Share Anton and the palette across the prepared routes, not the giant homepage scale: fixed reading roles and compact form titles preserve comprehension and task clarity.

## Layout

Shared full-width color bands contain centered content capped at 1200px. Section padding is 56px vertically and 20px horizontally on small screens; at 600px it becomes 72px and 32px. The homepage poster is deliberately shallower: vertical padding (36px), increasing to 40px at 600px. Navigation has its own 1264px border-box cap and fixed height (72px). All main-content IDs reserve navigation height plus 24px of scroll margin.

The recurring gaps are the frontmatter spacing steps, not an invented universal scale. Hero copy and numeral remain a two-column grid even on mobile; its ticket spans both columns with a top rule and padding (20px). The hero ticket is full width; at 600px its wrapper becomes a right-justified flex row. At 900px the hero gap becomes 32px.

- **Replay:** stacked image/text until 900px, then a `1.15fr 1fr` grid with a 48px gap.
- **Topics:** ruled full-width rows; two columns at 600px and three at 900px, with 24px trailing spacing.
- **People:** two columns initially with gaps (32px 20px); three at 600px with gaps (40px 32px); four at 900px.
- **News:** one column with a 24px gap; three at 900px with a 32px gap. Archive disclosures span the grid.
- **Historical guidance:** one column, becoming two with a 48px gap at 900px.
- **Reading pages:** yellow title/lead band followed by a readable guide column (70ch). Preparation separates only a direct authored heading and following lead paragraph, preserves copy/IDs/year, and promotes an authored lower-level page title to H1 (including the sole H3 case). Blocks are not recomposed. The 2026 guide remains historical and the closed submission page stays closed, without a new form.
- **Masterclass:** yellow hero with heading/copy before the genuine course logo on mobile; at 900px it becomes a `1.4fr .6fr` grid. Learning columns remain unboxed. Two authored agendas use stacked rows, becoming 160px time plus content columns at 600px with a 24px gap; breaks are rectangular yellow bands. Speaker portraits follow two/three/four columns at 0/600/900px. Course-section top padding is 56px, increasing to 72px at 900px.
- **Task forms:** transparent wrappers cap at 720px. Left-aligned yellow headers have 24px padding, increasing to 32px at 900px; the title size does not grow. Existing field grids, radio groups, conditional fields, and accept/decline actions remain the task structure.

Existing `browser-checks.json` covers the homepage at 320/390/600/900/1440 before the inner-only decorative correction. `rollout-browser-checks.json` has 55 passing entries: nine sibling routes at those five widths, seven mocked form scenarios, and three excluded-route isolation checks. It covers overflow/JS errors, images, navigation/current page, mobile menu/Escape, scroll offsets, focus/reduced motion, historical IDs/copy, closed submission state, conditional fields, retries, and accept/decline payloads. All POSTs were intercepted: UI behavior was checked with mocked responses, not live submissions or backend testing. Supplied validation also records nine focused `test/rockstar.test.js` tests passing, `npm run lint` passing with six pre-existing unused-disable warnings, and `git diff --check` passing. Product suites were not rerun for this documentation-only merge.

## Elevation & Depth

The principal surfaces are flat. Color fields, rules, scale, and image/text juxtaposition supply hierarchy; replay containers, winner tiles, learning columns, and speakers remove card shells rather than acquiring elevation. The inherited recording-icon hover still scales and adds a soft shadow; it is an isolated legacy residue, not an elevation token to reuse. Form focus halos and the access-input's stable shadow-drawn stroke are functional state indicators, not lifted surfaces.

### Named Rules
**The Flat Bill Rule.** Keep editorial containers and people unboxed; retain hierarchy through fields, spacing, and thin rules rather than adding card elevation.

## Shapes

Tickets, winner-year tabs, winner/speaker portraits, replay imagery, date blocks, form fields/actions, and content containers use square geometry. Portraits crop to a square; images themselves remain genuine CMS assets. Thin borders (1px) divide selected sections, topic/agenda rows, disclosures, and the poster ticket area; homepage news articles and archive wrappers have no staggered bottom borders. Native radios retain their familiar circular geometry. The ticket chevron is drawn with CSS borders, not a text glyph. Native disclosure markers and the existing CSS hamburger are functional controls, not decorative iconography.

## Components

### Buttons

Ticket-like and legible, with the primary and replay variants defined in frontmatter. Labels wrap instead of truncating; borders are transparent (1px), corners square.

- **Primary:** royal-blue fill, off-white text. Hover and keyboard focus change fill to ink.
- **Replay on blue:** yellow fill with ink text; its more specific color assignment persists on hover/focus.
- **Feedback:** link tickets append a border-drawn chevron (9px square, 2px strokes, 18px left margin). Hover/focus translates it 4px over `.2s cubic-bezier(.16, 1, .3, 1)`.
- **Focus:** shared visible outline (3px solid current color), offset (5px); sibling course/form actions explicitly use blue outlines.
- **Motion:** reduced-motion mode removes ticket-arrow and recording-link transitions and disables smooth scrolling. No looping motion or autoplay is established.

Form buttons use the same square blue/off-white language without the link-ticket chevron. Enabled hover changes to ink; disabled buttons use neutral gray and a not-allowed cursor. Confirmation's secondary action rests transparent with a blue stroke/text; hover becomes ink with off-white text, and disabled styling takes precedence. Existing loading behavior remains intact. These are native task controls, not a homepage form or filter-chip system.

### Cards / Containers

Replay content is an unboxed image/text pairing on blue, with the image spanning its available width. Community tiles have no panel background, border, padding, rounding, or card hover lift; the attached year tab is blue with yellow Anton text and padding (8px 12px), directly above the square portrait, with the name below. Optional recording controls use the existing inline SVG and sit over the portrait. News articles and archive wrappers are borderless, unpadded containers rather than raised card shells; grid spacing provides separation. Masterclass learning columns and genuine speaker portraits carry the same unboxed treatment.

### Inputs / Fields

Square and readable, with Roboto labels/controls and neutral placeholders. Registration/confirmation text inputs and textareas retain white surfaces, neutral strokes, blue hover/focus borders, blue focus outlines, and their existing subtle focus halos. Access-request inputs instead retain a stable shadow-drawn stroke: neutral at rest/hover, blue at focus, red for populated invalid input; their focus rule suppresses the generic outline. Do not collapse these into one invented focus token. Text-field padding is defined in frontmatter; placeholders use neutral gray (`#666`) and carets use blue.

Native radios, required markers, dietary-other and corporate-email conditional fields, inline errors/warnings, green success panels, red error panels, loading opacity, and disabled controls remain semantic states from the existing blocks. Success/error panel corners are square. Registration's decorative location emoji is hidden without removing venue text. Form JavaScript, configuration, endpoints, old dates, and submission behavior were not changed by the visual rollout.

### Agenda Session Labels

Restrained rectangular annotations, not selectable chips. Yellow session labels use ink text, small Roboto (.875rem), and padding (4px 8px). Day badges reverse to off-white on blue; break bands use yellow with plain ink labels. Session names and tabular times stay Roboto rather than becoming condensed poster text.

### Navigation

Fixed yellow bar with an ink bottom rule, existing Adobe icon, and nonwrapping Anton wordmark (1.2rem, tracking .02em). The scoped links lead to show, community, news, Masterclass, and the genuine submission guide. Homepage hash links stay local; on siblings they are prefixed with `/en/`. Exact page matches without hashes receive `aria-current="page"` and an underline, not a pill. Desktop navigation starts at 900px; links inherit Roboto (the incumbent desktop size is .875rem). Below that, a real button controls the collapsible menu with expanded state, Escape handling, and keyboard focus. No new hover fill is established.

### Disclosures

Native `details`/`summary` preserve keyboard behavior and the browser marker. General homepage disclosures have a top rule, margin above (36px), and bold summary with vertical padding (18px). News/guidance archive wrappers remove borders and reset that margin to zero; all summaries within news use compact vertical padding (12px). Historical guidance is explicitly labeled as past-edition material, not current eligibility or dates.

### Poster

The two-line title and separate edition numeral form the signature bill. The numeral has an accessible edition label. The ruled ticket rail carries a genuine destination: currently the 2026 replay, with community/submission-guide fallbacks when authored material is absent. This is current surface behavior, not a permanent event-registration component.

## Do's and Don'ts

### Do:
- **Do** keep shared tokens and shell inside the prepared route boundary, and homepage recomposition inside the homepage boundary.
- **Do** preserve genuine CMS imagery, portrait identity, recording destinations, and authorable structures.
- **Do** use the existing focus treatment, semantic controls, and reduced-motion behavior.
- **Do** label historical recordings and guidance as historical; upcoming dates and registration remain unconfirmed.
- **Do** retain the guide's 70ch measure, fixed reading hierarchy, compact form titles, native fields, and semantic feedback.
- **Do** preserve inline symbols and block configuration; preparation strips only leading decorative emoji prefixes from direct prose headings, paragraphs, lists, and their list-item/emphasis text.

### Don't:
- **Don't** apply giant homepage display/edition sizes to guide or task-form headings, or retheme excluded routes.
- **Don't** turn the flat replay, news, or community content into rounded, shadowed card grids.
- **Don't** treat the working replay action as proof of upcoming registration or a confirmed lineup.
- **Don't** treat preview tonal ramps in the sidecar as additional shipped palette tokens.
- **Don't** reinterpret old masterclass dates, the 2026 guide, closed submissions, or mocked form responses as current availability or verified backend delivery.

Not canonized or repaired: the inherited recording-link hover scale/soft shadow remains legacy drift from the flat container language; the existing masterclass `.kicker` remains authored residue, not a reusable eyebrow rule. The hidden trophy/location glyphs and hero bolt are not an icon system. No hard offset shadow or system display face is adopted; no product-source changes were authorized in this merge. The initial rollout review found decorative emoji leftovers, subsequently corrected; the fresh fallback scorer marked that single correction RESOLVED / SHIP only at that scope, not unrestricted whole-site approval. The existing detector had no primary findings; its type-ramp advisories are not a reason to invent roles or suppress checks. Product tests and detector were not rerun here.
