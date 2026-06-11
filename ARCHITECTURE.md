# Arquitectura del proyecto — Clínica Odontológica Verboonen

Este documento explica cómo está construido el sitio, qué hace cada pieza y por qué
se tomó cada decisión. Léelo junto con [SETUP.md](SETUP.md) (puesta en marcha) y
[README.md](README.md) (comandos del día a día).

## 1. Visión general

Es una **SPA de React** (Vite + TypeScript + Tailwind) servida como sitio estático
desde **GitHub Pages**, con **Supabase** (plan gratuito) como único backend y
**GoatCounter** para analítica. No hay ningún servidor propio que mantener.

```
┌─────────────┐   git push    ┌────────────────┐   publica    ┌──────────────┐
│ Desarrollador│ ───────────► │ GitHub Actions  │ ───────────► │ GitHub Pages │
└─────────────┘               │ (build + sitemap)│  (gh-pages)  │  (CDN, $0)   │
                              └────────┬───────┘               └──────┬───────┘
                                       │ consulta slugs                │ HTML/JS/CSS
                                       ▼                               ▼
                              ┌────────────────┐   REST + Auth  ┌──────────────┐
                              │    Supabase    │ ◄───────────── │  Navegador   │
                              │ Postgres + RLS │                │  (visitante  │
                              │ Auth TOTP/MFA  │                │   o admin)   │
                              │ Storage imgs   │                └──────┬───────┘
                              └────────────────┘                       │ pageviews
                                                                       ▼
                                                              ┌──────────────┐
                                                              │  GoatCounter │
                                                              └──────────────┘
```

| Pieza | Servicio | Costo | Rol |
|---|---|---|---|
| Hosting | GitHub Pages | $0 | Sirve el sitio estático desde un CDN |
| CI/CD | GitHub Actions | $0 | Compila y publica en cada push + corrida semanal |
| Datos | Supabase Postgres | $0 | Artículos del blog y contenido editable de la portada |
| Login | Supabase Auth | $0 | Email + contraseña + TOTP (Google Authenticator) |
| Imágenes del blog | Supabase Storage | $0 (1 GB) | Subidas desde el panel, comprimidas en el navegador |
| Métricas | GoatCounter | $0 | Visitas del sitio y por artículo, sin aviso de cookies |

## 2. Estructura del código

```
src/
├── main.tsx                  # Punto de entrada: monta <App/>, importa Montserrat
├── App.tsx                   # Providers, rutas, scroll a anclas, code-splitting del admin
├── config/site.ts            # SITE_URL, nombre del sitio, código de GoatCounter
│
├── pages/                    # Una página por ruta
│   ├── HomePage.tsx          #  /            portada (hero + 6 servicios + blog + contacto)
│   ├── BlogListPage.tsx      #  /blog        listado con búsqueda/categorías/paginación
│   ├── BlogPostPage.tsx      #  /blog/:slug  artículo (Markdown + JSON-LD)
│   ├── AdminLoginPage.tsx    #  /admin/login login en dos pasos (oculta, noindex)
│   ├── AdminResetPage.tsx    #  /admin/reset destino del correo de recuperación
│   ├── AdminDashboardPage.tsx#  /admin       métricas + tabla de artículos (protegida)
│   ├── AdminEditorPage.tsx   #  /admin/blog/new|:id/edit  editor Markdown + campos SEO
│   └── AdminSettingsPage.tsx #  /admin/settings           datos editables de la portada
│
├── components/
│   ├── common/               # Header, Footer, Button, Seo, ProtectedRoute,
│   │                         # LoadingSpinner, BrandIcons (SVG de WhatsApp/FB/IG/TikTok)
│   ├── home/                 # HeroSection, FeatureBadges, ServiceSection,
│   │                         # ImageSlideshow (carrusel), ContactSection
│   ├── blog/                 # BlogGrid, BlogCard, CategoryFilter, Pagination
│   ├── admin/                # AdminSidebar, AdminHeader, BlogTable, RichTextEditor
│   └── forms/                # ContactForm (abre WhatsApp con el mensaje armado)
│
├── context/                  # Estado global con React Context
│   ├── AuthContext.tsx       # Sesión Supabase, MFA, recuperación de contraseña
│   ├── BlogContext.tsx       # CRUD de artículos (en memoria + Supabase)
│   └── SettingsContext.tsx   # Contenido editable de la portada, con valores de respaldo
│
├── lib/                      # Acceso a servicios externos
│   ├── supabase.ts           # Cliente único + flags isSupabaseConfigured / isDevMock
│   ├── postsApi.ts           # CRUD de posts (mapea snake_case ↔ camelCase)
│   ├── settingsApi.ts        # Lectura/escritura de site_settings
│   ├── uploadImage.ts        # Compresión en el navegador + subida al bucket
│   └── goatcounter.ts        # Contadores públicos + API con token (estadísticas)
│
├── data/
│   ├── services.ts           # Las 6 secciones de servicios (títulos = carpetas del cliente)
│   ├── defaultSettings.ts    # Valores de respaldo si Supabase no responde
│   └── mockPosts.ts          # Artículos del modo demo local
│
├── hooks/usePageTracking.ts  # Inyecta GoatCounter y cuenta cada cambio de ruta
├── utils/slugify.ts          # "¿Cuándo?" → "cuando" (URLs limpias)
└── types/index.ts            # BlogPost, SiteSettings, AuthUser

scripts/
├── optimize-images.mjs       # Una vez: material del cliente → webp optimizados
└── generate-sitemap.mjs      # En cada build: sitemap.xml con los slugs publicados

supabase/
├── schema.sql                # Tablas, políticas RLS, bucket de imágenes, fila inicial
└── seed.sql                  # 3 artículos de ejemplo (opcional)

public/                       # Copiado tal cual a dist/
├── 404.html                  # Truco SPA para GitHub Pages (ver §6)
├── robots.txt                # Disallow /admin + ruta del sitemap
├── favicon.png, apple-touch-icon.png, og-default.jpg
.github/workflows/deploy.yml  # CI/CD (ver §8)
```

