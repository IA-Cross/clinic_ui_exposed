import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { RichTextEditor } from '../components/admin/RichTextEditor';
import { Button } from '../components/common/Button';
import { Seo } from '../components/common/Seo';
import { BlogPost } from '../types';
import { slugify } from '../utils/slugify';
import { uploadImage } from '../lib/uploadImage';
import { isSlugTaken } from '../lib/postsApi';

const CATEGORIES = [
  'ORTODONCIA',
  'ODONTOLOGÍA GENERAL',
  'ODONTOLOGÍA PEDIÁTRICA',
  'ORTOPEDIA MAXILAR',
  'CRECIMIENTO Y DESARROLLO',
  'ORTHOKINÉTICA',
  'HIGIENE',
  'NOTICIAS',
];

const META_MAX = 155;

export const AdminEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlogById, createBlog, updateBlog, deleteBlog } = useBlogs();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!id;
  const existingBlog = id ? getBlogById(id) : null;

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    coverImageAlt: '',
    category: CATEGORIES[0],
    tags: [],
    keywords: [],
    metaDescription: '',
    author: 'Dra. Verboonen',
    status: 'draft',
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingBlog) {
      setFormData(existingBlog);
      setTagInput(existingBlog.tags.join(', '));
      setKeywordInput(existingBlog.keywords.join(', '));
      setSlugTouched(true);
    }
  }, [existingBlog]);

  const setField = <K extends keyof BlogPost>(key: K, value: BlogPost[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      // El slug sigue al título hasta que el admin lo edite a mano
      slug: slugTouched ? prev.slug : slugify(title),
    }));
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      setField('coverImage', url);
    } catch {
      setError('No se pudo subir la imagen. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const parseList = (input: string) =>
    input.split(',').map((t) => t.trim()).filter(Boolean);

  const validate = async (): Promise<string | null> => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      return 'Completa al menos título, descripción breve y contenido.';
    }
    const slug = formData.slug || slugify(formData.title);
    if (!slug) return 'El slug (URL) no puede quedar vacío.';
    try {
      if (await isSlugTaken(slug, id)) {
        return `Ya existe otra entrada con la URL "${slug}". Cámbiala para continuar.`;
      }
    } catch {
      return 'No se pudo verificar la URL. Revisa tu conexión.';
    }
    return null;
  };

  const save = async (status: 'draft' | 'published') => {
    setError('');
    const problem = await validate();
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    const payload = {
      ...formData,
      slug: formData.slug || slugify(formData.title!),
      tags: parseList(tagInput),
      keywords: parseList(keywordInput),
      status,
      publishedAt:
        status === 'published'
          ? formData.publishedAt ?? new Date().toISOString()
          : formData.publishedAt ?? null,
    };
    try {
      if (isEditing && id) {
        await updateBlog(id, payload);
      } else {
        await createBlog(payload as Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>);
      }
      navigate('/admin');
    } catch {
      setError('No se pudo guardar. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Seguro que quieres eliminar esta entrada? Esta acción no se puede deshacer.')) {
      if (id) await deleteBlog(id);
      navigate('/admin');
    }
  };

  const metaLen = formData.metaDescription?.length ?? 0;

  return (
    <div className="flex h-screen overflow-hidden">
      <Seo title={isEditing ? 'Editar entrada' : 'Nueva entrada'} description="Editor del blog" noindex />
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-[840px] mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-primary w-fit"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="text-sm font-bold">Volver al panel</span>
              </button>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {isEditing ? 'Editar entrada' : 'Nueva entrada'}
              </h1>
            </div>

            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Imagen de portada */}
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-t-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-3 transition-all hover:border-primary/50"
                >
                  {formData.coverImage ? (
                    <img
                      src={formData.coverImage}
                      alt="Portada"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-sm text-primary">
                        <span className="material-symbols-outlined text-3xl">
                          {uploading ? 'hourglass_top' : 'add_photo_alternate'}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          {uploading ? 'Subiendo imagen…' : 'Haz clic para subir la imagen de portada'}
                        </p>
                        <p className="text-xs text-slate-500">
                          Se comprime automáticamente (recomendado: horizontal)
                        </p>
                      </div>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <div className="p-4 grid md:grid-cols-2 gap-3">
                  {formData.coverImage && (
                    <button
                      type="button"
                      onClick={() => setField('coverImage', '')}
                      className="text-sm text-red-500 font-semibold text-left"
                    >
                      Quitar imagen
                    </button>
                  )}
                  <input
                    type="text"
                    value={formData.coverImageAlt}
                    onChange={(e) => setField('coverImageAlt', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm md:col-start-2"
                    placeholder="Texto alternativo de la imagen (mejora el SEO)"
                  />
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Título
                  </label>
                  <input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-xl font-bold placeholder:text-slate-400"
                    placeholder="Un título atractivo para tu artículo…"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    URL (slug)
                  </label>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-slate-400 shrink-0">/blog/</span>
                    <input
                      value={formData.slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setField('slug', slugify(e.target.value) || e.target.value);
                      }}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary font-mono"
                      placeholder="url-del-articulo"
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Descripción breve
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setField('excerpt', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-base min-h-[80px] resize-none placeholder:text-slate-400"
                    placeholder="Un resumen corto que aparece en las tarjetas del blog…"
                  />
                </div>

                <RichTextEditor
                  value={formData.content || ''}
                  onChange={(value) => setField('content', value)}
                />
              </div>
            </div>

            {/* SEO y clasificación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">travel_explore</span>
                  SEO
                </h3>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
                    Meta descripción
                    <span className={metaLen > META_MAX ? 'text-red-500' : 'text-slate-400'}>
                      {metaLen}/{META_MAX}
                    </span>
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setField('metaDescription', e.target.value)}
                    className="mt-1 w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm px-4 py-2 min-h-[70px] resize-none"
                    placeholder="Texto que mostrará Google bajo el título (ideal ≤155 caracteres)…"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Palabras clave (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm px-4 py-2"
                    placeholder="ortodoncia, brackets, sonrisa…"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">label</span>
                  Clasificación
                </h3>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setField('category', e.target.value)}
                    className="mt-1 w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm px-4 py-2"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Etiquetas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm px-4 py-2"
                    placeholder="blanqueamiento, consejos…"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Autor</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setField('author', e.target.value)}
                    className="mt-1 w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm px-4 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pb-12">
              <Button variant="secondary" onClick={() => save('draft')} className="flex-1" disabled={saving || uploading}>
                {saving ? 'Guardando…' : 'Guardar borrador'}
              </Button>
              <Button variant="primary" onClick={() => save('published')} className="flex-1" disabled={saving || uploading}>
                {saving ? 'Guardando…' : 'Publicar'}
              </Button>
              {isEditing && (
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={saving}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
