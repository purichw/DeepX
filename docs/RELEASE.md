# Release runbook and current state

Updated: 2026-10-22 (Asia/Bangkok).

## Authorization before push or deploy

Owner instruction effective 2026-10-17: **never push or deploy automatically**.
This supersedes earlier standing requests to push/deploy after completing work.
Each round needs an explicit user instruction for the requested remote actions.
Implementation, fixes, tests or documentation requests alone do not grant it.
Complete local work and checks, report readiness, and wait for that instruction.

Push and deployment are separate permissions. Preview deployments and production
promotion are also covered. Check for automatic deployment triggers before a
push-only action; do not enable deployment automation without explicit approval.
An explicit instruction for the current round does not need repeat confirmation.
The runbook commands and historical releases below do not grant authorization.

## Product Studio — released, 2026-10-22

The owner requested the software house wing at `/studio` with CMS and Google
discovery, and approved six Concept projects. The owner explicitly authorized
**push and deployment for this round on October 22, 2026**. Source
`4dd03ee26c59e7bcf481d1a5c5df08583958d5c7` is pushed to `main` and live at
`https://deepxworks.com/studio`. Google accepted the indexing request; actual
indexing remains pending. The prior homepage SEO score is not a score for Studio.
See [STUDIO.md](STUDIO.md) for the route, CMS and recovery map.

- Added isolated responsive Studio UI, six generated Concept illustrations,
  filters/details, shared contacts, editable service/process/AI/footer sections,
  optional verified metrics/reviews, and a homepage footer discovery link.
- Applied and recorded migrations `20261021090000` and `20261021090100` to the
  existing Supabase project through its authorized SQL editor. Additive bootstrap
  created draft revision 11 while publication stayed at 10. No Auth, RLS, bucket,
  admin allowlist or domain setting changed.
- Authenticated CMS test changed the Studio hero alt text, switched between both
  page editors without losing the working edit, saved revision 12, reloaded and
  reopened it, previewed the shared renderer, then published revision 12.
  Public RPC read-back confirms all six concepts and **every pre-existing page,
  case-study and partner value is unchanged**. Publishing the content does not
  deploy the new route or source code.
- SQL transaction test passed unsigned/anonymous access denial, stale revision
  rejection, old-client Studio omission rejection, duplicate-ID rejection, and
  intentional empty media/arrays. Test changes rolled back. The same SQL test is
  committed without an owner's email; it resolves an existing confirmed admin
  from the private allowlist when run through a trusted connection.
- TypeScript/production build, 18 tests and generated SQL schema parity pass.
  The initial build exposed plugin ordering; the content plugin now runs after
  Vite's HTML generation and builds both route documents successfully. No gate
  was bypassed. Studio HTML has one canonical, one h1, its own metadata and valid
  escaped JSON-LD. Sitemap lists both public routes; admin exclusion is unchanged.
- Chromium checks at 1440/834/390 CSS pixels show all six projects and no page
  horizontal overflow. Filter, Concept dialog, Escape/focus return, TH/EN, mobile
  menu, footer accordion and contact destinations work. All 11 generated assets
  load after scrolling. Mobile filters have 44px targets. No console errors.
  Safari/iOS hardware and actual Vercel redirects are not verified locally.

Evidence is ignored under `artifacts/studio/`: CMS published-state capture,
public before/after JSON, desktop/tablet/mobile captures and generated HTML.
Browser screenshots contain extra capture-canvas padding; review images crop it
using observed DOM width/height, retaining the actual page pixels.

Release closeout:

- Push completion was verified against the remote `main` SHA. No GitHub Actions
  workflow or Git integration was introduced. Existing local tests/build/schema
  and CMS mutation evidence were reused for the unchanged release candidate.
- Preview `dpl_BpTc8PifJMNDGiTQF2vHEAhuBS49`
  (`deepx-5i89jhlco-purich-w.vercel.app`) built successfully. Its `/studio` document
  matched the local build; the browser rendered published CMS content and the
  trailing-slash redirect worked. Preview protection remained enabled.
- One `vercel promote` call produced production deployment
  `dpl_GaXaFNhC8atPWvw1bC4cpL4yPkdT`
  (`deepx-mf2v085ji-purich-w.vercel.app`). Vercel rebuilt for the production
  environment during promotion, rather than merely moving the preview alias.
  It is READY, aliased to `deepxworks.com`, and its metadata confirms source
  `4dd03ee26c59e7bcf481d1a5c5df08583958d5c7`. Production build took about 7.6s;
  there was no duplicate deploy or pending promotion.
- Production `/studio` returns 200 with its own canonical and no noindex;
  `/studio/` returns 308 to `/studio`. `/admin` returns 200 with noindex/nofollow.
  Both old domains preserve `/studio` and query parameters in their 308 redirect.
  All 32 checked HTML, JS/CSS, font, Studio image, favicon and crawler files match
  the checked local build byte-for-byte.
- Production Chrome checks at 1440px and 390px pass without horizontal overflow.
  Portfolio filtering, Concept details, Escape, mobile navigation and contact
  links work. All 19 image elements load after scrolling, including all 11 new
  Studio assets. Public Studio, homepage and authenticated CMS have no captured
  warning/error logs. Homepage copy, canonical and play-once video remain intact.
- The existing production admin session opens the new Product Studio selector
  and editable fields, with draft/published revision 12 and no unsaved changes.
  No repeat content mutation or authentication-setting change was needed.
- Search Console initially reported Studio as unknown to Google. Live Test on
  October 22 at 13:42 Bangkok time returned **URL is available to Google**,
  **Page can be indexed**, and one valid Breadcrumb item. One Request indexing
  submission returned **Indexing requested**, added to the priority crawl queue.
  The updated sitemap was submitted once and reports **Success**, last read
  October 22, **2 discovered pages**. This is not yet evidence of Studio indexing.

