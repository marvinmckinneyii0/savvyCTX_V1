'use client';

import { useState, useEffect } from 'react';
import { AppTopbar } from '@/components/app-topbar';
import { getAuthUser, setAuthUser, type AuthUser } from '@/lib/auth';
import { Eye, EyeOff, TriangleAlert as AlertTriangle, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPws, setShowPws] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [outputFormat, setOutputFormat] = useState<'DOCX' | 'PDF'>('PDF');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  useEffect(() => {
    const u = getAuthUser();
    if (u) { setUser(u); setName(u.name); setEmail(u.email); }
  }, []);

  const saveProfile = () => {
    if (!user) return;
    const updated = { ...user, name, email };
    setAuthUser(updated);
    setUser(updated);
    toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
  };

  const changePassword = () => {
    if (!currentPw) { toast({ title: 'Enter current password', variant: 'destructive' }); return; }
    if (newPw !== confirmPw) { toast({ title: 'Passwords do not match', variant: 'destructive' }); return; }
    if (newPw.length < 6) { toast({ title: 'Password too short', variant: 'destructive' }); return; }
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    toast({ title: 'Password changed successfully' });
  };

  const deleteAccount = () => {
    if (deleteText !== 'DELETE') { toast({ title: 'Type DELETE to confirm', variant: 'destructive' }); return; }
    toast({ title: 'Account deletion requested', description: 'Your account will be deleted within 24 hours.' });
    setDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AppTopbar title="Settings" subtitle="SCX Platform" />
      <div className="p-6 max-w-2xl mx-auto space-y-6">

        {/* Profile */}
        <section className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-5">Profile</div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#D4A843] rounded-full flex items-center justify-center text-black font-bold text-xl">
              {user?.avatarInitials || 'U'}
            </div>
            <div>
              <div className="text-white font-medium">{user?.name}</div>
              <div className="text-sm text-[#6B6B6B]">{user?.email}</div>
              <div className="text-xs font-mono text-[#D4A843] capitalize mt-0.5">{user?.plan} plan</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A843]" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A843]" />
            </div>
            <button onClick={saveProfile} className="flex items-center gap-2 bg-[#D4A843] hover:bg-[#E8C469] text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
              <Save size={14} /> Save Changes
            </button>
          </div>
        </section>

        {/* Change password */}
        <section className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-5">Change Password</div>
          <div className="space-y-4">
            {[
              { label: 'Current password', value: currentPw, set: setCurrentPw },
              { label: 'New password', value: newPw, set: setNewPw },
              { label: 'Confirm new password', value: confirmPw, set: setConfirmPw },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">{label}</label>
                <div className="relative">
                  <input
                    type={showPws ? 'text' : 'password'}
                    value={value}
                    onChange={e => set(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#D4A843]"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPws(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]">
                    {showPws ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}
            <button onClick={changePassword} className="flex items-center gap-2 border border-[#D4A843]/30 text-[#D4A843] hover:bg-[#D4A843]/5 px-5 py-2.5 rounded-xl text-sm transition-colors">
              <Save size={14} /> Update Password
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-5">Preferences</div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Email alert notifications</div>
                <div className="text-xs text-[#6B6B6B] mt-0.5">Receive alert emails when rules trigger</div>
              </div>
              <button
                onClick={() => { setEmailAlerts(e => !e); toast({ title: emailAlerts ? 'Email alerts disabled' : 'Email alerts enabled' }); }}
                className={`w-10 h-6 rounded-full flex items-center transition-all ${emailAlerts ? 'bg-[#D4A843]' : 'bg-[#2A2A2A]'}`}
              >
                <span className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${emailAlerts ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div>
              <div className="text-sm font-medium text-white mb-2">Default output format</div>
              <div className="flex gap-2">
                {(['DOCX', 'PDF'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => { setOutputFormat(f); toast({ title: `Default format set to ${f}` }); }}
                    className={`px-4 py-2 rounded-lg text-sm font-mono border transition-all ${
                      outputFormat === f ? 'bg-[#D4A843]/10 border-[#D4A843]/30 text-[#D4A843]' : 'border-[#3A3A3A] text-[#6B6B6B]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-white mb-2">Theme</div>
              <div className="flex gap-2">
                {(['dark', 'light'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); toast({ title: `${t.charAt(0).toUpperCase() + t.slice(1)} mode applied` }); }}
                    className={`px-4 py-2 rounded-lg text-sm capitalize border transition-all ${
                      theme === t ? 'bg-[#D4A843]/10 border-[#D4A843]/30 text-[#D4A843]' : 'border-[#3A3A3A] text-[#6B6B6B]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-[#111111] border border-[#C0392B]/20 rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#C0392B] mb-5">Danger Zone</div>
          {!deleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Delete account</div>
                <div className="text-xs text-[#6B6B6B] mt-0.5">Permanently delete your account and all associated data.</div>
              </div>
              <button onClick={() => setDeleteConfirm(true)} className="flex items-center gap-2 border border-[#C0392B]/30 text-[#C0392B] hover:bg-[#C0392B]/10 px-4 py-2 rounded-lg text-sm transition-colors">
                <AlertTriangle size={13} /> Delete Account
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-[#C0392B]">
                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                This action is permanent and cannot be undone. All your data, reports, and alert rules will be deleted.
              </div>
              <div>
                <label className="block text-xs font-mono text-[#6B6B6B] mb-2">Type <span className="text-[#C0392B]">DELETE</span> to confirm</label>
                <input
                  type="text"
                  value={deleteText}
                  onChange={e => setDeleteText(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C0392B]/30 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C0392B]"
                  placeholder="DELETE"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setDeleteConfirm(false); setDeleteText(''); }} className="flex items-center gap-2 border border-[#3A3A3A] text-[#9A9A9A] hover:text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  <X size={14} /> Cancel
                </button>
                <button onClick={deleteAccount} className="flex-1 bg-[#C0392B] hover:bg-[#A93226] text-white font-semibold py-2 rounded-lg text-sm transition-colors">
                  Permanently Delete Account
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
