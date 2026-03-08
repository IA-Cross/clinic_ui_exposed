import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Clínica Odontológica Láser Verboonen
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-64 hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
            placeholder="Search articles..."
            type="text"
          />
        </div>
        <button className="size-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
