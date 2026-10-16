import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { siteSchema } from "../src/content.ts";

export async function checkCmsSchema() {
  const directory = new URL("../supabase/migrations/", import.meta.url);
  const migrations = (await readdir(directory)).filter((name) => /^\d{14}_.*\.sql$/.test(name)).sort().reverse();
  for (const name of migrations) {
    const source = await readFile(new URL(name, directory), "utf8");
    if (!/create (?:or replace )?function public\.cms_document_schema\(\)/i.test(source)) continue;
    const match = source.match(/\$schema\$([\s\S]*?)\$schema\$::json;/);
    if (!match) throw new Error(`Cannot read generated CMS schema from ${name}.`);
    const expected = z.toJSONSchema(siteSchema, { target: "draft-7" });
    if (!isDeepStrictEqual(JSON.parse(match[1]), expected)) {
      throw new Error(`${name} is out of sync with src/content.ts. Generate a new forward schema migration.`);
    }
    console.log(`CMS SQL schema matches the frontend contract (${name}).`);
    return;
  }
  throw new Error("No CMS validation-schema migration was found.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) await checkCmsSchema();
