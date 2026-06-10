import React from 'react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import { useSettings } from '../context/SettingsContext';
import { BlogGrid } from '../components/blog/BlogGrid';
import { Seo } from '../components/common/Seo';
import { HeroSection } from '../components/home/HeroSection';
import { FeatureBadges } from '../components/home/FeatureBadges';
import { ServiceSection } from '../components/home/ServiceSection';
import { ContactSection } from '../components/home/ContactSection';
import { services } from '../data/services';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/site';

export const HomePage: React.FC = () => {
  const { getPublishedBlogs } = useBlogs();
  const { settings } = useSettings();
  const latestBlogs = getPublishedBlogs().slice(0, 3);

  const clinicJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: SITE_NAME,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    telephone: settings.contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.contact.address,
      addressCountry: 'MX',
    },
    openingHours: settings.contact.hours,
    sameAs: Object.values(settings.social).filter(Boolean),
    medicalSpecialty: services.map((s) => s.title),
  };

  return (
    <main>
      <Seo
        title={`${SITE_NAME} | Ortodoncia y Odontología en México`}
        description={settings.seo.defaultDescription}
        path="/"
        jsonLd={clinicJsonLd}
      />

      <HeroSection />
      <FeatureBadges />

      {/* Servicios: seis secciones con carrusel de imágenes */}
      <section id="servicios" className="py-12 bg-background-light dark:bg-slate-900/30 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto px-4 mb-4">
          <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">
            Nuestros Servicios
          </h2>
          <p className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
            Cuidado dental integral para toda la familia
          </p>
        </div>
        {services.map((service, i) => (
          <ServiceSection key={service.id} service={service} reverse={i % 2 === 1} />
        ))}
      </section>

      {/* Últimas entradas del blog */}
      <section className="py-24" id="blog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">
                Blog
              </h2>
              <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
                Consejos y novedades
              </h3>
            </div>
            <Link
              to="/blog"
              className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            >
              Ver todas las entradas{' '}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          {latestBlogs.length > 0 ? (
            <BlogGrid blogs={latestBlogs} />
          ) : (
            <p className="text-slate-500">Muy pronto compartiremos artículos sobre salud dental.</p>
          )}
        </div>
      </section>

      <ContactSection />
    </main>
  );
};
