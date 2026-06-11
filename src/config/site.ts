// Central site configuration. When the clinic gets a custom domain, update
// VITE_SITE_URL (env/CI secret) and `base` in vite.config.ts — nothing else.

export const SITE_NAME = 'Clínica Odontológica Verboonen';

// `||` y no `??`: una variable no definida en CI llega como cadena vacía
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://ia-cross.github.io/clinic_ui_exposed'
).replace(/\/$/, '');

export const BASE_PATH = import.meta.env.BASE_URL;

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export const GOATCOUNTER_CODE = import.meta.env.VITE_GOATCOUNTER_CODE ?? '';
