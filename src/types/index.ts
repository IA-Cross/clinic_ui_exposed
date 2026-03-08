export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
  quickLinks?: Array<{ label: string; url: string }>;
}

export interface AuthUser {
  username: string;
  name: string;
}
