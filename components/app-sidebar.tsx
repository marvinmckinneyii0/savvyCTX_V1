'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Upload, TrendingUp, Bell, BellPlus,
  FileText, CreditCard, Settings, ChevronLeft, ChevronRight,
  LogOut, User, Zap
} from 'lucide-react';
import { ScxLogo } from '@/components/scx-logo';
import { getAuthUser, logout, type AuthUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const navSections = [
  {
    label: 'Analytics',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Upload & Analyze', href: '/analyze', icon: Upload },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { label: 'Drift History', href: '/drift', icon: TrendingUp },
      { label: 'Alerts', href: '/alerts', icon: Bell },
      { label: 'Alert Rules', href: '/alerts/rules', icon: BellPlus },
    ],
  },
  {
    label: 'Outputs',
    items: [
      { label: 'Reports', href: '/reports', icon: FileText },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Usage & Billing', href: '/usage', icon: CreditCard },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

const planColors: Record<string, string> = {
  free: 'text-[#6B6B6B] border-[#3A3A3A]',
  starter: 'text-[#3498DB] border-[#3498DB]/30',
  professional: 'text-[#D4A843] border-[#D4A843]/30',
  enterprise: 'text-[#27AE60] border-[#27AE60]/30',
};

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const u = getAuthUser();
    if (!u) {
      router.push('/login');
    } else {
      setUser(u);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    toast({ title: 'Signed out', description: 'See you next time.' });
    router.push('/login');
  };

  const planLabel = user?.plan
    ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) + ' Plan'
    : 'Free Plan';
  const planColor = planColors[user?.plan || 'free'];

  return (
    <aside
      className={cn(
        'flex flex-col bg-[#111111] border-r border-[#2A2A2A] transition-all duration-300 ease-in-out flex-shrink-0 h-screen sticky top-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center h-16 border-b border-[#2A2A2A] px-4', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && <ScxLogo size="sm" />}
        {collapsed && (
          <div className="w-7 h-7 bg-[#D4A843] rounded-lg flex items-center justify-center text-black font-bold text-sm">S</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn('p-1 rounded text-[#6B6B6B] hover:text-white hover:bg-[#2A2A2A] transition-colors', collapsed && 'hidden')}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {collapsed && (
        <div className="flex justify-center py-2 border-b border-[#2A2A2A]">
          <button onClick={() => setCollapsed(false)} className="p-1 rounded text-[#6B6B6B] hover:text-white hover:bg-[#2A2A2A] transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navSections.map(section => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <div className="px-3 mb-1.5 text-[10px] font-mono uppercase tracking-widest text-[#4A4A4A]">
                {section.label}
              </div>
            )}
            {section.items.map(item => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 group',
                    isActive
                      ? 'bg-[#D4A843]/10 text-[#D4A843] font-medium'
                      : 'text-[#9A9A9A] hover:text-white hover:bg-[#1A1A1A]',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon
                    size={16}
                    className={cn('flex-shrink-0', isActive ? 'text-[#D4A843]' : 'text-[#6B6B6B] group-hover:text-[#9A9A9A]')}
                  />
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1 h-1 bg-[#D4A843] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#2A2A2A] p-3 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 bg-[#D4A843] rounded-full flex items-center justify-center text-black font-bold text-xs flex-shrink-0">
              {user.avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.name}</div>
              <div className="text-[10px] text-[#6B6B6B] truncate">{user.email}</div>
            </div>
          </div>
        )}
        {!collapsed && (
          <div className={cn('flex items-center gap-2 px-2 py-1.5 rounded border text-xs font-mono', planColor)}>
            <Zap size={11} />
            {planLabel}
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-2 text-[#6B6B6B] hover:text-white hover:bg-[#1A1A1A] rounded-lg px-3 py-2 text-sm transition-colors w-full',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut size={14} />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  );
}
