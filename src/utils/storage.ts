const STORAGE_KEYS = {
  BLOGS: 'clinic_blogs',
  AUTH: 'clinic_auth',
} as const;

export const storage = {
  getBlogs: (): any[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BLOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBlogs: (blogs: any[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
    } catch (error) {
      console.error('Failed to save blogs:', error);
    }
  },

  getAuth: (): any | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveAuth: (auth: any): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
    } catch (error) {
      console.error('Failed to save auth:', error);
    }
  },

  clearAuth: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
  },
};