Fresh evidence: `artifacts/studio/production-{deployment-api,assets,route-check}.json`,
`production-desktop-raw.png`, `production-mobile.png`, `production-cms.png`,
`gsc-indexing-requested.png` and `gsc-sitemap-success.png`. These release captures
have native page dimensions and need no padding crop. Physical iOS/Safari and a
new Lighthouse score were not tested. Documentation closeout needs no redeploy.
Recovery baseline is `dpl_DjjDZRH7HVFDoroxcqaiQ9yePdT9`; reverting source must not
drop the additive Studio data or reset the existing CMS/database.

## Google Search Console — deepxworks.com, 2026-10-19


The owner requested Google discoverability for the new primary domain. Google
already had `https://deepxworks.com/` indexed when inspected: **URL is on Google**,
**Page is indexed**, user-declared canonical `https://deepxworks.com/`, and
Google-selected canonical **Inspected URL**. Last crawl displayed October 19,
2026, 4:53:52 AM, by Googlebot smartphone; crawl/indexing were allowed and page
fetch succeeded. This is evidence of existing indexing, not a result attributed
to today's sitemap submission. No redundant Request indexing was submitted.

- Verified the new URL-prefix property with the owner's Google account using an
  apex DNS TXT record in Vercel: `rec_2ddd7da47da6910375d686e4`. Keep this Google
  verification record. Existing Zoho verification, SPF, DKIM and MX were preserved;
  the existing HTML verification meta tag was not changed.
- Submitted `/sitemap.xml` once. Search Console reports **Success**, submitted and
  last read October 19, 2026, with **1 discovered page**.
- Submitted Change of Address from `https://deepxsolution.com/` to
  `https://deepxworks.com/`. Both ownership and homepage redirect validation passed
  with the existing 308 redirect. After confirming, Google reports **This site is
  currently moving**, destination `deepxworks.com`, start date October 19, 2026.
  The request is accepted; completion of Google's migration processing is pending.
- Production HTTP checks pass for the homepage, canonical, robots, sitemap and
  favicon. The public homepage has no noindex and the old apex redirects to the
  new one. No source runtime, CMS content, UI, Auth or redirect configuration changed.

Evidence: ignored `artifacts/deepxworks-gsc-http-2026-10-19.json` and
`deepxworks-gsc-{verified,sitemap,indexed,migration}-2026-10-19.png` captures.
This round changed Search Console and one DNS TXT record, plus local documentation;
there was no push or deployment. Broad tests/build, Lighthouse and UI regression
checks were not repeated because the deployed application was unchanged. Indexing
does not guarantee a particular ranking or appearance for every search query.

## Domain migration — deepxworks.com, 2026-10-18

The owner requested `deepxworks.com` as the primary origin of the existing Vercel
project, preserving the website and CMS. The owner explicitly authorized push
and production deployment on 2026-10-18. Source
`9e60fbae649861151f0056661a6a79b3262d6311` is pushed to `main` and deployed as
`dpl_DjjDZRH7HVFDoroxcqaiQ9yePdT9` (`deepx-6s5st0l6q-purich-w.vercel.app`),
READY and aliased to `https://deepxworks.com`. Vercel metadata confirms that SHA.
The verified-local production path ran once, without a separate preview or
promotion. No GitHub Actions workflow or Vercel Git integration is configured.

- Attached apex and `www.deepxworks.com` to project `deepx`; apex initially served
  the existing production deployment over HTTPS before the metadata release.
- `deepxsolution.com`, `www.deepxsolution.com`, `deepxtech.vercel.app`, and
  `www.deepxworks.com` now point directly to the new apex with 308 redirects.
  Old aliases were retargeted before redirecting the old apex, as Vercel rejects
  a redirect source which is still the destination of another domain redirect.
  HTTP checks confirm path/query preservation on every alias. A Chrome visit
  through the old `/admin?domain_probe=1#domain-migration-check` also preserved the
  fragment and opened the authenticated CMS. New `/admin` remains HTTP 200 with
  `X-Robots-Tag: noindex, nofollow`.
- Supabase Auth Site URL is `https://deepxworks.com`; exact allowed callback
  `https://deepxworks.com/admin` is added, preserving the four existing callbacks.
  Settings persisted after reload. A real email-link login returned to the new
  `/admin`, loaded the authorized workspace, and survived reload.
- CMS revision 9 was saved, reopened and published from the new domain. Public
  before/after comparison confirms only `content.site.website` changed, from
  `https://deepx.tech` to `https://deepxworks.com`. Brand, email, imagery and all
  other content remain unchanged. No credentials, roles, RLS or schema changed.
- Production canonical, Open Graph/JSON-LD origin, robots and sitemap now use the
  new domain. All 12 tests, schema parity and typecheck/build passed before release;
  their evidence was reused for the unchanged candidate. Vercel build passed.
  Production HTML, robots, sitemap, favicons and public/CMS JS/CSS match the
  checked local build byte-for-byte. Public/CMS runtime JS/CSS are unchanged from
  the preceding deployment, preserving both interfaces exactly.
- After deployment, HTTP checks passed for `/`, `/admin`, crawler files,
  favicons, public/CMS assets and all four redirect aliases, including admin
  path/query. Chrome shows the new canonical/Open Graph URL and unchanged public
  page; the existing authenticated CMS session reloads successfully. Neither
  page reported console warnings/errors. No additional CMS mutation was needed.

