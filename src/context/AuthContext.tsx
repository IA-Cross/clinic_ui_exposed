import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isDevMock } from '../lib/supabase';

// Niveles de seguridad de Supabase Auth:
//  aal1 = solo contraseña · aal2 = contraseña + código TOTP (Google Authenticator)
// El panel de administración exige aal2.
export type MfaStatus = 'unknown' | 'enroll' | 'challenge' | 'verified';

interface EnrollData {
  factorId: string;
  qrCode: string; // SVG data-url para escanear con Google Authenticator
  secret: string;
}

interface AuthContextType {
  session: Session | null;
  /** true cuando la sesión alcanzó aal2 (contraseña + TOTP) */
  isAuthenticated: boolean;
  /** false mientras se resuelve el estado inicial */
  ready: boolean;
  mfaStatus: MfaStatus;
  /** true en `npm run dev` sin Supabase configurado (login simulado) */
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  /** Inicia el alta de TOTP; devuelve el QR para escanear */
  startEnrollment: () => Promise<EnrollData>;
  /** Verifica el código de 6 dígitos (alta o reto) */
  verifyCode: (code: string, factorId?: string) => Promise<void>;
  /** Envía el correo de recuperación de contraseña */
  requestPasswordReset: (email: string) => Promise<void>;
  /** Define la nueva contraseña (desde el enlace de recuperación) */
  updatePassword: (newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const [mfaStatus, setMfaStatus] = useState<MfaStatus>('unknown');

  const evaluateLevel = async () => {
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const verified = data?.currentLevel === 'aal2';
    setIsAuthenticated(verified);
    if (verified) {
      setMfaStatus('verified');
      return;
    }
    // Con sesión aal1: ¿ya tiene TOTP dado de alta o hay que inscribirlo?
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const hasVerifiedTotp = (factorsData?.totp ?? []).some((f) => f.status === 'verified');
    setMfaStatus(hasVerifiedTotp ? 'challenge' : 'enroll');
  };

  useEffect(() => {
    if (isDevMock) {
      setReady(true);
      return;
    }
    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        setSession(data.session);
        if (data.session) await evaluateLevel();
      })
      .finally(() => setReady(true));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setIsAuthenticated(false);
        setMfaStatus('unknown');
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (isDevMock) {
      // Demo local: cualquier credencial entra y se omite el MFA
      setIsAuthenticated(true);
      setMfaStatus('verified');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await evaluateLevel();
  };

  const startEnrollment = async (): Promise<EnrollData> => {
    // Limpia altas a medias de intentos anteriores
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    for (const f of factorsData?.totp ?? []) {
      if (f.status !== 'verified') await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    if (error) throw error;
    return { factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret };
  };

  const verifyCode = async (code: string, factorId?: string) => {
    let id = factorId;
    if (!id) {
      const { data: factorsData, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      id = factorsData?.totp.find((f) => f.status === 'verified')?.id;
      if (!id) throw new Error('No hay un factor TOTP configurado');
    }
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: id,
    });
    if (challengeError) throw challengeError;
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: id,
      challengeId: challenge.id,
      code,
    });
    if (verifyError) throw verifyError;
    setIsAuthenticated(true);
    setMfaStatus('verified');
  };

  const requestPasswordReset = async (email: string) => {
    if (isDevMock) return;
    // El enlace del correo regresa a la página de restablecimiento del sitio
    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}admin/reset`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    if (isDevMock) return;
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const logout = async () => {
    if (!isDevMock) await supabase.auth.signOut();
    setSession(null);
    setIsAuthenticated(false);
    setMfaStatus('unknown');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated,
        ready,
        mfaStatus,
        isDemoMode: isDevMock,
        login,
        startEnrollment,
        verifyCode,
        requestPasswordReset,
        updatePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
