---
name: Bowlup
description: Warm, practical recipe discovery and cooking, led by real food.
colors:
  ember: "#F26B2A"
  ember-hover: "#FF813F"
  saffron: "#FFB547"
  rating-ink: "#654008"
  rating-hover: "#F6E7CF"
  roast: "#2B1D14"
  cream: "#FBF7F2"
  surface: "#F2EBE2"
  line: "#E6DBCE"
  muted: "#6C5E53"
  field: "#FFFDF9"
  field-border: "#B9A997"
  outline-border: "#BCAE9F"
  placeholder: "#78695C"
  focus: "#A53E12"
  error: "#A63029"
  error-surface: "#FBE8E3"
  error-text: "#822E25"
  disabled-surface: "#E9E0D5"
  disabled-text: "#6A5D52"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(44px, 4.6vw, 68px)"
    fontWeight: 650
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "23px"
    fontWeight: 550
    lineHeight: 1.24
    letterSpacing: "-0.025em"
  panel-title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "28px"
    fontWeight: 550
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.25
  small:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  inset: "8px"
  field: "12px"
  compact-photo: "16px"
  panel: "20px"
  detail-photo: "24px"
  hero-photo: "28px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  control: "20px"
  lg: "24px"
  panel: "28px"
  section: "32px"
  row: "40px"
  wide: "48px"
  cooking: "64px"
components:
  rating-star:
    width: "44px"
    height: "44px"
    color: "#7B6A58"
    fill: "none"
  rating-star-selected:
    color: "#654008"
    fill: "{colors.saffron}"
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.roast}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-primary-hover:
    backgroundColor: "{colors.ember-hover}"
    textColor: "{colors.roast}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.roast}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-disabled:
    backgroundColor: "{colors.disabled-surface}"
    textColor: "{colors.disabled-text}"
  field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.roast}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    width: "100%"
  search:
    backgroundColor: "{colors.field}"
    textColor: "{colors.roast}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
  category:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  category-selected:
    backgroundColor: "{colors.roast}"
    textColor: "{colors.cream}"
  recipe-photo:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    width: "100%"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.roast}"
    rounded: "{rounded.panel}"
    padding: "28px"
  form-error:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.error-text}"
    rounded: "{rounded.field}"
    padding: "14px 16px"
---

# Design System: Bowlup

## Overview

**Creative North Star: "The meal is the interface"**

Bowlup is a friendly kitchen companion. Real food photographs provide appetite and texture; clear geometric headings, practical controls, and warm open space help a cook move from an idea to a meal. The approved Bowlup marks, palette, and font pairing are binding brand commitments from [PRODUCT.md](PRODUCT.md).

The shipped world is calm and useful across public discovery, cooking, account access, saved recipes, and authoring. It uses a shared centered frame, generous photo crops, pill actions, and quiet tonal panels. The discovery composition belongs to its [surface contract](.impeccable/surfaces/app-pages-index-vue.md); it is not a required composition for every page.

**Key Characteristics:**

- Real, dish-matched food photography with retained credits.
- Cream ground, dark roast text, and a clear orange lead action.
- Outfit hierarchy paired with readable DM Sans controls and instructions.
- Flat surfaces, rounded photographs, and restrained interaction motion.
- Warm, plain language that describes actual product states.

Evidence: extracted from `app/assets/css/main.css` and the shared header, footer, recipe card, catalog, authentication, editor, manager, profile, and recipe-detail implementations. Representative production captures were inspected at desktop and phone sizes; the finish reviewer opened all 20 captures in `.impeccable/review/capture-manifest.json`, including the tablet view. Its four scored fixes received a scoped ship verdict; this is not a whole-product audit. Taste's editorial-greeting draw (seed 661168651) informed density and hierarchy; the supplied Bowlup identity governs palette, type, and top navigation. No Impeccable concept-seed or catalog QUALITY BAR was produced, so neither is claimed as evidence.

## Colors

Warm neutrals make room for food color; Ember identifies the primary action and approved orange mark. Frontmatter values are the normative palette.

### Primary

- **Ember:** orange primary-action fill and the approved header mark. Buttons use roast text; the brighter Ember hover belongs to interaction state.

### Secondary

- **Saffron:** selected save controls and the profile initial fallback; also the theme warning color.

### Neutral

- **Dark Roast:** default text, selected category fills, and the footer ground.
- **Cream:** page ground, reverse text, and unsaved photo-overlay controls.
- **Warm Surface:** ingredient panels, editor asides, empty states, and quiet hover fills.
- **Warm Line:** dividers and subtle panel/menu borders.
- **Muted Roast:** supporting copy and recipe metadata; also the opaque search placeholder.
- **Field White:** warm input and search surfaces. Field Border and Outline Border distinguish editable fields and secondary buttons.
- **Placeholder:** standard input and textarea hints; use Muted Roast in search fields as implemented.
- **Disabled Surface / Disabled Text:** legible unavailable button states without opacity fading.

