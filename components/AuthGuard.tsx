'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn, checked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (checked && !isLoggedIn) {
      router.replace('/login');
    }
  }, [checked, isLoggedIn, router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b17] text-slate-300">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return <>{children}</>;
}
