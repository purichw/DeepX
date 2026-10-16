# DeepX operating instructions

## Read first

Read `README.md`, `docs/PROJECT_MAP.md`, `docs/CMS.md`, and the scope-specific section of
`docs/RELEASE.md`. Use `project-onboarding` for a new session. Inspect
`git status --short --branch` before edits and preserve unrelated changes.

## Product and content

- The company is **DeepX**. “Deep Tech” describes the category, not a second brand.
- The supplied desktop, tablet and mobile images in `docs/references/` are the
  visual source of truth. Use `ui-ux-expert` and `mockup-to-product` for UI work.
- Do not replace the established navy/cyan system with generic skill tokens.
- Business content, navigation, images, metadata and contact information belong
  in Supabase. Do not hardcode them in components or add production seed fallbacks.
- Admin operational labels, validation/error messages, layout and access behavior
  are code-owned. They are not editable business content or permission settings.
- `supabase/content/initial-content.json` is a historical bootstrap fixture,
  not a competing source of truth after the database is initialized.
- Never seed invented clients, partnerships, testimonials, awards or performance
  numbers. Real case studies and partner logos require approved source evidence.
- Default language is Thai. Keep the English equivalent and mobile wrapping.
- Links to email, LINE and LinkedIn open the user's external service; there is
  no automatic message sending or hidden submission.

## Data safety

- Public browser roles may read **published** content only. Never give anonymous
  visitors or all authenticated users content-write privileges.
- `/admin` uses Supabase Auth and a server-managed allowlist of confirmed email
  identities. Signing in alone must never grant CMS access. Do not commit the
  owner's personal email or expose allowlist/audit data through the public RPC.
- CMS writes go through the guarded RPCs, not direct browser table mutations.
  Preserve shared server drafts, expected-revision checks, atomic publication,
  immutable snapshots and authenticated actor attribution.
- Do not claim an editable field affects the public site until its actual
  consumer is wired and checked. Update the coverage map in `docs/CMS.md` when
  adding, removing or changing a content field.
- A deliberately cleared optional contact/image must stay empty. Never resurrect
  it from seed data. Removing a record from a draft must not change the live site
  until publication; preserve unpublished database records and history.
- Uploaded CMS media has a public URL. Accept only the configured image types
  and size limit, create a new object path for replacements, and do not expose
  overwrite/delete or private-document upload without a separately scoped design.
- Keep schema and policy changes in migrations. Inspect the remote target and
  migration history before applying them. Never reset or clear a remote database.
- Never place a database password, service-role key or access token in Vite env,
  source, logs or screenshots. The publishable key is public by design.

## Verification and delivery

Use a focused pass for small changes; use the release runbook for deploy work.
Check types/build, the changed interactions, desktop/mobile rendering and actual
deployed assets. Record evidence and untested engines honestly. Do not run broad
checks repeatedly after unchanged successful results.

For CMS changes, check save/reopen, publish/read-back, intentional clear/removal,
stale revision rejection and non-admin denial for the touched surface. Database
transaction fixtures are not proof of an authenticated browser journey. Keep
SEO/social metadata build-time freshness distinct from runtime body content.

Keep all work in this chat. Do not read, message or delegate to other chats
without the user's explicit identification and authorization. Do not change
files outside this project or perform destructive commands without permission.
