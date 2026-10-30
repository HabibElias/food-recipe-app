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
  rating-outline: "#7B6A58"
  landing-field-border: "#9B5834"
  roast-hover: "#4D3626"
  reverse-muted: "#DFD1C2"
  reverse-border: "#846F5F"
  saffron-outline: "#765626"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(58px, 6.4vw, 92px)"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.035em"
  landing-headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(36px, 4.2vw, 60px)"
    fontWeight: 550
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  landing-closing:
    fontFamily: "Outfit, sans-serif"
    fontSize: "64px"
    fontWeight: 550
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  founder-name:
    fontFamily: "Outfit, sans-serif"
    fontSize: "58px"
    fontWeight: 550
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  landing-section:
    fontFamily: "Outfit, sans-serif"
    fontSize: "44px"
    fontWeight: 550
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  journey-chapter:
    fontFamily: "Outfit, sans-serif"
    fontSize: "33px"
    fontWeight: 550
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  journey-recipe-title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "31px"
    fontWeight: 550
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  photo-caption:
    fontFamily: "Outfit, sans-serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.2
  starter-title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "25px"
    fontWeight: 550
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  benefit-title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "24px"
    fontWeight: 550
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  landing-intro:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.75
  compact-body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.75
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
  leaf-photo: "10px"
  field: "12px"
  compact-photo: "16px"
  recipe-sheet: "18px"
  panel: "20px"
  kitchen-leaf: "22px"
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
  landing-section: "72px"
  landing-section-phone: "80px"
  landing-section-tablet: "96px"
  landing-section-inset: "112px"
  landing-section-wide: "128px"
  landing-heading-gap: "56px"
components:
  rating-star:
    width: "44px"
    height: "44px"
    textColor: "{colors.rating-outline}"
  rating-star-selected:
    textColor: "{colors.rating-ink}"
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.roast}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-primary-hover:
    backgroundColor: "{colors.ember-hover}"
    textColor: "{colors.roast}"
  landing-primary:
    backgroundColor: "{colors.roast}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    height: "50px"
    width: "100%"
  landing-primary-hover:
    backgroundColor: "{colors.roast-hover}"
    textColor: "{colors.cream}"
  landing-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.roast}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    width: "100%"
  journey-phase:
    backgroundColor: "transparent"
    textColor: "{colors.reverse-muted}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
    height: "44px"
  journey-phase-selected:
    backgroundColor: "{colors.saffron}"
    textColor: "{colors.roast}"
  recipe-sheet:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.roast}"
    rounded: "{rounded.recipe-sheet}"
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

The app's Operate surfaces remain calm and useful across recipe browsing, cooking, account access, saved recipes, and authoring. They share a centered frame, generous photo crops, pill actions, and quiet tonal panels. The home route now uses a Persuade composition: broad brand-color chapters and a recipe sheet that demonstrates the product. This scoped landing expression belongs to its [surface contract](.impeccable/surfaces/app-pages-index-vue.md); other routes retain the app system.

**Key Characteristics:**

- Real, dish-matched food photography with retained credits.
- Cream app ground and dark roast text; Ember and Saffron become full landing chapters with contrasting actions.
- Outfit hierarchy paired with readable DM Sans controls and instructions.
- Flat surfaces and rounded photographs; one transforming recipe sheet supplies the landing's main motion.
- Warm, plain language that describes actual product states.

Evidence: the retained app system comes from `app/assets/css/main.css`, `motion.css`, and the shared app components. The current landing additions come from `app/pages/index.vue`, `app/components/landing-recipe-journey.vue`, and `app/assets/css/landing.css`. The former catalog homepage used Taste's editorial-greeting draw (seed 661168651). For this landing, Impeccable produced seven grounded candidates with surface seed `e9dbf295ca036dc7`, dealt 5/1/6; the user selected candidate 5, Follow one recipe, and the choice CLI recorded it. Taste's actual landing draw is page-is-the-object (seed 1843819450), retaining the approved palette and type. Implementation is code-led. No new catalog world, catalog QUALITY BAR card, or approved sketch/comp image was produced; no comp fidelity is claimed.

