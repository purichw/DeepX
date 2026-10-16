import assert from "node:assert/strict";
import test from "node:test";
import {
  getAt,
  newArrayItem,
  reservedField,
  sectionPath,
  setAt,
} from "./model.ts";

test("nested edits preserve the original document and unrelated content", () => {
  const original = {
    content: {
      site: { email: "contact@example.com" },
      hero: { title: { th: "เดิม", en: "Original" } },
    },
  };
  const next = setAt(original, ["content", "hero", "title", "th"], "ใหม่");
  assert.equal(getAt(next, ["content", "hero", "title", "th"]), "ใหม่");
  assert.equal(original.content.hero.title.th, "เดิม");
  assert.deepEqual(next.content.site, original.content.site);
});

test("clearing optional channels stays explicitly empty", () => {
  const next = setAt(
    { site: { email: "contact@example.com" } },
    ["site", "email"],
    "",
  );
  assert.equal(next.site.email, "");
});

test("new records have distinct stable IDs and no invented business claims", () => {
  const first = newArrayItem(["case_studies"]) as {
    id: string;
    title: { th: string; en: string };
    metrics: unknown[];
  };
  const second = newArrayItem(["case_studies"]) as typeof first;
  assert.notEqual(first.id, second.id);
  assert.match(first.id, /^[0-9a-f-]{36}$/);
  assert.deepEqual(first.title, { th: "", en: "" });
  assert.deepEqual(first.metrics, []);
});

test("collection paths and reserved fields do not hide supported controls", () => {
  assert.deepEqual(sectionPath("partner_records"), ["partners"]);
  assert.deepEqual(sectionPath("partners"), ["content", "partners"]);
  assert.equal(
    reservedField(["content", "industries", "items", 0, "icon"]),
    true,
  );
  assert.equal(
    reservedField(["content", "industries", "items", 0, "image"]),
    false,
  );
  assert.equal(
    reservedField(["content", "capabilities", "items", 0, "description"]),
    false,
  );
});
