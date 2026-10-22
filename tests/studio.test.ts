import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { siteSchema } from "../src/content.ts";
import { studioSchema, studioIdentityErrors } from "../src/studio/schema.ts";
import {
  studioSeoHead,
  studioStaticBody,
  studioUrl,
} from "../scripts/studio-seo.ts";
import { getAt, setAt, sectionPath, newArrayItem } from "../src/cms/model.ts";
const initial = () =>
  studioSchema.parse(
    JSON.parse(
      readFileSync(
        new URL("../supabase/content/studio-initial.json", import.meta.url),
        "utf8",
      ),
    ),
  );
const fixture = () =>
  siteSchema.parse({
    content: {
      ...JSON.parse(
        readFileSync(
          new URL("../supabase/content/initial-content.json", import.meta.url),
          "utf8",
        ),
      ),
      studio: initial(),
    },
    case_studies: [],
    partners: [],
  });
test("six concepts have unique identities; unverified social proof stays absent", () => {
  const s = initial();
  assert.equal(s.portfolio.projects.length, 6);
  assert.equal(new Set(s.portfolio.projects.map((p) => p.category)).size, 6);
  assert.ok(
    s.portfolio.projects.every((p) => p.status === "concept" && !p.website),
  );
  assert.equal(s.hero.metrics.length, 0);
  assert.equal(s.testimonials.enabled, false);
  assert.deepEqual(studioIdentityErrors(s), []);
  s.portfolio.projects.push(s.portfolio.projects[0]);
  assert.deepEqual(studioIdentityErrors(s), ["projects"]);
});
test("CMS Studio edits preserve homepage and explicit empty arrays/media", () => {
  const d = fixture();
  const before = JSON.stringify(d.content.hero);
  const path = sectionPath("studio.services");
  const updated = setAt(d, [...path, "items"], []);
  assert.deepEqual(getAt(updated, path), {
    ...d.content.studio!.services,
    items: [],
  });
  assert.equal(JSON.stringify(updated.content.hero), before);
  assert.ok(siteSchema.safeParse(updated).success);
  updated.content.studio!.hero.image = "";
  updated.content.studio!.ai.enabled = false;
  assert.ok(siteSchema.safeParse(updated).success);
  assert.equal(d.content.studio!.services.items.length, 6);
});
test("new CMS records are safe concepts and require complete translations", () => {
  const a = newArrayItem([
    "content",
    "studio",
    "portfolio",
    "projects",
  ]) as Record<string, unknown>;
  const b = newArrayItem([
    "content",
    "studio",
    "portfolio",
    "projects",
  ]) as Record<string, unknown>;
  assert.notEqual(a.id, b.id);
  assert.equal(a.status, "concept");
  assert.equal(a.website, "");
  const s = initial();
  s.portfolio.projects.push(a as never);
  assert.equal(studioSchema.safeParse(s).success, false);
  assert.equal(
    (
      newArrayItem(["content", "studio", "testimonials", "quotes"]) as Record<
        string,
        unknown
      >
    ).approved,
    false,
  );
});
test("Studio has independent canonical, crawlable content, no fabricated reviews", () => {
  const d = fixture();
  const head = studioSeoHead(d),
    body = studioStaticBody(d);
  assert.ok(head.includes(`rel="canonical" href="${studioUrl}"`));
  assert.ok(head.includes('"@type":"Service"'));
  assert.ok(!head.includes("AggregateRating"));
  assert.ok(body.includes(d.content.studio!.hero.title.th));
  assert.equal((body.match(/<h1>/g) || []).length, 1);
  assert.ok(body.includes("Cloudseed"));
  assert.ok(body.includes("Concept"));
  assert.ok(!body.includes("<blockquote>"));
  d.content.studio!.services.enabled = false;
  assert.ok(!studioStaticBody(d).includes('id="studio-services"'));
});
test("Studio metadata and crawlable body escape authored markup", () => {
  const d = fixture();
  const value = '</script><script>alert("cms")</script>&';
  d.content.studio!.page.description.th = value;
  d.content.studio!.hero.title.th = value;
  const head = studioSeoHead(d),
    body = studioStaticBody(d);
  assert.equal((head.match(/<script/g) || []).length, 1);
  assert.ok(!body.includes("<script>"));
  assert.ok(body.includes("&lt;/script&gt;"));
});
test("published Studio content is mandatory for a production route", () => {
  const d = fixture();
  delete d.content.studio;
  assert.throws(() => studioSeoHead(d), /Publish/);
  assert.throws(() => studioStaticBody(d), /required/);
});
