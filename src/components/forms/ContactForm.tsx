import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../common/Button';
import { useSettings } from '../../context/SettingsContext';
import { services } from '../../data/services';

interface ContactFormData {
  name: string;
  service: string;
  message: string;
}

// Sin backend: el formulario arma un mensaje y abre WhatsApp con él.
export const ContactForm: React.FC = () => {
  const { settings } = useSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    const text = [
      `Hola, soy ${data.name}.`,
      `Me interesa: ${data.service}.`,
      data.message,
    ].join('\n');
    window.open(
      `https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener',
    );
  };

  return (
    <div className="bg-background-light dark:bg-background-dark p-8 lg:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Nombre completo
          </label>
          <input
            id="contact-name"
            {...register('name', { required: 'Escribe tu nombre' })}
            className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder="Tu nombre"
            type="text"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-service" className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Servicio de interés
          </label>
          <select
            id="contact-service"
            {...register('service', { required: 'Selecciona un servicio' })}
            className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            <option value="">Selecciona un servicio</option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Otro">Otro</option>
          </select>
          {errors.service && <p className="text-xs text-red-500">{errors.service.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-message" className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Mensaje
          </label>
          <textarea
            id="contact-message"
            {...register('message', { required: 'Cuéntanos en qué podemos ayudarte' })}
            className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder="Cuéntanos en qué podemos ayudarte..."
            rows={4}
          />
          {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
        </div>
        <Button type="submit" variant="primary" className="w-full">
          <span className="inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-base">chat</span>
            Enviar por WhatsApp
          </span>
        </Button>
        <p className="text-xs text-slate-500 text-center">
          Se abrirá WhatsApp con tu mensaje listo para enviar.
        </p>
      </form>
    </div>
  );
};