Build phase completed in about 6 seconds; no retry or duplicate deployment was
needed. Recovery baseline: `dpl_AXbdFZ1qtjL6YAqTt7iW1PWzeoMC`, source `97fc54a`.
That artifact contains the old canonical; reverting it alone does not undo the
Vercel redirects, Supabase URL settings or CMS revision 9. Treat those changes
separately and do not roll back working authentication as part of a code rollback.
This verification closeout is documentation-only and needs no extra deployment.

Evidence: ignored `artifacts/deepxworks-*` configuration, public-content comparison,
HTTP checks, Auth settings and CMS/public screenshots. Search Console property,
sitemap submission and Change of Address were not performed in this release;
see the October 19 Search Console entry above for their subsequent completion.
No new Lighthouse run, broad UI audit, password reset, physical iOS
test, unrelated DNS/mail change or database migration was needed for this scope.

## Previous release — centered card rows and favicon, 2026-10-18

The owner explicitly authorized pushing and deploying both changes. Source
`97fc54a4452f9351d16929568468f7ed560712ef` is pushed to `main` and deployed to
`https://deepxsolution.com` as `dpl_AXbdFZ1qtjL6YAqTt7iW1PWzeoMC`
(`deepx-c7bgmic6l-purich-w.vercel.app`), READY. This used the verified-local
production path once; no separate preview or promotion was run. No GitHub Actions
workflow is configured. Fresh authorization remains required for later releases.

The shared Rail layout centers incomplete rows while preserving column widths
and mobile horizontal scrolling. Capabilities, industries and applications share
the rule. PNG 192×192 and ICO 16/32/48 variants of the existing favicon are linked
in static HTML; the PNG corners are transparent. CMS content and schema were not
changed by this release. At verification, live CMS had five industry cards and
five applications; the six-card count below records the earlier publication.

All 12 tests, CMS schema parity, typecheck/build and diff checks passed. Local
1440/820/390px evidence covers the affected variants. Production 1440px geometry
confirms centered 4+1 industry and 3+2 application rows with unchanged card widths;
390px navigation reaches the last industry card without page overflow. Inspected
screenshots and console checks pass. All five industry images decode successfully.

Production HTML, main JS/CSS and both favicon files match the local build
byte-for-byte. Favicon URLs return HTTP 200 with image MIME types and no noindex;
the PNG decodes at 192×192 in Chrome. Public robots.txt permits crawling, `/admin`
retains noindex, and legacy Vercel/www redirects return 308 to the canonical host.
Google Search appearance remains asynchronous; no new Search Console indexing
request was submitted in this release. Authenticated CMS writes, database changes,
physical Safari/iOS, broad media audits and Lighthouse were outside this scope.

Evidence: ignored `artifacts/favicon-cards-production-*` HTTP/layout records and
desktop/mobile captures. Recovery baseline: `dpl_4b8P6vkw8NDU5NQqENTmpgXGuAyx`
(`deepx-6onnfkg11-purich-w.vercel.app`, source `3e5daae`). This release record is
documentation-only and does not require another deployment.

## Latest content publication — sector expansion, 2026-10-18

The owner requested publication of the approved five-sector copy and supplied a
Restaurant & F&B image. CMS revision **7** was saved, reopened in a fresh
authenticated tab, previewed, and published at `https://deepxsolution.com`.
Manufacturing, Logistics & SME Growth, and Smart Agriculture were updated in
Thai and English; Restaurant & F&B Growth and B2B Industrial Growth were added.
The existing Government & Research entry was preserved, giving six industry
cards and five illustrative applications. B2B uses the existing manufacturing
image; Restaurant uses the owner's uploaded 1448 × 1086 PNG in `cms-media`.

Public read-back matches the saved draft and confirms that only `industries`
and `applications` changed. Government & Research, partners, case studies, and
all other content remain unchanged. Preview checks covered both languages,
Restaurant and B2B detail dialogs, and the 390 px mobile card rail. Production
renders the uploaded image at its natural dimensions; its URL returns HTTP 200.
Before/draft/published JSON and the live screenshot are saved under ignored
`artifacts/sector-content-*-2026-10-18.*`.

This was a CMS publication only: no source push, build, deploy, schema change,
or permission change. Existing metadata was not edited. Broad code/auth tests
were not repeated for this editorial update.

## Previous release — compact Content Studio forms

Source `e0527c6` is pushed to `main` and deployed to
`https://deepxsolution.com`. Production deployment
`dpl_DRpjTJVJM9N9A6Q1dJm9kKBSf9zF`
(`deepx-5uc88vjsm-purich-w.vercel.app`) is Ready with the production aliases.
The owner explicitly authorized push and deployment for this round. The standing
requirement for fresh authorization on later rounds remains in effect.

Shared CMS fields now use labels beside controls when the editor is wide enough,
compact spacing, textareas that grow with their contents, and media previews beside
their controls. Narrow editors stack labels above controls and retain mobile touch
targets. The change covers all 16 editor sections and nested records. Public-site
layout, CMS content, schema, persistence and authorization contracts are unchanged.

Local authenticated Chrome verification covered all 16 sections, shared control
variants, Thai/English switching, textarea growth, dirty/clean transitions and
390px responsive layout. Unsaved test changes were discarded by reloading the server
draft; no business content was saved or published. All 12 tests, typecheck/build
and diff checks passed. Evidence: `artifacts/cms-compact-qa.md` and its captures.

