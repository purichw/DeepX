import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { siteSchema } from "../src/content.ts";
import { canonicalUrl, escapeHtml, seoHead } from "../scripts/seo.ts";

const fixture = () =>
  siteSchema.parse({
    content: JSON.parse(
      readFileSync(
        new URL("../supabase/content/initial-content.json", import.meta.url),
        "utf8",
      ),
    ),
    partners: [],
    case_studies: [],
  });

test("SEO uses published editorial values and canonical deployment identity", () => {
  const data = fixture();
  data.content.site.name = "CMS brand";
  data.content.site.title.en = "Edited CMS title";
  data.content.site.description.en = "Edited CMS description";
  data.content.site.defaultLocale = "en";
  data.content.site.website = "https://contact.example.com";
  data.content.hero.videoPoster = "/images/poster.webp";
  const head = seoHead(data);
  assert.ok(head.includes(`rel="canonical" href="${canonicalUrl}"`));
  assert.ok(head.includes('property="og:title" content="Edited CMS title"'));
  assert.ok(head.includes('property="og:locale" content="en_US"'));
  assert.ok(
    head.includes('content="https://deepxworks.com/images/poster.webp"'),
  );
  assert.ok(!head.includes("contact.example.com"));
  const json = head.match(
    /<script type="application\/ld\+json">(.*?)<\/script>/s,
  )![1];
  const graph = JSON.parse(json)["@graph"];
  assert.equal(canonicalUrl, "https://deepxworks.com/");
  assert.equal(graph[0].url, canonicalUrl);
  assert.equal(graph[1].url, canonicalUrl);
  assert.ok(!head.includes("https://deepxsolution.com"));
  assert.equal(graph[0].name, "CMS brand");
  assert.equal(graph[1].inLanguage, "en");
  assert.equal(graph[1].publisher["@id"], graph[0]["@id"]);
});

test("cleared optional fields stay absent from social and structured metadata", () => {
  const data = fixture();
  data.content.site.email = "";
  data.content.site.linkedin = "";
  data.content.hero.videoPoster = "";
  const head = seoHead(data);
  assert.ok(!head.includes('"email":'));
  assert.ok(!head.includes('"sameAs":'));
  assert.ok(!head.includes('property="og:image"'));
  assert.ok(!head.includes('name="twitter:image"'));
  assert.ok(head.includes('name="twitter:card" content="summary"'));
});

test("CMS strings cannot escape HTML metadata or the structured-data script", () => {
  const data = fixture();
  const value = '</script><script>alert("cms")</script>&';
  data.content.site.description.th = value;
  data.content.site.name = value;
  const head = seoHead(data);
  assert.ok(!head.includes(value));
  assert.equal((head.match(/<script/g) || []).length, 1);
  assert.equal((head.match(/<\/script>/g) || []).length, 1);
  assert.ok(head.includes(`name="description" content="${escapeHtml(value)}"`));
  const json = head.match(
    /<script type="application\/ld\+json">(.*?)<\/script>/s,
  )![1];
  assert.equal(JSON.parse(json)["@graph"][0].description, value);
});

test("crawler files expose only the canonical public route; admin can be crawled for noindex", () => {
  const sitemap = readFileSync(
    new URL("../public/sitemap.xml", import.meta.url),
    "utf8",
  );
  const robots = readFileSync(
    new URL("../public/robots.txt", import.meta.url),
    "utf8",
  );
  const vercel = JSON.parse(
    readFileSync(new URL("../vercel.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(
    [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]),
    [canonicalUrl],
  );
  assert.ok(robots.includes(`Sitemap: ${canonicalUrl}sitemap.xml`));
  assert.ok(!robots.includes("Disallow:"));
  const admin = vercel.headers.find(
    (rule: { source: string }) => rule.source === "/admin/:path*",
  );
  assert.ok(
    admin.headers.some(
      (header: { key: string; value: string }) =>
        header.key === "X-Robots-Tag" && header.value.includes("noindex"),
    ),
  );
  assert.ok(
    !vercel.headers
      .find((rule: { source: string }) => rule.source === "/(.*)")
      .headers.some((header: { key: string }) => header.key === "X-Robots-Tag"),
  );
});
