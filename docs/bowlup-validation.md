# Bowlup UI rework validation

The rework applies the supplied Bowlup brand guide to discovery, browse/filter,
recipe detail and cooking, saved recipes, accounts, profiles, notifications, and
recipe creation and management. The paid and photo workflows remain visible.
Cloudinary uploads and Chapa checkout are currently unavailable to user roles;
the interface states this explicitly and does not simulate success.

## Evidence

- Production Nuxt build completed. The optional unused `@nuxt/image` sharp
  binary warning remains; the shipping food photographs use native images.
- 23 browser checks passed with no page runtime errors: signup, cookie/session
  reload, login, failed-login recovery, logout, search/empty/category filters,
  real-image loading, bookmarks, comments, likes, ratings and rating updates,
  profile persistence, recipe creation, editing and deletion, and notifications.
- The isolated Hasura suite verified all recipe query documents, nested recipe
  writes, ownership and private-field restrictions, paid-content access, profile
  updates restricted to the account owner, and WebSocket user isolation.
- A second-account browser check confirmed that paid ingredients and cooking
  steps stay hidden and checkout availability is explicit.
- Twenty full-page route/state screenshots were checked at desktop, tablet and
  mobile widths. No broken images or horizontal document overflow appeared.
- Taste final browser inspection: **0 FAIL** at 1440, 768 and 390 pixels. The
  remaining mobile color-share warning comes from real food photography; keeping
  that image is intentional. Cream and public discovery headline-size allowances
  follow the supplied brand; the icon-chip allowance covers bookmark controls
  over recipe photos, not decorative dashboard tiles.
- Taste source lint: **0 FAIL**. The remaining warnings describe the real account
  dropdown shadow, the paid-access verb “Unlock,” and title punctuation; they do
  not identify fabricated claims or decorative elevation.
- The single Impeccable detector pass returned an empty findings array. All 14
  shipping PNG/WebP assets have source provenance (embedded PNG metadata or
  WebP sidecars). Ten food photographs have creator/license/source attribution
  on `/photo-credits`. The approved brand marks and self-hosted fonts are used.

The original food-recipe UI was captured before replacement. The main changes
are a shorter, food-led opening, a consistent recipe grid and navigation,
legible native forms and cooking steps, and real dishes rather than illustrated
category thumbnails. No fabricated team members, activity totals, ratings or
purchases are introduced.

## Database refresh

The seed upgrade was tested against the preceding seed in an isolated database.
It preserves the ten recipe IDs, adds no duplicates on a second run, replaces
three original sample dishes and their matching ingredients/steps, and preserves
an edited sample title, an external uploaded image, and an unrelated recipe.
Deploy frontend photo assets before applying the seed refresh to production.

## Design process

Original Impeccable and Taste skills were applied from their public upstream
repositories (`pbakaus/impeccable` and `leonxlnx/taste-skill`). The supplied brand
and website composition governed the implementation. Taste's app draw used
seed 661168651 (`editorial-greeting`), with approved palette/type retained and
brand top navigation replacing the dealt workspace sidebar. No Impeccable
concept-seed roll or generated comp was produced; the implementation is
code-led and reviewed against the supplied brand, not a generated design comp.

## Finish review

The fresh Impeccable reviewer requested four scoped fixes: accurate workflow
provenance, search placeholder contrast, category navigation below recipe
titles, and profile-link text width. All four were scored resolved in the
subsequent **ship** verdict. The measured search-placeholder contrast is
6.15:1. All twenty recaptures were valid, with no fix-batch regressions observed.
The verdict covers those fixes; no independent catalog quality ceiling was
scored because no catalog QUALITY BAR card was used.

## Rating and motion follow-up

The CSS-mask rating icons were replaced with true SVG stars so selected values
have actual gold fills. Five 44px radio targets support hover preview, arrows,
Home/End, touch, pending submission, failure/retry, and restored saved ratings.
The motion layer adds a featured-food crop reveal, one-time card arrivals,
filter/list moves, page/menu transitions and action feedback, using CSS and the
native Web Animations API. Reduced motion removes spatial effects and keeps
state feedback. The interface remains visible when JavaScript is disabled.
Seventeen browser checks passed against the production build in an isolated
PostgreSQL/Hasura environment, with zero page runtime errors.
