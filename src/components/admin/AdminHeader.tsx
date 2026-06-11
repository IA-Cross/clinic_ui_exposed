import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AdminHeader: React.FC = () => {
  const { session, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
        Clínica Odontológica Verboonen
      </h2>
      <div className="flex items-center gap-4">
        {isDemoMode && (
          <span
            className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full"
            title="Ejecutando sin Supabase: los cambios viven solo en memoria y se pierden al recargar"
          >
            Modo demo local
          </span>
        )}
        <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">
          {session?.user.email}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};
