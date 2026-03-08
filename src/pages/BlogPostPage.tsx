import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import { format } from 'date-fns';
import { BlogCard } from '../components/blog/BlogCard';

export const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlogById, getPublishedBlogs } = useBlogs();

  const blog = id ? getBlogById(id) : undefined;
  const allBlogs = getPublishedBlogs();
  const relatedBlogs = allBlogs
    .filter(b => b.id !== id && b.category === blog?.category)
    .slice(0, 3);

  if (!blog) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-20 py-10">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link to="/blog" className="text-primary hover:underline">
            Return to blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow">
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-4xl px-6 pt-8">
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/blog" className="hover:text-primary">
            Blog
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-200">{blog.category}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <article className="mx-auto max-w-4xl px-6 py-8">
        <header className="mb-10">
          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl text-slate-900 dark:text-slate-50">
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
                <p className="text-sm text-slate-500 dark:text-slate-400">Lead Dentist & Laser Specialist</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              {blog.publishedAt && (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                    <span>{format(new Date(blog.publishedAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    <span>15 min read</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative mb-12 h-[450px] w-full overflow-hidden rounded-xl shadow-lg">
          <img
            alt={blog.title}
            className="h-full w-full object-cover"
            src={blog.coverImage}
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-slate prose-lg dark:prose-invert max-w-none">
          <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300 first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left mb-8">
            {blog.excerpt}
          </p>
          <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
            {blog.content}
          </div>
        </div>

        {/* Tags */}
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
      </article>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="bg-white dark:bg-slate-900 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Related Articles
                </h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Continue learning about modern dental health.
                </p>
              </div>
              <Link
                to="/blog"
                className="group flex items-center gap-1 font-bold text-primary"
              >
                View all posts
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

      {/* Newsletter Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Join our newsletter
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Get the latest news on dental technology and tips for a healthier smile delivered to
            your inbox.
          </p>
        </div>
      </section>
    </main>
  );
};