Final landing evidence includes desktop, tablet, phone and 320px captures in `.impeccable/review`, normal-motion full pages in `/workspace/.setup/bowlup-landing-final-inspect`, and custom desktop/phone/reduced-motion sheets with `motion-report.json`. Functional checks passed 22/22 with no account mutations or runtime errors. Final Taste inspection reported 0 FAIL and 5 WARN; the earlier design detector reported 0 primary findings and 61 advisories against the old document. Those observations remain recorded; this refresh describes intentional extensions rather than claiming the tools did not run. Raster provenance scanned 14 existing images with 0 missing records; the landing adds no shipping raster. This evidence is scoped to the landing and prior reviewed app work, not a whole-product audit.

## Colors

Warm neutrals make room for food color. Ember identifies app primary actions and the approved orange mark; the landing also uses the approved inks as large flat fields. Frontmatter values are the normative palette.

### Primary

- **Ember:** app primary-action fill and the approved header mark; also the landing's opening and closing grounds. Ember buttons use Roast text; Ember fields use Roast buttons with Cream labels.

### Secondary

- **Saffron:** selected save controls and the profile initial fallback; also the theme warning color. On the landing it supplies the sharing field, saved recipe leaf, photo surround and selected phase controls.

### Neutral

- **Dark Roast:** default text, selected category fills, and the footer ground.
- **Cream:** page ground, reverse text, and unsaved photo-overlay controls.
- **Warm Surface:** ingredient panels, editor asides, empty states, and quiet hover fills.
- **Warm Line:** dividers and subtle panel/menu borders.
- **Muted Roast:** supporting copy and recipe metadata; also the opaque search placeholder.
- **Field White:** warm input and search surfaces. Field Border and Outline Border distinguish editable fields and secondary buttons.
- **Placeholder:** standard input and textarea hints; use Muted Roast in search fields as implemented.
- **Disabled Surface / Disabled Text:** legible unavailable button states without opacity fading.
- **Reverse Muted / Reverse Border:** supporting journey copy, captions and phase-control strokes on Roast. These are scoped reverse-surface supports, not new brand accents.
- **Landing Field Border / Saffron Outline:** readable field strokes on Ember and the sharing button's outline on Saffron. Roast Hover is the landing search-button hover fill.

Focus is a darker warm accent. Error, Error Surface, and Error Text carry field and form failures; do not turn them into a brand accent.

**The Quiet Ground Rule.** Keep Operate surfaces warm and quiet so the food supplies the most varied color; the landing may organize its story with flat fields of the approved brand colors.

**The Lead Action Rule.** Use Ember for principal app actions; on Ember landing fields use Roast with Cream labels. Keep supporting actions outline or text treatments.

## Typography

**Display Font:** Outfit, with sans-serif fallback. The variable face is self-hosted at `public/fonts/Outfit.woff2`.

**Body Font:** DM Sans, with sans-serif fallback. The variable face is self-hosted at `public/fonts/DM-Sans.woff2`.

**Character:** Outfit supplies soft geometric confidence. DM Sans keeps ingredients, steps, forms, and small navigation direct and comfortable to read. Both load with `font-display: swap`; license files accompany the fonts.

### Hierarchy

- **Display / Landing Headline:** the home promise and the landing's principal section headings. Their fluid desktop sizes and responsive overrides are scoped to this surface.
- **Landing Section / Closing / Founder Name:** compact recipe-and-FAQ section headings, the closing search statement, and the founder's typographic signature. They use Outfit without introducing a new display face.
- **Journey Chapter / Journey Recipe Title:** narrative stage headings and the title inside the live recipe sheet. The opening search title also uses the recipe-title size, with tighter leading (1.05).
- **Starter Title / Photo Caption / Benefit Title:** food-entry names, the captions printed on recipe leaves, and practical benefit headings. Opening recipe names use the starter-title size with leading (1.2); photo captions remain regular weight.
- **Headline:** standard page titles. Recipe detail uses a larger desktop title (44px), then scales down with the viewport.
- **Title:** recipe-card names. Their compact leading keeps two-line names coherent.
- **Panel Title:** ingredient and cooking headings. Discovery section headings are larger (34px), while editor section headings are slightly smaller (26px).
- **Body:** default text and editable fields. Reading copy is limited to 68ch; page introductions use up to 60ch.
- **Lead:** shared introductory copy. Cooking steps and reading paragraphs use more generous leading (1.85).
- **Landing Intro / Compact Body:** opening and journey introduction copy, plus compact benefit copy on wider screens. Landing paragraphs use generous leading (1.75); preview descriptions and notes use tighter leading (1.6–1.65).
- **Label / Small:** compact actions and supporting information. Navigation uses regular body-family text (15px); category controls use a medium weight (550).

