'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CircleAlert as AlertCircle } from 'lucide-react';
import { ScxLogo } from '@/components/scx-logo';
import { login } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('demo@savvyanalytics.info');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));
    const result = login(email, password);

    if (result.success) {
      toast({ title: 'Welcome back!', description: `Signed in as ${result.user?.name}` });
      router.push('/dashboard');
    } else {
      setError(result.error || 'Authentication failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/">
            <ScxLogo size="lg" showTagline />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-white mb-1">Sign in to SavvyCortex</h1>
            <p className="text-[#6B6B6B] text-sm">Enter your credentials to access the platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors placeholder-[#4A4A4A]"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors placeholder-[#4A4A4A]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#9A9A9A] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-[#C0392B]/10 border border-[#C0392B]/30 rounded-lg px-4 py-3 text-sm text-[#C0392B]">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4A843] hover:bg-[#E8C469] disabled:opacity-50 text-black font-semibold py-3 rounded-lg transition-all text-sm hover:shadow-lg hover:shadow-[#D4A843]/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
            <p className="text-center text-sm text-[#6B6B6B]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#D4A843] hover:underline font-medium">
                Start Free
              </Link>
            </p>
          </div>

          <div className="mt-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#4A4A4A] mb-1">Demo credentials</div>
            <div className="text-xs font-mono text-[#6B6B6B]">
              <span className="text-[#9A9A9A]">demo@savvyanalytics.info</span> / <span className="text-[#9A9A9A]">demo123</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#4A4A4A] mt-6">
          Powered by{' '}
          <a href="https://www.savvyanalytics.info/" target="_blank" rel="noopener noreferrer" className="text-[#6B6B6B] hover:text-[#D4A843] transition-colors">
            Savvy Analytics
          </a>
        </p>
      </div>
    </div>
  );
}
