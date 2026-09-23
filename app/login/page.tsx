'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { APP_CONFIG } from '../config/app.config';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username: trimmedUsername,
        password,
      });

      const data = response.data;
      const token = data.accessToken || data.token;

      login(token, {
        id: data.id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      });

      router.push('/product');
    } catch (err: any) {
      const status = err?.status;
      if (status === 400 || status === 401 || status === 404) {
        setError('Invalid username or password.');
      } else {
        setError(err?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b17] px-4 py-10 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.35),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.32),transparent_30%)]" />
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/15 bg-white/5 shadow-[0_30px_90px_rgba(79,70,229,0.38)] backdrop-blur-2xl">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden border-r border-white/10 bg-[linear-gradient(135deg,rgba(91,33,182,0.78),rgba(30,64,175,0.72),rgba(15,23,42,0.92))] p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_20%),radial-gradient(circle_at_80%_80%,rgba(96,165,250,0.18),transparent_30%)]" />

            <div className="relative z-10">
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.18)] backdrop-blur-lg">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-violet-100" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
                    <path d="M8 9.5h8M8 13h6" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-violet-100/80">Operations</p>
                  <p className="text-lg font-semibold text-white">Product Admin</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-violet-100">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]" />
                    Smart inventory flow
                  </span>
                  <h1 className="mt-6 max-w-sm text-4xl font-semibold leading-tight text-white">
                    Manage products with clarity and speed.
                  </h1>
                </div>

                <div className="space-y-4 text-sm text-slate-200">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-white">Secure team access</p>
                      <p className="mt-1 text-slate-300">Keep product operations protected, visible, and easy to manage.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-200">
                      ⌁
                    </span>
                    <div>
                      <p className="font-semibold text-white">Live inventory visibility</p>
                      <p className="mt-1 text-slate-300">Track updates, search products, and keep the catalog organized.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-sm text-violet-100/80">
              Built for fast product decisions and cleaner workflow visibility.
            </div>
          </section>

          <section className="flex items-center justify-center bg-slate-950/40 p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="text-xs font-medium uppercase tracking-[0.26em] text-violet-300">Welcome back</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Sign in</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-200">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition focus:border-violet-400/80 focus:bg-white/8 focus:ring-2 focus:ring-violet-500/40"
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition focus:border-violet-400/80 focus:bg-white/8 focus:ring-2 focus:ring-violet-500/40"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200">
                    {error}
                  </div>
                ) : null}

                <div className="rounded-2xl border border-violet-400/20 bg-violet-500/8 px-3 py-2 text-sm text-slate-200">
                  Demo access: <span className="font-mono font-semibold text-white">{APP_CONFIG.dummy_user}</span> / <span className="font-mono font-semibold text-white">{APP_CONFIG.dummy_password}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center rounded-2xl border border-violet-300/30 bg-[linear-gradient(135deg,#8b5cf6,#3b82f6)] px-4 py-3 text-base font-semibold text-white shadow-[0_18px_35px_rgba(99,102,241,0.5)] transition hover:scale-[1.01] hover:shadow-[0_22px_40px_rgba(99,102,241,0.6)] disabled:cursor-not-allowed disabled:opacity-75"
                >
                  <span>{loading ? 'Signing in...' : 'Log in'}</span>
                  {!loading ? (
                    <svg viewBox="0 0 24 24" className="ml-2 h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  ) : null}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}