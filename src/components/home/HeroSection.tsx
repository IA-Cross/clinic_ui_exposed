import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import heroImg from '../../assets/office/consultorio-1.webp';

export const HeroSection: React.FC = () => {
  const { settings } = useSettings();
  const whatsappUrl = `https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(
    'Hola, me gustaría agendar una cita en Clínica Verboonen.',
  )}`;

  return (
    <section className="relative bg-primary text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-secondary font-semibold uppercase tracking-wider mb-4">
            Clínica Odontológica Verboonen
          </p>
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
            Tu Sonrisa en las <span className="text-secondary">Mejores Manos</span>
          </h1>
          <p className="text-lg text-white/85 mb-8 max-w-xl">
            Cuidamos de tu salud dental con profesionalismo y calidez. Ortodoncia,
            odontología general y pediátrica, ortopedia maxilar y orthokinética con
            tecnología avanzada.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3.5 font-bold text-white hover:brightness-110 transition"
            >
              <span className="material-symbols-outlined">chat</span>
              Agenda tu Cita Hoy
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/60 px-6 py-3.5 font-bold hover:bg-white/10 transition"
            >
              Nuestros Servicios
            </a>
          </div>
        </div>
        <div className="hidden lg:block">
          <img
            src={heroImg}
            alt="Consultorio de Clínica Odontológica Verboonen"
            width={1600}
            height={2399}
            loading="eager"
            {...({ fetchpriority: 'high' } as Record<string, string>)}
            className="rounded-2xl shadow-2xl w-full max-h-[560px] object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};
