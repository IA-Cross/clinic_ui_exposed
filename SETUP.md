# Guía de puesta en marcha — Clínica Verboonen

Pasos manuales (una sola vez) para dejar el sitio funcionando. Costo total: **$0/mes**.

## 1. Supabase (base de datos, login e imágenes)

1. Crea una cuenta gratuita en [supabase.com](https://supabase.com) y un proyecto nuevo
   (región recomendada: `us-east-1` o la más cercana a México).
2. En **Project Settings → API** copia:
   - `Project URL` → variable `VITE_SUPABASE_URL`
   - `anon public` key → variable `VITE_SUPABASE_ANON_KEY`

   > La clave *anon* es pública por diseño; la seguridad la imponen las políticas
   > RLS del esquema. La clave `service_role` **nunca** debe salir del panel.
3. En **SQL Editor** ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql)
   y luego, si quieres artículos de ejemplo, [`supabase/seed.sql`](supabase/seed.sql).
4. En **Authentication → Sign In / Up**: desactiva *Allow new users to sign up*.
5. En **Authentication → Users → Add user**: crea el usuario del administrador
   (correo + contraseña fuerte). Marca *Auto Confirm User*.
6. En **Authentication → Multi-Factor**: verifica que TOTP esté habilitado (lo está
   por defecto). El QR para Google Authenticator aparece en el primer inicio de
   sesión en `/admin/login` del propio sitio.
7. En **Authentication → URL Configuration**:
   - *Site URL*: la URL del sitio (p. ej. `https://ia-cross.github.io/clinic_ui_exposed`)
   - *Redirect URLs*: agrega `https://<tu-sitio>/admin/reset` (y
     `http://localhost:5173/clinic_ui_exposed/admin/reset` para pruebas locales).
   Sin esto, el enlace de "¿Olvidaste tu contraseña?" no podrá volver al sitio.

## 2. GoatCounter (métricas, gratis y sin aviso de cookies)

1. Crea una cuenta en [goatcounter.com](https://www.goatcounter.com) con un código de
   sitio, p. ej. `verboonen` → variable `VITE_GOATCOUNTER_CODE`.
2. En **Settings → Visitor counter**: habilita el contador público
   (permite mostrar las vistas por artículo en el panel).
3. En **User → API** genera un token con permiso de **solo lectura**.
4. En el SQL Editor de Supabase ejecuta:
   ```sql
   insert into admin_secrets (key, value) values ('goatcounter_token', 'EL_TOKEN_AQUI');
   ```
   Ese token solo es legible con la sesión del administrador; no viaja en el código.

## 3. Variables de entorno

- Local: copia `.env.example` a `.env` y rellena los valores.
- GitHub: en **Settings → Secrets and variables → Actions** crea los secretos
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`, `VITE_GOATCOUNTER_CODE`.

## 4. GitHub Pages

1. En **Settings → Pages** del repositorio: *Deploy from a branch* → rama `gh-pages`.
2. El workflow `.github/workflows/deploy.yml` publica automáticamente en cada push a
   `main` y cada lunes (la corrida semanal actualiza el `sitemap.xml` con los artículos
   nuevos y evita que Supabase pause el proyecto gratuito por inactividad).

## 5. Primer inicio de sesión del administrador

1. Abre `https://<tu-sitio>/admin/login` (la ruta no está enlazada desde el sitio público).
2. Ingresa el correo y contraseña creados en el paso 1.5.
3. Escanea el código QR con **Google Authenticator** y escribe el código de 6 dígitos.
   A partir de entonces, cada inicio de sesión pide contraseña + código.

## 6. Imágenes del material del cliente

Si cambian las fotos de la carpeta `Verboonen-Odontología-material-web/`:

```bash
node scripts/optimize-images.mjs
```

y haz commit de los `.webp` generados en `src/assets/`.

## Dominio propio (más adelante, muy recomendado para SEO)

1. Compra el dominio (~$200–300 MXN/año) y apúntalo a GitHub Pages
   ([guía oficial](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)).
2. Cambia **solo dos cosas** en el repo:
   - `base` en `vite.config.ts` → `'/'`
   - El secreto `VITE_SITE_URL` → `https://tudominio.com`
   (y `pathSegmentsToKeep = 0` en `public/404.html`).
3. Da de alta el sitio en [Google Search Console](https://search.google.com/search-console)
   y envía `https://tudominio.com/sitemap.xml`.

## Recuperación de acceso

- **Contraseña olvidada**: en `/admin/login` escribe el correo y pulsa
  «¿Olvidaste tu contraseña?». Llega un correo cuyo enlace abre `/admin/reset`,
  donde se define la nueva contraseña (pide también el código de Google
  Authenticator si ya está configurado).
- **Teléfono / app de autenticación perdida**: entra al panel de Supabase →
  **Authentication → Users** → usuario del admin → **Factors** → elimina el factor
  TOTP. En el siguiente inicio de sesión el sitio mostrará de nuevo el QR para
  inscribir el nuevo teléfono.
- **Correo del admin perdido**: el dueño del proyecto Supabase puede cambiar el
  correo o crear otro usuario desde **Authentication → Users**.

## Probar en local sin nada configurado (modo demo)

`npm run dev` sin `.env` activa un modo demostración: blog con artículos de ejemplo
y panel accesible con cualquier credencial (sin MFA, cambios solo en memoria).
Útil para revisar la UI o enseñar el panel sin crear cuentas. Solo existe en
desarrollo; el build de producción siempre exige Supabase real.

## Seguridad — resumen

- Login oculto en `/admin/login` (sin enlaces públicos, con `noindex` y bloqueado en `robots.txt`).
- Doble factor obligatorio: las escrituras en la base exigen sesión **aal2**
  (contraseña + Google Authenticator); una contraseña filtrada no basta para modificar nada.
- Supabase aplica límites de intentos al login (protección contra fuerza bruta).
- El sitio público es estático en un CDN de GitHub: no hay servidor propio que tirar.
