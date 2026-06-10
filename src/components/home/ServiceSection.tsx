import React from 'react';
import { ImageSlideshow } from './ImageSlideshow';
import type { Service } from '../../data/services';

interface ServiceSectionProps {
  service: Service;
  reverse?: boolean;
}

export const ServiceSection: React.FC<ServiceSectionProps> = ({ service, reverse = false }) => (
  <section
    id={service.id}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-10 items-center scroll-mt-24"
  >
    <div className={reverse ? 'md:order-2' : ''}>
      <ImageSlideshow images={service.images} className="aspect-square max-w-lg mx-auto shadow-lg" />
    </div>
    <div className={reverse ? 'md:order-1' : ''}>
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-3xl text-primary">{service.icon}</span>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{service.title}</h3>
      </div>
      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
        {service.description}
      </p>
    </div>
  </section>
);
