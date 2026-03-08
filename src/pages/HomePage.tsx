import React from 'react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import { BlogGrid } from '../components/blog/BlogGrid';
import { Button } from '../components/common/Button';
import { ContactForm } from '../components/forms/ContactForm';

export const HomePage: React.FC = () => {
  const { getPublishedBlogs } = useBlogs();
  const latestBlogs = getPublishedBlogs().slice(0, 3);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <span className="material-symbols-outlined text-sm">bolt</span>
                Next-Gen Dental Tech
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                Advanced Laser Dentistry for a{' '}
                <span className="text-primary">Brighter Smile</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                Experience the future of dental care with our high-tech laser treatments.
                Painless, precise, and personalized for your comfort.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button variant="primary" className="px-8 py-4 text-lg">
                  Book Your Visit
                </Button>
                <Button variant="outline" className="px-8 py-4 text-lg">
                  Our Services
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full border-4 border-white dark:border-background-dark bg-slate-200"></div>
                  <div className="w-12 h-12 rounded-full border-4 border-white dark:border-background-dark bg-slate-300"></div>
                  <div className="w-12 h-12 rounded-full border-4 border-white dark:border-background-dark bg-slate-400"></div>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  Trusted by <span className="text-slate-900 dark:text-white font-bold">2,000+ patients</span> every year
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-square shadow-2xl bg-slate-100">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
                <img
                  alt="Laser Dentistry"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK5Lu_AviwXavpLLdVSbvwxYah-uLW-xOSkMLcFqnBoc906_XLnVh2sqh-p4ugAxGcrFJUMOVw-rSZfGZmINP25IsPcylKtB_3uaTipWxOLB-wTD3_pgCTCOKWeUgZnyZkOQnqH81XHkGs5WWCS3thpH3WAKq-Fer38CiGQiCjS6JRPasyPcFNHdyfO_1ytfrgEPh_lS7el0ZZIZhjry_KGj003_nrPg-WzBPsQFHQtDsv8fjufd9lP4R9we_BX2DAmjDNtLh7iSvi"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-white dark:bg-slate-900/50" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">
              About Our Clinic
            </h2>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6">
              High-Tech Care, Personalized for You
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              We combine years of expertise with cutting-edge laser technology to provide
              painless and effective dental solutions for the whole family.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background-light dark:bg-background-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-3xl">precision_manufacturing</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Laser Technology</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Precision laser treatments for faster healing times and minimally invasive
                procedures.
              </p>
            </div>
            <div className="bg-background-light dark:bg-background-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-3xl">medical_services</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Expert Dentists</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Certified professionals with global experience and a passion for oral health
                excellence.
              </p>
            </div>
            <div className="bg-background-light dark:bg-background-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Painless Care</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Our advanced techniques ensure maximum comfort and anxiety-free dental visits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-24" id="blog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">
                Blog & Updates
              </h2>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                Latest From Our Experts
              </h3>
            </div>
            <Link
              to="/blog"
              className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            >
              View all posts <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <BlogGrid blogs={latestBlogs} />
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-24 bg-white dark:bg-slate-900/50" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">
                Contact Us
              </h2>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-8">
                Get in Touch with Our Team
              </h3>
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1">Our Location</p>
                    <p className="text-slate-600 dark:text-slate-400">
                      123 Laser Avenue, Healthcare District<br />
                      Mexico City, MX 01000
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1">Phone Number</p>
                    <p className="text-slate-600 dark:text-slate-400">
                      +52 (55) 1234-5678<br />
                      Mon-Fri: 9am - 7pm
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden h-64 bg-slate-200 border border-slate-200 dark:border-slate-800">
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl">map</span>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
};
