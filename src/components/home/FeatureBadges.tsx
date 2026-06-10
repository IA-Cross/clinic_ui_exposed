import React from 'react';

const features = [
  {
    icon: 'verified_user',
    title: 'Atención Profesional',
    text: 'Especialistas certificados comprometidos con tu bienestar y el de tu familia.',
  },
  {
    icon: 'biotech',
    title: 'Tecnología Avanzada',
    text: 'Equipos de última generación para tratamientos precisos y cómodos.',
  },
  {
    icon: 'search_insights',
    title: 'Diagnóstico Preciso',
    text: 'Evaluación integral para un plan de tratamiento hecho a tu medida.',
  },
];

export const FeatureBadges: React.FC = () => (
  <section className="bg-white dark:bg-background-dark py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-8">
      {features.map((f) => (
        <div key={f.title} className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-secondary/20 text-accent flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">{f.icon}</span>
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{f.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">{f.text}</p>
        </div>
      ))}
    </div>
  </section>
);