**The Two Voices Rule.** Use Outfit for headings and DM Sans for reading and controls; retain the actual approved logo artwork instead of typesetting the wordmark.

## Layout

The shared frame centers content with a maximum width (1240px) and desktop side clearance (40px). Below the first breakpoint (1000px), clearance becomes 24px; at phone layouts (760px and below), it becomes 20px. The implementation uses explicit split and equal-column CSS grids, not a literal shared twelve-column grid.

App recipe grids have three equal desktop columns with horizontal gaps (28px) and row gaps (40px). At phone widths, app grids use two columns with smaller horizontal gaps (16px); below 370px, they use one column. Photo crops change from a wide ratio (1.38) to square on phones. Main content remains readable without sideways scrolling.

Detail and creator screens use their own task-specific splits. At phone widths, these sections stack, catalog search spans both filter columns, advanced filters become a single column, and editor side content follows the main form. Cooking ingredients and instructions stack with a gap (36px). The former homepage's near-equal discovery split remains legacy CSS and does not describe the current landing.

The header is a sticky horizontal logo-and-navigation row (108px tall), reducing to 84px on phones. After deliberate downward travel it moves above the viewport; upward travel returns it. Keyboard focus and open menus keep it reachable, and reduced motion keeps it visible. Its layout height stays constant. Desktop navigation folds into a labeled menu at 760px on app routes and 900px on the landing; the open menu scrolls within the available viewport. Authentication forms are capped at 440px; profile content at 840px; reading pages at 960px.

Standard app page titles reduce to 32px on phones; detail titles reduce to 36px below 1000px and 34px on phones. App recipe-card titles reduce to 21px and then 19px.

The landing uses full-width color fields with the shared frame inside. Its opening title/copy grid is asymmetric (1.5:0.8, gap 72px); the recipe/search row is 1.4:1 with an 80px gap. At 900px the title and explanation stack while recipe and search remain side by side. At 600px search leads the one-column lower row, placing explanation and working controls before the food photograph. The opening recipe leaf uses a fixed-height crop (320px desktop, 300px tablet, 225px phone).

The desktop journey preserves its three 430px narrative chapters and its 1:1.15 grid with a 100px gap. The sticky recipe sheet sits 124px from the top to clear the returning header. At widths of 900px or less, or desktop window heights below 820px, the preview precedes the selected chapter and direct controls choose all three states. Recipe-sheet geometry is unchanged: 580px tall, becoming 540px at 600px. Benefits, sharing, founder and closing retain their existing splits, stacking at 600px. Starter dishes retain three columns through tablet widths, then one on phones; FAQ reading text moves from two columns to one.

Landing chapter space is 160px for benefits/founder/recipe endings and 136px for colored chapters on desktop, 120/104px on tablets, and 96/88px on phones. The opening uses 88/104px top/bottom padding, becoming 52/80px on phones, with 72px title-to-content separation (48px on phones). Section-heading-to-content gaps are 56px desktop and 40px phone. Benefit groups use 28px vertical padding, then 24px on tablets/phones; FAQ rows use 40px desktop and 36px smaller-screen gaps. Starter entries use 36px desktop and 48px phone gaps. Keep labels and their inputs close; do not enlarge the journey's internal geometry or add empty scroll distance.

The landing display becomes 70px at 1100px, 76px in the stacked layout at 900px, 48px at 600px and 40px at 370px. The shared landing heading becomes 36px at 600px and 32px at 370px; individual phone headings deliberately vary by role: journey/benefits/sharing (38px), founder introduction (35px), starters (33px), FAQ (34px), closing (46px), and search (26px). The final 370px rule brings the general h2 headings to 32px; the more specific starter heading remains 33px and search remains 26px. Journey recipe titles reduce from 31px to 27px at 1100px, 26px at 600px and 24px at 370px. Chapter titles reduce from 33px to 31px and 28px. Founder names move from 58px to 48px, then 42px at tablet and back to 48px in the phone stack. These are current scoped role adjustments, not a mandate to expand app typography.

