import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedAuth = storage.getAuth();
    if (savedAuth) {
      setUser(savedAuth);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Simple authentication - in production, this would call an API
    // For demo purposes, accept any username/password
    if (username && password) {
      const authUser: AuthUser = {
        username,
        name: username, // Use username as name, can be customized
      };
      setUser(authUser);
      storage.saveAuth(authUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    storage.clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
