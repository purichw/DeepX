import { readFile, writeFile } from "node:fs/promises";
import { studioSchema } from "../src/studio/schema.ts";

// One-time bootstrap only. Public runtime never imports this seed.
const studio = studioSchema.parse(
  JSON.parse(await readFile("supabase/content/studio-initial.json", "utf8")),
);
const base = await readFile(
  "supabase/migrations/20261016090200_cms.sql",
  "utf8",
);
let validate = base.slice(
  base.indexOf("create function public.cms_validate_document"),
  base.indexOf("revoke all on function public.cms_validate_document"),
);
validate = validate
  .replace("create function", "create or replace function")
  .replace(
    "declare section jsonb;",
    "declare section jsonb; collection jsonb;",
  );
validate = validate
  .replace(
    "end;\n$$;",
    () => `  if p_document->'content' ? 'studio' then
    for collection in select value from jsonb_build_array(
      p_document#>'{content,studio,hero,metrics}', p_document#>'{content,studio,portfolio,projects}',
      p_document#>'{content,studio,services,items}', p_document#>'{content,studio,process,items}',
      p_document#>'{content,studio,why,items}', p_document#>'{content,studio,ai,items}',
      p_document#>'{content,studio,testimonials,quotes}', p_document#>'{content,studio,footer,groups}'
    ) as collections(value) loop
      if exists (select 1 from jsonb_array_elements(collection) x group by x->>'id' having count(*) > 1) then
        raise exception 'Studio record IDs must be unique within each collection' using errcode = '23514';
      end if;
    end loop;
  end if;
end;
$$;`,
  )
  .replace(
    "from jsonb_build_array(",
    "from jsonb_array_elements(jsonb_build_array(",
  )
  .replace(") as collections(value) loop", ")) as collections(value) loop");
const rpc = await readFile(
  "supabase/migrations/20261016090600_revision_conflict_http.sql",
  "utf8",
);
let save = rpc.slice(
  rpc.indexOf("create or replace function public.cms_save_draft"),
  rpc.indexOf("create or replace function public.cms_publish"),
);
save = save.replace(
  "  perform public.cms_validate_document(p_document);",
  `  if workspace.document->'content' ? 'studio' and not coalesce(p_document->'content' ? 'studio', false) then
    raise exception 'This editor is outdated; reload to preserve Product Studio content' using errcode = 'PT409';
  end if;
  perform public.cms_validate_document(p_document);`,
);
const output = `-- Product Studio extends the existing draft, permissions and publication contract.
-- Preserves all existing DeepX content and pending edits; does not publish.
${validate}
${save}
do $bootstrap$
declare workspace public.cms_workspace%rowtype; next_document jsonb;
begin
  select * into strict workspace from public.cms_workspace where id = 'main' for update;
  if not (workspace.document->'content' ? 'studio') then
    next_document := jsonb_set(workspace.document, '{content,studio}', $studio$${JSON.stringify(studio)}$studio$::jsonb);
    perform public.cms_validate_document(next_document);
    update public.cms_workspace set document = next_document, revision = revision + 1,
      updated_at = now(), updated_by = null where id = 'main' returning * into workspace;
    insert into public.cms_revisions (revision, document, saved_by) values (workspace.revision, workspace.document, null);
  end if;
end;
$bootstrap$;
`;
await writeFile(
  "supabase/migrations/20261021090100_product_studio.sql",
  output,
  { flag: "wx" },
);
console.log(
  "Created Product Studio draft migration; public content remains unchanged.",
);
