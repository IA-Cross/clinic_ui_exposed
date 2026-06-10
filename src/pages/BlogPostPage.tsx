import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useBlogs } from '../context/BlogContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BlogCard } from '../components/blog/BlogCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Seo } from '../components/common/Seo';
import { SITE_NAME, SITE_URL } from '../config/site';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getBlogBySlug, getPublishedBlogs, loading } = useBlogs();

  const blog = slug ? getBlogBySlug(slug) : undefined;
  const allBlogs = getPublishedBlogs();
  const relatedBlogs = allBlogs
    .filter(b => b.slug !== slug && b.category === blog?.category)
    .slice(0, 3);

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-20 py-24">
        <LoadingSpinner />
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-20 py-10">
        <Seo title="Artículo no encontrado" description="El artículo que buscas no existe." noindex />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
          <Link to="/blog" className="text-primary hover:underline">
            Volver al blog
          </Link>
        </div>
      </main>
    );
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.metaDescription || blog.excerpt,
    image: blog.coverImage || undefined,
    keywords: blog.keywords.join(', ') || undefined,
    datePublished: blog.publishedAt ?? undefined,
    dateModified: blog.updatedAt,
    author: { '@type': 'Person', name: blog.author },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${blog.slug}`,
    inLanguage: 'es',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: blog.title, item: `${SITE_URL}/blog/${blog.slug}` },
    ],
  };

  return (
    <main className="flex-grow">
      <Seo
        title={blog.title}
        description={blog.metaDescription || blog.excerpt}
        path={`/blog/${blog.slug}`}
        image={blog.coverImage || undefined}
        type="article"
        jsonLd={[articleJsonLd, breadcrumbJsonLd]}
      />

      {/* Migas de pan */}
      <div className="mx-auto max-w-4xl px-6 pt-8">
        <nav aria-label="Migas de pan" className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-primary">
            Inicio
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/blog" className="hover:text-primary">
            Blog
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-200">{blog.category}</span>
        </nav>
      </div>

      <article className="mx-auto max-w-4xl px-6 py-8">
        <header className="mb-10">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-slate-900 dark:text-slate-50">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-6 border-y border-slate-200 dark:border-slate-800 py-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full bg-slate-200">
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">person</span>
                </div>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-none mb-1">
                  {blog.author}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Clínica Verboonen</p>
              </div>
            </div>
            {blog.publishedAt && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                <span>
                  {format(new Date(blog.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
              </div>
            )}
          </div>
        </header>

        {blog.coverImage && (
          <div className="relative mb-12 h-[450px] w-full overflow-hidden rounded-xl shadow-lg">
            <img
              alt={blog.coverImageAlt || blog.title}
              className="h-full w-full object-cover"
              src={blog.coverImage}
            />
          </div>
        )}

        {/* Contenido en Markdown */}
        <div className="prose prose-slate prose-lg dark:prose-invert max-w-none">
          <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300 mb-8">
            {blog.excerpt}
          </p>
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

        {blog.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 pt-8">
            {blog.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {relatedBlogs.length > 0 && (
        <section className="bg-white dark:bg-slate-900 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Artículos relacionados
                </h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Sigue aprendiendo sobre salud dental.
                </p>
              </div>
              <Link
                to="/blog"
                className="group flex items-center gap-1 font-bold text-primary"
              >
                Ver todos
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map(relatedBlog => (
                <BlogCard key={relatedBlog.id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
