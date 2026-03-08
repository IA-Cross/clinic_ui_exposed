import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { BlogTable } from '../components/admin/BlogTable';
import { Button } from '../components/common/Button';

export const AdminDashboardPage: React.FC = () => {
  const { getPublishedBlogs, getDraftBlogs, publishBlog, unpublishBlog, deleteBlog } = useBlogs();
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');
  const navigate = useNavigate();

  const publishedBlogs = getPublishedBlogs();
  const draftBlogs = getDraftBlogs();

  const handlePublish = (id: string) => {
    publishBlog(id);
  };

  const handleUnpublish = (id: string) => {
    unpublishBlog(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(id);
    }
  };

  const totalBlogs = publishedBlogs.length + draftBlogs.length;
  const pendingDrafts = draftBlogs.length;

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Blog Management
              </h3>
              <p className="text-slate-500 mt-1">
                Manage your drafts and published articles for the clinic's portal.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate('/admin/blog/new')}
              className="flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Create New Blog
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Total Articles
              </p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">{totalBlogs}</span>
                <span className="text-primary text-sm font-medium">+3 this month</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Total Views
              </p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">12.8k</span>
                <span className="text-emerald-500 text-sm font-medium">↑ 12%</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Pending Drafts
              </p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">{pendingDrafts}</span>
                <span className="text-amber-500 text-sm font-medium">Needs review</span>
              </div>
            </div>
          </div>

          {/* Content Area with Tabs */}
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
                Published Blogs
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`px-6 py-4 border-b-2 text-sm font-bold transition-colors ${
                  activeTab === 'drafts'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Saved Drafts
              </button>
            </div>
            <div className="p-6">
              {activeTab === 'published' ? (
                publishedBlogs.length > 0 ? (
                  <BlogTable
                    blogs={publishedBlogs}
                    onPublish={handlePublish}
                    onUnpublish={handleUnpublish}
                    onDelete={handleDelete}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">No published blogs yet.</p>
                  </div>
                )
              ) : (
                draftBlogs.length > 0 ? (
                  <BlogTable
                    blogs={draftBlogs}
                    onPublish={handlePublish}
                    onUnpublish={handleUnpublish}
                    onDelete={handleDelete}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">No draft blogs yet.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
