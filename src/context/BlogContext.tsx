import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BlogPost } from '../types';
import { storage } from '../utils/storage';

interface BlogContextType {
  blogs: BlogPost[];
  getPublishedBlogs: () => BlogPost[];
  getDraftBlogs: () => BlogPost[];
  getBlogById: (id: string) => BlogPost | undefined;
  createBlog: (blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => BlogPost;
  updateBlog: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;
  publishBlog: (id: string) => void;
  unpublishBlog: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const savedBlogs = storage.getBlogs();
    if (savedBlogs.length > 0) {
      setBlogs(savedBlogs);
    } else {
      // Initialize with sample blogs
      const sampleBlogs: BlogPost[] = [
        {
          id: '1',
          title: 'The Benefits of Laser Gum Treatment',
          excerpt: 'Discover how laser technology is revolutionizing periodontal care with less discomfort...',
          content: 'For decades, the sound of the dental drill has been a source of anxiety for patients worldwide. However, a revolutionary shift is taking place in modern clinics. Laser technology is redefining what it means to visit the dentist, offering treatments that are faster, more precise, and—most importantly—nearly pain-free.\n\nDental lasers work by delivering energy in the form of light. When used for surgical and dental procedures, the laser acts as a cutting instrument or a vaporizer of tissue that it comes in contact with.',
          coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfaNCK8kOC6a3Iwhh85o8Ewwzrpce3G9kbyJcpTaYfMfJ7R7ftRLGdk7XkXWfr1Cj-FyLel56czib9PD8x6G4LGUSR4VJTh4ID5Vo8TBKTG3jUoRE-EheuPxXRfQ49J5VPiTCZXl1hxLaaDj5YFHwwXL7T-QhmmkMv3pIxTYDWl9lNZ0H-hqpLbIVgxc2PK8zRPMkDhjq4pjsUTgjgR6pwYJXs_E362iVHKN-6T0RaRIyejIkKynUqj6ksbugmdTnhshMfRWTyeEwc',
          category: 'TREATMENTS',
          tags: ['laser', 'gum treatment', 'periodontal'],
          author: 'Dr. Verboonen',
          publishedAt: '2023-10-24T00:00:00Z',
          createdAt: '2023-10-24T00:00:00Z',
          updatedAt: '2023-10-24T00:00:00Z',
          status: 'published',
        },
        {
          id: '2',
          title: '5 Daily Habits for a Radiant Smile',
          excerpt: 'Maintaining your pearly whites doesn\'t have to be a chore. Follow these simple steps...',
          content: 'Maintaining your pearly whites doesn\'t have to be a chore. Follow these simple steps to keep your smile bright and healthy every day.',
          coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBOLtFvFS1ys4ZkZ_H7C05um7dkzj-Xp7LO-mwAfMyvpXPdPOkLLpArlq5mJn8mnRU7KU8YvZTo9VS9u-zXZgArMvr5C2TyX0BtMBoF2DI2JIw4Di48N0JCON6J1_gaXq7ck7muNOMVRn8c143N1aJniyIRz5_rHzI6BKiNBkd_yuHCor_AAna9yuSPmxMhpRjaCuAuCFU1rlJoas-mhdZTBW0GJZGK-Beb3S22o_KnzsSQA5zyZVfRTIhMWfHOj9tN2qMBdAwHGnR',
          category: 'HYGIENE',
          tags: ['hygiene', 'daily habits', 'prevention'],
          author: 'Dr. Verboonen',
          publishedAt: '2023-10-18T00:00:00Z',
          createdAt: '2023-10-18T00:00:00Z',
          updatedAt: '2023-10-18T00:00:00Z',
          status: 'published',
        },
        {
          id: '3',
          title: 'Introducing Our New 3D Imaging Tech',
          excerpt: 'We are excited to announce the arrival of our latest diagnostic equipment for better accuracy...',
          content: 'We are excited to announce the arrival of our latest diagnostic equipment for better accuracy and patient care.',
          coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtaqU3B960D3jqNf1GaMjQ-4gxi9Zdh8dsNABKiksYvkeKy8mKaZjPaYgAwVDjR6cX98PD_duwQ4Oa_8gRjv32mUpuVs7j7Jn8zZyLwWQRvZj0kHniriMGfwzw_x3YUO8Wx-Ts9VdfgbUa-oTo3Lm_Pr1Os-vHRQdyMGZyZYcB8uWuOZVqBcCJpPXzlsYAiDveJvlg7CB66pjplLCR9r3dbukny-AiAVXFlpKOtA2WO4PbnGV3-82S5nOmtkk-eiGpme_nmbvjDiq2',
          category: 'CLINIC NEWS',
          tags: ['technology', '3D imaging', 'diagnostics'],
          author: 'Dr. Verboonen',
          publishedAt: '2023-10-12T00:00:00Z',
          createdAt: '2023-10-12T00:00:00Z',
          updatedAt: '2023-10-12T00:00:00Z',
          status: 'published',
        },
      ];
      setBlogs(sampleBlogs);
      storage.saveBlogs(sampleBlogs);
    }
  }, []);

  const saveBlogs = (updatedBlogs: BlogPost[]) => {
    setBlogs(updatedBlogs);
    storage.saveBlogs(updatedBlogs);
  };

  const getPublishedBlogs = () => {
    return blogs.filter(blog => blog.status === 'published').sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  };

  const getDraftBlogs = () => {
    return blogs.filter(blog => blog.status === 'draft').sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  };

  const getBlogById = (id: string) => {
    return blogs.find(blog => blog.id === id);
  };

  const createBlog = (blogData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost => {
    const now = new Date().toISOString();
    const newBlog: BlogPost = {
      ...blogData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    const updatedBlogs = [...blogs, newBlog];
    saveBlogs(updatedBlogs);
    return newBlog;
  };

  const updateBlog = (id: string, updates: Partial<BlogPost>) => {
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === id) {
        return {
          ...blog,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return blog;
    });
    saveBlogs(updatedBlogs);
  };

  const deleteBlog = (id: string) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== id);
    saveBlogs(updatedBlogs);
  };

  const publishBlog = (id: string) => {
    updateBlog(id, {
      status: 'published',
      publishedAt: new Date().toISOString(),
    });
  };

  const unpublishBlog = (id: string) => {
    updateBlog(id, {
      status: 'draft',
    });
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        getPublishedBlogs,
        getDraftBlogs,
        getBlogById,
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

export const useBlogs = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlogs must be used within a BlogProvider');
  }
  return context;
};
