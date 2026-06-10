export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  coverImage: string;
  coverImageAlt: string;
  category: string;
  tags: string[];
  keywords: string[];
  metaDescription: string;
  author: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
}

export interface AuthUser {
  username: string;
  name: string;
}

export interface SiteSettings {
  contact: {
    phone: string;
    whatsapp: string; // solo dígitos con código de país, p.ej. 5215512345678
    email: string;
    address: string;
    hours: string;
    mapsUrl: string;
  };
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
  seo: {
    defaultDescription: string;
  };
}
