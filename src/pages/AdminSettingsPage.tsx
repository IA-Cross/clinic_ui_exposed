import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSettings } from '../context/SettingsContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { Button } from '../components/common/Button';
import { Seo } from '../components/common/Seo';
import type { SiteSettings } from '../types';

// El administrador edita el CONTENIDO de la página principal (datos de
// contacto, horarios, redes), nunca su estructura.
export const AdminSettingsPage: React.FC = () => {
  const { settings, saveSettings } = useSettings();
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { register, handleSubmit, reset } = useForm<SiteSettings>({ defaultValues: settings });

  // Cuando llegan los valores reales de Supabase, refresca el formulario
  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const onSubmit = async (data: SiteSettings) => {
    setStatus('saving');
    try {
      await saveSettings(data);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    }
  };

  const field = (label: string, name: string, props: object, hint?: string) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
        id={name}
      />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Seo title="Datos del sitio" description="Configuración del sitio" noindex />
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Datos del sitio
            </h1>
            <p className="text-slate-500 mb-8">
              Esta información aparece en la sección de contacto, el pie de página y los
              resultados de búsqueda.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 pb-16">
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                <h2 className="font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">call</span>
                  Contacto
                </h2>
                {field('Teléfono', 'phone', register('contact.phone'))}
                {field(
                  'WhatsApp',
                  'whatsapp',
                  register('contact.whatsapp'),
                  'Solo dígitos, con código de país. Ej.: 5215512345678',
                )}
                {field('Correo electrónico', 'email', register('contact.email'))}
                {field('Dirección', 'address', register('contact.address'))}
                {field('Horario', 'hours', register('contact.hours'), 'Ej.: Lun – Vie: 9:00 – 19:00')}
                {field('Enlace de Google Maps', 'mapsUrl', register('contact.mapsUrl'))}
              </section>

              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                <h2 className="font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">share</span>
                  Redes sociales
                </h2>
                {field('Facebook', 'facebook', register('social.facebook'), 'URL completa del perfil')}
                {field('Instagram', 'instagram', register('social.instagram'))}
                {field('TikTok', 'tiktok', register('social.tiktok'))}
              </section>

              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                <h2 className="font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">travel_explore</span>
                  SEO
                </h2>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Descripción del sitio
                  </label>
                  <textarea
                    {...register('seo.defaultDescription')}
                    className="w-full px-4 py-2.5 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm min-h-[80px]"
                  />
                  <p className="text-xs text-slate-500">
                    Texto que muestran Google y las redes al compartir la página principal.
                  </p>
                </div>
              </section>

              {status === 'saved' && (
                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-lg">
                  Cambios guardados. Ya son visibles en el sitio.
                </div>
              )}
              {status === 'error' && (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
                  No se pudieron guardar los cambios. Intenta de nuevo.
                </div>
              )}

              <Button type="submit" variant="primary" disabled={status === 'saving'}>
                {status === 'saving' ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
