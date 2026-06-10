import { createClient } from '@supabase/supabase-js';

// La clave anónima es pública por diseño: viaja en el bundle y la seguridad
// real la imponen las políticas RLS en Supabase (lectura pública solo de
// contenido publicado; escritura solo con sesión + MFA).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  anonKey ?? 'placeholder-anon-key',
);
