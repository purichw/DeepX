import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";
import { escapeHtml, seoHead } from "./scripts/seo.ts";
import { studioSeoHead, studioStaticBody } from "./scripts/studio-seo.ts";
import type { SiteData } from "./src/content.ts";

export default defineConfig(({ command, mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  const fixture = env.VITE_LOCAL_CONTENT_PREVIEW === "1";
  let published: SiteData | undefined;
  if (command === "build" && fixture)
    throw new Error("A local content fixture must never be deployed.");
  return {
    plugins: [
      react(),
      {
        name: "deepx-content",
        // Vite emits index.html before post plugins generate derived route HTML.
        enforce: "post",
        configureServer(server) {
          if (!fixture) return;
          server.middlewares.use("/__preview-content", async (_req, res) => {
            const content = JSON.parse(
              await readFile("supabase/content/initial-content.json", "utf8"),
            );
            const studio = JSON.parse(
              await readFile("supabase/content/studio-initial.json", "utf8"),
            );
            let data = { content, case_studies: [], partners: [] };
            try {
              data = JSON.parse(
                await readFile("artifacts/studio/public-before.json", "utf8"),
              );
            } catch {
              /* Optional local QA snapshot, never used in a production build. */
            }
            data.content.studio = studio;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
          });
        },
        async transformIndexHtml(html) {
          if (command !== "build") return html;
          const url = env.VITE_SUPABASE_URL;
          const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
          if (!url || !key)
            throw new Error(
              "Supabase configuration is required for production metadata.",
            );
          const response = await fetch(`${url}/rest/v1/rpc/get_site_content`, {
            headers: { apikey: key },
            signal: AbortSignal.timeout(10000),
          });
          if (!response.ok)
            throw new Error(
              `Production content is unavailable: ${response.status}`,
            );
          const { siteSchema } = await import("./src/content.ts");
          const data = siteSchema.parse(await response.json());
          published = data;
          const site = data.content.site;
          const locale = site.defaultLocale;
          return html
            .replace('<html lang="th">', `<html lang="${locale}">`)
            .replace(
              "<title>Loading</title>",
              `<title>${escapeHtml(site.title[locale])}</title>`,
            )
            .replace(
              "</head>",
              `<!-- cms-seo-start -->${seoHead(data)}<!-- cms-seo-end -->\n</head>`,
            );
        },
        generateBundle(_options, bundle) {
          const index = bundle["index.html"];
          if (!published || !index || index.type !== "asset")
            throw new Error("Missing published content or HTML output.");
          const studio = published.content.studio;
          if (!studio)
            throw new Error(
              "Publish Product Studio content before deploying this build.",
            );
          const html = String(index.source)
            .replace(
              /<title>.*?<\/title>/s,
              `<title>${escapeHtml(studio.page.title[published.content.site.defaultLocale])}</title>`,
            )
            .replace(
              /<!-- cms-seo-start -->.*?<!-- cms-seo-end -->/s,
              studioSeoHead(published),
            )
            .replace(
              '<div id="root"></div>',
              `<div id="root">${studioStaticBody(published)}</div>`,
            )
            .replace(/<noscript[\s\S]*?<\/noscript>/, "")
            .replace('content="#00121e"', 'content="#f1faff"')
            .replace(
              "</head>",
              "<style>.studio-static{background:#f4fbff;color:#12354b;padding:40px max(24px,calc((100vw - 1000px)/2));font:16px/1.8 sans-serif}.studio-static img{max-width:100%;height:auto}.studio-static section{margin-block:40px}.studio-static a{color:#006e9c}.studio-static h1{font-size:36px}.studio-static article{margin-block:22px}</style></head>",
            );
          this.emitFile({
            type: "asset",
            fileName: "studio/index.html",
            source: html,
          });
        },
      },
    ],
    build: { target: "es2022" },
  };
});
