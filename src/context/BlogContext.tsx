import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { BlogPost } from '../types';
import * as postsApi from '../lib/postsApi';

interface BlogContextType {
  blogs: BlogPost[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getPublishedBlogs: () => BlogPost[];
  getDraftBlogs: () => BlogPost[];
  getBlogById: (id: string) => BlogPost | undefined;
  getBlogBySlug: (slug: string) => BlogPost | undefined;
  createBlog: (blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BlogPost>;
  updateBlog: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  publishBlog: (id: string) => Promise<void>;
  unpublishBlog: (id: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBlogs(await postsApi.fetchAllPosts());
    } catch {
      setError('No se pudieron cargar las entradas del blog. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getPublishedBlogs = () =>
    blogs
      .filter((blog) => blog.status === 'published')
      .sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });

  const getDraftBlogs = () =>
    blogs
      .filter((blog) => blog.status === 'draft')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getBlogById = (id: string) => blogs.find((blog) => blog.id === id);
  const getBlogBySlug = (slug: string) => blogs.find((blog) => blog.slug === slug);

  const createBlog = async (blogData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await postsApi.createPost(blogData);
    setBlogs((prev) => [created, ...prev]);
    return created;
  };

  const updateBlog = async (id: string, updates: Partial<BlogPost>) => {
    const updated = await postsApi.updatePost(id, updates);
    setBlogs((prev) => prev.map((blog) => (blog.id === id ? updated : blog)));
  };

  const deleteBlog = async (id: string) => {
    await postsApi.deletePost(id);
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
  };

  const publishBlog = (id: string) =>
    updateBlog(id, { status: 'published', publishedAt: new Date().toISOString() });

  const unpublishBlog = (id: string) => updateBlog(id, { status: 'draft' });

  return (
    <BlogContext.Provider
      value={{
        blogs,
        loading,
        error,
        refresh,
        getPublishedBlogs,
        getDraftBlogs,
        getBlogById,
        getBlogBySlug,
        createBlog,
        updateBlog,
        deleteBlog,
        publishBlog,
        unpublishBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBlogs = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlogs must be used within a BlogProvider');
  }
  return context;
};
