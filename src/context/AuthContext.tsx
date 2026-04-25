import { createContext, useContext, useState, type ReactNode } from 'react';

// 1. تعريف الأدوار في مكان واحد (سهل تزود فيه مستقبلاً)
export type UserRole = 'admin' | 'accountant' | 'reviewer' | 'writer' | 'client';

interface User {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // ✅ تطبيق OCP: الفنكشن دي مش هتتغير أبداً حتى لو بقى عندك 100 دور
  const hasRole = (role: UserRole) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, setUser, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
