// One-time seed authoring utility. Never run against an existing live section to overwrite CMS edits.
import { readFile, writeFile } from 'node:fs/promises';
const content = JSON.parse(await readFile(new URL('../supabase/content/initial-content.json', import.meta.url), 'utf8'));
const escape = value => value.replaceAll("'", "''");
const rows = Object.entries(content).map(([key, data]) => `('${escape(key)}', '${escape(JSON.stringify(data))}'::jsonb, 'published')`);
const sql = `-- Initial editorial content; runtime reads Supabase, never this seed file.\n-- Existing CMS edits are preserved if this seed is imported again.\ninsert into public.website_content (key, data, status) values\n${rows.join(',\n')}\non conflict (key) do nothing;\n`;
await writeFile(new URL('../supabase/migrations/20261016090100_initial_content.sql', import.meta.url), sql, { flag: 'wx' });
console.log('Created the initial editorial-content migration.');
