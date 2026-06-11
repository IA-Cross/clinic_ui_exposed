# Clínica Odontológica Verboonen

Sitio web de la clínica con blog optimizado para SEO y panel de administración.
React + Vite + Tailwind en GitHub Pages, con Supabase (plan gratuito) como backend
y GoatCounter para métricas. **Costo de operación: $0/mes.**

➡️ **Puesta en marcha:** ver [SETUP.md](SETUP.md).

## Características

### Sitio público (español)
- Página principal con hero, seis secciones de servicios con carrusel de imágenes,
  llamada a la acción por WhatsApp y sección de contacto editable por el administrador
- Blog con búsqueda, filtro por categoría y paginación
- SEO: URLs amigables (`/blog/mi-articulo`), meta etiquetas y Open Graph por página,
  datos estructurados schema.org (Dentist, BlogPosting, BreadcrumbList),
  `sitemap.xml` automático, `robots.txt`, imágenes webp optimizadas

### Panel de administración (`/admin`, oculto)
- Login con correo/contraseña + **Google Authenticator** (TOTP obligatorio)
- Métricas reales del sitio y vistas por artículo (GoatCounter)
- Crear, editar, publicar y eliminar entradas (Markdown con vista previa)
- Campos SEO por entrada: slug, meta descripción, palabras clave, texto alternativo
- Subida de imágenes con compresión automática (Supabase Storage)
- Edición de los datos de la página principal (contacto, horarios, redes)

## Arquitectura

| Pieza | Servicio | Plan |
|---|---|---|
| Hosting estático | GitHub Pages | Gratis |
| Base de datos, login e imágenes | Supabase | Gratis |
| Métricas | GoatCounter | Gratis |
| CI/CD + sitemap semanal | GitHub Actions | Gratis |

La clave anónima de Supabase es pública por diseño; la seguridad la imponen las
políticas RLS (lectura pública solo de contenido publicado; escritura solo con
sesión verificada por segundo factor).

## Ejecutar en local

**Opción A — Demo sin backend** (ver toda la UI, incluido el panel de administración):

```bash
npm install
npm run dev
# abre http://localhost:5173/clinic_ui_exposed/
```

Sin archivo `.env` el sitio entra en **modo demo local**: el blog muestra artículos
de ejemplo y en `/admin/login` entra cualquier correo/contraseña (sin MFA, los
cambios viven en memoria). Este modo solo existe en `npm run dev`, nunca en producción.

**Opción B — Proyecto completo** (datos y login reales):

```bash
cp .env.example .env   # rellena con tu proyecto de Supabase (ver SETUP.md §1-3)
npm install
npm run dev
```

Otros comandos: `npm run build` (genera `dist/` + `sitemap.xml`), `npm run preview`
(sirve el build), `npm run lint`.

## Desplegar (GitHub Pages, gratis, automático desde el repo)

1. Sube el repo a GitHub y agrega los 4 secretos en
   **Settings → Secrets and variables → Actions**:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`, `VITE_GOATCOUNTER_CODE`.
2. Haz push a `main`: el workflow `deploy.yml` compila y publica en la rama `gh-pages`.
3. La primera vez, en **Settings → Pages** elige *Deploy from a branch* → `gh-pages` → `/ (root)`.
4. El sitio queda en `https://<usuario>.github.io/<repo>/` y **cada push a `main`
   se despliega solo**. También puedes desplegar a mano con `npm run deploy`.

## Estructura

```
src/
├── components/      # common/, blog/, admin/, forms/, home/
├── pages/           # Páginas públicas y de administración
├── context/         # Auth (Supabase + MFA), Blog, Settings
├── lib/             # Clientes: supabase, postsApi, settingsApi, goatcounter, uploadImage
├── data/            # services.ts (6 secciones), defaultSettings.ts
├── hooks/           # usePageTracking (GoatCounter SPA)
├── config/          # site.ts (URL canónica, nombre del sitio)
└── utils/           # slugify
scripts/             # optimize-images.mjs, generate-sitemap.mjs
supabase/            # schema.sql (tablas + RLS), seed.sql
```

© Clínica Odontológica Verboonen. Todos los derechos reservados.
