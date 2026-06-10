import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoColor from '../../assets/brand/logo-color.webp';

const navLinks = [
  { to: '/', label: 'Inicio', route: true },
  { to: '/#servicios', label: 'Servicios', route: true },
  { to: '/blog', label: 'Blog', route: true },
  { to: '/#contacto', label: 'Contacto', route: true },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const renderLink = (link: (typeof navLinks)[number], onClick?: () => void) =>
    link.route ? (
      <Link
        key={link.label}
        to={link.to}
        onClick={onClick}
        className={`text-sm font-semibold transition-colors ${
          isActive(link.to) ? 'text-primary' : 'hover:text-primary'
        }`}
      >
        {link.label}
      </Link>
    ) : (
      <a
        key={link.label}
        href={link.to}
        onClick={onClick}
        className="text-sm font-semibold hover:text-primary transition-colors"
      >
        {link.label}
      </a>
    );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img
              src={logoColor}
              alt="Clínica Odontológica Verboonen"
              width={600}
              height={360}
              className="h-14 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => renderLink(link))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/#contacto"
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Agenda tu Cita
            </Link>
            <button
              className="md:hidden p-2"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4">
            {navLinks.map((link) => renderLink(link, () => setMobileMenuOpen(false)))}
            <Link
              to="/#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-primary"
            >
              Agenda tu Cita
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
