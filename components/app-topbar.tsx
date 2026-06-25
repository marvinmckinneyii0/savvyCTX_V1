'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { ScxLogo } from '@/components/scx-logo';
import { getAuthUser, logout, type AuthUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { ALERTS } from '@/lib/mock-data';

interface AppTopbarProps {
  title?: string;
  subtitle?: string;
}

export function AppTopbar({ title, subtitle }: AppTopbarProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const activeAlerts = ALERTS.filter(a => a.status === 'active').length;

  const handleLogout = () => {
    logout();
    toast({ title: 'Signed out', description: 'See you next time.' });
    router.push('/login');
  };

  return (
    <header className="h-14 border-b border-[#2A2A2A] bg-[#111111]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        {title && <h1 className="font-display text-lg font-semibold text-white leading-none">{title}</h1>}
        {subtitle && <p className="text-[10px] font-mono text-[#6B6B6B] mt-0.5 uppercase tracking-wider">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/alerts" className="relative p-2 text-[#6B6B6B] hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors">
          <Bell size={16} />
          {activeAlerts > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C0392B] rounded-full" />
          )}
        </Link>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            <div className="w-7 h-7 bg-[#D4A843] rounded-full flex items-center justify-center text-black font-bold text-xs">
              {user?.avatarInitials || 'U'}
            </div>
            <ChevronDown size={12} className="text-[#6B6B6B]" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-52 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#2A2A2A]">
                  <div className="text-sm font-medium text-white">{user?.name}</div>
                  <div className="text-xs text-[#6B6B6B]">{user?.email}</div>
                </div>
                <Link href="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#9A9A9A] hover:text-white hover:bg-[#2A2A2A] transition-colors">
                  <User size={14} /> Profile
                </Link>
                <Link href="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#9A9A9A] hover:text-white hover:bg-[#2A2A2A] transition-colors">
                  <Settings size={14} /> Settings
                </Link>
                <div className="border-t border-[#2A2A2A] mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#C0392B] hover:bg-[#C0392B]/10 transition-colors w-full text-left"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