## Elevation & Depth

Surfaces are flat at rest. Tonal panels, image crops, spacing, and fine separators provide hierarchy. Buttons and fields explicitly have no box shadow. The account popover is the sole recurring shadowed surface, with a restrained ambient shadow (`0 12px 30px #2b1d1414`). The landing's recipe leaves create physical layering through overlap, small rotations and color; they do not introduce resting shadows.

**The Flat At Rest Rule.** Preserve flat recipe cards and task panels; reserve the small ambient shadow for the floating account menu.

Operate motion retains the shared tokens in `app/assets/css/motion.css`: 140ms feedback, 220ms UI transitions and 420ms arrivals, with `cubic-bezier(.16,1,.3,1)` for arrivals. App recipe cards, list moves, menus, saved marks, ingredient checks and ratings retain their feedback. A single passive scroll listener schedules a frame only when needed for the header: 40px deliberate downward travel tucks it away beyond the first half viewport; 16px upward travel returns it. The header travels for 360ms and its task links settle with 35ms sibling offsets. Keyboard focus reveals it immediately, open menus hold it, navigation closes menus, and reduced motion suppresses travel. No motion dependency or autoplay loop is added.

The existing recipe transformation remains the landing's focal motion: 750ms opening leaf and 700ms Find/Save/Cook state changes, with direct keyboard/touch controls. Supporting one-shot section transitions use `IntersectionObserver` and the Web Animations API: a benefits photo uncovers onto its leaf, the sharing recipe passes into place, the founder name inks across its baseline, and starter leaves settle with at most 140ms total sibling delay. Selected headings uncover without a whole-section opacity fade. These run for 720ms (800ms for the signature), start from visible default content, cancel cleanly on unmount or preference change, and do not replay when scrolling back. Approved logo artwork is never rotated or distorted. The existing photo view timeline, hover feedback and footer curtain remain. No stock motion footage or repeated section-wide fade is introduced.

Rating controls use five real SVG stars, 27px inside 44px touch targets. Selected stars fill with Saffron and a dark outline; hover previews a choice without replacing the saved selection. The radio group supports arrows, Home, End, Space and Enter. Loading prevents duplicate submissions, and the saved rating returns on reload.

Reduced motion removes spatial transforms, animated crop reveals and scripted card entrances. The landing keeps direct phase selection, exposes the final cooking layout by explicit top positions, applies the phase crop without interpolation, and returns the footer to normal flow. Short color and opacity feedback remains; smooth scrolling is disabled. Static introduction, founder and FAQ content renders without JavaScript; interactive phase selection requires it. Do not make animation necessary to understand state.

## Shapes

The background pattern in `public/brand/bowlup-pattern-ember.svg` follows the page 17 arrangement: 75-unit spacing, alternate half-step rows, every fourth icon turned sideways and every third in Saffron. A 900px square closes both repeat cycles. Muted Ember-toned icons and quiet Saffron repeat across the entire opening and closing on the same Ember ground. Both sections use a direct CSS background, with no clipped strips, separate overlay or mobile top band. Phone repeats scale to 675px. Logo lockups remain intact and upright.

Pills identify actions, category controls, and app search. Editable fields and landing search use soft corners; photographs and quiet panels use broader corners. App desktop card photos and panels share the panel radius; detail photographs use the detail-photo radius and reduce to 20px on phones. Phone app card photos reduce to the compact-photo radius. Circles are reserved for save controls, compact icon controls, and avatar initials.

Landing recipe leaves use the compact-photo radius outside and the leaf-photo radius on the opening image. The transforming recipe sheet and saved leaf use the recipe-sheet radius; their image crop uses the field radius. Benefits use the kitchen-leaf radius around a field-radius photograph; sharing uses the compact-photo radius outside and the inset radius on the photograph. Small rotations belong to those food/recipe objects, not the supplied logo. These scoped extensions preserve the app's rounded material language.

Use fine warm strokes to expose editable controls and separate list rows. Photo frames clip the image, which uses `object-fit: cover`. Keep the approved logo lockups intact, proportionate, and on quiet backgrounds; do not recolor, rotate, stretch, rearrange, or add effects to the supplied marks in `public/brand`.

## Components

### Buttons

