import { supabase, isSupabaseConfigured, isDevMock } from './supabase';
import { defaultSettings } from '../data/defaultSettings';
import type { SiteSettings } from '../types';

const KEY = 'site';

export async function fetchSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return defaultSettings;
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', KEY)
    .single();
  if (error || !data) throw error ?? new Error('Sin configuración');
  // Mezcla con los defaults para tolerar campos nuevos aún no guardados
  const value = data.value as Partial<SiteSettings>;
  return {
    contact: { ...defaultSettings.contact, ...value.contact },
    social: { ...defaultSettings.social, ...value.social },
    seo: { ...defaultSettings.seo, ...value.seo },
  };
}

export async function updateSettings(settings: SiteSettings): Promise<void> {
  if (isDevMock) return; // demo local: el estado en memoria lo conserva el contexto
  const { error } = await supabase
    .from('site_settings')
    .update({ value: settings, updated_at: new Date().toISOString() })
    .eq('key', KEY);
  if (error) throw error;
}