Preview `dpl_Bm2Aj3o54khWcoLsVJYZkopGKjWz` was Ready and its app HTML and CMS assets
matched the local build (the public preview adds Vercel's feedback script).
Vercel CLI promotion of this Preview-target deployment required a fresh build
using Production environment settings; it created the production deployment above.
Production `/`, `/admin`, main JS, public CSS and CMS JS/CSS all return 200 and
match the local build byte-for-byte. `/admin` retains `noindex, nofollow`.
The legacy Vercel and www domains return 308 to the canonical host with path/query
preserved. The live public page and CMS login screen render without console
warnings/errors. No GitHub Actions workflow is configured; validation used local
checks and the Vercel build, not CI.

Ignored release evidence: `artifacts/cms-release-preview-checks.json`,
`cms-release-production-checks.json`, `cms-release-production-login.png` and
`cms-release-production-public.png`. Authenticated editor interaction was verified
locally; production login submission, save/publish/upload mutations and physical
Safari/iOS testing were not repeated for this presentation-only release.
Recovery baseline: `dpl_96YCZbmae4zKjidP9TeNssZRZkiq` (source `9a665aa`).
This closeout is documentation-only and requires no additional deployment.

## Previous release — Google discovery and CMS-driven SEO

Source `9a665aa` is pushed and deployed to `https://deepxsolution.com`.
Deployment `dpl_96YCZbmae4zKjidP9TeNssZRZkiq`
(`deepx-htilk4r4e-purich-w.vercel.app`) is Ready with the production aliases.
Canonical-host HTML matches the local production build exactly.

Added the canonical URL, a one-page XML sitemap and robots discovery, Google
verification meta tag, CMS-derived Open Graph/Twitter image metadata, and
Organization/WebSite JSON-LD. `/admin` returns `X-Robots-Tag: noindex, nofollow`.
Editorial metadata retains CMS ownership and explicit empty-value behavior;
canonical identity is deployment configuration, not the contact website field.
No runtime UI/CSS or CMS schema/data/auth permissions changed. Public JS/CSS
asset hashes match the preceding production build.

Lighthouse 13.5.0 measured **SEO 100/100** on production for mobile and desktop
at 01:40–01:41 on October 17, with no failing audits or run warnings. The mobile
baseline was already 100; discovery and Search Console setup are additional
work beyond that automated score. Performance/accessibility/best-practices scores
were not measured in these SEO-only runs. All 12 content/editor/SEO tests, CMS
schema parity, typecheck/build and diff checks passed.

Production `/`, `/robots.txt`, `/sitemap.xml`, the social image and `/admin`
return 200. Public responses have no noindex header; `/admin` and the tested
`/admin/settings` rewrite have noindex. `/admin/` returns a real 404; the supported
CMS entry remains `/admin`. Legacy Vercel and www aliases still return 308 to the
canonical domain and retain path/query. No changes were made to route rewrites.

### Google Search Console evidence

- Verified ownership of URL-prefix property `https://deepxsolution.com/` using
  its issued HTML meta tag. Keep the public tag after verification.
- Submitted `/sitemap.xml`; Google reports **Sitemap processed successfully**,
  last read October 17, with **1 discovered page**. The brief initial Couldn't
  fetch state resolved on the detail view without resubmission or code changes.
- URL Inspection reports **URL is on Google / Page is indexed**. Its indexed
  snapshot shows a last crawl of October 16, 2026, 7:59 PM, Googlebot smartphone,
  successful fetch and allowed crawl/indexing. This predates this SEO deployment;
  the site was already indexed rather than newly indexed by our submission.
- The live test on October 17 at 01:45:04 reports **URL is available to Google /
  Page can be indexed**, successful smartphone fetch and the new user-declared
  canonical `https://deepxsolution.com/`.
- Requested indexing once for the updated metadata. Google confirmed **Indexing
  requested** and addition to its priority crawl queue. The latest metadata's
  replacement in Search results is asynchronous and is not claimed complete.

Ignored evidence: `artifacts/seo-mobile.report.html`, `seo-desktop.report.html`,
their JSON reports, `seo-lighthouse-summary.json`, `seo-production-checks.json`,
`google-ownership-verified.png`, `google-sitemap-success.png`,
`google-page-indexed.png`, `google-live-test-success.png`, and
`google-indexing-requested.png`. The ongoing workflow is in [SEO.md](SEO.md).
CMS authenticated write journeys and physical-device QA were not repeated for
metadata/header changes. This verification closeout is documentation-only and
does not need another deployment. Previous runtime is the ticker release below;
retain a valid Search Console verification method if restoring older HTML.

## Previous release — mobile ticker speed and controls

Source `34b832c` is pushed and deployed to `https://deepxsolution.com`.
Production `dpl_9hTEZer6jvc4g3M7yVmWJyKeeMgK`
(`deepx-d422pqghh-purich-w.vercel.app`) is Ready. Production HTML matches the build.

Mobile ticker speed increases from 22 to 32px/s (38.5s per current eight-logo
sequence). The owner requested removal of Play/Pause, so the control and its
42px reserved space are removed. Hover, keyboard/static and reduced-motion
behavior remain. Desktop/tablet still use the unchanged Rail renderer and grid.

Build/types and diff checks passed. Local 390px verification: 38.5s duration for
a 1232px sequence (32px/s), zero ticker buttons, no reserved control padding,
no horizontal overflow and no console warnings/errors. The 1280px partner markup
matches the preceding desktop baseline exactly and renders no ticker.
Production 390px verification confirms a running 38.5s animation, a 1232px
sequence, zero ticker buttons, no horizontal overflow and no console warnings/
errors. Evidence: `artifacts/ecosystem-ticker-faster-production.png` (ignored).
Broader CMS/auth checks and physical-device testing were not repeated for this
scoped adjustment. This closeout is documentation-only.

## Previous release — compact mobile hero and mobile-only ecosystem ticker

Source `ebf33e3` is pushed to `main` and deployed at `https://deepxsolution.com`.
Production deployment `dpl_FVsMEttPFSWHTGYHaZqGiMEwqqsj`
(`deepx-i7t41xj11-purich-w.vercel.app`) is Ready with the production aliases.

The mobile hero no longer has a forced 640px minimum height. Its action-to-expertise
gap is 33px (390px Thai hero: approximately 519px tall), removing the empty band
while preserving the background brand crop. The video is centered at 50% of the
content-sized banner to keep its placement close to the preceding layout.

Ecosystem logos on mobile only (up to 640px) now loop left-to-right at 22px/s with
CMS order, assets and links. One measured sequence determines the duration:
56s at 390px for the current eight logos. Explicit pause/resume, hover pause,
offscreen/hidden-tab pause, stable keyboard links and a reduced-motion static
layout are provided. Desktop/tablet use the original Rail and grid; other mobile
card rails are unchanged. At 1280px the candidate partner markup, all eight logo
widths and hero height match the current production baseline exactly.

Local build/types and diff checks passed. Local 390px hero and mobile ticker
renders were inspected; pause freezes position, resume restarts motion, and Tab
reaches all eight original links through Google Cloud with no duplicate tab stops
or page overflow. All 16 rendered image instances decoded after entering view.
Production HTML matches the local build. At 390 × 844 the hero is 518.83px tall,
the gap is 33px, and the video is decoded/playing without horizontal overflow.
The ticker moved +474.84px over 21.674s (approximately 22px/s, left-to-right),
and its live pause/resume controls passed. Hover pause and 7px focus-outline
clearance were verified locally. Console warning/error logs were empty.

At 1280px, production partner HTML, all logo widths and hero height exactly match
the pre-release production baseline; no ticker is rendered on desktop. Evidence:
`artifacts/mobile-hero-compact-production.png`,
`artifacts/ecosystem-ticker-mobile-production.png` and
`artifacts/mobile-ticker-verification.json` (ignored). Physical iOS/Safari and
OS reduced-motion emulation were not exercised; the static reduced-motion path
was source-reviewed. CMS/auth suites were not repeated because their contracts
and data were unchanged. The preceding deployment is the recovery baseline.

## Previous release — mobile banner crop refinement

Source `88535ba` is pushed to `main` and deployed at `https://deepxsolution.com`.
Production deployment `dpl_BU6T3EKY6LEeSiUgiixmnY37u9R6`
(`deepx-n45lf3m74-purich-w.vercel.app`) is Ready with the production aliases.

The mobile video is back behind the main banner copy/actions. The 16:9 frame is
scaled to 170% width, centered horizontally at 40% of the banner height. Empty
left/right scenery is cropped while the central DeepX mark and wordmark remain
inside the viewport. The prior bottom placement and reserved copy padding are
removed. CMS media and playback behavior are unchanged; desktop/tablet CSS is
unchanged. TypeScript/production build and diff checks passed. Local 390px Thai
and 320px English renders show the complete animated mark/wordmark inside the
viewport, behind the copy and above the solid CTA. Neither viewport overflows.
At 1280px the video retains its full-banner `cover` behavior with no transform.
Browser warning/error logs are empty. Evidence:
`artifacts/mobile-hero-brand-crop-local.png` (ignored).

Production HTML matches the local build. The 390 × 844 production capture at
7.9 seconds shows the complete brand within the viewport, behind the banner
copy. Video decodes to readyState 4 and plays automatically, muted and looping,
with no controls. Browser logs are empty and the page has no horizontal overflow.
Evidence: `artifacts/mobile-hero-brand-crop-production.png` (ignored). Physical
iOS/Safari and reduced-motion emulation were not exercised; CMS/auth suites were
not repeated for this CSS-only change. The preceding deployment below remains
the recovery baseline. This verification closeout changes documentation only.

## Previous release — mobile banner background correction

Source `7c3c876` is pushed to `main` and deployed to `https://deepxsolution.com`.
Deployment `dpl_6HbNvsYtWh52k7kdmpuqGwdxznFu`
(`deepx-4wfu47nhs-purich-w.vercel.app`) is Ready and carries the production aliases.

The mobile video remains an absolute background inside the hero banner, with an
uncropped, full-width 16:9 image toward the bottom. Gradient masking blends its
edges into the banner; copy spacing keeps the animated logo clear. This replaces
the separate panel from the preceding release. Desktop/tablet styling, CMS media
references, published content and automatic playback are unchanged.

TypeScript/production build and diff checks passed. Local 390px Thai and 320px
English checks confirmed full-width contained video with no horizontal overflow.
The 320px capture shows the entire animated logo and DeepX wordmark inside the
banner. Auth/CMS regression suites were not repeated for this CSS-only correction.
Production HTML matches the local build exactly. At 390 × 844 the video is an
absolute background layer (`z-index: -1`) with a 390 × 219.375 frame and
`object-fit: contain`. It is decoded (readyState 4), playing, muted, looping,
inline and without controls. There is no horizontal overflow or browser warning/
error. Evidence: `artifacts/mobile-hero-background-production.png` (ignored).
Physical iOS/Safari and reduced-motion emulation were not repeated. No second
deployment is needed for the documentation-only verification closeout.

## Previous release — SUT ecosystem and uncropped mobile hero

Source `fa03002` includes the SUT layout change from `e1a60d1` and is deployed
to `https://deepxsolution.com` as production deployment
`dpl_3UCKydikZU8CLmkzeWnqegYYXCHZ`
(`deepx-gk2bqb38g-purich-w.vercel.app`).

The owner-supplied SUT PNG was uploaded unchanged through the authenticated CMS.
Draft revision 6 was saved and reopened while public content stayed at revision 5,
then published. Public read-back proves SUT is first, Chula second, and all other
content and seven existing partners remain unchanged. The logo URL returns 200
and its bytes match the supplied file. Provenance is in `ASSETS.md`.
The desktop logo grid now fits available space instead of fixing seven columns;
tablet four-column and mobile swipe layouts retain their existing behavior.

At widths up to 600px, the hero video uses a separate uncropped 16:9 panel below
copy/actions, preserving the whole animated DeepX mark. Desktop/tablet still use
the full-banner background. CMS media references and playback behavior are unchanged.

TypeScript/production build and diff checks passed. Local 390px Thai, 320px
English/contact-dialog and 1280px desktop checks passed without horizontal overflow.
Production HTML matches the local build. Production 390px video has a 350 × 196.875
frame, `object-fit: contain`, 24px gap after the copy/actions, readyState 4, playing,
muted and no controls. Desktop remains full-banner/cover. Console warnings/errors
were empty. Both the old Vercel hostname and www still return 308 redirects with
path/query preserved. SUT and the seven original logos loaded in the live browser.
Evidence: `artifacts/sut-public-verification.json`, `sut-ecosystem-production.png`
and `mobile-hero-contained-production.png` (ignored).

Physical iOS/Safari and OS reduced-motion emulation were not run. No schema,
permission or auth changes; their broader regression suites were not repeated.
Recovery baseline for mobile layout is deployment
`dpl_9zEVuDSyrMVqsT5Av3kNFbXfGBsY` (SUT grid release). CMS publication is separate
from deployment; change logo content/order through a new CMS draft/publication.

## Current domain — deepxsolution.com

The owner registered `deepxsolution.com` with Vercel. It is attached to
`purich-w/deepx` and points to existing production deployment
`dpl_FP8shW1XB1gFUdPBRNWt98fyDFYe`; this configuration-only cutover did not
create a new deployment or change runtime source/content.

- `https://deepxsolution.com/` and `/admin` return HTTP 200 with valid HTTPS.
- `www.deepxsolution.com` and `deepxtech.vercel.app` use permanent 308 redirects
  to `deepxsolution.com`. `/admin?domain_check=1` retains its path and query.
- HTTP upgrades to HTTPS. DNS resolves through `ns1.vercel-dns.com` and
  `ns2.vercel-dns.com`; Vercel reports the project domains verified.
- Supabase project `yazamwbukbtetzqmqcpm` now has Site URL
  `https://deepxsolution.com` and exact allowed redirect
  `https://deepxsolution.com/admin`. Existing Vercel/local-development redirect
  entries were preserved. The API configuration was read back after the update.
- Public HTML matches the existing local release artifact byte-for-byte;
  its JS/CSS return 200. The alias API confirms the production deployment ID.
  The immutable deployment URL requires Vercel login for an unauthenticated
  request, so its login HTML is not used for artifact comparison.
- In-app browser renders Thai content, autoplaying muted hero video
  (`readyState=4`) and no broken loaded images or warning/error logs. The new
  `/admin` renders the unauthenticated login guard. Evidence:
  `artifacts/custom-domain-home.png` (ignored).

No new magic-link email, authenticated CMS save/publish roundtrip, database
migration, mobile sweep or build was needed/run for this host configuration.
CMS contact content (including its pre-existing website link) was not edited.
Recovery: remove the old-host redirect and restore Supabase Site URL to
`https://deepxtech.vercel.app`; the production deployment is unchanged. Inspect
current domain ownership/configuration before any removal or reversal.

## Latest update — full-banner hero video

Source `a0b92a0a1d0d98c549e9a9ab46907cd95764f2cd` is pushed and deployed to
[deepxtech.vercel.app](https://deepxtech.vercel.app). Deployment
`dpl_FP8shW1XB1gFUdPBRNWt98fyDFYe` is **READY**, target production, with immutable
URL [deepx-q2ryw4bek-purich-w.vercel.app](https://deepx-q2ryw4bek-purich-w.vercel.app).
The video now covers the whole banner behind the text and actions. Responsive
cropping and a dark gradient replace the separate 16:9 panel. CMS fields and
playback logic remain unchanged; there is no database migration or content write.

TypeScript/production build and `git diff --check` passed. Local desktop/mobile
visual checks and the mobile contact CTA passed. Production HTML matches the
local build, and the new JS/CSS return HTTP 200. At 1440px and 390px the video
matches the banner's inner bounds, plays automatically muted/looping without
controls, and introduces no horizontal overflow; console warning/error lists
were empty. Reviewed evidence is in ignored
`artifacts/full-banner-{desktop,mobile}-production.png` and
`artifacts/full-banner-production-smoke.json`. Unchanged database/auth flows,
other routes, physical devices and reduced-motion OS emulation were not rerun.
The prior deployment below is the recovery baseline. No CI is configured.

## Initial production release — baseline

[deepxtech.vercel.app](https://deepxtech.vercel.app) is served by Vercel deployment
`dpl_DneBLyfVMuuT8PQidKvz4RrjUimB`, status **READY**, from pushed source
`af3dfd456ec42d3e232aaa3b39dd1349355ebd2d` and published CMS revision **5**.
The immutable deployment is
[deepx-8uzy2995d-purich-w.vercel.app](https://deepx-8uzy2995d-purich-w.vercel.app).
Production HTTP/assets, desktop/mobile rendering, video playback and the
unauthenticated CMS entry checks passed within the scope recorded below.

| Area | Completed evidence | Boundary / follow-up |
| --- | --- | --- |
| Repository | `main` source `af3dfd456ec42d3e232aaa3b39dd1349355ebd2d` pushed; exact remote head confirmed | This closeout documentation is a subsequent docs-only change |
| Supabase access | Correct project `yazamwbukbtetzqmqcpm` linked and accessible | Keep all operations scoped to this project |
| Database | Migrations `20261016090000`–`20261016090700` applied: partner surfaces, ecosystem bootstrap, `PT409` conflicts, hero video fields and separate video Storage | Preserve applied migrations; no pending migration at this checkpoint |
| Access/transactions | Live SQL tests passed in rollback transactions, including migration 907 video/clear/Storage checks and `PT409`; anonymous private CMS RPC returned HTTP 401 | No repeat required unless a touched contract changes |
| Local checks | All 8 content/editor tests, schema parity, TypeScript and real-data production build passed for the released implementation | Rerun only if relevant source changes |
| CMS browser | Real Chrome administrator edited all four image URLs/TH–EN alt text, saved revision 4 while public revision stayed 3; uploaded MP4 to `cms-video`, saved/reopened revision 5 and confirmed publication to public revision 5 | Production `/admin` renders the email magic-link/password login with no editor exposed to an unauthenticated visitor; no new login email sent |
| Conflict recovery | Stale revision 4 save after revision 5 was rejected; test copy remained in the editor, confirmed reload restored revision 5, and test copy never reached live content | No pending local recovery retest |
| Public UI | Local 1440/820/390px checks passed; production 1440px desktop and 390 × 844 mobile inspected in Thai with no overflow; desktop fonts, centered timeline/application headings and mobile hero confirmed; no console warnings/errors | Production HTML and JS/CSS match the local released build; physical devices not exercised |
| Ecosystem | Seven official files/current records verified; all deployed URLs return HTTP 200 and all seven logos decode/render in the production browser | Provenance in `ASSETS.md`; logos do not establish commercial relationships |
| Industry replacements | CMS points to four bundled 1200 × 900 WebPs with TH–EN alt text, published revision 5; production DOM reports all four loaded at natural width 1200 and asset HTTP 200 | These images were selected by URL in CMS; they were not four new Storage uploads |
| Hero video | Actual CMS Storage MP4 returns HTTP 200/Range 206; production desktop/mobile video progresses with `readyState=4`, playing, muted/loop/inline/autoplay, controls off; local offscreen pause passed | Reduced-motion OS emulation remains untested |
| Vercel setup | `purich-w/deepx`, project ID `prj_rRSo3p0ZO8NvxjP1jFTWTTTkBllf`, Node 24.x; first deployment became production automatically and is READY | No separate preview or promotion occurred |
| Domain | `deepxtech.vercel.app` serves the verified deployment; preferred `deepx.vercel.app` unavailable (HTTP 409, already assigned) | `deepx.tech` custom-domain cutover is outside this deployment |

Vercel also assigned `deepx-pi.vercel.app`; it is not the intended public URL.
`deepx.tech` remains the owner-supplied official link. Its DNS/ownership and custom
domain cutover are not configured by attaching the Vercel alias.

## Database and editorial change gate

Use the authorized account and exact project. Do not switch projects or copy
another project's credentials. Authentication/linking are already complete;
start by comparing migration history rather than repeating initialization.

```sh
supabase migration list
supabase db push --dry-run
```

Inspect existing remote tables and migration history first. If the remote is
already populated or conflicts with these names, reconcile it; do not reset it.
Once the pending migrations are confirmed to match this project:

```sh
supabase db push
supabase db query --linked --file supabase/tests/content_access.sql
supabase db query --linked --file supabase/tests/cms_access.sql
```

Keep applied migrations immutable; use forward changes. Bootstrap data uses
`ON CONFLICT DO NOTHING`. Do not regenerate/reapply seed data to overwrite CMS
edits. Ecosystem initialization was applied with an unchanged-workspace guard.
Subsequent content and image updates must use the current CMS workspace rather
than replace it with an old seed. Read the current revision, preserve other changes,
save, publish and compare the public response. Logos identify the owner-requested
ecosystem; their presence does not prove a commercial relationship or result.

Check published reads with the publishable key, draft invisibility, and write
denial for both anonymous and ordinary authenticated roles. The SQL fixture is
inside a rolled-back transaction and must leave no record.

## Gate for subsequent releases

Apply only the actions explicitly authorized for this round under the policy
above. Without a push/deploy instruction, stop after local verification and report
readiness; do not execute the remote steps below automatically.

1. Review intended files with `git status --short --branch` and `git diff --check`;
   prepare the intended commit and, when push is authorized, push and verify the
   exact remote SHA.
2. When deployment is authorized, deploy one candidate and inspect its actual
   target. Prefer a preview for
   subsequent releases. Confirm `/`, `/admin`, the intended published revision,
   the four industry images, seven ecosystem logos and hero video/poster on that
   immutable URL. Inspect relevant asset/network failures and console errors.
3. If the artifact is a preview and production promotion is authorized, promote
   it once verified; if already production,
   do not create a duplicate deployment or claim a separate promotion. Confirm
   `deepxtech.vercel.app` resolves to it and run the focused alias smoke.

Do not restart a whole-site audit without a new failure or source change. When
relevant implementation changes, the repeatable local checks are `npm test`
(8 tests at this checkpoint), `npm run check:schema`, `npm run typecheck` and
`npm run build` with real published data; never enable the local fixture flag for
a release. Rerun only the affected database/browser checks where appropriate.

Preview/production commands only after authorization and the gate are met:

```sh
vercel --scope purich-w
# Inspect preview, then promote that verified artifact when suitable:
vercel promote <verified-deployment-url> --scope purich-w
```

Alternatively deploy a verified local release with `vercel --prod --scope purich-w`.
Do not run both paths for the same unchanged candidate. Source push, CI, build
and production promotion are separate states; report each explicitly.

No CI workflow is configured for this candidate. No GitHub Actions workflow or
Vercel Git integration existed in the initial repo.
Do not claim CI or a remote source sync has run merely because a local build passes.
Only if the owner explicitly requests continuous deployment, connect
`purichw/DeepX` deliberately and verify the intended production branch and
required checks. Do not enable it as part of ordinary implementation work.

## Deployment timing and delay checkpoints

The first Vercel build ran from `2026-10-16T10:45:32Z` to
`2026-10-16T10:45:43.772Z` (about 12 seconds), including about 4 seconds install
and 2.07 seconds Vite build. The CLI status monitor returned `ETIMEDOUT` after
upload; inspecting the same deployment and build logs confirmed **READY**.
No retry or duplicate deployment was created. This is the initial build baseline.

Investigate immediately on failure/auth errors/wrong revision. For no-progress
work, inspect a push at 2 minutes, a missing expected run at 3 minutes, queue at
5 minutes, build/CI at 10 minutes, or promotion 2 minutes after readiness. These
are investigation points, not cancellation or retry thresholds. Inspect exact
run logs before repeating any operation.

## Evidence boundaries

Earlier fixture-backed Chromium reviews covered 1440×1000, 820×1180, 390×844
and 320×700, including navigation, language persistence and dialog Escape/focus.
They found and fixed a 4px gutter overflow at 320px, mobile card text and timeline
readability. The four sector photos loaded. These captures prove that earlier
local state, not the latest CMS-backed release or the new ecosystem row.

Current evidence is separate from those earlier fixtures: real Chrome CMS
save/reopen/publish/conflict recovery and the in-app browser's published revision
5 were exercised against Supabase. Inspected current captures include
`artifacts/cms-publication-revision5.png`, `artifacts/tablet-hero-video.png`,
`artifacts/mobile-hero-video.png`, `artifacts/mobile-industries-new.png` and
`artifacts/centered-process-applications-desktop.png`. Artifacts stay ignored.

The four WebPs are 1200 × 900, totaling 762,794 bytes. Their CMS-edited references
point to `/images/industries/{manufacturing,logistics,agriculture,research}-thailand.webp`
on the production site; all four loaded successfully. Prepared hero files are
`/videos/deepx-hero.mp4` (1920 × 1080, 10 seconds, 2,633,405 bytes), optional
`/videos/deepx-hero-mobile.mp4` (960 × 540, 927,714 bytes), and
`/images/deepx-hero-poster.webp` (1920 × 1080, 42,230 bytes). The published video
uses its uploaded `cms-video` URL; the renderer does not automatically select the
mobile file. Provenance and manifests are described in [ASSETS.md](ASSETS.md).

Reduced-motion handling exists in `HeroMedia`, but OS preference/emulation was
not exercised. SQL tests prove their asserted transaction/policy behavior, not
every browser interaction.

`artifacts/production-smoke.json` records the deployed source/deployment identity,
matching HTML, correct JS/CSS hashes, public revision 5, `/` and `/admin` HTTP 200
with configured security headers, four industry images, seven logos and poster
HTTP 200, and uploaded video HTTP 200/Range 206. Browser checks additionally
confirm all four images decode at natural width 1200, all seven logos decode,
desktop/mobile playback and the unauthenticated `/admin` login. At 390 × 844,
the video was playing at 7.295 seconds with `readyState=4`; its autoplay, muted,
loop and inline flags were true and controls false. Reviewed production captures:
`artifacts/production-hero-desktop.png`, `artifacts/production-industries-process.png`,
`artifacts/production-ecosystem.png`, `artifacts/production-hero-mobile.png` and
`artifacts/production-admin-login.png`. Browser console warning/error lists were
empty. These screenshots remain ignored.

Authenticated save/publish was exercised through the local Chrome CMS against
the same live Supabase project. Production `/admin` verification covered the
unauthenticated route and absence of editor exposure; no new production login
email was sent and no second authenticated editing round-trip is claimed.

Do not claim physical iOS/Android, WebKit/Firefox, contact message delivery, load
testing or privacy legal review. No email/LINE message needs to be sent to smoke
the public contact links. Avoid publishing invented records merely to test UI.

## Release record

| Stage | Current record |
| --- | --- |
| Source commit / remote push | `af3dfd456ec42d3e232aaa3b39dd1349355ebd2d`; exact remote head confirmed |
| Required CI | Not configured; local checks are recorded separately |
| Final real-data build | PASS for released source; 8 tests/schema parity/typecheck/build passed; Vercel build READY |
| Migration/content revision | 900–907 applied; authenticated CMS published revision 5; live SQL and browser read-back/conflict recovery passed |
| Deployment / promotion | `dpl_DneBLyfVMuuT8PQidKvz4RrjUimB`, READY; first deployment automatically production, no separate promotion |
| Production smoke | PASS at `deepxtech.vercel.app`: exact artifact, HTTP/assets/public revision 5, desktop/mobile rendering/playback, seven logos/four images and unauthenticated `/admin`; inspected captures and limits above |

Body content refreshes from published Supabase records when the page reloads.
SEO/social HTML metadata is built at deploy time; CMS publication alone does not
rebuild it. Record the content revision used for the build where possible.

## Recovery

This first deployment is the production baseline. Future code releases can
promote a known good Vercel deployment if rollback is required. Diagnose the exact
artifact and current alias before taking recovery action. Database recovery must
use reviewed forward migrations or approved content revisions; never reset the
production DB or overwrite current content with an old seed.