Confident pills with readable labels. Standard app buttons have a minimum height (46px), medium weight (600), and the frontmatter padding. Primary app buttons pair Ember with Roast. Outline buttons remain transparent with a warm stroke and gain a Warm Surface fill on hover. The shared motion layer scales a press to .96. Disabled buttons retain full opacity and use the disabled palette. Compact icon controls are circular (44px); save overlays are smaller (40px, or 36px on phones).

Landing search actions span the form, pair Roast with Cream and use Roast Hover for pointer feedback. They have a minimum height (50px, becoming 48px on phones). The sharing outline uses Saffron Outline against its Saffron ground. Landing phase buttons have a minimum height (44px), Reverse Border and Reverse Muted at rest, and Saffron with Roast when `aria-pressed` is true.

### Chips

Category controls are quiet pills with minimum height (42px). Unselected labels use Muted Roast; hover uses Warm Surface and Roast. Selection pairs Roast fill with Cream text, expressed through `aria-pressed` or the current-page state. Category controls wrap on narrow screens.

### Cards / Containers

Recipe cards sit directly on Cream without a surrounding border, shadow, or colored text box. Rounded dish photographs carry the visual weight; metadata appears before a clear title, followed by a modest author or price line. Image hover scales to 1.035 without moving the card. The independent save overlay uses Cream, then Saffron when saved, with an accessible pressed state. Warm panels group ingredients, editor details, empty states, and locked-recipe explanations; their desktop padding follows the panel token and reduces to 22px for general panels on phones.

### Inputs / Fields

Inputs, selects, and textareas share Field White, a warm stroke, soft corners, and a minimum height (48px). Keep editable text at body size. Search is a compact pill with an inline SVG search icon, a minimum height (46px), and a darker opaque placeholder. The reviewed search combination measures 6.15:1 against its field surface.

The global keyboard outline is 3px with a 4px offset; search uses a 2px focus-within outline with a 3px offset. Form failures use the warm error panel and a text explanation, with `role="alert"` where implemented. Busy controls expose their busy or disabled state and keep helpful progress text.

The opening and closing landing searches retain warm field surfaces, body-sized editable text and opaque Muted Roast hints. Their rounded rectangles have Landing Field Border and a minimum height (50px); the opening time selector uses the same border. Focus-within uses Roast (3px with a 3px offset) against Ember. Visible labels remain above the controls. Both searches carry the entered title to `/browse`; the opening form also carries the selected maximum cooking time.

### Navigation

Use the intact orange horizontal lockup at the left of the light header; the footer uses its approved cream version on Roast. Main navigation is plain DM Sans text with underlined hover and current-page states. The mobile menu has a clear open/close label, expanded state, and stacked links. Account navigation is a compact popover, not a permanent workspace sidebar. The skip link becomes visible on keyboard focus.

### Cooking and Authoring

Ingredients form a quiet panel of native checkboxes; checked items strike through and become muted. Instructions remain an ordered sequence with Outfit step numbers and generous reading leading. Keep category navigation with the recipe facts below the title and description rather than introducing an eyebrow above the heading.

The editor retains real recipe fields, repeatable ingredient and step rows, photo management, and free/paid choices. Upload availability and checkout availability must be visible in plain text next to the relevant controls. Present the current unavailable states honestly and keep paid ingredients and steps locked for cooks without access. Empty or zero community states remain explicit rather than suggesting invented activity.

### Landing Recipe Journey

One real starter recipe supplies every phase; the preview is explicitly labeled and never writes an account bookmark. The Find state shows its photograph and facts, Save adds a Saffron leaf and a filled SVG bookmark, and Cook exposes three usable ingredient checks plus the first real step. Inactive cooking controls are inert and hidden from assistive technology. Manual phase controls are always available and expose their pressed state; the account routes and full-recipe links remain separate from demonstration state. Live recipe IDs enhance title-based catalog fallbacks after hydration, so a slow API does not withhold the introduction or useful recipe links.

Benefits use photo/prose; sharing uses a brand-color chapter and recipe note; the solo founder appears through the confirmed name, role and approved icon, with no invented portrait or quotation. Starter cards put the real dish title before category/time facts. FAQ answers remain visible reading text rather than collapsed controls. These compositions are local landing choices, not replacements for the app's Operate components.

## Do's and Don'ts

