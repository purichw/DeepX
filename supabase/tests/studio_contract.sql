-- Run after the Studio migration with a trusted database connection. All changes roll back.
begin;
do $test$
declare w public.cms_workspace%rowtype; edited jsonb; admin_id uuid;
begin
  select * into strict w from public.cms_workspace where id='main';
  if not (w.document->'content' ? 'studio') then raise exception 'Missing Studio draft'; end if;
  if has_function_privilege('anon','public.cms_save_draft(jsonb,bigint)','execute') then raise exception 'Anonymous draft write allowed'; end if;
  if has_table_privilege('anon','public.cms_workspace','select') then raise exception 'Anonymous private draft access allowed'; end if;
  perform set_config('request.jwt.claim.sub','',true);
  begin
    perform public.cms_save_draft(w.document,w.revision);
    raise exception 'Unsigned caller accepted';
  exception when insufficient_privilege then null; end;
  select u.id into strict admin_id from auth.users u
    join public.cms_admins a on a.email=lower(u.email) and a.active
    where u.email_confirmed_at is not null and u.deleted_at is null order by u.created_at limit 1;
  perform set_config('request.jwt.claim.sub',admin_id::text,true);
  begin
    perform public.cms_save_draft(w.document,w.revision-1);
    raise exception 'Stale revision accepted';
  exception when sqlstate 'PT409' then null; end;
  begin
    perform public.cms_save_draft(w.document #- '{content,studio}',w.revision);
    raise exception 'Old editor dropped Studio';
  exception when sqlstate 'PT409' then null; end;
  edited := jsonb_set(w.document,'{content,studio,portfolio,projects}',(w.document#>'{content,studio,portfolio,projects}') || jsonb_build_array(w.document#>'{content,studio,portfolio,projects,0}'));
  begin
    perform public.cms_save_draft(edited,w.revision);
    raise exception 'Duplicate Studio identity accepted';
  exception when check_violation then null; end;
  edited := jsonb_set(jsonb_set(w.document,'{content,studio,services,items}','[]'::jsonb),'{content,studio,hero,image}','""'::jsonb);
  perform public.cms_save_draft(edited,w.revision);
  if not exists(select 1 from public.cms_workspace where document#>'{content,studio,services,items}'='[]'::jsonb and document#>>'{content,studio,hero,image}'='') then raise exception 'Clear was not preserved'; end if;
end;
$test$;
rollback;
select 'PASS: authorization, conflict, old-client preservation, duplicate IDs, explicit clears' as studio_contract;
