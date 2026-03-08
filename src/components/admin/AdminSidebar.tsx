import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-xl">dentistry</span>
        </div>
        <h1 className="text-sm font-bold leading-tight tracking-tight uppercase opacity-80">
          Clinica Laser
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
        <Link
          to="/admin"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isActive('/admin') && !location.pathname.includes('/blog')
              ? 'text-primary bg-primary/10'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
        <Link
          to="/admin/blog/new"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            location.pathname.includes('/blog/new')
              ? 'text-primary bg-primary/10'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined">edit_note</span>
          <span className="text-sm font-medium">New Post</span>
        </Link>
      </nav>
    </aside>
  );
};
