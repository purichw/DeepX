-- Editorial conflicts are HTTP409, not retriable serialization failures.
-- https://supabase.com/docs/guides/troubleshooting/high-cpu-and-infinite-transaction-retries-when-using-custom-error-codes-in-rpc-functions-77326b
create or replace function public.cms_save_draft(p_document jsonb, p_expected_revision bigint) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare workspace public.cms_workspace%rowtype;
begin
  if not public.is_cms_admin() then
    raise exception 'CMS administrator access required' using errcode = '42501';
  end if;
  select * into strict workspace from public.cms_workspace where id = 'main' for update;
  if p_expected_revision is null or workspace.revision <> p_expected_revision then
    raise exception 'Draft changed in another session; reload before saving' using errcode = 'PT409';
  end if;
  perform public.cms_validate_document(p_document);
  if workspace.document is distinct from p_document then
    update public.cms_workspace
    set document = p_document, revision = revision + 1, updated_at = now(), updated_by = auth.uid()
    where id = 'main' returning * into workspace;
    insert into public.cms_revisions (revision, document, saved_by)
      values (workspace.revision, workspace.document, auth.uid());
  end if;
  return jsonb_build_object('document', workspace.document, 'revision', workspace.revision,
    'published_revision', workspace.published_revision, 'updated_at', workspace.updated_at);
end;
$$;

create or replace function public.cms_publish(p_expected_revision bigint) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare workspace public.cms_workspace%rowtype;
begin
  if not public.is_cms_admin() then
    raise exception 'CMS administrator access required' using errcode = '42501';
  end if;
  select * into strict workspace from public.cms_workspace where id = 'main' for update;
  if p_expected_revision is null or workspace.revision <> p_expected_revision then
    raise exception 'Draft changed in another session; reload before publishing' using errcode = 'PT409';
  end if;
  perform public.cms_validate_document(workspace.document);
  if workspace.published_revision <> workspace.revision then
    -- Rows removed from the draft become unpublished, preserving their data.
    update public.website_content set status = 'draft'
      where status = 'published' and not (workspace.document->'content' ? key);
    insert into public.website_content (key, data, status)
      select key, value, 'published' from jsonb_each(workspace.document->'content')
      on conflict (key) do update set data = excluded.data, status = 'published';

    update public.case_studies set status = 'draft'
      where status = 'published' and id not in (
        select (value->>'id')::uuid from jsonb_array_elements(workspace.document->'case_studies')
      );
    insert into public.case_studies (id, slug, title, summary, sector, body, metrics, status, sort_order)
      select (entry->>'id')::uuid, entry->>'slug', entry->'title', entry->'summary',
        entry->'sector', entry->'body', entry->'metrics', 'published', (ordinal - 1)::integer
      from jsonb_array_elements(workspace.document->'case_studies') with ordinality as entries(entry, ordinal)
      on conflict (id) do update set slug = excluded.slug, title = excluded.title,
        summary = excluded.summary, sector = excluded.sector, body = excluded.body,
        metrics = excluded.metrics, status = 'published', sort_order = excluded.sort_order;

    update public.partners set status = 'draft'
      where status = 'published' and id not in (
        select (value->>'id')::uuid from jsonb_array_elements(workspace.document->'partners')
      );
    insert into public.partners (id, name, logo_url, website_url, surface, status, sort_order)
      select (entry->>'id')::uuid, entry->>'name', entry->>'logo_url', entry->>'website_url', coalesce(entry->>'surface', 'dark'),
        'published', (ordinal - 1)::integer
      from jsonb_array_elements(workspace.document->'partners') with ordinality as entries(entry, ordinal)
      on conflict (id) do update set name = excluded.name, logo_url = excluded.logo_url,
        website_url = excluded.website_url, surface = excluded.surface, status = 'published', sort_order = excluded.sort_order;

    insert into public.cms_publications (revision, published_by) values (workspace.revision, auth.uid());
    update public.cms_workspace set published_revision = revision, updated_at = now(), updated_by = auth.uid()
      where id = 'main' returning * into workspace;
  end if;
  return jsonb_build_object('document', workspace.document, 'revision', workspace.revision,
    'published_revision', workspace.published_revision, 'updated_at', workspace.updated_at);
end;
$$;
