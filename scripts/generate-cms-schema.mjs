import { readdir, writeFile } from "node:fs/promises";
import { z } from "zod";
import { siteSchema } from "../src/content.ts";
import { checkCmsSchema } from "./check-cms-schema.mjs";

// Applied migrations are immutable. Every contract change gets an explicitly
// named, new forward migration; this command never overwrites an existing file.
if (process.argv.includes("--check")) {
  await checkCmsSchema();
} else {
  const targetIndex = process.argv.indexOf("--target");
  const name = targetIndex < 0 ? undefined : process.argv[targetIndex + 1];
  if (!name || !/^\d{14}_[a-z0-9_]+\.sql$/.test(name)) {
    throw new Error("Provide --target YYYYMMDDHHMMSS_cms_schema.sql, or use --check (read-only).");
  }
  const directory = new URL("../supabase/migrations/", import.meta.url);
  const migrations = (await readdir(directory)).filter((file) => /^\d{14}_.*\.sql$/.test(file)).sort();
  if (migrations.length && name.slice(0, 14) <= migrations.at(-1).slice(0, 14)) {
    throw new Error("The new migration timestamp must be later than every existing migration.");
  }
  const schema = JSON.stringify(z.toJSONSchema(siteSchema, { target: "draft-7" }));
  const output = `-- Forward validation-contract migration. Existing drafts and published data are preserved.\n-- Generated from src/content.ts; apply through the normal migration review.\n-- BEGIN GENERATED CONTENT SCHEMA\ncreate or replace function public.cms_document_schema() returns json\nlanguage sql immutable set search_path = '' as $function$\n  select $schema$${schema}$schema$::json;\n$function$;\nrevoke all on function public.cms_document_schema() from public, anon, authenticated;\n-- END GENERATED CONTENT SCHEMA\n`;
  await writeFile(new URL(name, directory), output, { flag: "wx" });
  console.log(`Created ${name} with the current draft-7 validation contract.`);
}
