import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="text-primary">
              <span className="material-symbols-outlined text-4xl">dentistry</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Clínica Odontológica<br />
              <span className="text-primary">Láser Verboonen</span>
            </h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-primary' : 'hover:text-primary'
              }`}
            >
              Home
            </Link>
            <a
              href="#about"
              className="text-sm font-semibold hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#services"
              className="text-sm font-semibold hover:text-primary transition-colors"
            >
              Services
            </a>
            <Link
              to="/blog"
              className={`text-sm font-semibold transition-colors ${
                isActive('/blog') ? 'text-primary' : 'hover:text-primary'
              }`}
            >
              Blog
            </Link>
            <a
              href="#contact"
              className="text-sm font-semibold hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="primary">Book Appointment</Button>
            <button
              className="md:hidden p-2"
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
            <Link
              to="/"
              className="text-sm font-semibold hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="#about"
              className="text-sm font-semibold hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#services"
              className="text-sm font-semibold hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </a>
            <Link
              to="/blog"
              className="text-sm font-semibold hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <a
              href="#contact"
              className="text-sm font-semibold hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};
