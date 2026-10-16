-- DeepX CMS: verified identities, private drafts and atomic publication.
-- No account is implicitly an admin. The owner bootstraps a confirmed email in
-- cms_admins through a trusted database connection, never through the browser.
create extension if not exists pg_jsonschema with schema extensions;

create table public.cms_admins (
  email text primary key check (email = lower(trim(email)) and position('@' in email) > 1),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create function public.is_cms_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from auth.users u
    join public.cms_admins a on a.email = lower(u.email) and a.active
    where u.id = auth.uid() and u.email_confirmed_at is not null
      and u.deleted_at is null and (u.banned_until is null or u.banned_until <= now())
  );
$$;
revoke all on function public.is_cms_admin() from public, anon, authenticated;
grant execute on function public.is_cms_admin() to authenticated;

-- BEGIN GENERATED CONTENT SCHEMA
create function public.cms_document_schema() returns json
language sql immutable set search_path = '' as $function$
  select $schema${"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"content":{"type":"object","properties":{"site":{"type":"object","properties":{"name":{"type":"string"},"descriptor":{"type":"string"},"tagline":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"email":{"anyOf":[{"type":"string","format":"email","pattern":"^(?:[A-Za-z0-9_'+\\-]+\\.)*[A-Za-z0-9_'+\\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"},{"type":"string","const":""}]},"line":{"type":"string"},"lineUrl":{"anyOf":[{"type":"string","pattern":"^(https:\\/\\/[^\\s]+|mailto:[^\\s]+|#[a-z][\\w-]*)$"},{"type":"string","const":""}]},"website":{"anyOf":[{"type":"string","pattern":"^(https:\\/\\/[^\\s]+|mailto:[^\\s]+|#[a-z][\\w-]*)$"},{"type":"string","const":""}]},"linkedin":{"anyOf":[{"type":"string","pattern":"^(https:\\/\\/[^\\s]+|mailto:[^\\s]+|#[a-z][\\w-]*)$"},{"type":"string","const":""}]},"defaultLocale":{"type":"string","enum":["th","en"]},"navigation":{"type":"array","items":{"type":"object","properties":{"label":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"href":{"type":"string","pattern":"^(https:\\/\\/[^\\s]+|mailto:[^\\s]+|#[a-z][\\w-]*)$"}},"required":["label","href"],"additionalProperties":false}},"footerText":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"copyright":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["name","descriptor","tagline","title","description","email","line","lineUrl","website","linkedin","defaultLocale","navigation","footerText","copyright"],"additionalProperties":false},"hero":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"accent":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"body":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"visualCaption":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"trustLabel":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"fields":{"type":"array","items":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}}},"required":["eyebrow","title","accent","body","visualCaption","trustLabel","fields"],"additionalProperties":false},"capabilities":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"items":{"minItems":1,"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"icon":{"type":"string"},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"detail":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["id","icon","title","description","detail"],"additionalProperties":false}}},"required":["eyebrow","title","items"],"additionalProperties":false},"industries":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"items":{"minItems":1,"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"icon":{"type":"string"},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"detail":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"image":{"anyOf":[{"type":"string","pattern":"^(\\/images\\/[\\w./-]+|https:\\/\\/[^\\s]+)$"},{"type":"string","const":""}]},"imageAlt":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"position":{"type":"string","pattern":"^\\d{1,3}% \\d{1,3}%$"}},"required":["id","icon","title","description","detail","image","imageAlt","position"],"additionalProperties":false}}},"required":["eyebrow","title","items"],"additionalProperties":false},"process":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"items":{"minItems":1,"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"icon":{"type":"string"},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"detail":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["id","icon","title","description","detail"],"additionalProperties":false}}},"required":["eyebrow","title","items"],"additionalProperties":false},"applications":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"note":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"items":{"minItems":1,"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"icon":{"type":"string"},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"detail":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"sector":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"outcomes":{"type":"array","items":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}}},"required":["id","icon","title","description","detail","sector","outcomes"],"additionalProperties":false}}},"required":["eyebrow","title","note","items"],"additionalProperties":false},"caseStudies":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["eyebrow","title"],"additionalProperties":false},"why":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"items":{"minItems":1,"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"icon":{"type":"string"},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"detail":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["id","icon","title","description","detail"],"additionalProperties":false}}},"required":["eyebrow","title","items"],"additionalProperties":false},"ecosystem":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"items":{"minItems":1,"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"icon":{"type":"string"},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"detail":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["id","icon","title","description","detail"],"additionalProperties":false}}},"required":["eyebrow","title","items"],"additionalProperties":false},"partners":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["eyebrow","title"],"additionalProperties":false},"contact":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"accent":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"body":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"note":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["eyebrow","title","accent","body","note"],"additionalProperties":false},"insights":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"items":{"minItems":1,"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"icon":{"type":"string"},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"detail":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["id","icon","title","description","detail"],"additionalProperties":false}}},"required":["eyebrow","title","items"],"additionalProperties":false},"privacy":{"type":"object","properties":{"eyebrow":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"description":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"body":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["eyebrow","title","body"],"additionalProperties":false},"ui":{"type":"object","properties":{"consultation":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"capabilities":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"learnMore":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"explore":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"viewAll":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"menu":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"close":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"next":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"previous":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"slide":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"scroll":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"contact":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"email":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"line":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"privacy":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"insights":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"back":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"details":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"skip":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"language":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"ready":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"linkedin":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"website":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["consultation","capabilities","learnMore","explore","viewAll","menu","close","next","previous","slide","scroll","contact","email","line","privacy","insights","back","details","skip","language","ready","linkedin","website"],"additionalProperties":false}},"required":["site","hero","capabilities","industries","process","applications","caseStudies","why","ecosystem","partners","contact","insights","privacy","ui"],"additionalProperties":false},"case_studies":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"slug":{"type":"string","pattern":"^[a-z0-9]+(-[a-z0-9]+)*$"},"title":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"summary":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"sector":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"body":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false},"metrics":{"type":"array","items":{"type":"object","properties":{"value":{"type":"string"},"label":{"type":"object","properties":{"th":{"type":"string","minLength":1},"en":{"type":"string","minLength":1}},"required":["th","en"],"additionalProperties":false}},"required":["value","label"],"additionalProperties":false}}},"required":["id","slug","title","summary","sector","body","metrics"],"additionalProperties":false}},"partners":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"name":{"type":"string","minLength":1},"logo_url":{"type":"string","pattern":"^(\\/images\\/[\\w./-]+|https:\\/\\/[^\\s]+)$"},"website_url":{"type":"string","pattern":"^https:\\/\\/[^\\s]+$"}},"required":["id","name","logo_url","website_url"],"additionalProperties":false}}},"required":["content","case_studies","partners"],"additionalProperties":false}$schema$::json;
$function$;
revoke all on function public.cms_document_schema() from public, anon, authenticated;
-- END GENERATED CONTENT SCHEMA

create function public.cms_validate_document(p_document jsonb) returns void
language plpgsql set search_path = '' as $$
declare section jsonb;
begin
  if p_document is null or octet_length(p_document::text) > 2097152 then
    raise exception 'CMS document must be present and smaller than 2 MiB' using errcode = '23514';
  end if;
  if not extensions.jsonb_matches_schema(public.cms_document_schema(), p_document) then
    raise exception 'CMS document does not match the required bilingual content schema' using errcode = '23514';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_document->'case_studies') x
    group by x->>'id' having count(*) > 1
  ) or exists (
    select 1 from jsonb_array_elements(p_document->'case_studies') x
    group by x->>'slug' having count(*) > 1
  ) or exists (
    select 1 from jsonb_array_elements(p_document->'partners') x
    group by x->>'id' having count(*) > 1
  ) then
    raise exception 'Case-study IDs and slugs, and partner IDs must be unique' using errcode = '23514';
  end if;
  for section in select value from jsonb_each(p_document->'content') loop
    if section ? 'items' and exists (
      select 1 from jsonb_array_elements(section->'items') x
      group by x->>'id' having count(*) > 1
    ) then
      raise exception 'Card IDs must be unique within each section' using errcode = '23514';
    end if;
  end loop;
end;
$$;
revoke all on function public.cms_validate_document(jsonb) from public, anon, authenticated;

-- Stable IDs survive reordering and changes to a case-study slug.
create or replace function public.get_site_content() returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'content', coalesce((select jsonb_object_agg(key, data) from public.website_content where status = 'published'), '{}'::jsonb),
    'case_studies', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'slug', slug, 'title', title, 'summary', summary, 'sector', sector, 'body', body, 'metrics', metrics) order by sort_order, slug) from public.case_studies where status = 'published'), '[]'::jsonb),
    'partners', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'name', name, 'logo_url', logo_url, 'website_url', website_url) order by sort_order, name) from public.partners where status = 'published'), '[]'::jsonb)
  );
