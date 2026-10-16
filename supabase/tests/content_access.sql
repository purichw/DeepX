-- Run in a transaction through an owner connection. No fixture survives rollback.
begin;
insert into public.website_content (key, data, status) values
  ('deepxAccessTestDraft', '{"fixture":true}', 'draft');

do $$
declare target text; role_name text;
begin
  foreach target in array array['website_content', 'case_studies', 'partners'] loop
    if not (select relrowsecurity from pg_class where oid = ('public.' || target)::regclass) then
      raise exception 'RLS is disabled on %', target;
    end if;
    foreach role_name in array array['anon','authenticated'] loop
      if not has_table_privilege(role_name, 'public.' || target, 'SELECT') then
        raise exception '% lacks published-read grant on %', role_name, target;
      end if;
      if has_table_privilege(role_name, 'public.' || target, 'INSERT,UPDATE,DELETE,TRUNCATE') then
        raise exception '% has unauthorized write grant on %', role_name, target;
      end if;
    end loop;
  end loop;
end $$;

set local role anon;
do $$
begin
  if exists(select 1 from public.website_content where status <> 'published') then raise exception 'Anonymous access exposed a draft'; end if;
  if not exists(select 1 from public.website_content where key = 'site') then raise exception 'Published site not readable'; end if;
  if public.get_site_content()->'content' ? 'deepxAccessTestDraft' then raise exception 'RPC exposed a draft'; end if;
end $$;
reset role;
set local role authenticated;
do $$
begin
  if exists(select 1 from public.website_content where status <> 'published') then raise exception 'Authenticated access exposed a draft'; end if;
end $$;
reset role;
rollback;
