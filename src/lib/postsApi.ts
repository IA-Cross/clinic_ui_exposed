import { supabase } from './supabase';
import type { BlogPost } from '../types';

// Fila en Postgres (snake_case) ↔ BlogPost (camelCase)
interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  cover_image_alt: string | null;
  category: string;
  tags: string[] | null;
  keywords: string[] | null;
  meta_description: string | null;
  author: string;
  status: 'published' | 'draft';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function fromRow(row: PostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image ?? '',
    coverImageAlt: row.cover_image_alt ?? '',
    category: row.category,
    tags: row.tags ?? [],
    keywords: row.keywords ?? [],
    metaDescription: row.meta_description ?? '',
    author: row.author,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(post: Partial<BlogPost>): Partial<PostRow> {
  const row: Partial<PostRow> = {};
  if (post.slug !== undefined) row.slug = post.slug;
  if (post.title !== undefined) row.title = post.title;
  if (post.excerpt !== undefined) row.excerpt = post.excerpt;
  if (post.content !== undefined) row.content = post.content;
  if (post.coverImage !== undefined) row.cover_image = post.coverImage;
  if (post.coverImageAlt !== undefined) row.cover_image_alt = post.coverImageAlt;
  if (post.category !== undefined) row.category = post.category;
  if (post.tags !== undefined) row.tags = post.tags;
  if (post.keywords !== undefined) row.keywords = post.keywords;
  if (post.metaDescription !== undefined) row.meta_description = post.metaDescription;
  if (post.author !== undefined) row.author = post.author;
  if (post.status !== undefined) row.status = post.status;
  if (post.publishedAt !== undefined) row.published_at = post.publishedAt;
  return row;
}

const COLUMNS =
  'id, slug, title, excerpt, content, cover_image, cover_image_alt, category, tags, keywords, meta_description, author, status, published_at, created_at, updated_at';

// RLS decide qué ve cada quien: el público solo lo publicado;
// el admin autenticado también los borradores.
export async function fetchAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(COLUMNS)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as PostRow[]).map(fromRow);
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('posts')
    .select(COLUMNS)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as PostRow) : null;
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  let query = supabase.from('posts').select('id').eq('slug', slug);
  if (excludeId) query = query.neq('id', excludeId);
  const { data, error } = await query;
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

export async function createPost(
  post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('posts')
    .insert(toRow(post))
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return fromRow(data as PostRow);
}

export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('posts')
    .update({ ...toRow(updates), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return fromRow(data as PostRow);
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}
