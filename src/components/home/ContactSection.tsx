import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { ContactForm } from '../forms/ContactForm';

export const ContactSection: React.FC = () => {
  const { settings } = useSettings();
  const { contact } = settings;

  return (
    <section className="py-24 bg-white dark:bg-slate-900/50 scroll-mt-24" id="contacto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">
              Contáctanos
            </h2>
            <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-8">
              Estamos para ayudarte
            </h3>
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="font-bold text-lg mb-1">Dirección</p>
                  <p className="text-slate-600 dark:text-slate-400">{contact.address}</p>
                  {contact.mapsUrl && (
                    <a
                      href={contact.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold text-sm hover:underline"
                    >
                      Ver en Google Maps
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <p className="font-bold text-lg mb-1">Teléfono</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {contact.phone}
                    <br />
                    {contact.hours}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#25D366] text-white rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <div>
                  <p className="font-bold text-lg mb-1">WhatsApp</p>
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline"
                  >
                    Escríbenos directamente
                  </a>
                </div>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};
