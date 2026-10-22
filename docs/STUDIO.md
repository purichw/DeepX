# DeepX Product Studio

Product Studio is the software development wing of DeepX, served at `/studio`.
The existing DeepX AI homepage remains at `/`. The same `/admin` manages both.
This document describes the implementation; deployment/indexing status is in
[RELEASE.md](RELEASE.md).

## Design and editorial decisions

- References: `docs/references/studio/{desktop,tablet,mobile}.png`. Studio uses
  the supplied white/ice-blue/navy direction, scoped under `.studio-site`.
  Homepage navy/cyan styles and the hero video are unchanged.
- Six portfolio entries are explicitly **Concept**: web/agriculture, mobile
  wellbeing, original Cloudseed game, restaurant operations, SME workspace and
  CRM/ERP-lite. The owner approved concepts on October 21, 2026. These are not
  delivered-client claims and do not have invented live-project links.
- Metrics start empty; testimonials start disabled and empty. Only `verified`
  metrics and `approved` quotes may render. Do not publish the mockup's 50+,
  100%, 4.9/5 or client identities without evidence and permission.
- Existing ecosystem records are shared, ordered by the existing CMS list and
  described as the DeepX ecosystem, not Studio clients. Existing contact and
  privacy content are shared too; no duplicate email/LINE configuration.
- Desktop has the editorial portfolio composition and six service columns;
  tablet uses two portfolio / three service columns; mobile uses one portfolio
  / two service columns and vertical process steps. All six projects remain
  available, filters scroll horizontally, and footer groups become accordions.
- Hero entrance ends after 900ms; reduced-motion removes animations. No automatic
  testimonial carousel. Filters, details, mobile menu and contacts are real controls.

## Ownership and file map

| Owner | Responsibility |
|---|---|
| `src/studio/schema.ts` | Bilingual Studio contract, project categories/status, unique identities |
| `src/studio/StudioWebsite.tsx` | Shared public and draft-preview renderer |
| `src/studio/StudioApp.tsx` | Published-data loading, retry and absent-page state |
| `src/studio/studio.css` | Isolated Studio design and responsive behavior |
| `src/cms/{CmsApp,EditorFields,model}.tsx/ts` | Page selection, nested editing, validation and existing save/publish workflow |
| `scripts/studio-seo.ts`, `vite.config.ts` | Studio metadata and readable initial HTML from published CMS |
| `supabase/content/studio-initial.json` | One-time bootstrap fixture, never a production fallback |
| `supabase/migrations/2026102109*.sql` | Schema extension, guarded save and additive bootstrap |
| `tests/studio.test.ts`, `supabase/tests/studio_contract.sql` | Content, SEO, authorization/CAS/clear regressions |

Existing Button, Modal and NeuralX components are reused. Studio does not create
another authentication system, storage bucket or public write API. The homepage
footer includes a `/studio` link whose label comes from `studio.page.unit`.

## CMS workflow and field coverage

Choose **Product Studio** in the page selector. Switching page or section keeps
the in-memory working document. The existing compact, bilingual controls support
image uploads, explicit clears, list insertion/removal/reordering and preview.
The page selector is navigation, not a separate permission or publication scope.

| CMS section / data path | Public consumer |
|---|---|
| `studio.page` | Brand, navigation, AI link, title/description and copyright |
| `studio.hero` | Headline, closing line, body, device image/alt, verified metrics |
| `studio.ecosystem` | Visibility and contextual labels around shared partner records |
| `studio.portfolio` | Headings, filter labels, project image/alt/focal point, category, status, description/detail and optional HTTPS project link |
| `studio.services` | Section visibility/headings, service icons/copy and details |
| `studio.process` | Section backdrop/alt, ordered steps, optional step images and detail dialogs |
| `studio.why` | Values, details and SME focus panel image/copy |
| `studio.ai` | Optional AI section, illustration, features/details and destination |
| `studio.testimonials` | Optional section, approved quotes and manual previous/next controls |
| `studio.contact` | Closing background/alt, headings/body and shared contact actions |
| `studio.footer` | Description, ordered link groups and mobile accordion labels |
| `studio.ui` | CTA/filter count/status/menu/dialog/language/privacy/contact labels |
| `content.site`, `content.privacy`, `partners` | Shared channels, default locale, privacy text and ecosystem logos |

`studio.ui.services` is reserved and hidden from the editor because it has no
independent renderer consumer. Do not expose it as an effective control.
Operational loading/errors, layout and access checks are code-owned.

All text has TH/EN values. Required translations cannot be blank. Optional images
and project links preserve an explicit empty string; arrays can be empty. Disabled
sections keep their draft content without rendering it. Empty service/project
arrays hide their sections and corresponding primary navigation links. There is
no seed resurrection. New metrics/reviews are unverified by default.

Save uses the existing `cms_save_draft(document, expected_revision)` RPC and an
allowlisted confirmed identity. Server validation checks nested IDs and rejects
stale revisions. Old editors that omit an existing Studio document are rejected
with PT409 instead of silently deleting the new page. Anonymous roles cannot read
drafts or write content. The existing storage permissions and Auth callbacks stay
unchanged because Studio uses the same origin and admin route.

**Publish applies the entire saved workspace, including both pages.** The dialog
states this explicitly. Before publishing, inspect all pending changes. The
bootstrap preserves existing content and only adds Studio when absent; it does
not publish automatically or overwrite later CMS edits.

## SEO and release

Studio has its own title, description, canonical, Open Graph/Twitter and
WebPage/Service/BreadcrumbList JSON-LD. `dist/studio/index.html` contains readable
initial content from the published snapshot; React then reads fresh published
data. No fake Review/AggregateRating is generated. Vercel rewrites `/studio` to
that document and permanently redirects `/studio/` to `/studio`.

Sitemap contains the homepage and `/studio`. Admin remains noindex. Publication
updates runtime body content on reload; metadata and initial HTML require a new
build/deploy. A build fails if published Studio content is absent or unavailable.
Local fixtures are rejected by production builds.

The owner prohibits automatic push/deploy. After explicit release approval,
follow the existing runbook, verify the real `/studio` HTML/assets/CMS, then use
the existing `https://deepxworks.com/` Search Console property to inspect the new
URL, test live access and request indexing once. Verify the updated sitemap.
An indexing request is not proof that the page is indexed or ranks for a query.

## Verification scope

October 21 local checks cover the published document, CMS save/reopen and
publish/read-back, server authorization/conflict/clear behavior, production build,
schema parity and 18 tests. Browser checks cover Chromium at 1440, 834 and 390 CSS
pixels, both languages, project filters/details, Escape/focus return, mobile menu,
footer expansion and contact destinations. Safari/iOS hardware, production Vercel
routing and Google indexing must not be inferred from this local evidence.

October 22 release verification separately confirms production routing, byte
parity for 32 deployed files, rendered media and desktop/mobile interactions,
plus the authenticated Studio editor at revision 12. Google Live Test passed,
the indexing request was accepted, and the sitemap reports two discovered pages.
Actual Studio indexing is pending; see the exact deployment and evidence in
[RELEASE.md](RELEASE.md). No new Lighthouse score is claimed.

Screenshots live in ignored `artifacts/studio/`. The browser capture tool produced
a canvas twice the DOM width/height with unused dark padding; final images crop
only that padding using the recorded DOM dimensions, without changing page pixels.

Recovery: revert the Studio source release through the normal reviewed process.
The additive CMS content can remain stored safely; do not drop data or reset the
database as part of a UI rollback. Older CMS clients are intentionally prevented
from saving documents that omit Studio.
