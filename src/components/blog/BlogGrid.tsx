import React from 'react';
import { BlogPost } from '../../types';
import { BlogCard } from './BlogCard';

interface BlogGridProps {
  blogs: BlogPost[];
}

export const BlogGrid: React.FC<BlogGridProps> = ({ blogs }) => {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};
