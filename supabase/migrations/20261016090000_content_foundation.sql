-- DeepX public content. Authoring is owner/service-role only until CMS auth exists.
create table public.website_content (
  key text primary key check (key ~ '^[a-zA-Z][a-zA-Z0-9_]*$'),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now()
);

create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title jsonb not null check (jsonb_typeof(title) = 'object' and title ?& array['th','en']),
  summary jsonb not null check (jsonb_typeof(summary) = 'object' and summary ?& array['th','en']),
  sector jsonb not null check (jsonb_typeof(sector) = 'object' and sector ?& array['th','en']),
  body jsonb not null check (jsonb_typeof(body) = 'object' and body ?& array['th','en']),
  metrics jsonb not null default '[]' check (jsonb_typeof(metrics) = 'array'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  logo_url text not null check (logo_url ~ '^(/images/|https://)'),
  website_url text not null check (website_url ~ '^https://'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger website_content_updated_at before update on public.website_content
for each row execute function public.touch_updated_at();
create trigger case_studies_updated_at before update on public.case_studies
for each row execute function public.touch_updated_at();
create trigger partners_updated_at before update on public.partners
for each row execute function public.touch_updated_at();

alter table public.website_content enable row level security;
alter table public.case_studies enable row level security;
alter table public.partners enable row level security;

revoke all on public.website_content, public.case_studies, public.partners from anon, authenticated;
grant select on public.website_content, public.case_studies, public.partners to anon, authenticated;
grant all on public.website_content, public.case_studies, public.partners to service_role;

create policy "Read published content" on public.website_content for select to anon, authenticated using (status = 'published');
create policy "Read published case studies" on public.case_studies for select to anon, authenticated using (status = 'published');
create policy "Read published partners" on public.partners for select to anon, authenticated using (status = 'published');

create index case_studies_published_order on public.case_studies (sort_order) where status = 'published';
create index partners_published_order on public.partners (sort_order) where status = 'published';

-- One bounded request, security invoker so the table policies still apply.
create function public.get_site_content() returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'content', coalesce((select jsonb_object_agg(key, data) from public.website_content where status = 'published'), '{}'::jsonb),
    'case_studies', coalesce((select jsonb_agg(jsonb_build_object('slug', slug, 'title', title, 'summary', summary, 'sector', sector, 'body', body, 'metrics', metrics) order by sort_order, slug) from public.case_studies where status = 'published'), '[]'::jsonb),
    'partners', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'name', name, 'logo_url', logo_url, 'website_url', website_url) order by sort_order, name) from public.partners where status = 'published'), '[]'::jsonb)
  );
$$;
revoke all on function public.get_site_content() from public;
grant execute on function public.get_site_content() to anon, authenticated, service_role;
revoke all on function public.touch_updated_at() from public, anon, authenticated;

comment on table public.website_content is 'Public website sections and UI copy. Never store secrets, private drafts of personal data, or internal commercial notes here.';
comment on table public.case_studies is 'Only publish approved real case studies with substantiated outcomes.';
comment on table public.partners is 'Only publish verified relationships with approved logos.';
