'use client';

import { useState } from 'react';
import { AppTopbar } from '@/components/app-topbar';
import { SeverityBadge } from '@/components/severity-badge';
import { StatusBadge } from '@/components/status-badge';
import { ALERTS, formatDateTime, timeAgo, type Alert, type AlertStatus, type Severity, type RuleType } from '@/lib/mock-data';
import { Bell, Shield, TrendingUp, Database, Activity, SquareCheck as CheckSquare, ChartBar as BarChart2, Filter, ChevronRight, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ruleTypeIcons: Record<RuleType, React.ReactNode> = {
  drift_severity: <TrendingUp size={14} />,
  mean_shift: <Activity size={14} />,
  volume_change: <Database size={14} />,
  schema_change: <BarChart2 size={14} />,
  completeness_drop: <CheckSquare size={14} />,
  dqa_severity: <Shield size={14} />,
};

const ruleTypeLabels: Record<RuleType, string> = {
  drift_severity: 'Drift Severity',
  mean_shift: 'Mean Shift',
  volume_change: 'Volume Change',
  schema_change: 'Schema Change',
  completeness_drop: 'Completeness Drop',
  dqa_severity: 'DQA Severity',
};

export default function AlertsPage() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState(ALERTS);
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<RuleType | 'all'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const filtered = alerts.filter(a => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (typeFilter !== 'all' && a.ruleType !== typeFilter) return false;
    return true;
  });

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' as AlertStatus } : a));
    if (selectedAlert?.id === id) setSelectedAlert(prev => prev ? { ...prev, status: 'acknowledged' } : null);
    toast({ title: 'Alert acknowledged' });
  };

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' as AlertStatus } : a));
    if (selectedAlert?.id === id) setSelectedAlert(prev => prev ? { ...prev, status: 'resolved' } : null);
    toast({ title: 'Alert resolved' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AppTopbar title="Alerts" subtitle="SCX Alert Center" />
      <div className="p-6 max-w-screen-2xl mx-auto">
        {/* Summary counts */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {(['active', 'acknowledged', 'resolved'] as AlertStatus[]).map(status => {
            const count = alerts.filter(a => a.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
                className={`bg-[#111111] border rounded-xl p-4 text-left transition-all ${
                  statusFilter === status ? 'border-[#D4A843]' : 'border-[#2A2A2A] hover:border-[#3A3A3A]'
                }`}
              >
                <div className="font-data text-2xl font-bold text-white mb-1">{count}</div>
                <StatusBadge status={status} />
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#6B6B6B]"><Filter size={12} />Filters:</div>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value as Severity | 'all')}
            className="bg-[#1A1A1A] border border-[#3A3A3A] text-[#9A9A9A] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4A843]">
            <option value="all">All severities</option>
            {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE'] as Severity[]).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as AlertStatus | 'all')}
            className="bg-[#1A1A1A] border border-[#3A3A3A] text-[#9A9A9A] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4A843]">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as RuleType | 'all')}
            className="bg-[#1A1A1A] border border-[#3A3A3A] text-[#9A9A9A] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4A843]">
            <option value="all">All types</option>
            {(Object.keys(ruleTypeLabels) as RuleType[]).map(t => <option key={t} value={t}>{ruleTypeLabels[t]}</option>)}
          </select>
          <div className="ml-auto text-xs text-[#6B6B6B] font-mono">{filtered.length} alerts</div>
        </div>

        <div className="grid lg:grid-cols-5 gap-5">
          {/* Alert list */}
          <div className="lg:col-span-3 space-y-2">
            {filtered.length === 0 ? (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-12 text-center">
                <Bell size={32} className="mx-auto text-[#3A3A3A] mb-3" />
                <div className="text-[#6B6B6B] text-sm">No alerts match your filters.</div>
              </div>
            ) : filtered.map(alert => (
              <button
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`w-full text-left bg-[#111111] border rounded-xl p-4 transition-all hover:border-[#3A3A3A] ${
                  selectedAlert?.id === alert.id ? 'border-[#D4A843]' : 'border-[#2A2A2A]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-[#D4A843] flex-shrink-0">{ruleTypeIcons[alert.ruleType]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-white leading-snug">{alert.title}</span>
                    </div>
                    <div className="text-xs text-[#6B6B6B] truncate mb-2">{alert.description}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <SeverityBadge severity={alert.severity} />
                      <StatusBadge status={alert.status} />
                      <span className="text-[10px] font-mono text-[#4A4A4A]">{ruleTypeLabels[alert.ruleType]}</span>
                      <span className="text-[10px] font-mono text-[#4A4A4A] ml-auto">{timeAgo(alert.timestamp)}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[#3A3A3A] flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            {selectedAlert ? (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden sticky top-20">
                <div className="p-5 border-b border-[#2A2A2A] flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Alert Detail</div>
                    <div className="font-medium text-white text-sm leading-snug">{selectedAlert.title}</div>
                  </div>
                  <button onClick={() => setSelectedAlert(null)} className="p-1 text-[#6B6B6B] hover:text-white">
                    <X size={14} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <SeverityBadge severity={selectedAlert.severity} size="md" />
                    <StatusBadge status={selectedAlert.status} />
                  </div>

                  <div>
                    <div className="text-[10px] text-[#4A4A4A] uppercase tracking-wider mb-1">Description</div>
                    <div className="text-sm text-[#CCCCCC] leading-relaxed">{selectedAlert.description}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] text-[#4A4A4A] mb-1">Triggered</div>
                      <div className="font-data text-xs text-[#9A9A9A]">{formatDateTime(selectedAlert.timestamp)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#4A4A4A] mb-1">Dataset</div>
                      <div className="font-data text-xs text-[#9A9A9A]">{selectedAlert.dataset}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#4A4A4A] mb-1">Rule type</div>
                      <div className="text-xs text-[#9A9A9A]">{ruleTypeLabels[selectedAlert.ruleType]}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#4A4A4A] mb-1">Run ID</div>
                      <div className="font-data text-xs text-[#9A9A9A]">{selectedAlert.runId}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#4A4A4A] uppercase tracking-wider mb-2">Evidence</div>
                    <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg p-3">
                      <pre className="font-data text-[11px] text-[#9A9A9A] whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(selectedAlert.evidence, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {selectedAlert.status === 'active' && (
                      <button
                        onClick={() => handleAcknowledge(selectedAlert.id)}
                        className="flex-1 bg-[#F1C40F]/10 border border-[#F1C40F]/30 text-[#F1C40F] hover:bg-[#F1C40F]/20 py-2 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                    {selectedAlert.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolve(selectedAlert.id)}
                        className="flex-1 bg-[#27AE60]/10 border border-[#27AE60]/30 text-[#27AE60] hover:bg-[#27AE60]/20 py-2 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                    {selectedAlert.status === 'resolved' && (
                      <div className="flex-1 text-center py-2 text-xs text-[#6B6B6B]">Resolved — no action needed</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-8 text-center">
                <Bell size={24} className="mx-auto text-[#3A3A3A] mb-3" />
                <div className="text-[#6B6B6B] text-sm">Select an alert to view details</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
