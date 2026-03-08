import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-4xl">dentistry</span>
              <h2 className="text-2xl font-bold tracking-tight">
                Clínica Odontológica <span className="text-primary">Láser Verboonen</span>
              </h2>
            </div>
            <p className="text-slate-400 max-w-md mb-8">
              Providing excellence in modern dentistry since 1995. Our commitment is your smile and your health through the latest laser technologies.
            </p>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-sm">public</span>
              </a>
              <a
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-sm">share</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <a className="hover:text-primary transition-colors" href="#services">
                  Services
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Our Doctors
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Testimonials
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Patient Resources</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Patient Portal
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Insurance Info
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© 2023 Clínica Odontológica Láser Verboonen. All rights reserved.</p>
          <p>Designed with Care for Your Smile.</p>
        </div>
      </div>
    </footer>
  );
};
