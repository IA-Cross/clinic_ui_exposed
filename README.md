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

## Desarrollo

```bash
cp .env.example .env   # rellena las variables (ver SETUP.md)
npm install
npm run dev            # http://localhost:5173
npm run build          # genera dist/ + sitemap.xml
npm run lint
```

El deploy es automático en cada push a `main` (workflow `deploy.yml`).

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