### Do:

- **Do** use the approved Bowlup marks and the pinned brand palette.
- **Do** use real, dish-matched food photographs and retain their provenance and attribution in `public/images/recipes/credits.json` and the credits page.
- **Do** keep food cards flat, their photo crops generous, and their titles readable at narrow widths.
- **Do** keep visible keyboard focus, opaque readable placeholders, and clear selected or disabled states.
- **Do** describe actual upload, checkout, loading, failure, and empty states in warm, practical language.
- **Do** preserve the two-font hierarchy and let instructions have comfortable reading width and leading.
- **Do** keep landing color fields and recipe-sheet choreography scoped to the home route; retain direct controls and final readable states with reduced motion.

### Don't:

- **Don't** replace the approved wordmark with text or alter the supplied logo artwork.
- **Don't** substitute illustrations or invented food imagery for the seeded recipe photographs.
- **Don't** add decorative kickers or eyebrows above headings; category navigation belongs with recipe facts.
- **Don't** add hard offset shadows, decorative gradients, or panel shadows to this flat visual world.
- **Don't** use text glyphs as interface icons; use the implemented SVG icon language.
- **Don't** invent team members, testimonials, ratings, purchases, or activity to fill visual space.

Not canonized or repaired by this documentation pass: unrelated incumbent drift remains outside scope. The recorded detector advisories and five final Taste warnings remain evidence, including the broad scoped type ramp, no-footage/still-page heuristics, mixed-font heuristics and muted-note readings; intentional sizes are documented by role rather than made into universal app defaults. No independent catalog QUALITY BAR or comp approval is claimed. Decorative kickers, glyph icons and hard resting shadows remain defects rather than inheritable rules.

## Compact recipe carousel
On tablet and phone widths (up to 900px), and short desktop windows, the second landing section uses a native horizontal scroll-snap story rail beneath its transforming recipe preview. Adjacent story leaves peek into the rail. Scrolling updates the shared Find/Save/Cook preview; buttons, progress indicators, keyboard arrows and Home/End select the same phases. Horizontal swipes on the preview also advance phases without blocking vertical page scroll or ingredient inputs. No auto-advance. Reduced motion uses immediate scrolling and preserves the static preview states. Wide, tall desktop windows retain the original sticky scroll journey.

## Viewport scroll scene
The compact second section now pins a scene within the visible viewport while a 300svh outer section supplies native vertical scroll progress. Find, Save and Cook advance with page scroll and remain directly selectable. A compact phase-specific summary stays below the flexible preview. The cooking checklist and first step scroll within the preview on short screens. Header clearance is 84px on phones and 108px otherwise. Reduced motion removes pinning and retains direct phase controls. This supersedes the compact horizontal carousel.

Tablet revision: at 601–1180px the pinned second-section scene uses two columns: active story on the left, recipe preview and phase controls on the right. Both remain within the viewport as scrolling advances phases. Phone layouts stay stacked; the wide desktop narrative starts at 1181px.

## Replacement of the second landing section
The user rejected the earlier recipe-sheet, carousel and tablet split iterations and requested a fresh full-screen scroll composition. Those implementations and their associated historical descriptions above are superseded for this section. The replacement is a Cream-ground photographic story: one real dish, three full-height movements. One large headline and short paragraph accompany a dominant photograph. Find, Save and Cook form a functional bottom timeline with continuous scroll progress; the Save movement offers a clearly labeled local preview toggle. Cook opens the real full recipe. No simulated checklist, card stack, internal content scrolling or reserved blank header strip remains.

Every viewport pins a 100svh stage in a 340svh scroll section. Large desktops use an expansive two-column composition, smaller PCs use a denser type scale, tablets use a balanced split and phones place the photograph above the story and timeline. Short landscape windows get a dedicated compact arrangement. The image crop and corner treatment change with each movement. Reduced motion removes the pin and spatial transitions and keeps manual timeline controls. The header clears the scene during the hold and returns for keyboard focus or an open menu.

Impeccable new-work was applied as a local replacement inside the established Bowlup identity, so there is no new brand-direction tournament. Taste scene guidance informed one short statement per held scene and a deliberate phone composition. No new raster assets, claims, testimonials, dependencies or branding were introduced. The real Shakshuka photo retains its existing provenance and photography credit.
