'use client';

import { useState } from 'react';
import { AppTopbar } from '@/components/app-topbar';
import { SeverityBadge } from '@/components/severity-badge';
import { DRIFT_RUNS, PIPELINE_RUNS, formatDateTime, formatDate, type DriftRun } from '@/lib/mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RotateCcw, Info, TrendingUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const datasets = Object.keys(DRIFT_RUNS);
const allDatasetsWithRuns = ['sales_q1_2026', 'customer_churn', 'inventory_march', 'revenue_by_region', 'loan_portfolio'];

const severityToColor: Record<string, string> = {
  CRITICAL: '#C0392B',
  HIGH: '#E67E22',
  MEDIUM: '#F1C40F',
  LOW: '#27AE60',
  NONE: '#3A3A3A',
};

const trendData = [
  { date: 'Apr 27', salesRevenue: 4713, churnProb: 0.278, inventory: 5200 },
  { date: 'Apr 28', salesRevenue: 4720, churnProb: 0.280, inventory: 5210 },
  { date: 'Apr 30', salesRevenue: 4751, churnProb: 0.281, inventory: 5510 },
  { date: 'May 02', salesRevenue: 4756, churnProb: 0.283, inventory: 5520 },
  { date: 'May 03', salesRevenue: 4762, churnProb: 0.285, inventory: 5640 },
  { date: 'May 04', salesRevenue: 4756, churnProb: 0.292, inventory: 5640 },
  { date: 'May 06', salesRevenue: 4820, churnProb: 0.342, inventory: 5640 },
  { date: 'May 07', salesRevenue: 4820, churnProb: 0.342, inventory: 5640 },
];

