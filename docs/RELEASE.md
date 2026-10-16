# Release runbook and current state

Updated: 2026-10-16 (Asia/Bangkok).

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

1. Review intended files with `git status --short --branch` and `git diff --check`;
   commit and push, then verify the exact remote SHA.
2. Deploy one candidate and inspect its actual target. Prefer a preview for
   subsequent releases. Confirm `/`, `/admin`, the intended published revision,
   the four industry images, seven ecosystem logos and hero video/poster on that
   immutable URL. Inspect relevant asset/network failures and console errors.
3. If the artifact is a preview, promote it once verified; if already production,
   do not create a duplicate deployment or claim a separate promotion. Confirm
   `deepxtech.vercel.app` resolves to it and run the focused alias smoke.

Do not restart a whole-site audit without a new failure or source change. When
relevant implementation changes, the repeatable local checks are `npm test`
(8 tests at this checkpoint), `npm run check:schema`, `npm run typecheck` and
`npm run build` with real published data; never enable the local fixture flag for
a release. Rerun only the affected database/browser checks where appropriate.

Preview/production commands after the gate is met:

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
Before enabling continuous deployment, connect `purichw/DeepX` deliberately and
verify the intended production branch and required checks.

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
