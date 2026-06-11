// Genera dist/sitemap.xml tras cada build (script "postbuild").
// Consulta los slugs publicados vía la API REST de Supabase con la clave
// anónima (solo ve contenido publicado, igual que cualquier visitante).
// En el workflow semanal de GitHub Actions esta consulta también funciona
// como "ping" que evita que el proyecto gratuito de Supabase se pause.

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// `||` y no `??`: en CI un secreto inexistente llega como cadena vacía
const SITE_URL = (process.env.VITE_SITE_URL || 'https://ia-cross.github.io/clinic_ui_exposed').replace(/\/$/, '');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

const staticRoutes = [
  { loc: '/', priority: '1.0' },
  { loc: '/blog', priority: '0.8' },
];

let posts = [];
if (SUPABASE_URL && ANON_KEY) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?select=slug,updated_at&status=eq.published`,
      { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } },
    );
    if (res.ok) {
      posts = await res.json();
    } else {
      console.warn(`Sitemap: Supabase respondió ${res.status}; solo rutas estáticas.`);
    }
  } catch (err) {
    console.warn('Sitemap: sin conexión a Supabase; solo rutas estáticas.', err.message);
  }
} else {
  console.warn('Sitemap: faltan VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY; solo rutas estáticas.');
}

const urls = [
  ...staticRoutes.map(
    (r) => `  <url>\n    <loc>${SITE_URL}${r.loc === '/' ? '/' : r.loc}</loc>\n    <priority>${r.priority}</priority>\n  </url>`,
  ),
  ...posts.map(
    (p) =>
      `  <url>\n    <loc>${SITE_URL}/blog/${p.slug}</loc>\n    <lastmod>${p.updated_at.slice(0, 10)}</lastmod>\n    <priority>0.7</priority>\n  </url>`,
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

await writeFile(path.join(root, 'dist', 'sitemap.xml'), xml);
console.log(`sitemap.xml generado con ${staticRoutes.length} rutas estáticas y ${posts.length} artículos.`);