$$;

create table public.cms_workspace (
  id text primary key check (id = 'main'),
  document jsonb not null check (jsonb_typeof(document) = 'object'),
  revision bigint not null default 0 check (revision >= 0),
  published_revision bigint not null default 0 check (published_revision >= 0 and published_revision <= revision),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.cms_revisions (
  revision bigint primary key check (revision >= 0),
  document jsonb not null,
  saved_at timestamptz not null default now(),
  saved_by uuid
);

create table public.cms_publications (
  id uuid primary key default gen_random_uuid(),
  revision bigint not null references public.cms_revisions(revision),
  published_at timestamptz not null default now(),
  published_by uuid
);

alter table public.cms_admins enable row level security;
alter table public.cms_workspace enable row level security;
alter table public.cms_revisions enable row level security;
alter table public.cms_publications enable row level security;
revoke all on public.cms_admins, public.cms_workspace, public.cms_revisions, public.cms_publications from public, anon, authenticated;
grant select on public.cms_admins, public.cms_workspace, public.cms_revisions, public.cms_publications to service_role;
grant insert, update on public.cms_admins to service_role;

-- The draft starts from the published source after the editorial seed migration.
do $$
declare initial_document jsonb := public.get_site_content();
begin
  perform public.cms_validate_document(initial_document);
  insert into public.cms_workspace (id, document) values ('main', initial_document);
  insert into public.cms_revisions (revision, document) values (0, initial_document);
  insert into public.cms_publications (revision) values (0);
end;
$$;

create function public.cms_get_workspace() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare workspace public.cms_workspace%rowtype;
begin
  if not public.is_cms_admin() then
    raise exception 'CMS administrator access required' using errcode = '42501';
  end if;
  select * into strict workspace from public.cms_workspace where id = 'main';
  return jsonb_build_object('document', workspace.document, 'revision', workspace.revision,
    'published_revision', workspace.published_revision, 'updated_at', workspace.updated_at);
end;
$$;

create function public.cms_save_draft(p_document jsonb, p_expected_revision bigint) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare workspace public.cms_workspace%rowtype;
begin
  if not public.is_cms_admin() then
    raise exception 'CMS administrator access required' using errcode = '42501';
  end if;
  select * into strict workspace from public.cms_workspace where id = 'main' for update;
  if p_expected_revision is null or workspace.revision <> p_expected_revision then
    raise exception 'Draft changed in another session; reload before saving' using errcode = '40001';
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

create function public.cms_publish(p_expected_revision bigint) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare workspace public.cms_workspace%rowtype;
begin
  if not public.is_cms_admin() then
    raise exception 'CMS administrator access required' using errcode = '42501';
  end if;
  select * into strict workspace from public.cms_workspace where id = 'main' for update;
  if p_expected_revision is null or workspace.revision <> p_expected_revision then
    raise exception 'Draft changed in another session; reload before publishing' using errcode = '40001';
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
    insert into public.partners (id, name, logo_url, website_url, status, sort_order)
      select (entry->>'id')::uuid, entry->>'name', entry->>'logo_url', entry->>'website_url',
        'published', (ordinal - 1)::integer
      from jsonb_array_elements(workspace.document->'partners') with ordinality as entries(entry, ordinal)
      on conflict (id) do update set name = excluded.name, logo_url = excluded.logo_url,
        website_url = excluded.website_url, status = 'published', sort_order = excluded.sort_order;

    insert into public.cms_publications (revision, published_by) values (workspace.revision, auth.uid());
    update public.cms_workspace set published_revision = revision, updated_at = now(), updated_by = auth.uid()
      where id = 'main' returning * into workspace;
  end if;
  return jsonb_build_object('document', workspace.document, 'revision', workspace.revision,
    'published_revision', workspace.published_revision, 'updated_at', workspace.updated_at);
end;
$$;

create function public.cms_list_revisions() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_cms_admin() then
    raise exception 'CMS administrator access required' using errcode = '42501';
  end if;
  return coalesce((select jsonb_agg(jsonb_build_object('revision', r.revision,
      'saved_at', r.saved_at, 'saved_by', r.saved_by,
      'published_at', (select max(p.published_at) from public.cms_publications p where p.revision = r.revision))
      order by r.revision desc)
    from (select revision, saved_at, saved_by from public.cms_revisions order by revision desc limit 100) r), '[]'::jsonb);
end;
$$;

revoke all on function public.cms_get_workspace(), public.cms_save_draft(jsonb, bigint), public.cms_publish(bigint), public.cms_list_revisions() from public, anon, authenticated;
grant execute on function public.cms_get_workspace(), public.cms_save_draft(jsonb, bigint), public.cms_publish(bigint), public.cms_list_revisions() to authenticated;

-- Public images have immutable object URLs: new upload, never overwrite/delete.
-- Bucket MIME and size checks are also enforced by the Storage service.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cms-media', 'cms-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "CMS admins upload new images" on storage.objects for insert to authenticated
with check (bucket_id = 'cms-media' and public.is_cms_admin()
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp'));
create policy "CMS admins inspect images" on storage.objects for select to authenticated
using (bucket_id = 'cms-media' and public.is_cms_admin());

comment on table public.cms_admins is 'Owner-managed allowlist; matched only against the signed-in confirmed auth.users email. No public or CMS write grants.';
comment on table public.cms_workspace is 'Private singleton draft; mutation only through authenticated, allowlisted, revision-checked RPCs.';
comment on table public.cms_revisions is 'Immutable draft snapshots for audit and operator recovery. Browser roles cannot update or delete.';
comment on table public.cms_publications is 'Immutable audit of atomic published revisions.';
