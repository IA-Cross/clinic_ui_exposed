import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '../lib/settingsApi';
import { defaultSettings } from '../data/defaultSettings';
import type { SiteSettings } from '../types';

interface SettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  saveSettings: (settings: SiteSettings) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  loading: false,
  saveSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSettings()
      .then((s) => {
        if (!cancelled) setSettings(s);
      })
      .catch(() => {
        // Si Supabase no responde, la página sigue funcionando con los defaults
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const saveSettings = async (next: SiteSettings) => {
    await updateSettings(next);
    setSettings(next);
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext);
