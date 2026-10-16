import type { SiteData } from "../src/content.ts";

// Deployment identity, separate from the editable website/contact link in the CMS.
export const canonicalUrl = "https://deepxsolution.com/";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** All editorial values come from the validated published CMS document. */
export function seoHead(data: SiteData) {
  const { site, hero } = data.content;
  const locale = site.defaultLocale;
  const title = site.title[locale];
  const description = site.description[locale];
  const image = hero.videoPoster
    ? new URL(hero.videoPoster, canonicalUrl).href
    : undefined;
  const organizationId = `${canonicalUrl}#organization`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: site.name,
        url: canonicalUrl,
        description,
        ...(site.email ? { email: site.email } : {}),
        ...(site.linkedin.startsWith("https://")
          ? { sameAs: [site.linkedin] }
          : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${canonicalUrl}#website`,
        url: canonicalUrl,
        name: site.name,
        description,
        inLanguage: locale,
        publisher: { "@id": organizationId },
      },
    ],
  };
  const meta = (attribute: "name" | "property", name: string, value: string) =>
    `<meta ${attribute}="${name}" content="${escapeHtml(value)}" />`;
  return [
    `<link rel="canonical" href="${canonicalUrl}" />`,
    meta("name", "description", description),
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    meta("property", "og:type", "website"),
    meta("property", "og:url", canonicalUrl),
    meta("property", "og:site_name", site.name),
    meta("property", "og:locale", locale === "th" ? "th_TH" : "en_US"),
    meta("name", "twitter:card", image ? "summary_large_image" : "summary"),
    meta("name", "twitter:title", title),
    meta("name", "twitter:description", description),
    ...(image
      ? [
          meta("property", "og:image", image),
          meta("property", "og:image:alt", site.name),
          meta("name", "twitter:image", image),
          meta("name", "twitter:image:alt", site.name),
        ]
      : []),
    // Escaping '<' prevents CMS text from terminating the script element.
    `<script type="application/ld+json">${JSON.stringify(structuredData).replaceAll("<", "\\u003c")}</script>`,
  ].join("\n");
}
