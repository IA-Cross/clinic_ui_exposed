import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Seo } from '../components/common/Seo';
import logoColor from '../assets/brand/logo-color.webp';

type Step = 'credentials' | 'enroll' | 'challenge';

// Página oculta (sin enlaces desde el sitio público).
// Paso 1: correo y contraseña (Supabase Auth).
// Paso 2: código de Google Authenticator (TOTP). La primera vez muestra el QR.
export const AdminLoginPage: React.FC = () => {
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [factorId, setFactorId] = useState<string | undefined>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, startEnrollment, verifyCode, mfaStatus, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Escribe tu correo y contraseña');
      return;
    }
    setBusy(true);
    try {
      await login(email, password);
    } catch {
      setError('Credenciales incorrectas');
    } finally {
      setBusy(false);
    }
  };

  // Tras iniciar sesión, AuthContext determina si toca inscribir o retar TOTP
  useEffect(() => {
    if (mfaStatus === 'challenge') setStep('challenge');
    if (mfaStatus === 'enroll') {
      setBusy(true);
      startEnrollment()
        .then((data) => {
          setQrCode(data.qrCode);
          setSecret(data.secret);
          setFactorId(data.factorId);
          setStep('enroll');
        })
        .catch(() => setError('No se pudo iniciar la configuración del autenticador'))
        .finally(() => setBusy(false));
    }
    // startEnrollment es estable; solo debe dispararse al cambiar mfaStatus
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mfaStatus]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }
    setBusy(true);
    try {
      await verifyCode(code, step === 'enroll' ? factorId : undefined);
      navigate('/admin');
    } catch {
      setError('Código incorrecto o expirado. Intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  const codeInput = (
    <input
      type="text"
      inputMode="numeric"
      maxLength={6}
      value={code}
      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
      className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-center text-2xl tracking-[0.5em]"
      placeholder="000000"
      autoComplete="one-time-code"
      aria-label="Código de verificación"
    />
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
      <Seo title="Acceso" description="Acceso administrativo" noindex />
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
            Panel de Administración
          </h1>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {step === 'credentials' && (
            <form onSubmit={handleCredentials} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Correo electrónico
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="correo@ejemplo.com"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Contraseña
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={busy}>
                {busy ? 'Verificando…' : 'Continuar'}
              </Button>
            </form>
          )}

          {step === 'enroll' && (
            <form onSubmit={handleVerify} className="space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Configura tu segundo factor.</strong> Escanea este código QR con
                Google Authenticator (o una app compatible) y escribe el código de 6 dígitos.
              </p>
              {qrCode && (
                <img src={qrCode} alt="Código QR para Google Authenticator" className="mx-auto w-48 h-48" />
              )}
              {secret && (
                <p className="text-xs text-slate-500 text-center break-all">
                  ¿No puedes escanear? Ingresa esta clave manualmente: <code>{secret}</code>
                </p>
              )}
              {codeInput}
              <Button type="submit" variant="primary" className="w-full" disabled={busy}>
                {busy ? 'Verificando…' : 'Activar y entrar'}
              </Button>
            </form>
          )}

          {step === 'challenge' && (
            <form onSubmit={handleVerify} className="space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Escribe el código de 6 dígitos de tu app Google Authenticator.
              </p>
              {codeInput}
              <Button type="submit" variant="primary" className="w-full" disabled={busy}>
                {busy ? 'Verificando…' : 'Entrar'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