## 3. Flujo de datos

### Visitante (sitio público)
1. El navegador recibe el HTML/JS estático desde el CDN de GitHub Pages.
2. `BlogContext` pide a Supabase (REST, clave anónima) los artículos **publicados** —
   las políticas RLS garantizan que un anónimo no puede ver borradores ni escribir.
3. `SettingsContext` pide la fila `site_settings` (teléfono, WhatsApp, horarios…).
   Si Supabase no responde (proyecto pausado, sin red), usa `defaultSettings.ts`:
   la portada nunca queda en blanco.
4. `usePageTracking` envía un pageview a GoatCounter en cada cambio de ruta
   (ignora `/admin*` y no se activa en desarrollo).

### Administrador
1. Entra a `/admin/login` (ruta oculta: sin enlaces, `noindex`, bloqueada en robots.txt).
2. **Paso 1**: email + contraseña contra Supabase Auth. **Paso 2**: código TOTP de
   Google Authenticator (la primera vez se muestra el QR de inscripción).
3. Con la sesión en nivel **aal2**, el panel puede crear/editar/eliminar artículos,
   subir imágenes (comprimidas en el navegador a webp ≤300 KB antes de subir) y
   editar los datos de la portada.
4. Las métricas del panel salen de GoatCounter: el total del sitio usa un token de
   solo lectura guardado en la tabla `admin_secrets` (legible solo con sesión aal2,
   nunca viaja en el bundle); las vistas por artículo usan el contador público.

## 4. Modelo de seguridad

La pregunta clave: *si la clave anónima de Supabase es pública, ¿qué protege los datos?*
**Row Level Security (RLS)** en Postgres — las políticas viven en `supabase/schema.sql`:

| Tabla | Anónimo | Autenticado (aal1) | Autenticado + MFA (aal2) |
|---|---|---|---|
| `posts` | SELECT solo `published` | SELECT todo | todo (INSERT/UPDATE/DELETE) |
| `site_settings` | SELECT | SELECT | UPDATE |
| `admin_secrets` | nada | nada | SELECT |
| Storage `blog-images` | SELECT | — | INSERT/DELETE |

Capas de defensa:
- **aal2 obligatorio para escribir**: una contraseña robada *sin* el teléfono del
  administrador no puede modificar nada (las políticas comprueban `auth.jwt()->>'aal'`).
- **Registro de usuarios desactivado** en Supabase: solo existe la cuenta del admin.
- **Rate limiting** de Supabase Auth contra fuerza bruta en el login.
- El sitio público es estático en un CDN: no hay servidor propio que atacar o tirar.
- La clave `service_role` (que salta RLS) jamás sale del panel de Supabase.

Recuperación de acceso:
- **Contraseña olvidada**: «¿Olvidaste tu contraseña?» en el login → Supabase envía un
  correo → el enlace abre `/admin/reset` → nueva contraseña (+ código TOTP si ya está
  inscrito, porque cambiar la contraseña también exige aal2).
- **Teléfono/autenticador perdido**: se elimina el factor MFA desde el panel de
  Supabase (Authentication → Users → usuario → Factors → eliminar) y el siguiente
  login vuelve a mostrar el QR de inscripción.

## 5. Modo demo local (para desarrollo)

`npm run dev` **sin** archivo `.env` activa `isDevMock` (`src/lib/supabase.ts`):
- El login acepta cualquier credencial y omite el MFA.
- Los artículos salen de `src/data/mockPosts.ts` y el CRUD opera en memoria
  (se pierde al recargar). Las imágenes se quedan como object-URLs locales.