Focus is a darker warm accent. Error, Error Surface, and Error Text carry field and form failures; do not turn them into a brand accent.

**The Quiet Ground Rule.** Keep interface surfaces warm and quiet so the food supplies the most varied color.

**The Lead Action Rule.** Use Ember for the principal action in the current task; use outline or text treatments for supporting actions.

## Typography

**Display Font:** Outfit, with sans-serif fallback. The variable face is self-hosted at `public/fonts/Outfit.woff2`.

**Body Font:** DM Sans, with sans-serif fallback. The variable face is self-hosted at `public/fonts/DM-Sans.woff2`.

**Character:** Outfit supplies soft geometric confidence. DM Sans keeps ingredients, steps, forms, and small navigation direct and comfortable to read. Both load with `font-display: swap`; license files accompany the fonts.

### Hierarchy

- **Display:** the responsive discovery heading; its actual viewport adjustments are recorded in Layout.
- **Headline:** standard page titles. Recipe detail uses a larger desktop title (44px), then scales down with the viewport.
- **Title:** recipe-card names. Their compact leading keeps two-line names coherent.
- **Panel Title:** ingredient and cooking headings. Discovery section headings are larger (34px), while editor section headings are slightly smaller (26px).
- **Body:** default text and editable fields. Reading copy is limited to 68ch; page introductions use up to 60ch.
- **Lead:** introductory discovery copy. Cooking steps and reading paragraphs use more generous leading (1.85).
- **Label / Small:** compact actions and supporting information. Navigation uses regular body-family text (15px); category controls use a medium weight (550).

**The Two Voices Rule.** Use Outfit for headings and DM Sans for reading and controls; retain the actual approved logo artwork instead of typesetting the wordmark.

## Layout

The shared frame centers content with a maximum width (1240px) and desktop side clearance (40px). Below the first breakpoint (1000px), clearance becomes 24px; at phone layouts (760px and below), it becomes 20px. The implementation uses explicit split and equal-column CSS grids, not a literal shared twelve-column grid.

Desktop recipe grids have three equal columns with horizontal gaps (28px) and row gaps (40px). At intermediate discovery widths (761–900px), the greeting stacks and recipes use two columns. At phone widths, recipe grids use two columns with smaller horizontal gaps (16px); below 370px, they use one column. Photo crops change from a wide ratio (1.38) to square on phones. Main content remains readable without sideways scrolling.

The desktop discovery split uses a near-equal ratio (1:1.04) and a generous gap (54px). Detail and creator screens use their own task-specific splits. At phone widths, these sections stack, catalog search spans both filter columns, advanced filters become a single column, and editor side content follows the main form. Cooking ingredients and instructions stack with a gap (36px).

The header is a horizontal logo-and-navigation row (108px tall), reducing to 84px on phones. Desktop navigation folds into a labeled menu at 760px. Authentication forms are capped at 440px; profile content at 840px; reading pages at 960px. Reuse the observed spacing steps rather than forcing all gaps onto a newly invented scale.

Discovery display sizing is fluid on wide screens, then explicitly becomes 52px below 1000px, 58px in the stacked 761–900px interval, 48px at phone widths, and 42px below 370px. Standard page titles reduce to 32px on phones; detail titles reduce to 36px below 1000px and 34px on phones. Recipe-card titles reduce to 21px and then 19px.

## Elevation & Depth

Surfaces are flat at rest. Tonal panels, image crops, spacing, and fine separators provide hierarchy. Buttons and fields explicitly have no box shadow. The account popover is the sole recurring lifted surface, with a restrained ambient shadow (`0 12px 30px #2b1d1414`).

**The Flat At Rest Rule.** Preserve flat recipe cards and task panels; reserve the small ambient shadow for the floating account menu.

Motion uses the shared tokens in `app/assets/css/motion.css`: 140ms feedback, 220ms UI transitions, 420ms arrivals, and one 640ms featured-meal entrance, with `cubic-bezier(.16,1,.3,1)` for arrivals. The featured photograph opens from a shallow rounded crop and settles into its frame; copy stays immediately readable. Recipe cards enter once when visible, with at most 90ms sibling delay. Filter changes use Vue list moves; navigation and mobile menus use short transitions. Saved marks, ingredient checks, star fills and button presses acknowledge their actual state. No autoplay loops, global scroll listener or motion dependency is used.

Rating controls use five real SVG stars, 27px inside 44px touch targets. Selected stars fill with Saffron and a dark outline; hover previews a choice without replacing the saved selection. The radio group supports arrows, Home, End, Space and Enter. Loading prevents duplicate submissions, and the saved rating returns on reload.

