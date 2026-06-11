import imageCompression from 'browser-image-compression';
import { supabase, isDevMock } from './supabase';
import { slugify } from '../utils/slugify';

const BUCKET = 'blog-images';

// Comprime en el navegador antes de subir para cuidar el límite gratuito
// de almacenamiento (1 GB) y la velocidad de carga del blog.
export async function uploadImage(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 1600,
    maxSizeMB: 0.3,
    useWebWorker: true,
    fileType: 'image/webp',
  });

  // Demo local: la imagen vive solo en la memoria del navegador
  if (isDevMock) return URL.createObjectURL(compressed);

  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'imagen';
  const path = `${Date.now()}-${base}.webp`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType: 'image/webp',
    cacheControl: '31536000',
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
