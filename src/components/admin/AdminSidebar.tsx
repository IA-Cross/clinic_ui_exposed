import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoColor from '../../assets/brand/logo-color.webp';

const links = [
  { to: '/admin', icon: 'dashboard', label: 'Panel', exact: true },
  { to: '/admin/blog/new', icon: 'edit_note', label: 'Nueva entrada', exact: false },
  { to: '/admin/settings', icon: 'settings', label: 'Datos del sitio', exact: false },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (link: (typeof links)[number]) =>
    link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <img src={logoColor} alt="Verboonen Odontología" width={600} height={360} className="h-10 w-auto" />
      </div>
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive(link)
                ? 'text-primary bg-primary/10'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-auto"
        >
          <span className="material-symbols-outlined">public</span>
          <span className="text-sm font-medium">Ver sitio</span>
        </Link>
      </nav>
    </aside>
  );
};
