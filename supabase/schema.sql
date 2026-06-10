-- Esquema de la base de datos para Clínica Verboonen
-- Ejecutar UNA VEZ en el SQL Editor del panel de Supabase (ver SETUP.md).

-- ============================== TABLAS ==============================

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content text not null default '',           -- Markdown
  cover_image text,
  cover_image_alt text,
  category text not null default 'NOTICIAS',
  tags text[] not null default '{}',
  keywords text[] not null default '{}',       -- SEO
  meta_description text,                       -- SEO
  author text not null default 'Dra. Verboonen',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_published_at on posts (status, published_at desc);

-- Contenido editable de la página principal (una sola fila, key = 'site')
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Secretos visibles solo para el administrador autenticado
-- (token de solo-lectura de GoatCounter). Se insertan a mano vía SQL.
create table if not exists admin_secrets (
  key text primary key,
  value text not null
);

-- ====================== ROW LEVEL SECURITY ==========================
-- La clave anónima es pública: estas políticas son la seguridad real.

alter table posts enable row level security;
alter table site_settings enable row level security;
alter table admin_secrets enable row level security;

-- Público: solo lee lo publicado
create policy "publico lee publicados" on posts
  for select using (status = 'published');

-- Admin autenticado: lee todo (incluye borradores)
create policy "admin lee todo" on posts
  for select to authenticated using (true);

-- Escrituras: exigen sesión con segundo factor verificado (aal2).
-- Una contraseña robada sin el código de Google Authenticator no puede escribir.
create policy "admin crea" on posts
  for insert to authenticated
  with check ((select auth.jwt()->>'aal') = 'aal2');

create policy "admin actualiza" on posts
  for update to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

create policy "admin elimina" on posts
  for delete to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2');

-- Configuración del sitio: lectura pública, escritura solo admin con MFA
create policy "publico lee configuracion" on site_settings
  for select using (true);

create policy "admin actualiza configuracion" on site_settings
  for update to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

-- Secretos: solo lectura autenticada con MFA; nunca escribibles desde el cliente
create policy "admin lee secretos" on admin_secrets
  for select to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2');

-- ========================== ALMACENAMIENTO ==========================
-- Bucket público para imágenes del blog (las URLs se sirven directo del CDN).

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "publico ve imagenes" on storage.objects
  for select using (bucket_id = 'blog-images');

create policy "admin sube imagenes" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'blog-images' and (select auth.jwt()->>'aal') = 'aal2');

create policy "admin elimina imagenes" on storage.objects
  for delete to authenticated
  using (bucket_id = 'blog-images' and (select auth.jwt()->>'aal') = 'aal2');

-- ====================== CONFIGURACIÓN INICIAL =======================

insert into site_settings (key, value) values (
  'site',
  '{
    "contact": {
      "phone": "+52 55 0000 0000",
      "whatsapp": "5215500000000",
      "email": "contacto@verboonen.com",
      "address": "Av. Ejemplo 123, Col. Centro, Ciudad de México",
      "hours": "Lun – Vie: 9:00 – 19:00 · Sáb: 9:00 – 14:00",
      "mapsUrl": ""
    },
    "social": { "facebook": "", "instagram": "", "tiktok": "" },
    "seo": {
      "defaultDescription": "Clínica Odontológica Verboonen: ortodoncia, odontología general y pediátrica, ortopedia maxilar y orthokinética. Tu sonrisa en las mejores manos."
    }
  }'::jsonb
) on conflict (key) do nothing;

-- Después de crear el token de GoatCounter (ver SETUP.md), ejecutar:
-- insert into admin_secrets (key, value) values ('goatcounter_token', 'TOKEN_AQUI');
