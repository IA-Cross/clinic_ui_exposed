import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { RichTextEditor } from '../components/admin/RichTextEditor';
import { Button } from '../components/common/Button';
import { BlogPost } from '../types';

export const AdminEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlogById, createBlog, updateBlog, deleteBlog, publishBlog } = useBlogs();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isEditing = !!id;
  const existingBlog = id ? getBlogById(id) : null;

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'TREATMENTS',
    tags: [],
    author: user?.name || 'Dr. Verboonen',
    status: 'draft',
    quickLinks: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    if (existingBlog) {
      setFormData({
        title: existingBlog.title,
        excerpt: existingBlog.excerpt,
        content: existingBlog.content,
        coverImage: existingBlog.coverImage,
        category: existingBlog.category,
        tags: existingBlog.tags,
        author: existingBlog.author,
        status: existingBlog.status,
        quickLinks: existingBlog.quickLinks || [],
      });
      setTagInput(existingBlog.tags.join(', '));
    }
  }, [existingBlog]);

  const handleSaveDraft = () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    if (isEditing && id) {
      updateBlog(id, {
        ...formData,
        status: 'draft',
      } as BlogPost);
    } else {
      createBlog({
        ...formData,
        status: 'draft',
      } as Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>);
    }

    navigate('/admin');
  };

  const handlePublish = () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    if (isEditing && id) {
      updateBlog(id, {
        ...formData,
        status: 'published',
        publishedAt: new Date().toISOString(),
      } as BlogPost);
    } else {
      const newBlog = createBlog({
        ...formData,
        status: 'published',
        publishedAt: new Date().toISOString(),
      } as Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>);
      publishBlog(newBlog.id);
    }

    navigate('/admin');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      if (id) {
        deleteBlog(id);
      }
      navigate('/admin');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const tags = tagInput.split(',').map(t => t.trim()).filter(t => t);
      setFormData({ ...formData, tags });
    }
  };

  const handleAddLink = () => {
    if (linkLabel.trim() && linkUrl.trim()) {
      const newLinks = [...(formData.quickLinks || []), { label: linkLabel, url: linkUrl }];
      setFormData({ ...formData, quickLinks: newLinks });
      setLinkLabel('');
      setLinkUrl('');
    }
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = formData.quickLinks?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, quickLinks: newLinks });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-[840px] mx-auto flex flex-col gap-8">
            {/* Title Section */}
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-primary w-fit"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="text-sm font-bold">Back to Blog List</span>
              </button>
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Share dental health tips and updates with your clinic's patients.
              </p>
            </div>

            {/* Post Form */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Post Image Upload Area */}
              <div className="p-1">
                <div className="group relative w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-t-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-3 transition-all hover:border-primary/50">
                  {formData.coverImage ? (
                    <img
                      src={formData.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-sm text-primary">
                        <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Click to upload cover image
                        </p>
                        <p className="text-xs text-slate-500">Recommended: 1200x630px (PNG, JPG)</p>
                      </div>
                    </>
                  )}
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    placeholder="Image URL"
                  />
                </div>
                <div className="p-4">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                    placeholder="Or paste image URL here"
                  />
                </div>
              </div>

              {/* Editor Fields */}
              <div className="p-6 md:p-8 flex flex-col gap-6">
                {/* Post Title Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Post Title
                  </label>
                  <input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-xl font-bold placeholder:text-slate-400"
                    placeholder="Enter an engaging title for your post..."
                    type="text"
                  />
                </div>

                {/* Post Excerpt */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Brief Description
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-base min-h-[80px] resize-none placeholder:text-slate-400"
                    placeholder="A short summary of what this post is about..."
                  />
                </div>

                {/* Rich Text Editor */}
                <RichTextEditor
                  value={formData.content || ''}
                  onChange={value => setFormData({ ...formData, content: value })}
                />
              </div>
            </div>

            {/* Post Settings Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">label</span>
                  Taxonomy & Meta
                </h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Categories</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm px-4 py-2"
                    >
                      <option value="TREATMENTS">TREATMENTS</option>
                      <option value="HYGIENE">HYGIENE</option>
                      <option value="CLINIC NEWS">CLINIC NEWS</option>
                      <option value="TECHNOLOGY">TECHNOLOGY</option>
                      <option value="ESTÉTICA">ESTÉTICA</option>
                      <option value="IMPLANTES">IMPLANTES</option>
                      <option value="PREVENCIÓN">PREVENCIÓN</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Tags (comma separated)
                    </label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onBlur={handleAddTag}
                        className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm px-4 py-2"
                        placeholder="teeth whitening, health tips..."
                      />
                    </div>
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">link</span>
                  Quick Links
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={linkLabel}
                      onChange={e => setLinkLabel(e.target.value)}
                      className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm px-4 py-2"
                      placeholder="Link label"
                    />
                    <input
                      type="text"
                      value={linkUrl}
                      onChange={e => setLinkUrl(e.target.value)}
                      className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm px-4 py-2"
                      placeholder="URL (e.g. /booking)"
                    />
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary/20"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-1">
                    These links will appear in a call-to-action box at the end of the post.
                  </p>
                  {formData.quickLinks && formData.quickLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.quickLinks.map((link, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {link.label}
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(index)}
                            className="material-symbols-outlined text-[14px] hover:text-red-500"
                          >
                            close
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pb-12">
              <Button variant="secondary" onClick={handleSaveDraft} className="flex-1">
                Save as Draft
              </Button>
              <Button variant="primary" onClick={handlePublish} className="flex-1">
                Publish Now
              </Button>
              {isEditing && (
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
