'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, getToken, getUser, saveSession } from '@/lib/auth';

type AuthUser = {
  id?: number | string;
  username?: string;
  firstName?: string;
  lastName?: string;
  image?: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  checked: boolean;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
    setChecked(true);
  }, []);

  const login = (token: string, userData: AuthUser) => {
    saveSession(token, userData);
    setUser(userData);
  };

  const logout = () => {
    clearSession();
    setUser(null);
    router.push('/login');
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoggedIn: !!user || !!getToken(),
      checked,
      login,
      logout,
    }),
    [user, checked]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
