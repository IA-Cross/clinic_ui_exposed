import React, { useState, useMemo } from 'react';
import { useBlogs } from '../context/BlogContext';
import { BlogGrid } from '../components/blog/BlogGrid';
import { CategoryFilter } from '../components/blog/CategoryFilter';
import { Pagination } from '../components/blog/Pagination';
import { NewsletterForm } from '../components/forms/NewsletterForm';

const POSTS_PER_PAGE = 6;

export const BlogListPage: React.FC = () => {
  const { getPublishedBlogs } = useBlogs();
  const allBlogs = getPublishedBlogs();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const cats = new Set(allBlogs.map(blog => blog.category));
    return Array.from(cats);
  }, [allBlogs]);

  const filteredBlogs = useMemo(() => {
    let filtered = allBlogs;

    if (selectedCategory) {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        blog =>
          blog.title.toLowerCase().includes(query) ||
          blog.excerpt.toLowerCase().includes(query) ||
          blog.content.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allBlogs, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredBlogs.slice(start, start + POSTS_PER_PAGE);
  }, [filteredBlogs, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-20 py-10">
      {/* Hero Section for Blog */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              Actualidad Dental
            </span>
            <h1 className="text-slate-900 dark:text-slate-100 text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Blog de Salud Dental Avanzada
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
              Descubre las últimas innovaciones en odontología láser y el cuidado dental
              especializado de la mano de expertos internacionales.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Buscar artículo..."
          />
        </div>
      </div>

      {/* Categories Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Blog Grid */}
      <BlogGrid blogs={paginatedBlogs} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Newsletter Section */}
      <div className="mt-20 p-8 md:p-12 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-md">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
            Suscríbete a nuestra newsletter
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Recibe consejos exclusivos de salud dental y las últimas promociones directamente en
            tu bandeja de entrada.
          </p>
        </div>
        <NewsletterForm />
      </div>
    </main>
  );
};
