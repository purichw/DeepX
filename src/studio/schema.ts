import { z } from "zod";

const text = z.object({ th: z.string().min(1), en: z.string().min(1) });
const image = z.string().regex(/^(\/images\/[\w./-]+|https:\/\/[^\s]+|)$/);
const link = z
  .string()
  .regex(
    /^(https:\/\/[^\s]+|mailto:[^\s]+|\/(?:studio)?(?:#[a-z][\w-]*)?|#[a-z][\w-]*)$/,
  );
const nav = z.object({ label: text, href: link });
const heading = z.object({
  eyebrow: text,
  title: text,
  accent: text,
  description: text,
});
const media = { image, imageAlt: text };
const item = z.object({
  id: z.string().min(1),
  icon: z.string(),
  title: text,
  description: text,
  detail: text,
});
export const studioCategories = [
  "web",
  "mobile",
  "game",
  "food",
  "business",
  "internal",
] as const;
export const studioSchema = z.object({
  page: z.object({
    name: z.string().min(1),
    unit: z.string().min(1),
    title: text,
    description: text,
    navigation: z.array(nav),
    aiLabel: text,
    copyright: text,
  }),
  hero: heading.extend({
    closing: text,
    ...media,
    metrics: z.array(
      z.object({
        id: z.string().min(1),
        value: z.string().min(1),
        label: text,
        verified: z.boolean(),
      }),
    ),
  }),
  ecosystem: z.object({ enabled: z.boolean(), label: text, note: text }),
  portfolio: heading.extend({
    enabled: z.boolean(),
    note: text,
    filters: z.object({
      all: text,
      web: text,
      mobile: text,
      game: text,
      food: text,
      business: text,
      internal: text,
    }),
    projects: z.array(
      z.object({
        id: z.string().min(1),
        title: text,
        description: text,
        detail: text,
        ...media,
        position: z.string().regex(/^(?:100|[0-9]{1,2})% (?:100|[0-9]{1,2})%$/),
        category: z.enum(studioCategories),
        status: z.enum(["concept", "prototype", "delivered"]),
        website: z.union([
          z
            .string()
            .url()
            .regex(/^https:\/\//),
          z.literal(""),
        ]),
      }),
    ),
  }),
  services: heading.extend({ enabled: z.boolean(), items: z.array(item) }),
  process: heading.extend({
    enabled: z.boolean(),
    ...media,
    items: z.array(item.extend(media)),
  }),
  why: heading.extend({
    enabled: z.boolean(),
    items: z.array(item),
    focusTitle: text,
    focusBody: text,
    ...media,
  }),
  ai: heading.extend({
    enabled: z.boolean(),
    ...media,
    items: z.array(item),
    ctaLabel: text,
    href: link,
  }),
  testimonials: heading.extend({
    enabled: z.boolean(),
    quotes: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        role: text,
        quote: text,
        image,
        approved: z.boolean(),
      }),
    ),
  }),
  contact: heading.extend({ body: text, ...media }),
  footer: z.object({
    description: text,
    groups: z.array(
      z.object({ id: z.string().min(1), title: text, links: z.array(nav) }),
    ),
  }),
  ui: z.object({
    consultation: text,
    work: text,
    learnMore: text,
    line: text,
    concept: text,
    prototype: text,
    delivered: text,
    projectLink: text,
    menu: text,
    close: text,
    skip: text,
    language: text,
    previous: text,
    next: text,
    services: text,
    email: text,
    linkedin: text,
    privacy: text,
    contactTitle: text,
    contactNote: text,
    noContact: text,
    filterCount: text,
  }),
});

export type StudioContent = z.infer<typeof studioSchema>;
export type StudioProject = StudioContent["portfolio"]["projects"][number];

/** Stable identities must remain unique before any RPC is sent. SQL checks too. */
export function studioIdentityErrors(studio: StudioContent): string[] {
  const collections = {
    metrics: studio.hero.metrics,
    projects: studio.portfolio.projects,
    services: studio.services.items,
    process: studio.process.items,
    why: studio.why.items,
    ai: studio.ai.items,
    quotes: studio.testimonials.quotes,
    groups: studio.footer.groups,
  };
  return Object.entries(collections).flatMap(([name, items]) =>
    new Set(items.map((item) => item.id)).size === items.length ? [] : [name],
  );
}
