import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/common/Button';
import { Seo } from '../components/common/Seo';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import logoColor from '../assets/brand/logo-color.webp';

// Destino del enlace de recuperación que envía Supabase por correo.
// El enlace incluye un token en el fragmento (#) que el cliente de Supabase
// convierte automáticamente en una sesión temporal. Si el administrador ya
// tiene Google Authenticator configurado, también se pide el código de
// 6 dígitos: cambiar la contraseña exige el segundo factor (aal2).
export const AdminResetPage: React.FC = () => {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [needsCode, setNeedsCode] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { verifyCode, updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // El cliente procesa el token del enlace al cargar; pequeña espera
      const { data } = await supabase.auth.getSession();
      setHasSession(Boolean(data.session));
      if (data.session) {
        const { data: factorsData } = await supabase.auth.mfa.listFactors();
        setNeedsCode((factorsData?.totp ?? []).some((f) => f.status === 'verified'));
      }
      setChecking(false);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setBusy(true);
    try {
      if (needsCode) {
        if (code.length !== 6) {
          setError('Escribe el código de 6 dígitos de Google Authenticator.');
          setBusy(false);
          return;
        }
        await verifyCode(code);
      }
      await updatePassword(password);
      setDone(true);
      setTimeout(() => navigate('/admin/login'), 2500);
    } catch {
      setError(
        needsCode
          ? 'No se pudo actualizar. Verifica el código de Google Authenticator e intenta de nuevo.'
          : 'No se pudo actualizar la contraseña. El enlace puede haber expirado; solicita uno nuevo.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
      <Seo title="Restablecer contraseña" description="Restablecer contraseña" noindex />
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img
            src={logoColor}
            alt="Clínica Odontológica Verboonen"
            width={600}
            height={360}
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Restablecer contraseña
          </h1>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
          {checking ? (
            <LoadingSpinner />
          ) : done ? (
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-lg">
              Contraseña actualizada. Redirigiendo al inicio de sesión…
            </div>
          ) : !hasSession ? (
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                El enlace no es válido o ya expiró. Solicita uno nuevo desde la página de
                inicio de sesión con «¿Olvidaste tu contraseña?».
              </p>
              <Link to="/admin/login" className="text-primary font-semibold hover:underline">
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Nueva contraseña
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Confirmar contraseña
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  autoComplete="new-password"
                />
              </div>
              {needsCode && (
                <div className="space-y-2">
                  <label htmlFor="totp-code" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Código de Google Authenticator
                  </label>
                  <input
                    id="totp-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-center text-2xl tracking-[0.5em]"
                    placeholder="000000"
                    autoComplete="one-time-code"
                  />
                </div>
              )}
              <Button type="submit" variant="primary" className="w-full" disabled={busy}>
                {busy ? 'Guardando…' : 'Guardar nueva contraseña'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
