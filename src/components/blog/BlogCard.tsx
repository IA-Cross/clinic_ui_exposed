import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import { format } from 'date-fns';

interface BlogCardProps {
  blog: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <Link to={`/blog/${blog.id}`} className="group cursor-pointer">
      <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-200">
        <img
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={blog.coverImage}
        />
      </div>
      <div className="flex gap-2 mb-3">
        <span className="text-xs font-bold text-primary px-2 py-1 rounded bg-primary/10">
          {blog.category}
        </span>
        {blog.publishedAt && (
          <span className="text-xs text-slate-500">
            {format(new Date(blog.publishedAt), 'MMM d, yyyy')}
          </span>
        )}
      </div>
      <h4 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
        {blog.title}
      </h4>
      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
        {blog.excerpt}
      </p>
    </Link>
  );
};