Reduced motion removes spatial transforms, crop reveals and scripted card entrances. Short color and opacity feedback remains; smooth scrolling is disabled. Default content stays visible without JavaScript. Do not make animation necessary to understand state.

## Shapes

Pills identify actions, category controls, and search. Editable fields use soft corners; photographs and quiet panels use broader corners. Desktop card photos and panels share the panel radius; hero and detail photographs have their own larger radii. Phone card photos reduce to the compact-photo radius; hero photos use 22px and detail photos use 20px. Circles are reserved for save controls, compact icon controls, and avatar initials.

Use fine warm strokes to expose editable controls and separate list rows. Photo frames clip the image, which uses `object-fit: cover`. Keep the approved logo lockups intact, proportionate, and on quiet backgrounds; do not recolor, rotate, stretch, rearrange, or add effects to the supplied marks in `public/brand`.

## Components

### Buttons

Confident pills with readable dark labels. Standard buttons have a minimum height (46px), medium weight (600), and the frontmatter padding. Primary buttons pair Ember with Roast. Outline buttons remain transparent with a warm stroke and gain a Warm Surface fill on hover. A press translates down by 1px. Disabled buttons retain full opacity and use the disabled palette. Compact icon controls are circular (44px); save overlays are smaller (40px, or 36px on phones).

### Chips

Category controls are quiet pills with minimum height (42px). Unselected labels use Muted Roast; hover uses Warm Surface and Roast. Selection pairs Roast fill with Cream text, expressed through `aria-pressed` or the current-page state. Category controls wrap on narrow screens.

### Cards / Containers

Recipe cards sit directly on Cream without a surrounding border, shadow, or colored text box. Rounded dish photographs carry the visual weight; metadata appears before a clear title, followed by a modest author or price line. Image hover scales to 1.035 without moving the card. The independent save overlay uses Cream, then Saffron when saved, with an accessible pressed state. Warm panels group ingredients, editor details, empty states, and locked-recipe explanations; their desktop padding follows the panel token and reduces to 22px for general panels on phones.

### Inputs / Fields

Inputs, selects, and textareas share Field White, a warm stroke, soft corners, and a minimum height (48px). Keep editable text at body size. Search is a compact pill with an inline SVG search icon, a minimum height (46px), and a darker opaque placeholder. The reviewed search combination measures 6.15:1 against its field surface.

The global keyboard outline is 3px with a 4px offset; search uses a 2px focus-within outline with a 3px offset. Form failures use the warm error panel and a text explanation, with `role="alert"` where implemented. Busy controls expose their busy or disabled state and keep helpful progress text.

### Navigation

Use the intact orange horizontal lockup at the left of the light header; the footer uses its approved cream version on Roast. Main navigation is plain DM Sans text with underlined hover and current-page states. The mobile menu has a clear open/close label, expanded state, and stacked links. Account navigation is a compact popover, not a permanent workspace sidebar. The skip link becomes visible on keyboard focus.

### Cooking and Authoring

Ingredients form a quiet panel of native checkboxes; checked items strike through and become muted. Instructions remain an ordered sequence with Outfit step numbers and generous reading leading. Keep category navigation with the recipe facts below the title and description rather than introducing an eyebrow above the heading.

The editor retains real recipe fields, repeatable ingredient and step rows, photo management, and free/paid choices. Upload availability and checkout availability must be visible in plain text next to the relevant controls. Present the current unavailable states honestly and keep paid ingredients and steps locked for cooks without access. Empty or zero community states remain explicit rather than suggesting invented activity.

## Do's and Don'ts

### Do:

- **Do** use the approved Bowlup marks and the pinned brand palette.
- **Do** use real, dish-matched food photographs and retain their provenance and attribution in `public/images/recipes/credits.json` and the credits page.
- **Do** keep food cards flat, their photo crops generous, and their titles readable at narrow widths.
- **Do** keep visible keyboard focus, opaque readable placeholders, and clear selected or disabled states.
- **Do** describe actual upload, checkout, loading, failure, and empty states in warm, practical language.
- **Do** preserve the two-font hierarchy and let instructions have comfortable reading width and leading.

### Don't:

- **Don't** replace the approved wordmark with text or alter the supplied logo artwork.
- **Don't** substitute illustrations or invented food imagery for the seeded recipe photographs.
- **Don't** add decorative kickers or eyebrows above headings; category navigation belongs with recipe facts.
- **Don't** add hard offset shadows, decorative gradients, or panel shadows to this flat visual world.
- **Don't** use text glyphs as interface icons; use the implemented SVG icon language.
- **Don't** invent team members, testimonials, ratings, purchases, or activity to fill visual space.

Not canonized or repaired by this documentation pass: no remaining defect was identified in the four scored finish fixes; the missing Impeccable concept-seed and catalog QUALITY BAR remain disclosed workflow limitations, not design rules or a claim of independent catalog-ceiling approval.