export default function DriftPage() {
  const { toast } = useToast();
  const [selectedDataset, setSelectedDataset] = useState('customer_churn');
  const [selectedRun, setSelectedRun] = useState<DriftRun | null>(DRIFT_RUNS['customer_churn']?.[0] || null);

  const runs = DRIFT_RUNS[selectedDataset] || [];
  const baselineRun = runs[runs.length - 1];
  const cleanRunCount = runs.filter(r => r.severity === 'NONE').length;

  const handleDatasetChange = (ds: string) => {
    setSelectedDataset(ds);
    setSelectedRun(DRIFT_RUNS[ds]?.[0] || null);
  };

  const handleRotateBaseline = () => {
    toast({ title: 'Baseline rotation queued', description: `New baseline will be set after next clean run for ${selectedDataset}.` });
  };

  const rowTrendData = trendData.map(d => ({ date: d.date, rows: 8600 + Math.round(Math.random() * 400) }));

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AppTopbar title="Drift History" subtitle="SCX Drift Monitor" />
      <div className="p-6 max-w-screen-2xl mx-auto">

        {/* Dataset selector */}
        <div className="flex items-center gap-3 mb-6">
          <label className="text-xs font-mono uppercase tracking-wider text-[#6B6B6B]">Dataset</label>
          <div className="relative">
            <select
              value={selectedDataset}
              onChange={e => handleDatasetChange(e.target.value)}
              className="bg-[#1A1A1A] border border-[#3A3A3A] text-white text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-[#D4A843] appearance-none"
            >
              {allDatasetsWithRuns.map(ds => (
                <option key={ds} value={ds}>{ds}.csv</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: timeline + column table */}
          <div className="lg:col-span-2 space-y-5">
            {/* Timeline */}
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-4">Run Timeline — Drift Severity</div>
              {runs.length === 0 ? (
                <div className="text-center py-8 text-[#6B6B6B] text-sm">No drift data available for this dataset yet.</div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {(PIPELINE_RUNS.filter(r => r.dataset === `${selectedDataset}.csv`).length > 0
                    ? PIPELINE_RUNS.filter(r => r.dataset === `${selectedDataset}.csv`)
                    : PIPELINE_RUNS.slice(0, 8)
                  ).map((run) => {
                    const driftRun = runs.find(dr => dr.runId === run.id);
                    const severity = driftRun?.severity || run.driftSeverity;
                    const isSelected = selectedRun?.runId === run.id;
                    return (
                      <button
                        key={run.id}
                        onClick={() => driftRun && setSelectedRun(driftRun)}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${
                            isSelected ? 'border-[#D4A843] scale-110' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: `${severityToColor[severity]}30`, borderColor: isSelected ? '#D4A843' : 'transparent' }}
                        >
                          <div className="w-full h-full rounded flex items-center justify-center">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: severityToColor[severity] }} />
                          </div>
                        </div>
                        <span className="font-data text-[9px] text-[#4A4A4A]">
                          {new Date(run.timestamp).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#1E1E1E]">
                {Object.entries({ NONE: 'None', LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', CRITICAL: 'Critical' }).map(([sev, label]) => (
                  <div key={sev} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: severityToColor[sev] }} />
                    <span className="text-[10px] text-[#6B6B6B]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column drift table */}
            {selectedRun ? (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#2A2A2A] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B]">Column Drift Detail</div>
                    <div className="text-sm font-medium text-white mt-0.5">{formatDateTime(selectedRun.timestamp)}</div>
                  </div>
                  <SeverityBadge severity={selectedRun.severity} size="md" />
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1E1E1E]">
                      {['Column', 'Baseline Mean', 'Current Mean', 'Shift %', 'Variance Ratio', 'Severity'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-[#4A4A4A]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRun.columns.map(col => (
                      <tr key={col.column} className="border-b border-[#1E1E1E] hover:bg-[#1A1A1A]">
                        <td className="px-4 py-3 font-data text-sm text-white">{col.column}</td>
                        <td className="px-4 py-3 font-data text-xs text-[#9A9A9A]">{col.baselineMean.toFixed(3)}</td>
                        <td className="px-4 py-3 font-data text-xs text-white">{col.currentMean.toFixed(3)}</td>
                        <td className="px-4 py-3">
                          <span className={`font-data text-xs font-bold ${
                            Math.abs(col.meanShiftPct) > 15 ? 'text-[#C0392B]' :
                            Math.abs(col.meanShiftPct) > 10 ? 'text-[#E67E22]' :
                            Math.abs(col.meanShiftPct) > 5 ? 'text-[#F1C40F]' : 'text-[#27AE60]'
                          }`}>
                            {col.meanShiftPct > 0 ? '+' : ''}{col.meanShiftPct.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 font-data text-xs text-[#9A9A9A]">{col.varianceRatio.toFixed(2)}</td>
                        <td className="px-4 py-3"><SeverityBadge severity={col.severity} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-8 text-center text-[#6B6B6B] text-sm">
                Select a run from the timeline to view column-level drift details.
              </div>
            )}

            {/* Trend charts */}
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-4">Column Mean Over Time</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B6B6B', fontFamily: 'JetBrains Mono' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B6B6B', fontFamily: 'JetBrains Mono' }} />
                  <Tooltip
                    contentStyle={{ background: '#1A1A1A', border: '1px solid #3A3A3A', borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: '#9A9A9A' }}
                  />
                  <Line type="monotone" dataKey="churnProb" stroke="#D4A843" strokeWidth={2} dot={false} name="churn_probability" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Baseline info */}
          <div className="space-y-5">
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-4">Baseline Info</div>
              {baselineRun ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] text-[#4A4A4A] mb-1">Baseline timestamp</div>
                    <div className="font-data text-sm text-white">{formatDateTime(baselineRun.timestamp)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#4A4A4A] mb-1">Baseline row count</div>
                    <div className="font-data text-sm text-white">{baselineRun.baselineRowCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#4A4A4A] mb-1">Clean run streak</div>
                    <div className="font-data text-2xl font-bold text-[#D4A843]">{cleanRunCount}</div>
                  </div>
                  <div className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs ${
                    cleanRunCount >= 3
                      ? 'bg-[#27AE60]/10 border border-[#27AE60]/20 text-[#27AE60]'
                      : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#6B6B6B]'
                  }`}>
                    <Info size={12} className="mt-0.5 flex-shrink-0" />
                    {cleanRunCount >= 3
                      ? 'Baseline eligible for rotation. 3+ clean runs achieved.'
                      : `${3 - cleanRunCount} more clean run${3 - cleanRunCount !== 1 ? 's' : ''} needed for rotation.`}
                  </div>
                  <button
                    onClick={handleRotateBaseline}
                    disabled={cleanRunCount < 3}
                    className="w-full flex items-center justify-center gap-2 border border-[#D4A843]/30 text-[#D4A843] hover:bg-[#D4A843]/5 disabled:opacity-30 disabled:cursor-not-allowed py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <RotateCcw size={14} /> Rotate Baseline
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 text-[#6B6B6B] text-sm">No baseline set for this dataset.</div>
              )}
            </div>

            <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-4">Row Count Trend</div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={rowTrendData}>
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#6B6B6B', fontFamily: 'JetBrains Mono' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#6B6B6B' }} width={40} />
                  <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #3A3A3A', borderRadius: 8, fontSize: 10 }} />
                  <Line type="monotone" dataKey="rows" stroke="#3498DB" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
