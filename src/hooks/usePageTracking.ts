import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GOATCOUNTER_CODE } from '../config/site';

declare global {
  interface Window {
    goatcounter?: {
      count: (opts: { path: string; title?: string; event?: boolean }) => void;
      no_onload?: boolean;
    };
  }
}

let scriptInjected = false;

function injectScript() {
  if (scriptInjected || !GOATCOUNTER_CODE || import.meta.env.DEV) return;
  scriptInjected = true;
  // no_onload: contamos manualmente en cada cambio de ruta (SPA)
  window.goatcounter = { ...window.goatcounter, no_onload: true } as Window['goatcounter'];
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.head.appendChild(script);
}

// Registra una vista por cada cambio de ruta pública; ignora /admin
export function usePageTracking() {
  const { pathname } = useLocation();

  useEffect(() => {
    injectScript();
  }, []);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    // count.js puede tardar en cargar; reintenta brevemente
    const send = () => window.goatcounter?.count({ path: pathname });
    if (window.goatcounter?.count) {
      send();
    } else {
      const t = setTimeout(send, 2000);
      return () => clearTimeout(t);
    }
  }, [pathname]);
}
