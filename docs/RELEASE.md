# Release runbook and current state

Updated: 2026-10-16 (Asia/Bangkok).

## Current state — pre-release

**No source commit/push or Vercel deployment has been completed yet.** The earlier
Supabase CLI access blocker is resolved. The current local candidate and CMS
publication revision **5** passed the checks below. Source delivery, preview
deployment, promotion and production smoke remain; this is not a deployment
completion report.

| Area | Completed evidence | Still required for this candidate |
| --- | --- | --- |
| Repository | Local `main` at `/Users/point/Website Projects/DeepX`; remote baseline `c5e8ca95a23678c28aa462042f2932158d14071b` | Review intended files, commit and push; record exact SHA |
| Supabase access | Correct project `yazamwbukbtetzqmqcpm` linked and accessible | Keep all operations scoped to this project |
| Database | Migrations `20261016090000`–`20261016090700` applied: partner surfaces, ecosystem bootstrap, `PT409` conflicts, hero video fields and separate video Storage | Preserve applied migrations; no pending migration at this checkpoint |
| Access/transactions | Live SQL tests passed in rollback transactions, including migration 907 video/clear/Storage checks and `PT409`; anonymous private CMS RPC returned HTTP 401 | No repeat required unless a touched contract changes |
| Local checks | All 8 content/editor tests, schema parity, TypeScript and real-data production build passed after the video implementation | Record the committed source SHA; rerun only if relevant source changes |
| CMS browser | Real Chrome administrator uploaded all four photos, saved revision 4 while public revision stayed 3; uploaded MP4 to `cms-video`, saved/reopened revision 5, confirmed publication to public revision 5 | Deployed `/admin` routing/session smoke |
| Conflict recovery | Stale revision 4 save after revision 5 was rejected; test copy remained in the editor, confirmed reload restored revision 5, and test copy never reached live content | No pending local recovery retest |
| Public UI | 1440/820/390px inspected with full-frame hero video and no horizontal overflow; shared centered actions/process inspected at 1440px; menu, EN persistence after reload, TH restoration and contact Escape/focus passed | Confirm the deployed artifact renders the same candidate |
| Ecosystem | All seven official assets downloaded and parsed; source URLs documented in `ASSETS.md`; records bootstrapped by migration 905 with light/dark surfaces | Verify public read and rendered logos in the final deployed candidate |
| Industry replacements | Four 1200 × 900 WebPs uploaded through CMS, both-language alt text saved, published in revision 5 and read/rendered by the public local page | Verify all four uploaded URLs and visible images on the deployed candidate |
| Hero video | CMS MP4 upload and revision 5 public read passed; public video reached `readyState=4`, playing, muted, loop, inline, controls off; scrolling offscreen paused it | Deployed playback/poster smoke; reduced-motion OS emulation remains untested |
| Vercel setup | `purich-w/deepx`, project ID `prj_rRSo3p0ZO8NvxjP1jFTWTTTkBllf`, Node 24.x; Supabase public configuration in production and preview | Preview deploy, scoped UAT, promote verified artifact and exact revision/alias smoke |
| Domain | `deepxtech.vercel.app` attached and verified; preferred `deepx.vercel.app` unavailable (HTTP 409, already assigned) | Confirm fallback alias serves the verified release after promotion |

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

## Release gate

Local/database/browser gates in the table above are complete for this candidate.
The remaining release steps are:

1. Review intended files with `git status --short --branch` and `git diff --check`;
   commit and push, then verify the exact remote SHA.
2. Deploy one preview candidate. Confirm `/`, `/admin`, published revision 5,
   the four industry images, seven ecosystem logos and hero video/poster on that
   immutable URL. Inspect relevant asset/network failures and console errors.
3. Promote that verified artifact and confirm `deepxtech.vercel.app` resolves to
   it. Repeat the focused route/media smoke on the alias and record the result.

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

## Delay checkpoints

No project baseline exists yet. Record this first successful run as the baseline.
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

The four source WebPs are 1200 × 900, totaling 762,794 bytes; the live references
are their immutable CMS Storage URLs. Prepared hero files are
`/videos/deepx-hero.mp4` (1920 × 1080, 10 seconds, 2,633,405 bytes), optional
`/videos/deepx-hero-mobile.mp4` (960 × 540, 927,714 bytes), and
`/images/deepx-hero-poster.webp` (1920 × 1080, 42,230 bytes). The published video
uses its uploaded `cms-video` URL; the renderer does not automatically select the
mobile file. Provenance and manifests are described in [ASSETS.md](ASSETS.md).

Reduced-motion handling exists in `HeroMedia`, but OS preference/emulation was
not exercised. SQL tests prove their asserted transaction/policy behavior, not
every browser interaction. Local playback and responsive captures do not prove
production asset delivery until deployment smoke completes.

Do not claim physical iOS/Android, WebKit/Firefox, contact message delivery, load
testing or privacy legal review. No email/LINE message needs to be sent to smoke
the public contact links. Avoid publishing invented records merely to test UI.

## Final release record — complete after release

| Stage | Current record |
| --- | --- |
| Source commit / remote push | Pending; record SHA and confirmed remote head |
| Required CI | Not configured; local checks are recorded separately |
| Final real-data build | PASS after video implementation; 8 tests/schema parity/typecheck/build passed; associate the result with the committed SHA |
| Migration/content revision | 900–907 applied; authenticated CMS published revision 5; live SQL and browser read-back/conflict recovery passed |
| Deployment / promotion | Pending; record immutable deployment URL and promotion result |
| Production smoke | Pending; record `deepxtech.vercel.app`, exact source revision, routes, CMS/public/media results and inspected screenshots |

Body content refreshes from published Supabase records when the page reloads.
SEO/social HTML metadata is built at deploy time; CMS publication alone does not
rebuild it. Record the content revision used for the build where possible.

## Recovery

No existing production website was changed. If first release verification fails,
keep the current alias unpromoted and repair the candidate. Future code releases
can promote a known good Vercel deployment. Database recovery must use reviewed
forward migrations or approved content revisions; never reset the production DB.