- El panel muestra el aviso «Modo demo local».

La condición incluye `import.meta.env.DEV`, así que este código es **inalcanzable en
el build de producción** (Vite lo elimina por dead-code elimination). Con un `.env`
configurado, el modo demo se apaga y todo va contra Supabase real.

## 6. SEO

Era el objetivo principal; las piezas:

1. **URLs limpias**: `/blog/:slug` (el slug se autogenera del título con
   `utils/slugify.ts` y es editable en el editor, con verificación de duplicados).
2. **Meta etiquetas por página**: `components/common/Seo.tsx` (react-helmet-async)
   pone título, descripción, canónica, Open Graph (`es_MX`) y Twitter Card.
   El editor expone por artículo: slug, meta descripción (contador de 155),
   palabras clave y texto alternativo de la portada.
3. **Datos estructurados (JSON-LD)**: `Dentist` en la portada (armado con los datos
   reales de `site_settings`), `BlogPosting` + `BreadcrumbList` en cada artículo.
4. **Línea base sin JavaScript**: `index.html` trae título/meta/OG en español para
   rastreadores que no ejecutan JS.
5. **sitemap.xml**: `scripts/generate-sitemap.mjs` corre en `postbuild`, consulta los
   slugs publicados por REST y lo escribe en `dist/`. La corrida semanal del workflow
   lo mantiene fresco.
6. **SPA en GitHub Pages**: Pages no conoce las rutas de React; `public/404.html`
   convierte cualquier ruta profunda en query-string y redirige a `index.html`, donde
   un script gemelo la restaura antes de que arranque React Router
   (técnica [spa-github-pages](https://github.com/rafgraph/spa-github-pages)).
7. **Rendimiento (Core Web Vitals)**: imágenes webp ≤150 KB con `width/height`
   explícitos y `loading="lazy"`, Montserrat autoalojada (@fontsource), el código del
   panel de administración se descarga solo al entrar a `/admin` (React.lazy).

Limitaciones aceptadas (documentadas en el plan): GitHub Pages responde HTTP 404
antes de la redirección SPA (mitigado por el sitemap y el renderizado JS de Google),
y las vistas previas al compartir un artículo en WhatsApp/Facebook muestran la imagen
genérica del sitio porque sus rastreadores no ejecutan JS.

## 7. Analítica (GoatCounter)

- `usePageTracking` inyecta `count.js` (solo en producción) y registra cada cambio de
  ruta manualmente (`no_onload`), excluyendo `/admin*`.
- **Vistas por artículo**: endpoint público `https://<código>.goatcounter.com/counter/<ruta>.json`
  (sin token; requiere activar el contador público en GoatCounter).
- **Estadísticas del sitio** (total, últimos días, páginas top): API oficial con un
  token de solo lectura guardado en `admin_secrets`. Si la llamada falla, el panel
  degrada a un enlace «Abrir panel de GoatCounter».

## 8. CI/CD (`.github/workflows/deploy.yml`)

- **En cada push a `main`**: `npm ci` → `npm run build` (con los 4 secretos `VITE_*`)
  → `postbuild` genera el sitemap → publica `dist/` en la rama `gh-pages`.
- **Cada lunes 07:00 UTC**: misma corrida. Sirve para (a) regenerar el sitemap con los
  artículos publicados durante la semana y (b) hacer una consulta a Supabase que evita
  que el proyecto gratuito se pause por inactividad.
- También se puede lanzar a mano (workflow_dispatch) o con `npm run deploy` local.

## 9. Decisiones y alternativas descartadas

| Decisión | Por qué |
|---|---|
| Supabase como backend | Único servicio gratuito con Postgres + Auth con TOTP + Storage y sin servidor que mantener. El cliente pidió no usar la API de GitHub como CMS. |
| Markdown en lugar de editor WYSIWYG | El editor "rico" anterior era decorativo. Markdown + vista previa es simple, portable y suficiente. |
| GoatCounter en lugar de Google Analytics | API consultable desde el navegador (GA4 exige backend), sin banner de cookies, gratuito. |
| Formulario de contacto → WhatsApp | Sin backend no hay envío de correos; el público objetivo usa WhatsApp y así lo marca la guía visual del cliente. |
| Imágenes de servicios en el repo (no en Storage) | Son parte del diseño, no contenido editable; convertidas una vez a webp con `scripts/optimize-images.mjs`. |
| `basename` + `404.html` en lugar de HashRouter | Las URLs con `#` no se indexan individualmente; el truco 404 mantiene URLs limpias. |
| Dominio centralizado en `config/site.ts` | Migrar a dominio propio toca 2 valores (más el og:image de `index.html`), documentado en SETUP.md. |
