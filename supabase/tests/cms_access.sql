-- Run through a trusted database connection. Every fixture and CMS mutation is
-- rolled back; no user is emailed and no real published content is retained.
begin;

insert into auth.users (id, aud, role, email, email_confirmed_at, created_at, updated_at)
values
  ('1d0d3a98-ef48-4ef0-b168-e8cd1c6f9001', 'authenticated', 'authenticated', 'cms-admin-test@deepx.invalid', now(), now(), now()),
  ('1d0d3a98-ef48-4ef0-b168-e8cd1c6f9002', 'authenticated', 'authenticated', 'cms-outsider-test@deepx.invalid', now(), now(), now()),
  ('1d0d3a98-ef48-4ef0-b168-e8cd1c6f9003', 'authenticated', 'authenticated', 'cms-unconfirmed-test@deepx.invalid', null, now(), now());
insert into public.cms_admins (email)
values ('cms-admin-test@deepx.invalid'), ('cms-unconfirmed-test@deepx.invalid');

do $$
declare table_name text;
begin
  foreach table_name in array array['cms_admins', 'cms_workspace', 'cms_revisions', 'cms_publications'] loop
    if not (select relrowsecurity from pg_class where oid = ('public.' || table_name)::regclass) then
      raise exception 'RLS is disabled on %', table_name;
    end if;
    if has_table_privilege('anon', 'public.' || table_name, 'SELECT,INSERT,UPDATE,DELETE')
      or has_table_privilege('authenticated', 'public.' || table_name, 'SELECT,INSERT,UPDATE,DELETE') then
      raise exception 'Browser role has direct access to %', table_name;
    end if;
  end loop;
  if has_function_privilege('anon', 'public.cms_get_workspace()', 'EXECUTE')
    or has_function_privilege('anon', 'public.cms_save_draft(jsonb,bigint)', 'EXECUTE')
    or has_function_privilege('anon', 'public.cms_publish(bigint)', 'EXECUTE')
    or has_function_privilege('authenticated', 'public.cms_validate_document(jsonb)', 'EXECUTE') then
    raise exception 'CMS RPC grants are too broad';
  end if;
  if not exists (select 1 from storage.buckets where id = 'cms-media' and public
      and file_size_limit = 5242880 and allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']) then
    raise exception 'CMS image bucket restrictions are incorrect';
  end if;
  if not exists (select 1 from storage.buckets where id = 'cms-video' and public
      and file_size_limit = 31457280 and allowed_mime_types = array['video/mp4']) then
    raise exception 'CMS video bucket restrictions are incorrect';
  end if;
end;
$$;

set local role anon;
do $$
begin
  begin
    perform public.cms_get_workspace();
    raise exception 'Anonymous CMS read unexpectedly succeeded';
  exception when insufficient_privilege then null; end;
  begin
    perform public.cms_publish(0);
    raise exception 'Anonymous publish unexpectedly succeeded';
  exception when insufficient_privilege then null; end;
end;
$$;
reset role;

-- A forged email claim cannot replace the actual auth.users identity.
select set_config('request.jwt.claim.sub', '1d0d3a98-ef48-4ef0-b168-e8cd1c6f9002', true);
select set_config('request.jwt.claims', '{"sub":"1d0d3a98-ef48-4ef0-b168-e8cd1c6f9002","role":"authenticated","email":"cms-admin-test@deepx.invalid"}', true);
set local role authenticated;
do $$
begin
  if public.is_cms_admin() then raise exception 'JWT email claim bypassed the allowlist'; end if;
  begin
    perform public.cms_get_workspace();
    raise exception 'Ordinary user CMS read unexpectedly succeeded';
  exception when insufficient_privilege then null; end;
  begin
    perform public.cms_save_draft('{}'::jsonb, 0);
    raise exception 'Ordinary user draft save unexpectedly succeeded';
  exception when insufficient_privilege then null; end;
  begin
    perform public.cms_publish(0);
    raise exception 'Ordinary user publish unexpectedly succeeded';
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects (bucket_id, name) values ('cms-media', 'cms-test-denied.jpg');
    raise exception 'Ordinary user media upload unexpectedly succeeded';
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects (bucket_id, name) values ('cms-video', 'cms-test-denied.mp4');
    raise exception 'Ordinary user video upload unexpectedly succeeded';
  exception when insufficient_privilege then null; end;
end;
$$;
reset role;

select set_config('request.jwt.claim.sub', '1d0d3a98-ef48-4ef0-b168-e8cd1c6f9003', true);
select set_config('request.jwt.claims', '{"sub":"1d0d3a98-ef48-4ef0-b168-e8cd1c6f9003","role":"authenticated"}', true);
set local role authenticated;
do $$
begin
  if public.is_cms_admin() then raise exception 'Unconfirmed email gained CMS access'; end if;
end;
$$;
reset role;

select set_config('request.jwt.claim.sub', '1d0d3a98-ef48-4ef0-b168-e8cd1c6f9001', true);
select set_config('request.jwt.claims', '{"sub":"1d0d3a98-ef48-4ef0-b168-e8cd1c6f9001","role":"authenticated"}', true);
set local role authenticated;
do $$
declare
  original jsonb := public.cms_get_workspace();
  live_before jsonb := public.get_site_content();
  draft jsonb;
  result jsonb;
  saved_revision bigint;
  fixture_case jsonb := jsonb_build_object(
    'id', 'd374c1a8-cdb9-4f77-944a-514346134001', 'slug', 'cms-transaction-test',
    'title', jsonb_build_object('th', 'ทดสอบธุรกรรม', 'en', 'Transactional test'),
    'summary', jsonb_build_object('th', 'ทดสอบ', 'en', 'Test'),
    'sector', jsonb_build_object('th', 'ทดสอบ', 'en', 'Test'),
    'body', jsonb_build_object('th', 'ทดสอบ', 'en', 'Test'), 'metrics', '[]'::jsonb
  );
  fixture_partner jsonb := jsonb_build_object(
    'id', 'd374c1a8-cdb9-4f77-944a-514346134002', 'name', 'Transactional test',
    'logo_url', '/images/test.jpg', 'website_url', 'https://example.invalid', 'surface', 'light'
  );
begin
  if not public.is_cms_admin() then raise exception 'Confirmed allowlisted identity was denied'; end if;
  draft := jsonb_set(original->'document', '{content,hero,body,th}', to_jsonb('CMS transaction test'::text));
  draft := jsonb_set(draft, '{content,site,email}', '""'::jsonb);
  draft := jsonb_set(draft, '{content,industries,items,0,image}', '""'::jsonb);
  draft := jsonb_set(draft, '{content,hero,videoUrl}', '"/videos/cms-test.mp4"'::jsonb);
  draft := jsonb_set(draft, '{content,hero,videoPoster}', '"/images/cms-test.jpg"'::jsonb);
  -- Why cards do not render descriptions; a newly authored card may leave this
  -- compatibility field empty without preventing a valid draft save.
  draft := jsonb_set(draft, '{content,why,items,0,description}', '{"th":"","en":""}'::jsonb);
  draft := jsonb_set(draft, '{case_studies}', (draft->'case_studies') || jsonb_build_array(fixture_case));
  draft := jsonb_set(draft, '{partners}', (draft->'partners') || jsonb_build_array(fixture_partner));
  result := public.cms_save_draft(draft, (original->>'revision')::bigint);
  saved_revision := (result->>'revision')::bigint;
  if saved_revision <> (original->>'revision')::bigint + 1 or result->'document' <> draft
      or (result->>'published_revision')::bigint <> (original->>'published_revision')::bigint then
    raise exception 'Draft save did not preserve the revision/publication contract';
  end if;
  if public.get_site_content() <> live_before then raise exception 'Saving a draft changed live data'; end if;
  if public.cms_get_workspace()->'document' <> draft then raise exception 'Saved draft did not persist'; end if;
  if not exists (select 1 from jsonb_array_elements(result->'document'->'partners') entry
      where entry->>'id' = 'd374c1a8-cdb9-4f77-944a-514346134002' and entry->>'surface' = 'light') then
    raise exception 'The selected light logo surface did not survive draft save';
  end if;
  if (public.cms_save_draft(draft, saved_revision)->>'revision')::bigint <> saved_revision then
    raise exception 'Unchanged save created a redundant revision';
  end if;
  begin
    perform public.cms_save_draft(draft, (original->>'revision')::bigint);
    raise exception 'Stale draft save unexpectedly succeeded';
  exception when sqlstate 'PT409' then null; end;
  begin
    perform public.cms_publish((original->>'revision')::bigint);
    raise exception 'Stale publish unexpectedly succeeded';
  exception when sqlstate 'PT409' then null; end;
  begin
    perform public.cms_save_draft(draft #- '{content,hero}', saved_revision);
    raise exception 'Incomplete content unexpectedly passed server validation';
  exception when check_violation then null; end;
  begin
    perform public.cms_save_draft(jsonb_set(draft, '{content,capabilities,items,0,description,th}', '""'::jsonb), saved_revision);
    raise exception 'A required visible description unexpectedly accepted an empty translation';
  exception when check_violation then null; end;
  begin
    perform public.cms_save_draft(jsonb_set(draft, '{content,site,linkedin}', '"javascript:alert(1)"'::jsonb), saved_revision);
    raise exception 'Unsafe link unexpectedly passed server validation';
  exception when check_violation then null; end;
  begin
    perform public.cms_save_draft(jsonb_set(draft, '{content,hero,videoUrl}', '"javascript:alert(1)"'::jsonb), saved_revision);
    raise exception 'An executable hero video URL unexpectedly passed server validation';
  exception when check_violation then null; end;
  begin
    perform public.cms_save_draft(jsonb_set(draft, '{content,hero,videoUrl}', '"/videos/cms-test.mov"'::jsonb), saved_revision);
    raise exception 'A non-MP4 local hero video unexpectedly passed server validation';
  exception when check_violation then null; end;
  begin
    perform public.cms_save_draft(jsonb_set(draft, '{case_studies}', jsonb_build_array(fixture_case, fixture_case)), saved_revision);
    raise exception 'Duplicate case IDs unexpectedly passed server validation';
  exception when check_violation then null; end;
  begin
    perform public.cms_save_draft(jsonb_set(draft, '{partners,0,surface}', '"neon"'::jsonb), saved_revision);
    raise exception 'An unsupported logo surface unexpectedly passed server validation';
  exception when check_violation then null; end;
  begin
    update public.cms_revisions set document = '{}'::jsonb;
    raise exception 'Browser was able to rewrite revision history';
  exception when insufficient_privilege then null; end;

  result := public.cms_publish(saved_revision);
  if (result->>'published_revision')::bigint <> saved_revision or public.get_site_content() <> draft then
    raise exception 'Atomic publication differs from the reviewed draft';
  end if;
  if public.get_site_content() #>> '{content,hero,videoUrl}' <> '/videos/cms-test.mp4'
      or public.get_site_content() #>> '{content,hero,videoPoster}' <> '/images/cms-test.jpg' then
    raise exception 'Hero video and poster did not survive publication and public read-back';
  end if;
  if not exists (select 1 from jsonb_array_elements(public.get_site_content()->'partners') entry
      where entry->>'id' = 'd374c1a8-cdb9-4f77-944a-514346134002' and entry->>'surface' = 'light') then
    raise exception 'The selected light logo surface did not survive publication and public read-back';
  end if;
  if (public.cms_publish(saved_revision)->>'published_revision')::bigint <> saved_revision then
    raise exception 'Idempotent publication failed';
  end if;
  if not exists (select 1 from jsonb_array_elements(public.cms_list_revisions()) x
      where (x->>'revision')::bigint = saved_revision and x->>'published_at' is not null
        and x->>'saved_by' = '1d0d3a98-ef48-4ef0-b168-e8cd1c6f9001') then
    raise exception 'Revision/publication audit is missing the authenticated actor';
  end if;

  -- Explicitly clearing optional media must remain empty in public output.
  result := public.cms_save_draft(
    jsonb_set(jsonb_set(draft, '{content,hero,videoUrl}', '""'::jsonb), '{content,hero,videoPoster}', '""'::jsonb),
    saved_revision
  );
  saved_revision := (result->>'revision')::bigint;
  perform public.cms_publish(saved_revision);
  if public.get_site_content() #>> '{content,hero,videoUrl}' is distinct from ''
      or public.get_site_content() #>> '{content,hero,videoPoster}' is distinct from '' then
    raise exception 'Cleared hero video/poster was not preserved as empty';
  end if;

  -- Removing entries unpublishes them. Their stored records remain recoverable.
  result := public.cms_save_draft(original->'document', saved_revision);
  perform public.cms_publish((result->>'revision')::bigint);
  if public.get_site_content() <> original->'document' then
    raise exception 'Publishing a replacement document did not remove public entries';
  end if;

  insert into storage.objects (bucket_id, name) values ('cms-media', 'cms-test-allowed.jpg');
  begin
    insert into storage.objects (bucket_id, name) values ('cms-media', 'cms-test-denied.svg');
    raise exception 'SVG media unexpectedly passed the upload policy';
  exception when insufficient_privilege then null; end;
  insert into storage.objects (bucket_id, name) values ('cms-video', 'cms-test-allowed.mp4');
  begin
    insert into storage.objects (bucket_id, name) values ('cms-video', 'cms-test-denied.jpg');
    raise exception 'A non-MP4 file unexpectedly passed the video upload policy';
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects (bucket_id, name) values ('cms-media', 'cms-test-denied.mp4');
    raise exception 'The image bucket unexpectedly accepted a video';
  exception when insufficient_privilege then null; end;
  update storage.objects set name = 'cms-test-overwrite.mp4'
    where bucket_id = 'cms-video' and name = 'cms-test-allowed.mp4';
  if found then raise exception 'Admin video overwrite unexpectedly succeeded'; end if;
  begin
    delete from storage.objects where bucket_id = 'cms-video' and name = 'cms-test-allowed.mp4';
    if found then raise exception 'Admin video deletion unexpectedly succeeded'; end if;
  exception when insufficient_privilege then null; end;
  -- No update/delete policy: an overwrite or deletion must affect zero rows.
  update storage.objects set name = 'cms-test-overwrite.jpg'
    where bucket_id = 'cms-media' and name = 'cms-test-allowed.jpg';
  if found then raise exception 'Admin image overwrite unexpectedly succeeded'; end if;
  begin
    delete from storage.objects where bucket_id = 'cms-media' and name = 'cms-test-allowed.jpg';
    if found then raise exception 'Admin image deletion unexpectedly succeeded'; end if;
  -- Storage also installs a protection trigger that can deny direct SQL deletes
  -- before RLS produces zero matching rows. Both are valid denial outcomes.
  exception when insufficient_privilege then null; end;
end;
$$;
reset role;

do $$
begin
  if not exists (select 1 from public.case_studies where id = 'd374c1a8-cdb9-4f77-944a-514346134001' and status = 'draft')
      or not exists (select 1 from public.partners where id = 'd374c1a8-cdb9-4f77-944a-514346134002' and status = 'draft') then
    raise exception 'Unpublishing deleted a stored record';
  end if;
  if (select count(*) from public.cms_publications where revision = (
      select revision from public.cms_revisions
      where saved_by = '1d0d3a98-ef48-4ef0-b168-e8cd1c6f9001'
        and document #>> '{content,hero,videoUrl}' = '/videos/cms-test.mp4'
      order by revision desc limit 1
    )) <> 1 then
    raise exception 'Idempotent publish wrote duplicate audit events';
  end if;
end;
$$;

-- Revoking an allowlist entry takes effect even with an existing JWT session.
update public.cms_admins set active = false where email = 'cms-admin-test@deepx.invalid';
set local role authenticated;
do $$
begin
  if public.is_cms_admin() then raise exception 'Revoked administrator retained CMS access'; end if;
end;
$$;
reset role;
rollback;
