'use client';

import { useState } from 'react';
import { AppTopbar } from '@/components/app-topbar';
import { PLANS, USAGE, formatDate } from '@/lib/mock-data';
import { CircleCheck as CheckCircle, Circle as XCircle, Zap, ArrowUpRight, CreditCard, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function UsageBar({ used, limit, label, unit }: { used: number; limit: number; label: string; unit: string }) {
  const pct = limit < 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const color = pct >= 90 ? '#C0392B' : pct >= 70 ? '#E67E22' : '#27AE60';
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[#CCCCCC]">{label}</span>
        <span className="font-data text-sm">
          {limit < 0 ? (
            <span className="text-[#27AE60]">Unlimited</span>
          ) : (
            <><span style={{ color }}>{used.toLocaleString()}</span><span className="text-[#4A4A4A]"> / {limit.toLocaleString()} {unit}</span></>
          )}
        </span>
      </div>
      {limit >= 0 && (
        <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      )}
      {limit < 0 && (
        <div className="h-2 bg-[#27AE60]/20 rounded-full">
          <div className="h-full w-full bg-[#27AE60]/30 rounded-full" />
        </div>
      )}
    </div>
  );
}

export default function UsagePage() {
  const { toast } = useToast();
  const [billingAnnual, setBillingAnnual] = useState(false);
  const currentPlan = PLANS.find(p => p.id === USAGE.plan)!;
  const daysRemaining = Math.ceil((new Date(USAGE.billingCycleEnd).getTime() - Date.now()) / 86400000);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AppTopbar title="Usage & Billing" subtitle="SCX Platform" />
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Current plan card */}
        <div className="bg-[#111111] border border-[#D4A843]/30 rounded-2xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Current Plan</div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-display text-2xl font-bold text-white">{currentPlan.name}</span>
                <span className="text-[10px] font-mono bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/30 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="font-data text-[#D4A843] text-lg">${USAGE.monthlyPrice}<span className="text-[#6B6B6B] text-sm font-sans">/month</span></div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => toast({ title: 'Manage Billing', description: 'Stripe billing portal coming in Phase 4.' })}
                className="flex items-center gap-2 border border-[#3A3A3A] text-[#9A9A9A] hover:text-white hover:border-[#4A4A4A] px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <CreditCard size={14} /> Manage Billing
              </button>
              <button
                onClick={() => toast({ title: 'Upgrade coming soon', description: 'Enterprise plan contact: savvyanalytics.info/book-online' })}
                className="flex items-center gap-2 bg-[#D4A843] hover:bg-[#E8C469] text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all"
              >
                <ArrowUpRight size={14} /> Upgrade Plan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-[#2A2A2A]">
            <div>
              <div className="text-[10px] text-[#4A4A4A] mb-1">Billing cycle</div>
              <div className="font-data text-xs text-[#9A9A9A]">{formatDate(USAGE.billingCycleStart)} — {formatDate(USAGE.billingCycleEnd)}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#4A4A4A] mb-1">Next billing date</div>
              <div className="flex items-center gap-1.5">
                <Calendar size={11} className="text-[#D4A843]" />
                <span className="font-data text-xs text-[#9A9A9A]">{formatDate(USAGE.nextBillingDate)}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#4A4A4A] mb-1">Days remaining</div>
              <div className="font-data text-2xl font-bold text-[#D4A843]">{daysRemaining}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#4A4A4A] mb-1">Reports this cycle</div>
              <div className="font-data text-xs text-[#9A9A9A]">{USAGE.reportsUsed} / {USAGE.reportsLimit} used</div>
            </div>
          </div>
        </div>

        {/* Usage meters */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-5">Usage This Billing Cycle</div>
          <div className="space-y-5">
            <UsageBar used={USAGE.reportsUsed} limit={USAGE.reportsLimit} label="Reports Generated" unit="reports" />
            <UsageBar used={USAGE.dataMbUsed} limit={USAGE.dataMbLimit} label="Data Processed" unit="MB" />
            <UsageBar used={USAGE.rulesUsed} limit={USAGE.rulesLimit} label="Monitoring Rules" unit="rules" />
          </div>
        </div>

        {/* Plan comparison */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">Compare Plans</div>
            <div className="flex gap-1 bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg p-1">
              <button onClick={() => setBillingAnnual(false)} className={`px-3 py-1 rounded text-xs font-mono transition-all ${!billingAnnual ? 'bg-[#2A2A2A] text-white' : 'text-[#6B6B6B]'}`}>Monthly</button>
              <button onClick={() => setBillingAnnual(true)} className={`px-3 py-1 rounded text-xs font-mono transition-all flex items-center gap-1 ${billingAnnual ? 'bg-[#2A2A2A] text-white' : 'text-[#6B6B6B]'}`}>
                Annual <span className="text-[10px] bg-[#D4A843]/20 text-[#D4A843] px-1 rounded">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map(plan => {
              const isCurrent = plan.id === USAGE.plan;
              return (
                <div key={plan.id} className={`bg-[#111111] border rounded-xl p-5 relative ${isCurrent ? 'border-[#D4A843]' : 'border-[#2A2A2A]'}`}>
                  {isCurrent && (
                    <div className="absolute -top-2.5 left-4 bg-[#D4A843] text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">Current</div>
                  )}
                  {plan.badge && !isCurrent && (
                    <div className="absolute -top-2.5 left-4 bg-[#2A2A2A] text-[#D4A843] text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-[#D4A843]/30">Popular</div>
                  )}
                  <div className="font-display font-bold text-white mb-2">{plan.name}</div>
                  <div className="font-data text-xl font-bold text-white mb-3">
                    {plan.monthlyPrice === null ? 'Custom' : plan.monthlyPrice === 0 ? 'Free' : `$${billingAnnual ? plan.annualPrice : plan.monthlyPrice}/mo`}
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.slice(0, 5).map(f => (
                      <li key={f.text} className="flex items-center gap-1.5 text-xs">
                        {f.included ? <CheckCircle size={11} className="text-[#27AE60] flex-shrink-0" /> : <XCircle size={11} className="text-[#3A3A3A] flex-shrink-0" />}
                        <span className={f.included ? 'text-[#CCCCCC]' : 'text-[#3A3A3A]'}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div className="text-center py-2 text-xs text-[#D4A843] font-mono">Current plan</div>
                  ) : (
                    <button
                      onClick={() => toast({ title: plan.monthlyPrice === null ? 'Contact sales' : `Upgrade to ${plan.name}`, description: plan.monthlyPrice === null ? 'savvyanalytics.info/book-online' : 'Stripe integration coming in Phase 4.' })}
                      className="w-full py-2 rounded-lg text-xs font-semibold border border-[#D4A843]/30 text-[#D4A843] hover:bg-[#D4A843]/5 transition-colors"
                    >
                      {plan.cta}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
