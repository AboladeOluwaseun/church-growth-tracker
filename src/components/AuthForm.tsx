'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isLogin = type === 'login';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-border overflow-hidden relative shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <Lock size={24} />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gradient">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              {isLogin 
                ? 'Sign in to access your dashboard and track follow-ups.' 
                : 'Join the Membership Integration Unit.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name-input" className="text-sm font-medium ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                    <User size={16} />
                  </div>
                  <input
                    id="name-input"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="input-field !pl-14 pr-4"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email-input" className="text-sm font-medium ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                  <Mail size={16} />
                </div>
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder="name@church.com"
                  className="input-field !pl-14 pr-4"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password-input" className="text-sm font-medium">Password</label>
                {isLogin && (
                  <Link href="#" className="text-xs text-primary hover:underline font-medium opacity-80">
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                  <Lock size={16} />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="input-field !pl-14 pr-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors z-10 cursor-pointer focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 p-3 rounded-xl border border-destructive/10"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don&apos;t have an account?" : "Already have an account?"}{' '}
              <Link 
                href={isLogin ? '/auth/signup' : '/auth/login'} 
                className="text-primary font-bold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
