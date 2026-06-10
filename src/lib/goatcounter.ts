import { supabase } from './supabase';
import { GOATCOUNTER_CODE } from '../config/site';

const BASE = `https://${GOATCOUNTER_CODE}.goatcounter.com`;

export interface SiteStats {
  totalViews: number;
  last30Days: { day: string; visits: number }[];
  topPages: { path: string; count: number }[];
}

// Contador público por página (no requiere token; activar
// "visitor counter" en los ajustes de GoatCounter).
export async function getPathViews(path: string): Promise<number | null> {
  if (!GOATCOUNTER_CODE) return null;
  try {
    const res = await fetch(`${BASE}/counter/${encodeURIComponent(path)}.json`);
    if (!res.ok) return null;
    const data = (await res.json()) as { count: string };
    // GoatCounter devuelve el conteo como texto, p.ej. "1 234"
    const n = parseInt(data.count.replace(/[^\d]/g, ''), 10);
    return Number.isNaN(n) ? null : n;
  } catch {
    return null;
  }
}

// El token (solo lectura) vive en la tabla admin_secrets, legible únicamente
// con sesión de administrador — nunca viaja en el bundle público.
async function getApiToken(): Promise<string | null> {
  const { data, error } = await supabase
    .from('admin_secrets')
    .select('value')
    .eq('key', 'goatcounter_token')
    .maybeSingle();
  if (error || !data) return null;
  return data.value as string;
}

export async function getSiteStats(): Promise<SiteStats | null> {
  if (!GOATCOUNTER_CODE) return null;
  const token = await getApiToken();
  if (!token) return null;

  try {
    const headers = { Authorization: `Bearer ${token}` };
    const [totalRes, hitsRes] = await Promise.all([
      fetch(`${BASE}/api/v0/stats/total`, { headers }),
      fetch(`${BASE}/api/v0/stats/hits?limit=10`, { headers }),
    ]);
    if (!totalRes.ok || !hitsRes.ok) return null;

    const total = (await totalRes.json()) as {
      total: number;
      stats?: { day: string; daily: number }[];
    };
    const hits = (await hitsRes.json()) as {
      hits: { path: string; count: number }[];
    };

    return {
      totalViews: total.total,
      last30Days: (total.stats ?? []).map((s) => ({ day: s.day, visits: s.daily })),
      topPages: (hits.hits ?? []).map((h) => ({ path: h.path, count: h.count })),
    };
  } catch {
    // CORS u otro fallo de red: el panel mostrará el enlace al dashboard externo
    return null;
  }
}

export function getDashboardUrl(): string {
  return BASE;
}
