import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { BlogTable } from '../components/admin/BlogTable';
import { Button } from '../components/common/Button';
import { Seo } from '../components/common/Seo';
import { getSiteStats, getPathViews, getDashboardUrl, SiteStats } from '../lib/goatcounter';

export const AdminDashboardPage: React.FC = () => {
  const { getPublishedBlogs, getDraftBlogs, publishBlog, unpublishBlog, deleteBlog } = useBlogs();
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [views, setViews] = useState<Record<string, number | null>>({});
  const navigate = useNavigate();

  const publishedBlogs = getPublishedBlogs();
  const draftBlogs = getDraftBlogs();

  useEffect(() => {
    getSiteStats()
      .then(setStats)
      .finally(() => setStatsLoading(false));
  }, []);

  // Vistas por artículo vía el contador público de GoatCounter
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        publishedBlogs.map(async (b) => [b.slug, await getPathViews(`/blog/${b.slug}`)] as const),
      );
      if (!cancelled) setViews(Object.fromEntries(entries));
    })();
    return () => {
      cancelled = true;
    };
    // Solo al cambiar el número de publicados (evita refetch en cada render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishedBlogs.length]);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro que quieres eliminar esta entrada? Esta acción no se puede deshacer.')) {
      await deleteBlog(id);
    }
  };

  const totalBlogs = publishedBlogs.length + draftBlogs.length;
  const last7 = stats?.last30Days.slice(-7).reduce((sum, d) => sum + d.visits, 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <Seo title="Panel de administración" description="Panel de administración" noindex />
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Gestión del Blog
              </h3>
              <p className="text-slate-500 mt-1">
                Administra los borradores y artículos publicados del sitio.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate('/admin/blog/new')}
              className="flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nueva entrada
            </Button>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Artículos totales
              </p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">{totalBlogs}</span>
                <span className="text-amber-500 text-sm font-medium">
                  {draftBlogs.length} en borrador
                </span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Visitas totales del sitio
              </p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">
                  {statsLoading ? '…' : stats ? stats.totalViews.toLocaleString('es-MX') : '—'}
                </span>
                {last7 !== undefined && (
                  <span className="text-emerald-500 text-sm font-medium">
                    {last7.toLocaleString('es-MX')} últimos 7 días
                  </span>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Página más visitada
              </p>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold truncate">
                  {statsLoading ? '…' : stats?.topPages[0]?.path ?? '—'}
                </span>
                {stats?.topPages[0] && (
                  <span className="text-primary text-sm font-medium shrink-0 ml-2">
                    {stats.topPages[0].count.toLocaleString('es-MX')} vistas
                  </span>
                )}
              </div>
            </div>
          </div>

          {!statsLoading && !stats && (
            <p className="text-sm text-slate-500 mb-8">
              No se pudieron cargar las métricas detalladas.{' '}
              <a
                href={getDashboardUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                Abrir panel de GoatCounter
              </a>
            </p>
          )}
          {stats && (
            <p className="text-sm text-slate-500 mb-8">
              Métricas de GoatCounter.{' '}
              <a
                href={getDashboardUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                Ver panel completo
              </a>
            </p>
          )}

          {/* Tabla con pestañas */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="border-b border-slate-200 dark:border-slate-800 flex px-6">
              <button
                onClick={() => setActiveTab('published')}
                className={`px-6 py-4 border-b-2 text-sm font-bold transition-colors ${
                  activeTab === 'published'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Publicados ({publishedBlogs.length})
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`px-6 py-4 border-b-2 text-sm font-bold transition-colors ${
                  activeTab === 'drafts'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Borradores ({draftBlogs.length})
              </button>
            </div>
            <div className="p-6">
              {activeTab === 'published' ? (
                publishedBlogs.length > 0 ? (
                  <BlogTable
                    blogs={publishedBlogs}
                    views={views}
                    onPublish={publishBlog}
                    onUnpublish={unpublishBlog}
                    onDelete={handleDelete}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">Aún no hay artículos publicados.</p>
                  </div>
                )
              ) : draftBlogs.length > 0 ? (
                <BlogTable
                  blogs={draftBlogs}
                  views={views}
                  onPublish={publishBlog}
                  onUnpublish={unpublishBlog}
                  onDelete={handleDelete}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">No hay borradores guardados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
