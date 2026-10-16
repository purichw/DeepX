-- One-time owner-approved ecosystem bootstrap. User requested these official
-- marks from the supplied mockup. This is a trusted initialization, not a
-- browser-user publication: audit actors remain NULL. Never overwrite edits.
do $bootstrap$
declare
  workspace public.cms_workspace%rowtype;
  records jsonb := $records$[{"id": "fbff2770-c59b-450e-a7e0-5af7d6221999", "name": "Chulalongkorn University", "logo_url": "/images/ecosystem/chula.svg", "website_url": "https://www.chula.ac.th/", "surface": "dark"}, {"id": "65bf259b-39f4-4e08-9ab0-c746b897dc44", "name": "KMUTT", "logo_url": "/images/ecosystem/kmutt.svg", "website_url": "https://www.kmutt.ac.th/", "surface": "dark"}, {"id": "3a7d1d03-f2e4-4f5e-9165-7501f46e93da", "name": "NSTDA", "logo_url": "/images/ecosystem/nstda.svg", "website_url": "https://www.nstda.or.th/", "surface": "dark"}, {"id": "72ad2b92-bde0-4337-8411-b260992a8c66", "name": "NRCT", "logo_url": "/images/ecosystem/nrct.png", "website_url": "https://www.nrct.go.th/", "surface": "dark"}, {"id": "71962496-ed24-47c6-a60d-b3dfb582c75c", "name": "AWS", "logo_url": "/images/ecosystem/aws.png", "website_url": "https://aws.amazon.com/", "surface": "dark"}, {"id": "05a18b1f-a501-41b8-8cc7-ef48353da075", "name": "Microsoft", "logo_url": "/images/ecosystem/microsoft.png", "website_url": "https://www.microsoft.com/", "surface": "dark"}, {"id": "e6fac4d0-bb40-4905-bbbd-c3b4c3c04ea9", "name": "Google Cloud", "logo_url": "/images/ecosystem/google-cloud.svg", "website_url": "https://cloud.google.com/", "surface": "light"}]$records$::jsonb;
  next_document jsonb;
begin
  select * into strict workspace from public.cms_workspace where id = 'main' for update;
  if workspace.document is distinct from public.get_site_content()
    or jsonb_array_length(workspace.document->'partners') <> 0
    or exists(select 1 from public.partners) then
    raise exception 'Ecosystem bootstrap requires the unchanged initial workspace; reconcile any editorial changes first';
  end if;
  insert into public.partners(id, name, logo_url, website_url, surface, status, sort_order)
    select (entry->>'id')::uuid, entry->>'name', entry->>'logo_url', entry->>'website_url',
      entry->>'surface', 'published', (ordinal - 1)::integer
    from jsonb_array_elements(records) with ordinality as entries(entry, ordinal);
  update public.website_content
    set data = jsonb_set(data, '{eyebrow}', '{"th":"OUR ECOSYSTEM","en":"OUR ECOSYSTEM"}'::jsonb)
    where key = 'ecosystem';
  next_document := public.get_site_content();
  perform public.cms_validate_document(next_document);
  update public.cms_workspace set document = next_document, revision = revision + 1,
    published_revision = revision + 1, updated_at = now(), updated_by = null
    where id = 'main' returning * into workspace;
  insert into public.cms_revisions(revision, document) values(workspace.revision, workspace.document);
  insert into public.cms_publications(revision) values(workspace.revision);
end;
$bootstrap$;
