'use client';

import { useState } from 'react';
import { AppTopbar } from '@/components/app-topbar';
import { ALERT_RULES, type AlertRule, type RuleType } from '@/lib/mock-data';
import { Plus, CreditCard as Edit2, Trash2, Play, Lock, X, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/status-badge';
import { formatDateTime } from '@/lib/mock-data';

const ruleTypeLabels: Record<RuleType, string> = {
  drift_severity: 'Drift Severity',
  mean_shift: 'Mean Shift',
  volume_change: 'Volume Change',
  schema_change: 'Schema Change',
  completeness_drop: 'Completeness Drop',
  dqa_severity: 'DQA Severity',
};

const ruleTypeDescriptions: Record<RuleType, string> = {
  drift_severity: 'Alert when overall drift severity reaches a threshold',
  mean_shift: 'Alert when a column mean shifts by a percentage from baseline',
  volume_change: 'Alert when row count changes beyond a percentage threshold',
  schema_change: 'Alert when columns are added or removed from the dataset',
  completeness_drop: 'Alert when column completeness (non-null rate) drops below a threshold',
  dqa_severity: 'Alert when the overall DQA score falls below a threshold',
};

const FREE_RULE_LIMIT = 1;
const USER_PLAN: string = 'professional';

interface RuleFormState {
  type: RuleType;
  column: string;
  threshold: string;
  channels: { email: boolean; log: boolean };
  description: string;
}

export default function AlertRulesPage() {
  const { toast } = useToast();
  const [rules, setRules] = useState(ALERT_RULES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<RuleFormState>({
    type: 'drift_severity',
    column: '',
    threshold: '10',
    channels: { email: true, log: true },
    description: '',
  });

  const isFree = USER_PLAN === 'free';
  const canAddRule = !isFree || rules.filter(r => r.enabled).length < FREE_RULE_LIMIT;

  const toggleEnabled = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast({ title: 'Rule updated' });
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    setDeleteConfirm(null);
    toast({ title: 'Rule deleted' });
  };

  const testRule = (rule: AlertRule) => {
    toast({ title: 'Rule test triggered', description: `Testing "${rule.description}" against latest dataset output.` });
  };

  const openEdit = (rule: AlertRule) => {
    setEditingRule(rule);
    setForm({
      type: rule.type,
      column: rule.column || '',
      threshold: rule.threshold?.toString() || '',
      channels: { email: rule.deliveryChannels.includes('email'), log: rule.deliveryChannels.includes('log') },
      description: rule.description,
    });
    setShowAddModal(true);
  };

  const openAdd = () => {
    setEditingRule(null);
    setForm({ type: 'drift_severity', column: '', threshold: '10', channels: { email: true, log: true }, description: '' });
    setShowAddModal(true);
  };

  const saveRule = () => {
    const channels = ([form.channels.email && 'email', form.channels.log && 'log'].filter(Boolean)) as ('email' | 'log')[];
    if (editingRule) {
      setRules(prev => prev.map(r => r.id === editingRule.id ? {
        ...r, type: form.type, column: form.column || null, threshold: form.threshold ? parseFloat(form.threshold) : null,
        deliveryChannels: channels, description: form.description,
      } : r));
      toast({ title: 'Rule updated' });
    } else {
      const newRule: AlertRule = {
        id: `rule_${Date.now()}`, type: form.type, column: form.column || null,
        threshold: form.threshold ? parseFloat(form.threshold) : null,
        enabled: true, lastTriggered: null, deliveryChannels: channels, description: form.description,
      };
      setRules(prev => [...prev, newRule]);
      toast({ title: 'Rule created', description: 'Alert rule is now active.' });
    }
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AppTopbar title="Alert Rules" subtitle="SCX Alert Center" />
      <div className="p-6 max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-[#6B6B6B]">
              {rules.filter(r => r.enabled).length} active · {rules.filter(r => !r.enabled).length} disabled
            </div>
          </div>
          <button
            onClick={() => {
              if (!canAddRule) {
                toast({ title: 'Rule limit reached', description: 'Free plan is limited to 1 active rule. Upgrade to add more.', variant: 'destructive' });
                return;
              }
              openAdd();
            }}
            className="flex items-center gap-2 bg-[#D4A843] hover:bg-[#E8C469] text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all"
          >
            <Plus size={14} /> Add Rule
            {isFree && <Lock size={11} className="ml-1" />}
          </button>
        </div>

        {isFree && (
          <div className="flex items-center justify-between bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl px-5 py-3 mb-5">
            <div className="text-sm text-[#D4A843] font-mono">Free plan: 1 active rule maximum</div>
            <button className="text-xs bg-[#D4A843] text-black font-semibold px-3 py-1.5 rounded-lg">Upgrade</button>
          </div>
        )}

        <div className="space-y-3">
          {rules.map(rule => (
            <div
              key={rule.id}
              className={`bg-[#111111] border rounded-xl p-5 transition-all ${
                rule.enabled ? 'border-[#2A2A2A]' : 'border-[#1A1A1A] opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleEnabled(rule.id)}
                  className={`mt-0.5 w-9 h-5 rounded-full flex items-center transition-all flex-shrink-0 ${
                    rule.enabled ? 'bg-[#D4A843]' : 'bg-[#2A2A2A]'
                  }`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${rule.enabled ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium text-white">{rule.description}</span>
                    {rule.enabled && <span className="text-[10px] font-mono bg-[#27AE60]/10 text-[#27AE60] border border-[#27AE60]/20 px-1.5 py-0.5 rounded uppercase">Active</span>}
                  </div>
                  <div className="flex items-center gap-4 flex-wrap text-xs text-[#6B6B6B]">
                    <span className="font-mono text-[#D4A843]">{ruleTypeLabels[rule.type]}</span>
                    {rule.column && <span>Column: <span className="font-mono text-[#9A9A9A]">{rule.column}</span></span>}
                    {rule.threshold !== null && <span>Threshold: <span className="font-mono text-[#9A9A9A]">{rule.threshold}%</span></span>}
                    <span>Channels: <span className="font-mono text-[#9A9A9A]">{rule.deliveryChannels.join(', ')}</span></span>
                    {rule.lastTriggered && <span>Last triggered: <span className="font-mono text-[#9A9A9A]">{formatDateTime(rule.lastTriggered)}</span></span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => testRule(rule)} className="p-2 text-[#6B6B6B] hover:text-[#27AE60] hover:bg-[#27AE60]/10 rounded-lg transition-colors" title="Test rule">
                    <Play size={13} />
                  </button>
                  <button onClick={() => openEdit(rule)} className="p-2 text-[#6B6B6B] hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors" title="Edit rule">
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(rule.id)}
                    className="p-2 text-[#6B6B6B] hover:text-[#C0392B] hover:bg-[#C0392B]/10 rounded-lg transition-colors" title="Delete rule"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {deleteConfirm === rule.id && (
                <div className="mt-3 pt-3 border-t border-[#2A2A2A] flex items-center justify-between bg-[#C0392B]/5 -mx-5 -mb-5 px-5 pb-4 rounded-b-xl">
                  <span className="text-sm text-[#C0392B]">Delete this rule? This cannot be undone.</span>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 text-xs border border-[#3A3A3A] text-[#9A9A9A] rounded-lg hover:bg-[#1A1A1A]">Cancel</button>
                    <button onClick={() => deleteRule(rule.id)} className="px-3 py-1.5 text-xs bg-[#C0392B] text-white rounded-lg hover:bg-[#A93226]">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-[#111111] border border-[#3A3A3A] rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-lg text-white">{editingRule ? 'Edit Rule' : 'Add Alert Rule'}</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 text-[#6B6B6B] hover:text-white"><X size={16} /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Rule type</label>
                  <div className="relative">
                    <select
                      value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value as RuleType }))}
                      className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A843] appearance-none"
                    >
                      {(Object.keys(ruleTypeLabels) as RuleType[]).map(t => <option key={t} value={t}>{ruleTypeLabels[t]}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-[#6B6B6B] mt-1">{ruleTypeDescriptions[form.type]}</p>
                </div>

                {(form.type === 'mean_shift' || form.type === 'completeness_drop') && (
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Column name</label>
                    <input
                      type="text"
                      value={form.column}
                      onChange={e => setForm(f => ({ ...f, column: e.target.value }))}
                      placeholder="e.g. revenue_usd"
                      className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A843]"
                    />
                  </div>
                )}

                {form.type !== 'schema_change' && (
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">
                      Threshold {form.type === 'dqa_severity' ? '(DQA score %)' : '(%)'}
                    </label>
                    <input
                      type="number"
                      value={form.threshold}
                      onChange={e => setForm(f => ({ ...f, threshold: e.target.value }))}
                      min="0" max="100"
                      className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A843]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Delivery channels</label>
                  <div className="flex gap-3">
                    {(['email', 'log'] as const).map(ch => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, channels: { ...f.channels, [ch]: !f.channels[ch] } }))}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono border transition-all ${
                          form.channels[ch]
                            ? 'bg-[#D4A843]/10 border-[#D4A843]/30 text-[#D4A843]'
                            : 'border-[#3A3A3A] text-[#6B6B6B]'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded border flex-shrink-0 ${form.channels[ch] ? 'bg-[#D4A843] border-[#D4A843]' : 'border-[#4A4A4A]'}`} />
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description of what this rule monitors"
                    className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A843]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 border border-[#3A3A3A] text-[#9A9A9A] hover:text-white py-2.5 rounded-xl text-sm transition-colors">
                    Cancel
                  </button>
                  <button onClick={saveRule} className="flex-1 bg-[#D4A843] hover:bg-[#E8C469] text-black font-semibold py-2.5 rounded-xl text-sm transition-all">
                    {editingRule ? 'Save Changes' : 'Create Rule'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
