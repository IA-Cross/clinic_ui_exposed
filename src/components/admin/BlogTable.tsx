import React from 'react';
import { BlogPost } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface BlogTableProps {
  blogs: BlogPost[];
  /** Vistas por slug (de GoatCounter); null = sin dato */
  views?: Record<string, number | null>;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BlogTable: React.FC<BlogTableProps> = ({
  blogs,
  views,
  onPublish,
  onUnpublish,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Autor
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Publicado
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Vistas
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {blogs.map(blog => (
            <tr
              key={blog.id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-6 py-4">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {blog.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actualizado el {format(new Date(blog.updatedAt), "d 'de' MMM, yyyy", { locale: es })}
                </p>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                {blog.author}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                {blog.publishedAt
                  ? format(new Date(blog.publishedAt), "d 'de' MMM, yyyy", { locale: es })
                  : '—'}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                {views?.[blog.slug] ?? '—'}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    blog.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}
                >
                  {blog.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigate(`/admin/blog/${blog.id}/edit`)}
                    className="p-1.5 rounded text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Editar"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  {blog.status === 'published' ? (
                    <button
                      onClick={() => onUnpublish(blog.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Pasar a borrador"
                    >
                      <span className="material-symbols-outlined text-xl">visibility_off</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onPublish(blog.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Publicar"
                    >
                      <span className="material-symbols-outlined text-xl">publish</span>
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(blog.id)}
                    className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
