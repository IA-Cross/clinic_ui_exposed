import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { FacebookIcon, InstagramIcon, TikTokIcon } from './BrandIcons';
import logoBlanco from '../../assets/brand/logo-blanco.webp';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const { contact, social } = settings;

  const socialLinks = [
    { href: social.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: social.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: social.tiktok, label: 'TikTok', Icon: TikTokIcon },
  ].filter((s) => s.href);

  return (
    <footer className="bg-background-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
          <div className="col-span-2">
            <img
              src={logoBlanco}
              alt="Clínica Odontológica Verboonen"
              width={600}
              height={360}
              className="h-16 w-auto mb-6"
            />
            <p className="text-slate-400 max-w-md mb-8">
              Tu sonrisa en las mejores manos. Cuidamos de tu salud dental con
              profesionalismo, calidez y tecnología avanzada.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Enlaces</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <Link className="hover:text-secondary transition-colors" to="/#servicios">
                  Servicios
                </Link>
              </li>
              <li>
                <Link className="hover:text-secondary transition-colors" to="/blog">
                  Blog
                </Link>
              </li>
              <li>
                <Link className="hover:text-secondary transition-colors" to="/#contacto">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Contacto</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-base">call</span>
                {contact.phone}
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-base">mail</span>
                {contact.email}
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-base">location_on</span>
                {contact.address}
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-base">schedule</span>
                {contact.hours}
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Clínica Odontológica Verboonen. Todos los derechos reservados.</p>
          <p>Diseñado con cuidado para tu sonrisa.</p>
        </div>
      </div>
    </footer>
  );
};
