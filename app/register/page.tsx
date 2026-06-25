'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react';
import { ScxLogo } from '@/components/scx-logo';
import { register } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { PLANS } from '@/lib/mock-data';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', plan: 'free' });
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!termsAccepted) { setError('Please accept the Terms of Service to continue.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const result = register(form.name, form.email, form.password, form.plan);
    if (result.success) {
      toast({ title: 'Account created!', description: `Welcome to SavvyCortex, ${result.user?.name}.` });
      router.push('/dashboard');
    } else {
      setError(result.error || 'Registration failed.');
    }
    setLoading(false);
  };

  const displayedPlans = PLANS.filter(p => p.id !== 'enterprise');

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-10">
          <Link href="/">
            <ScxLogo size="lg" showTagline />
          </Link>
        </div>

        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-[#6B6B6B] text-sm">Start free — no credit card required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Full name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  required
                  className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors"
                  placeholder="Alex Morgan"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Work email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  required
                  className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  required
                  className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors"
                  placeholder="At least 6 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Confirm password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                required
                className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors"
                placeholder="Repeat password"
              />
            </div>

            {/* Plan selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-3">Select a plan</label>
              <div className="grid grid-cols-3 gap-3">
                {displayedPlans.map(plan => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => update('plan', plan.id)}
                    className={`relative border rounded-xl p-3 text-left transition-all ${
                      form.plan === plan.id
                        ? 'border-[#D4A843] bg-[#D4A843]/5'
                        : 'border-[#3A3A3A] bg-[#1A1A1A] hover:border-[#4A4A4A]'
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-2 right-2 bg-[#D4A843] text-black text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Popular</div>
                    )}
                    {form.plan === plan.id && (
                      <CheckCircle size={12} className="absolute top-2 right-2 text-[#D4A843]" />
                    )}
                    <div className="font-semibold text-sm text-white">{plan.name}</div>
                    <div className="font-data text-xs text-[#D4A843] mt-0.5">
                      {plan.monthlyPrice === 0 ? 'Free' : `$${plan.monthlyPrice}/mo`}
                    </div>
                    <div className="text-[10px] text-[#6B6B6B] mt-1">{plan.reportsLimit} reports/mo</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setTermsAccepted(!termsAccepted)}
                className={`mt-0.5 w-4 h-4 flex-shrink-0 border rounded transition-all ${termsAccepted ? 'bg-[#D4A843] border-[#D4A843]' : 'border-[#3A3A3A]'}`}
              >
                {termsAccepted && <span className="text-black text-xs flex items-center justify-center">✓</span>}
              </button>
              <p className="text-sm text-[#6B6B6B]">
                I agree to the{' '}
                <a href="https://www.savvyanalytics.info/terms" target="_blank" rel="noopener noreferrer" className="text-[#D4A843] hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="https://www.savvyanalytics.info/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#D4A843] hover:underline">
                  Privacy Policy
                </a>
              </p>
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
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
            <p className="text-center text-sm text-[#6B6B6B]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#D4A843] hover:underline font-medium">
                Log in
              </Link>
            </p>
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
