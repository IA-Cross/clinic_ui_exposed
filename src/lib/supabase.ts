import { createClient } from '@supabase/supabase-js';

// La clave anónima es pública por diseño: viaja en el bundle y la seguridad
// real la imponen las políticas RLS en Supabase (lectura pública solo de
// contenido publicado; escritura solo con sesión + MFA).
// La URL debe ser la raíz del proyecto (https://xxxx.supabase.co): el cliente
// añade /auth/v1 y /rest/v1 por su cuenta. Si la variable llegó con ese
// sufijo pegado (error común al copiarla), se elimina aquí.
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)
  ?.replace(/\/(rest|auth|storage)\/v1\/?$/, '')
  .replace(/\/+$/, '');
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

// Modo demostración local: solo en `npm run dev` y sin .env configurado.
// Permite al desarrollador ver todo el sitio y el panel de administración
// (login con cualquier credencial, datos en memoria, sin MFA). Este código
// queda inerte en el build de producción (import.meta.env.DEV = false).
export const isDevMock = import.meta.env.DEV && !isSupabaseConfigured;

if (!isSupabaseConfigured && !import.meta.env.DEV) {
  // Build de producción publicado sin las variables VITE_SUPABASE_*:
  // el login y el blog no pueden funcionar. Ver SETUP.md §3.
  console.error(
    '[Verboonen] El sitio se compiló SIN las variables VITE_SUPABASE_URL / ' +
      'VITE_SUPABASE_ANON_KEY. Configúralas como Repository secrets en GitHub ' +
      'y vuelve a desplegar.',
  );
}

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
);
