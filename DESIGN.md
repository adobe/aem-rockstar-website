---
name: AEM Rockstar — The Gig Poster / Cut-and-Paste Fanzine
description: Historical Gig Poster base and approved Cut-and-Paste Fanzine homepage/supporting-page variant.
colors:
  rockstar-yellow: "#fcdf38"
  rockstar-blue: "#193acc"
  rockstar-ink: "#202020"
  rockstar-white: "#f8f8f2"
  fanzine-paper: "#deded7"
  fanzine-red: "#ef4937"
  fanzine-charcoal: "#181817"
  fanzine-white: "#f4f4ee"
  confirmation-error: "#b62b00"
typography:
  fanzine-display:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(3.2rem, 9.4vw, 8.5rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-.025em"
  fanzine-story:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(2.125rem, 4.8vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.05
  fanzine-story-body:
    fontFamily: "Roboto, roboto-fallback, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  fanzine-winner-name:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.2
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
  fanzine-ticket:
    backgroundColor: "{colors.fanzine-charcoal}"
    textColor: "{colors.fanzine-white}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "16px 22px"
  fanzine-ticket-hover:
    backgroundColor: "{colors.fanzine-white}"
    textColor: "{colors.fanzine-charcoal}"
  fanzine-navigation:
    backgroundColor: "{colors.fanzine-charcoal}"
    textColor: "{colors.fanzine-white}"
    height: "72px"
  fanzine-masthead:
    backgroundColor: "{colors.fanzine-paper}"
    textColor: "{colors.fanzine-charcoal}"
    typography: "{typography.fanzine-display}"
    padding: "20px"
  fanzine-story-sheet:
    backgroundColor: "{colors.fanzine-red}"
    textColor: "{colors.fanzine-charcoal}"
    typography: "{typography.fanzine-story}"
    padding: "24px"
  fanzine-winner-tile:
    backgroundColor: "{colors.fanzine-paper}"
    textColor: "{colors.fanzine-charcoal}"
    rounded: "{rounded.square}"
    padding: "10px"
  fanzine-winner-year:
    backgroundColor: "{colors.fanzine-charcoal}"
    textColor: "{colors.fanzine-white}"
    typography: "{typography.winner-year}"
    rounded: "{rounded.square}"
    padding: "6px 10px"
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
  fanzine-page-title-band:
    backgroundColor: "{colors.fanzine-red}"
    textColor: "{colors.fanzine-charcoal}"
    typography: "{typography.read-title}"
  fanzine-reading-sheet:
    backgroundColor: "{colors.fanzine-white}"
    textColor: "{colors.fanzine-charcoal}"
    typography: "{typography.body}"
  fanzine-form-header:
    backgroundColor: "{colors.fanzine-red}"
    textColor: "{colors.fanzine-charcoal}"
    typography: "{typography.form-title}"
    padding: "24px"
  fanzine-form-card:
    backgroundColor: "{colors.fanzine-white}"
    textColor: "{colors.fanzine-charcoal}"
    rounded: "{rounded.square}"
    width: "720px"
  fanzine-form-primary:
    backgroundColor: "{colors.fanzine-charcoal}"
    textColor: "{colors.fanzine-white}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "16px 22px"
  fanzine-form-primary-hover:
    backgroundColor: "{colors.fanzine-white}"
    textColor: "{colors.fanzine-charcoal}"
  fanzine-form-decline:
    backgroundColor: "transparent"
    textColor: "{colors.fanzine-charcoal}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "16px 22px"
  fanzine-confirmation-instruction:
    textColor: "{colors.confirmation-error}"
  fanzine-agenda-session:
    backgroundColor: "{colors.fanzine-paper}"
    textColor: "{colors.fanzine-charcoal}"
    rounded: "{rounded.square}"
    padding: "4px 8px"
---

# Design System: AEM Rockstar — The Gig Poster / Cut-and-Paste Fanzine

## Overview

**Creative North Star: "The Gig Poster / Cut-and-Paste Fanzine"**

Electric fields, condensed lettering, rectangular tickets, and unboxed editorial content make the Rockstar surfaces feel like a concert bill. Practitioners and their real portraits supply the personality; the AEM Rockstar name and Adobe connection remain intact. Guides trade poster scale for readable hierarchy, while forms keep brand expression in compact headers and square controls.

The user-selected Cut-and-Paste Fanzine adds charcoal backing, cool paper sheets, rough red ink, slightly misregistered homepage Anton headlines, and monochrome genuine portraits. Its paper masthead and red lead story make one pasted-up issue; the real historical replay remains the action. The approved supporting-page extension shares this world through red printed bands and clean reading/form sheets, not a third aesthetic or a copy of the homepage composition.

This is a finished-build record, not an unconditional sitewide replacement. On `2027-redesign-option-2`, the homepage receives `body.rockstar-home.rockstar-grunge` and its recomposed hero; selected siblings receive `body.rockstar-inner.rockstar-grunge`, retaining their reading/course/form DOM structures. The loader includes the base, sibling (for inner pages), and grunge stylesheets. Yellow/blue Gig Poster primitives remain the unchanged base/historical option, not the current selected siblings' palette. Voting/results and commerce, product, cart, and test pages remain excluded. CMS-authored copy, IDs, imagery, form configuration, and endpoints remain authoritative where available. The extension reuses the two original Canvas print rasters and adds no raster, dependency, animation, controller, or AEM core change. The original `2027-redesign` branch remains the Gig Poster option.

**Key Characteristics:**
- Historical yellow/blue Gig Poster base; current charcoal/paper/red Fanzine homepage and selected siblings.
- Anton headlines paired with existing Roboto reading text.
- Square actions and hairline divisions; unboxed grayscale course speakers, paper-backed homepage alumni, and clean reading/form sheets.
- Native disclosures and brief, reduced-motion-aware feedback.
- Shared identity with a tilted fanzine masthead and distinct reading, masterclass, and task-form hierarchies.

Authorized sibling routes: `/en/submission-guide`, `/en/submission-2026`, `/en/masterclass`, `/en/masterclass/register-nyc`, `/en/masterclass/register-ban`, `/en/masterclass/confirm-ban`, `/en/masterclass/nyc-setup`, `/en/masterclass/eds-labs-access-request`, and `/en/masterclass/demo-bbird-access-request`. The masterclass descendant matcher is intentionally broader than this nine-route inventory, not arbitrary site coverage or proof that content exists.

Evidence: `styles/rockstar-grunge.css`, unchanged `styles/rockstar.css` and `styles/rockstar-pages.css`, `scripts/scripts.js`, `scripts/rockstar.js`, the approved `blocks/rockstar-fanzine` homepage, and existing header/agenda/registration/confirmation/access-form styles. Contracts are `.impeccable/surfaces/styles-rockstar-grunge-css.md` and `.impeccable/surfaces/scripts-rockstar-js.md`; reading/persuasion/task modes remain surface-brief constraints, not product-wide rules. Inherited `seed:f7c7cad6ffcf995b` is corroborated by `fanzine-direction-roll.txt`; the user selected grounded candidate 1, Cut-and-Paste Fanzine, over assigned candidate 6, Backstage Contact Sheet. This extension is code-led, without a new roll, image comp, or external QUALITY BAR card. `PRODUCT.md` supplies content-truth and accessibility constraints.

Evidence limits: register-nyc, register-ban, confirm-ban, and nyc-setup returned 404 on local, main preview, and live during verification. No original HTML snapshots exist for these four. Browser-only interception supplied explicit synthetic block configurations with fake test titles/location/venue and `example.invalid` mocked endpoints; shipping source contains no fixtures. Their `fanzine-pages-fixture-` captures establish unchanged controller/new styling behavior, not actual authored content or route availability. The other five routes use authored preview content. No CMS content was restored or invented, and the existing 404 sampleRUM import was not fixed. All forms were mocked; real backend delivery and website publishing/deployment remain unclaimed.

Current capture evidence under `.impeccable/review/`: contact sheets `fanzine-pages-contact-mobile.png` / `fanzine-pages-contact-desktop.png`; course hierarchy uses the first viewport `fanzine-pages-first-masterclass-390.png` / `fanzine-pages-first-masterclass-1440.png`, not a full-page thumbnail. Five authored routes use `fanzine-pages-{route-with-slashes-replaced-by-hyphens}-{390,1440}.png`; four synthetic routes use `fanzine-pages-fixture-{route-with-slashes-replaced-by-hyphens}-{390,1440}.png`, plus fixture-registration-error-390, fixture-confirmation-company-email-390, and fixture-confirmation-success-390 captures. `fanzine-pages-capture-validity.json` records 23 same-named decoded/dimension-checked captures. Earlier Gig Poster desktop/mobile and sibling rollout captures are historical, not current unaffected-sibling evidence. Current homepage captures retain the `fanzine-` prefix, including first-view, full-page, focus, menu, and guidance evidence.

## Colors

The four `rockstar-*` frontmatter colors remain the base/historical primitives. The separately named `fanzine-*` primitives record `body.rockstar-grunge` aliases of the same CSS variable names, not new variables: `--rockstar-yellow` maps to fanzine-paper, `--rockstar-blue` to fanzine-red, `--rockstar-ink` to fanzine-charcoal, and `--rockstar-white` to fanzine-white. The loader applies these to the homepage and selected inner routes. Base component tokens remain base; `fanzine-*` component tokens describe current variants. The form-card width token is a maximum, not a fixed viewport width. The original multicolor masterclass logo remains unchanged.

### Primary
- **Electric Yellow** (`rockstar-yellow`): historical/base Gig Poster navigation, title/course/form bands, poster/topics/date blocks, and replay tickets; not the selected current siblings.
- **Rough Red Ink** (`fanzine-red`): homepage stamp/story/topics/statistics and selection; selected sibling printed title bands, course promotion, agenda breaks, and compact form headers.

### Secondary
- **Royal Blue** (`rockstar-blue`): historical/base primary tickets, footer, prose links, form accents, agenda times, replay/statistics, numeral, and winner tabs.

### Neutral
- **Ink** (`rockstar-ink`): light-field text and hairline divisions; primary ticket hover/focus fill.
- **Off-white** (`rockstar-white`): community/news canvas and text on blue.
- **Cool Paper** (`fanzine-paper`): homepage masthead, portrait/alumni sheets, replay/news beneath grain; supporting agenda session annotations inherit this alias without grain.
- **Charcoal Backing** (`fanzine-charcoal`): page/navigation/footer ground, paper/red text, tickets/year tabs/recording/news dates; supporting prose links, agenda times, primary controls, Decline strokes, and visible focus.
- **Clean Paper** (`fanzine-white`): text on charcoal and reversed ticket state; selected sibling reading/form cards and enabled control hover surfaces, without grain.

### Semantic state
- **Confirmation Instruction Red** (`confirmation-error`): only the scoped confirmation `.field-error` text on clean paper; measured contrast is 5.704:1 for both accept and decline flows. This is a specific legibility correction, not a global recolor of brand red or native feedback.

### Named Rules
**The Field Contrast Rule.** On historical/base Gig Poster surfaces pair ink with yellow or off-white, and off-white with blue. On Fanzine pair charcoal with paper or red, and clean paper text with charcoal; supporting prose, agenda times, and controls use charcoal, not rough red as reading ink.

**The Scoped Ink Rule.** Preserve base yellow/blue tokens; Fanzine aliases apply only through the selected body/route gate. Homepage recomposition and rotation do not propagate to supporting reading or form structures.

Selected sibling prose links are dark and underlined; agenda times are dark with tabular numerals. Current replay links use charcoal; base Gig Poster retains blue sibling links and off-white replay links. Native form errors/required markers, amber warnings, green success, white input surfaces, and neutral borders remain inherited except confirmation instruction text. Placeholder/disabled gray (`#666`) is a state treatment, not a brand color. Preserve Adobe and original course-logo colors; genuine homepage winners and supporting speakers receive the scoped grayscale treatment.

## Typography

**Display Font:** Anton, sans-serif.
**Body Font:** Roboto, roboto-fallback, sans-serif.

Anton supplies tall poster lettering and scoped sibling headings; Roboto keeps paragraphs, controls, navigation, agenda names/times, and news titles readable. Anton is locally served with swap from `fonts/anton-latin.woff2` (approximately 12 KB), licensed in `fonts/anton-OFL.txt`. Its supplied weight is regular. Existing Roboto regular/bold files remain in use.

### Hierarchy
- **Fanzine display / Story:** current homepage frontmatter fanzine roles; masthead caps at 8.5rem, with a deliberate title break below 600px and no forced break from 600px. Uppercase story has its own fixed line break. Ink-wear masks apply only to these two headlines.
- **Fanzine story body:** frontmatter role with a 46ch measure. Masthead invitation uses bold Roboto (1.125rem, line height 1.4), becoming 1.5rem at 600px; its 40ch limit is removed there. Featured winner name uses Anton, `clamp(1.75rem, 3vw, 2.5rem)`; caption metadata uses Roboto (1rem, line height 1.4).
- **Display / Edition (earlier Gig Poster option):** retained frontmatter roles describe the original poster, not the current fanzine title or stamp. Its display becomes `clamp(7rem, 12.3vw, 11rem)` at 900px; its separate blue numeral is not a watermark. The current red stamp inherits fanzine display, with an accessible edition label.
- **Headline:** frontmatter headline role for homepage section headings, with a bottom margin (28px). Statistics headings are a smaller exception (2rem).
- **Title:** frontmatter title role; news headings deliberately use bold Roboto rather than Anton.
- **Winner name:** current alumni use frontmatter fanzine-winner-name; the earlier option uses regular Anton, `clamp(1.3rem, 2.4vw, 2rem)`, line height (1.2). The shared heading rule overrides the incumbent block's bold weight. Neither is the news title.
- **Body:** frontmatter body role; replay paragraphs use the smaller replay-body role and a measure (65ch); disclosure paragraphs cap at 70ch.
- **Action / Label:** frontmatter action role for tickets; the small bold Roboto label role is not the winner-year treatment. The earlier poster invitation uses bold Roboto, `clamp(1rem, 2vw, 1.5rem)`, line height (1.4).
- **Winner year:** frontmatter winner-year type role remains uppercase Anton above portraits; current fanzine tabs use their separately scoped charcoal/clean-paper component role.
- **Reading title / Section / Subsection:** fixed frontmatter read roles for the guide; title becomes 4rem at 600px, while section and subsection sizes remain fixed. Direct authored page titles use the current red printed title-band variant; the base yellow role is historical.
- **Masterclass title:** frontmatter masterclass-title role for the course hero. Learning/agenda/speaker section headings use regular Anton (2rem); speaker names use regular Anton (1.5rem). Agenda topics stay bold Roboto (1.0625rem); times use bold Roboto (.875rem) with tabular numerals, descriptions use Roboto (1rem).
- **Form title / Field label / Field input:** fixed frontmatter form and field roles. Form titles stay compact at every breakpoint; descriptions use Roboto (1rem). Labels and controls do not inherit poster typography.

### Named Rules
**The Scoped Voice Rule.** Share Anton and the scoped Fanzine palette across prepared routes, not homepage display scale: fixed reading roles and compact form titles preserve comprehension and task clarity.

## Layout

Shared full-width color bands contain centered content capped at 1200px. Section padding is 56px vertically and 20px horizontally on small screens; at 600px it becomes 72px and 32px. Current fanzine hero section padding is 32px 22px 56px, becoming 36px 36px 64px at 600px, plus 4px block inline padding. The earlier poster uses vertical padding (36px), increasing to 40px at 600px. Navigation has its own 1264px border-box cap and fixed height (72px). All main-content IDs reserve navigation height plus 24px of scroll margin.

The recurring gaps are the frontmatter spacing steps, not an invented universal scale. Fanzine masthead sits above the story/portrait spread: one column in source order on mobile, story then portrait, with a 28px gap and 36px top margin. At 900px, when a genuine feature exists, the spread becomes `1.4fr 1fr` with a 36px gap and top alignment. Masthead padding grows from 20px to 24px 28px at 600px; story padding grows from 24px to 32px. Its ticket is full width until 600px, then auto width. The feature sheet has 14px padding; its landscape portrait has aspect ratio 1.4. The retained earlier Gig Poster layout is a two-column copy/numeral grid even on mobile, with a ruled spanning ticket rail; it is not the current homepage composition.

- **Replay:** stacked image/text until 900px, then a `1.15fr 1fr` grid with a 48px gap.
- **Topics:** ruled full-width rows; two columns at 600px and three at 900px, with 24px trailing spacing.
- **People:** all 11 alumni retained; two columns initially with gaps (32px 20px); three at 600px with gaps (40px 32px); four at 900px. Fanzine adds 10px paper backing, not a new grid.
- **News:** one column with a 24px gap; three at 900px with a 32px gap. Archive disclosures span the grid.
- **Historical guidance:** one column, becoming two with a 48px gap at 900px.
- **Reading pages:** red printed title/lead band above a clean paper guide column (70ch). Preparation separates only a direct authored heading and following lead paragraph, preserves copy/IDs/year, and promotes an authored lower-level page title to H1 (including the sole H3 case). Blocks are not recomposed or rotated. The 2026 guide remains historical and the closed submission page stays closed, without a new form.
- **Masterclass:** red printed hero with heading/copy before the original multicolor course logo on mobile; at 900px it remains a `1.4fr .6fr` grid. The first viewport establishes course hierarchy, not homepage masthead scale. Learning columns remain clean/unboxed. Two authored agendas stack rows, becoming 160px time plus content columns at 600px with a 24px gap; breaks are red printed rectangles. Genuine grayscale speakers follow two/three/four columns at 0/600/900px. Course-section top padding is 56px, increasing to 72px at 900px.
- **Task forms:** transparent outer sections expose charcoal backing; clean paper wrappers cap at 720px. Left-aligned red printed headers have 24px padding, increasing to 32px at 900px; title size stays fixed. Form bodies have 24px bottom padding. Direct fields, submit/action wrappers, success, and error panels have 24px inline margins. Access-request `.form-fields` explicitly uses `width:auto; min-width:0`, avoiding inherited 100%-width plus margins clipping. Existing grids, radios, conditional fields, and accept/decline actions remain unchanged and unrotated.

Historical `browser-checks.json` and `rollout-browser-checks.json` describe the earlier option. Current `check-rockstar-pages.mjs` evidence in `fanzine-pages-checks.json` records 55 passing cases: 45 responsive cases across nine routes at 320/390/600/900/1440 (20 synthetic), seven mocked functional scenarios (five synthetic/two authored), and three excluded-route class/style-isolation cases. Control-level form/viewport clipping checks are included. Actual computed confirmation instruction contrast is 5.704:1 in both accept and decline. Source tags distinguish authored preview content from synthetic configurations.

Homepage `check-fanzine.mjs` passed seven widths (320/390/600/900/1280/1440/1600) and nine shared-theme activation/isolation assertions; those nine assertions alone do not prove authored content exists. Supplied final validation: `npm run lint` passed (six pre-existing warnings/no errors), `npm run lint:css` passed after CSS fixes, `npx --no-install web-test-runner test/rockstar.test.js --node-resolve` passed 12 tests, and `git diff --check` passed. `fanzine-pages-detector.json` is empty (`[]`), run once before the reviewer-only contrast correction and not rerun. Earlier detector evidence is historical. This documentation merge does not rerun suites, detector, browser, or captures.

## Elevation & Depth

The historical Gig Poster base remains flat and unboxed. Fanzine adds material layering without card shadows: homepage masthead/feature rotate -1deg, story .6deg, and red edition stamp 3deg. Supporting guides/forms do not rotate; clean sheets, printed bands, rules, and spacing provide depth. Alumni have flat paper backing without hover lift; course people/learning content remain unboxed. The inherited recording-icon hover scale/soft shadow is legacy residue, not an elevation token. Form focus halos and stable shadow-drawn input strokes are functional state indicators, not lifted surfaces.

The two shipping materials are original deterministic Canvas-authored indexed rasters with embedded origin/provenance: `styles/assets/fanzine-print.png` (approximately 30 KB, transparent print grain) and `styles/assets/fanzine-ink.png` (approximately 10 KB, alpha ink-wear mask). The material scan returned two rasters and zero missing provenance records; this extension reuses them. Grain covers homepage paper/red fields and supporting title/course/form headers and agenda breaks, never long prose or inputs. The mask repeats at 384px 256px only on homepage masthead/story headlines. Genuine CMS portraits supply people, not generated textures or fabricated faces.

### Named Rules
**The Flat Bill Rule.** Keep Gig Poster editorial containers and people unboxed; fanzine may use its native flat paper sheets and alumni backing. Neither world adds card elevation; retain hierarchy through material, fields, spacing, and thin rules.

## Shapes

Tickets, winner-year tabs, alumni/speaker portraits, replay imagery, date blocks, form fields/actions, and content containers use square geometry. Alumni/speaker portraits crop square; the fanzine lead portrait instead uses a landscape 1.4 aspect ratio, still square-cornered. Images remain genuine CMS assets; homepage winner and supporting speaker portraits receive grayscale and contrast (1.1). Thin borders (1px) divide selected sections, topic/agenda rows, disclosures, and the earlier poster ticket area; homepage news articles and archive wrappers have no staggered bottom borders. Paper edges are rectangular with slight hero rotations, not torn polygon clips. Native radios retain their familiar circular geometry. The ticket chevron is drawn with CSS borders, not a text glyph. Native disclosure markers and the existing CSS hamburger are functional controls, not decorative iconography.

## Components

### Buttons

Ticket-like and legible, with the primary and replay variants defined in frontmatter. Labels wrap instead of truncating; borders are transparent (1px), corners square.

- **Historical/base primary:** royal-blue fill, off-white text. Hover and keyboard focus change fill to ink; current supporting controls use the Fanzine variant.
- **Earlier Gig Poster replay on blue:** yellow fill with ink text; its more specific color assignment persists on hover/focus.
- **Fanzine story ticket:** charcoal fill with clean paper text; hover and keyboard focus reverse to clean paper with charcoal text. Replay/news tickets share the resting fill and hover reversal; their focus retains the inherited charcoal fill and visible current-color outline. Do not claim the story's focus reversal applies to every ticket.
- **Feedback:** link tickets append a border-drawn chevron (9px square, 2px strokes, 18px left margin). Hover/focus translates it 4px over `.2s cubic-bezier(.16, 1, .3, 1)`.
- **Focus:** shared visible outline (3px solid current color), offset (5px); current sibling course/form actions explicitly use charcoal outlines. Base actions retain blue outlines.
- **Motion:** reduced-motion mode removes ticket-arrow and recording-link transitions and disables smooth scrolling. No looping motion or autoplay is established.

Current supporting form/course controls are charcoal with clean-paper text and dark borders; enabled hover reverses to clean paper with charcoal text/border. Disabled controls retain gray fill/stroke and paper text. Confirmation Decline is transparent with dark stroke/text and the same enabled hover reversal; disabled styling takes precedence. Form buttons have no link-ticket chevron; loading and native task behavior remain intact. These are not a homepage form or filter-chip system.

### Cards / Containers

Current replay content is an unboxed image/text pairing on printed paper; the earlier option uses blue. Images span available width. Current community tiles are paper rectangles with frontmatter fanzine padding; charcoal/clean-paper year tabs have an 8px bottom margin, square monochrome portraits, and Anton names with a 4px bottom margin. There is no border, rounding, shadow, or card hover lift. Earlier Gig Poster community tiles remain recorded as unboxed, unpadded tiles with blue/yellow tabs (8px 12px); these are not the current homepage preview. Optional recording controls keep the existing inline SVG, positioned top 12px/right 10px on fanzine tiles with charcoal fill and clean-paper stroke. News articles and archive wrappers are borderless, unpadded containers within the paper field; charcoal date blocks use clean-paper text and tabular numerals. Masterclass learning columns and genuine speaker portraits retain their unchanged unboxed treatment.

### Inputs / Fields

Square and readable, with Roboto labels/controls and neutral placeholders on clean paper cards. Native input surfaces remain white, without grain. Registration/confirmation hover/focus borders and keyboard outlines resolve `--link-color` to charcoal, retaining the existing subtle blue-tinted halo (`0 0 0 3px rgb(0 123 255 / 10%)`) and native invalid red border/halo. Access inputs retain stable shadow-drawn strokes: neutral at rest/hover, charcoal at focus, native red for populated invalid input; their focus suppresses the generic outline. The access stroke is 2px, increasing to 3px under the inherited higher-contrast preference. Do not collapse these into one invented focus token. Padding is defined in frontmatter; placeholders use gray (`#666`), while carets still resolve `--rockstar-blue` to rough red. Dark visible focus is not a claim that every inherited halo/caret was recolored.

Native radios, required markers, dietary-other and corporate-email conditional fields, warning/success/error panels, loading opacity, and disabled controls remain inherited. The single exception is `.rockstar-inner.rockstar-grunge .mc-confirm .field-error`: confirmation instruction/error text uses the frontmatter confirmation-error token on clean paper for measured 5.704:1 contrast. Other native semantic colors are untouched. Success/error panel corners are square. The 24px form-child margins and access fields' auto/min-width correction prevent control-level clipping, not new controller logic. Registration's decorative location emoji is hidden without removing venue text. Controllers, endpoints, payloads, conditional behavior, and old authored dates remain unchanged.

### Agenda Session Labels

Restrained rectangular annotations, not selectable chips. Current session labels inherit cool paper with charcoal text, small Roboto (.875rem), and padding (4px 8px). Day badges use charcoal/clean paper; breaks are red printed bands with dark plain labels. Names and dark tabular times stay Roboto. Yellow labels/blue badges remain historical/base roles, not current sibling colors.

### Navigation

The historical/base shell is a fixed yellow bar with an ink bottom rule; current Fanzine homepage and selected siblings override it to charcoal with clean-paper links/wordmark/hamburger and a paper bottom rule. Both retain the existing Adobe icon and nonwrapping Anton wordmark (1.2rem, tracking .02em). The scoped links lead to show, community, news, Masterclass, and the genuine submission guide. Homepage hash links stay local; on siblings they are prefixed with `/en/`. Exact page matches without hashes receive `aria-current="page"` and an underline, not a pill. Desktop navigation starts at 900px; links inherit Roboto (the incumbent desktop size is .875rem). Below that, a real button controls the collapsible menu with expanded state, Escape handling, and keyboard focus. No new hover fill is established.

### Disclosures

Native `details`/`summary` preserve keyboard behavior and the browser marker. General homepage disclosures have a top rule, margin above (36px), and bold summary with vertical padding (18px). News/guidance archive wrappers remove borders and reset that margin to zero; all summaries within news use compact vertical padding (12px). Historical guidance is explicitly labeled as past-edition material, not current eligibility or dates.

### Fanzine Masthead / Lead Story

The tilted paper masthead contains the AEM Rockstar title and inline red edition stamp, not the earlier giant separate numeral. The lead-story sheet exposes the historical 2026 replay action before the portrait in source/mobile order. The featured winner is taken from the first authored alumni row, with its actual name/year; `createOptimizedPicture` builds an eager optimized 800px CMS portrait with the name as alt text. The feature is omitted if its genuine image/name/year are absent; the 900px two-column layout is conditional on the feature. No fabricated person or placeholder portrait is authorized. When a recording is unavailable, the existing community/submission-guide fallback and neutral next-chapter copy apply, not invented registration.

### Poster (Earlier Gig Poster Option)

The two-line title and separate edition numeral form the signature bill. The numeral has an accessible edition label. The ruled ticket rail carries a genuine destination: the 2026 replay, with community/submission-guide fallbacks when authored material is absent. This describes the earlier option's surface behavior, not a permanent event-registration component.

## Do's and Don'ts

### Do:
- **Do** preserve historical/base Gig Poster tokens; use Fanzine aliases for the selected homepage/supporting routes, with recomposition and rotation confined to the homepage.
- **Do** preserve genuine CMS imagery, portrait identity, recording destinations, and authorable structures.
- **Do** retain dark visible supporting focus, native semantic controls, and reduced-motion behavior; keep confirmation instruction red scoped to its measured clean-paper context.
- **Do** label historical recordings and guidance as historical; upcoming dates and registration remain unconfirmed.
- **Do** retain the guide's 70ch measure, fixed reading hierarchy, compact form titles, clean unrotated prose/inputs, 24px form-child margins, and access fields' auto/min-width correction.
- **Do** preserve inline symbols and block configuration; preparation strips only leading decorative emoji prefixes from direct prose headings, paragraphs, lists, and their list-item/emphasis text.

### Don't:
- **Don't** apply giant homepage display/edition sizes to guide or task-form headings, or retheme excluded routes.
- **Don't** turn flat replay, news, or supporting-page people into rounded, shadowed card grids; homepage fanzine paper backing is native material, not permission for elevated cards.
- **Don't** treat the working replay action as proof of upcoming registration or a confirmed lineup.
- **Don't** treat preview tonal ramps in the sidecar as additional shipped palette tokens.
- **Don't** reinterpret old masterclass dates, the 2026 guide, closed submissions, or mocked form responses as current availability or verified backend delivery.

Not canonized or repaired: inherited recording-link hover scale/soft shadow remains legacy drift; the existing masterclass `.kicker` is a craft defect/authored residue, not a reusable eyebrow rule. Hidden trophy/location glyphs and the old hero bolt are not an icon system. No hard offset shadow or system display face is adopted. Missing-route authored content and the existing 404 sampleRUM import remain outside this frontend/documentation scope; synthetic fixtures do not legitimize them.

Review boundary: the earlier seed-evidence correction and original rollout findings are historical, not current whole-site certificates. The fresh full supporting-page finish reviewer matched all contract rows except conditional-email instruction contrast, disposition fix. One scoped confirmation red-text correction followed. A fresh narrow Verdict Pass (synchronous one-shot could not continue) scored that one fix resolved, disposition ship, with no patch-induced regression observed. This describes reviewed frontend scope and a narrowed verdict, not unrestricted whole-site approval, authored missing-route fidelity, real backend delivery, or publishing/deployment. No source repair, suite rerun, detector rerun, or browser recapture occurred in this documentation merge.
