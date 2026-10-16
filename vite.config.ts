import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";
import { escapeHtml, seoHead } from "./scripts/seo.ts";

export default defineConfig(({ command, mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  const fixture = env.VITE_LOCAL_CONTENT_PREVIEW === "1";
  if (command === "build" && fixture)
    throw new Error("A local content fixture must never be deployed.");
  return {
    plugins: [
      react(),
      {
        name: "deepx-content",
        configureServer(server) {
          if (!fixture) return;
          server.middlewares.use("/__preview-content", async (_req, res) => {
            const content = JSON.parse(
              await readFile("supabase/content/initial-content.json", "utf8"),
            );
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ content, case_studies: [], partners: [] }),
            );
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
          const site = data.content.site;
          const locale = site.defaultLocale;
          return html
            .replace('<html lang="th">', `<html lang="${locale}">`)
            .replace(
              "<title>Loading</title>",
              `<title>${escapeHtml(site.title[locale])}</title>`,
            )
            .replace("</head>", `${seoHead(data)}\n</head>`);
        },
      },
    ],
    build: { target: "es2022" },
  };
});
