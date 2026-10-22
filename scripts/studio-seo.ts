import type { SiteData } from "../src/content.ts";
import { canonicalUrl, escapeHtml } from "./seo.ts";
export const studioUrl = `${canonicalUrl}studio`;

export function studioSeoHead(data: SiteData) {
  const s = data.content.studio;
  if (!s)
    throw new Error("Publish Product Studio content before building /studio.");
  const locale = data.content.site.defaultLocale;
  const title = s.page.title[locale],
    description = s.page.description[locale];
  const image = s.hero.image
    ? new URL(s.hero.image, canonicalUrl).href
    : undefined;
  const meta = (attr: string, key: string, value: string) =>
    `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${studioUrl}#webpage`,
        url: studioUrl,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { "@id": `${canonicalUrl}#website` },
        about: { "@id": `${studioUrl}#service` },
        ...(image
          ? { primaryImageOfPage: { "@type": "ImageObject", url: image } }
          : {}),
      },
      {
        "@type": "Service",
        "@id": `${studioUrl}#service`,
        name: `${s.page.name} ${s.page.unit}`,
        description,
        url: studioUrl,
        provider: {
          "@type": "Organization",
          "@id": `${canonicalUrl}#organization`,
          name: data.content.site.name,
          url: canonicalUrl,
        },
        ...(s.services.enabled && s.services.items.length
          ? {
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: s.services.title[locale],
                itemListElement: s.services.items.map((item) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: item.title[locale],
                    description: item.description[locale],
                  },
                })),
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: data.content.site.name,
            item: canonicalUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: s.page.unit,
            item: studioUrl,
          },
        ],
      },
    ],
  };
  return [
    `<link rel="canonical" href="${studioUrl}" />`,
    meta("name", "description", description),
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    meta("property", "og:type", "website"),
    meta("property", "og:url", studioUrl),
    meta("property", "og:site_name", `${s.page.name} ${s.page.unit}`),
    meta("property", "og:locale", locale === "th" ? "th_TH" : "en_US"),
    meta("name", "twitter:card", image ? "summary_large_image" : "summary"),
    meta("name", "twitter:title", title),
    meta("name", "twitter:description", description),
    ...(image
      ? [
          meta("property", "og:image", image),
          meta("property", "og:image:alt", s.hero.imageAlt[locale]),
          meta("name", "twitter:image", image),
        ]
      : []),
    `<script type="application/ld+json">${JSON.stringify(graph).replaceAll("<", "\\u003c")}</script>`,
  ].join("\n");
}

/** Readable initial HTML for every visitor and crawler; React replaces it once live CMS data arrives. */
export function studioStaticBody(data: SiteData) {
  const s = data.content.studio;
  if (!s) throw new Error("Product Studio content is required.");
  const locale = data.content.site.defaultLocale;
  const text = (v: { th: string; en: string }) => escapeHtml(v[locale]);
  const section = (
    id: string,
    v: {
      title: { th: string; en: string };
      accent: { th: string; en: string };
      description: { th: string; en: string };
    },
  ) =>
    `<section id="${id}"><h2>${text(v.title)} ${text(v.accent)}</h2><p>${text(v.description)}</p>`;
  const items = (
    list: Array<{
      title: { th: string; en: string };
      description: { th: string; en: string };
      detail: { th: string; en: string };
    }>,
  ) =>
    list
      .map(
        (i) =>
          `<article><h3>${text(i.title)}</h3><p>${text(i.description)}</p><p>${text(i.detail)}</p></article>`,
      )
      .join("");
  return `<div class="studio-static"><header><a href="${canonicalUrl}">${escapeHtml(s.page.name)}</a> / ${escapeHtml(s.page.unit)}</header><main><p>${text(s.hero.eyebrow)}</p><h1>${text(s.hero.title)} ${text(s.hero.accent)} ${text(s.hero.closing)}</h1><p>${text(s.hero.description)}</p>${s.hero.image ? `<img src="${escapeHtml(s.hero.image)}" alt="${text(s.hero.imageAlt)}" width="960" height="720" />` : ""}
  ${s.portfolio.enabled && s.portfolio.projects.length ? section("studio-work", s.portfolio) + `<p>${text(s.portfolio.note)}</p>` + s.portfolio.projects.map((p) => `<article><h3>${text(p.title)}</h3><p>${text(s.ui[p.status])} · ${text(s.portfolio.filters[p.category])}</p><p>${text(p.description)}</p><p>${text(p.detail)}</p></article>`).join("") + "</section>" : ""}
  ${s.services.enabled && s.services.items.length ? section("studio-services", s.services) + items(s.services.items) + "</section>" : ""}
  ${s.process.enabled && s.process.items.length ? section("studio-process", s.process) + items(s.process.items) + "</section>" : ""}
  ${s.why.enabled ? section("studio-about", s.why) + items(s.why.items) + `<h3>${text(s.why.focusTitle)}</h3><p>${text(s.why.focusBody)}</p></section>` : ""}
  ${s.ai.enabled ? section("studio-ai", s.ai) + items(s.ai.items) + `<a href="${escapeHtml(s.ai.href)}">${text(s.ai.ctaLabel)}</a></section>` : ""}
  ${
    s.testimonials.enabled
      ? s.testimonials.quotes
          .filter((q) => q.approved)
          .map(
            (q) =>
              `<figure><blockquote>${text(q.quote)}</blockquote><figcaption>${escapeHtml(q.name)} — ${text(q.role)}</figcaption></figure>`,
          )
          .join("")
      : ""
  }
  ${section("studio-contact", s.contact)}<p>${text(s.contact.body)}</p>${data.content.site.email ? `<a href="mailto:${escapeHtml(data.content.site.email)}">${text(s.ui.email)}</a>` : ""}${data.content.site.lineUrl ? `<a href="${escapeHtml(data.content.site.lineUrl)}">${text(s.ui.line)}</a>` : ""}</section></main><footer><p>${text(s.footer.description)}</p>${s.footer.groups.map((g) => `<nav aria-label="${text(g.title)}">${g.links.map((n) => `<a href="${escapeHtml(n.href)}">${text(n.label)}</a>`).join(" · ")}</nav>`).join("")}<p>${text(s.page.copyright)}</p></footer></div>`;
}
