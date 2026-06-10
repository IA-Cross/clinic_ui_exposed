import type { SiteSettings } from '../types';

// Valores por defecto: se usan si Supabase no responde (proyecto pausado,
// sin conexión) para que la página nunca quede en blanco. El administrador
// edita los valores reales desde /admin/settings.
export const defaultSettings: SiteSettings = {
  contact: {
    phone: '+52 55 0000 0000',
    whatsapp: '5215500000000',
    email: 'contacto@verboonen.com',
    address: 'Av. Ejemplo 123, Col. Centro, Ciudad de México',
    hours: 'Lun – Vie: 9:00 – 19:00 · Sáb: 9:00 – 14:00',
    mapsUrl: '',
  },
  social: {
    facebook: '',
    instagram: '',
    tiktok: '',
  },
  seo: {
    defaultDescription:
      'Clínica Odontológica Verboonen: ortodoncia, odontología general y pediátrica, ortopedia maxilar y orthokinética. Tu sonrisa en las mejores manos.',
  },
};
