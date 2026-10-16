import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { siteSchema } from "../src/content.ts";

const content = JSON.parse(
  await readFile(
    new URL("../supabase/content/initial-content.json", import.meta.url),
    "utf8",
  ),
);
const initial = { content, case_studies: [], partners: [] };

test("initial CMS content is bilingual and complete", () => {
  const data = siteSchema.parse(initial);
  assert.equal(data.content.site.defaultLocale, "th");
  assert.equal(data.content.site.email, "DeepX@deepxtech.com");
  assert.equal(data.case_studies.length, 0);
  assert.equal(data.partners.length, 0);
});
test("CMS links cannot introduce executable URLs", () => {
  const data = structuredClone(initial);
  data.content.site.navigation[0].href = "javascript:alert(1)";
  assert.equal(siteSchema.safeParse(data).success, false);
});
test("a missing published section is rejected instead of producing a broken page", () => {
  const data = structuredClone(initial);
  delete data.content.contact;
  assert.equal(siteSchema.safeParse(data).success, false);
});
test("empty translations are rejected before rendering", () => {
  const data = structuredClone(initial);
  data.content.hero.title.th = "";
  assert.equal(siteSchema.safeParse(data).success, false);
});
