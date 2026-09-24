'use client';

import {
  createContext,
  useCallback,
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

const AUTH_EXPIRED_EVENT = 'auth:expired';
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const syncSession = () => {
      setUser(getUser());
      setChecked(true);
    };

    const timer = window.setTimeout(syncSession, 0);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => {
      clearSession();
      setUser(null);
      setChecked(true);
      router.replace('/login');
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpiredSession);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpiredSession);
  }, [router]);

  const login = useCallback((token: string, userData: AuthUser) => {
    saveSession(token, userData);
    setUser(userData);
    setChecked(true);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setChecked(true);
    router.push('/login');
  }, [router]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoggedIn: !!user || !!getToken(),
      checked,
      login,
      logout,
    }),
    [user, checked, login, logout]
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
