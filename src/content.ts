import { z } from "zod";

export type Locale = "th" | "en";
const text = z.object({ th: z.string().min(1), en: z.string().min(1) });
const link = z
  .string()
  .regex(/^(https:\/\/[^\s]+|mailto:[^\s]+|#[a-z][\w-]*)$/, "Unsafe link");
const media = z
  .string()
  .regex(/^(\/images\/[\w./-]+|https:\/\/[^\s]+)$/, "Invalid image URL");
const video = z
  .string()
  .regex(/^(\/videos\/[\w./-]+\.mp4|https:\/\/[^\s]+)$/, "Invalid video URL");
const optionalLink = z.union([link, z.literal("")]);
const item = z.object({
  id: z.string(),
  icon: z.string(),
  title: text,
  description: text,
  detail: text,
});
const heading = z.object({
  eyebrow: text,
  title: text,
  description: text.optional(),
});
const caseStudy = z.object({
  id: z.string().uuid(),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  title: text,
  summary: text,
  sector: text,
  body: text,
  metrics: z.array(z.object({ value: z.string(), label: text })),
});
const partner = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  logo_url: media,
  website_url: z.string().regex(/^https:\/\/[^\s]+$/),
  surface: z.enum(["dark", "light"]).optional(),
});

export const siteSchema = z.object({
  content: z.object({
    site: z.object({
      name: z.string(),
      descriptor: z.string(),
      tagline: text,
      title: text,
      description: text,
      email: z.union([z.string().email(), z.literal("")]),
      line: z.string(),
      lineUrl: optionalLink,
      website: optionalLink,
      linkedin: optionalLink,
      defaultLocale: z.enum(["th", "en"]),
      navigation: z.array(z.object({ label: text, href: link })),
      footerText: text,
      copyright: text,
    }),
    hero: heading.extend({
      accent: text,
      body: text,
      visualCaption: text,
      trustLabel: text,
      fields: z.array(text),
      videoUrl: z.union([video, z.literal("")]).optional(),
      videoPoster: z.union([media, z.literal("")]).optional(),
    }),
    capabilities: heading.extend({ items: z.array(item).min(1) }),
    industries: heading.extend({
      items: z
        .array(
          item.extend({
            image: z.union([media, z.literal("")]),
            imageAlt: text,
            position: z.string().regex(/^\d{1,3}% \d{1,3}%$/),
          }),
        )
        .min(1),
    }),
    process: heading.extend({ items: z.array(item).min(1) }),
    applications: heading.extend({
      note: text,
      items: z
        .array(item.extend({ sector: text, outcomes: z.array(text) }))
        .min(1),
    }),
    caseStudies: heading,
    why: heading.extend({
      items: z
        .array(
          item.extend({
            description: z.object({ th: z.string(), en: z.string() }),
          }),
        )
        .min(1),
    }),
    ecosystem: heading.extend({ items: z.array(item).min(1) }),
    partners: heading,
    contact: heading.extend({ accent: text, body: text, note: text }),
    insights: heading.extend({ items: z.array(item).min(1) }),
    privacy: heading.extend({ body: text }),
    ui: z.object({
      consultation: text,
      capabilities: text,
      learnMore: text,
      explore: text,
      viewAll: text,
      menu: text,
      close: text,
      next: text,
      previous: text,
      slide: text,
      scroll: text,
      contact: text,
      email: text,
      line: text,
      privacy: text,
      insights: text,
      back: text,
      details: text,
      skip: text,
      language: text,
      ready: text,
      linkedin: text,
      website: text,
    }),
  }),
  case_studies: z.array(caseStudy),
  partners: z.array(partner),
});
export type SiteData = z.infer<typeof siteSchema>;
export type ContentItem = z.infer<typeof item>;
export type Heading = z.infer<typeof heading>;
export type Bilingual = z.infer<typeof text>;

export function translated(value: Bilingual, locale: Locale) {
  return value[locale];
}

// Content has a single production owner: published Supabase records.
// No embedded marketing fallback: an outage shows a retry screen instead of stale claims.
export async function loadSite(signal?: AbortSignal): Promise<SiteData> {
  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_LOCAL_CONTENT_PREVIEW === "1"
  ) {
    const response = await fetch("/__preview-content", { signal });
    return siteSchema.parse(await response.json());
  }
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase configuration");
  const timeout = AbortSignal.timeout(10000);
  const response = await fetch(`${url}/rest/v1/rpc/get_site_content`, {
    headers: { apikey: key, Accept: "application/json" },
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (!response.ok)
    throw new Error(`Content request failed: ${response.status}`);
  return siteSchema.parse(await response.json());
}
