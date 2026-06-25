'use client';

import { useState, useMemo } from 'react';
import { AppTopbar } from '@/components/app-topbar';
import { SeverityBadge } from '@/components/severity-badge';
import { StatusBadge } from '@/components/status-badge';
import {
  PIPELINE_RUNS, formatDateTime, formatDuration, timeAgo,
  type PipelineRun, type RunStatus, type Severity
} from '@/lib/mock-data';
import { CircleCheck as CheckCircle, Circle as XCircle, Clock, TriangleAlert as AlertTriangle, TrendingUp, ChartBar as BarChart2, ChevronDown, ChevronUp, ExternalLink, Filter, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const successRate = Math.round(
  (PIPELINE_RUNS.filter(r => r.status === 'success').length / PIPELINE_RUNS.length) * 100
);

const latestRun = PIPELINE_RUNS[0];
const avgDqaScore = Math.round(
  PIPELINE_RUNS.filter(r => r.dqaScore > 0).reduce((sum, r) => sum + r.dqaScore, 0) /
  PIPELINE_RUNS.filter(r => r.dqaScore > 0).length * 10
) / 10;

const activeAlertCount = 2;

function dqaColor(score: number) {
  if (score >= 90) return 'text-[#27AE60]';
  if (score >= 75) return 'text-[#F1C40F]';
  if (score >= 60) return 'text-[#E67E22]';
  return 'text-[#C0392B]';
}

const sparklinePoints = [88, 91, 87, 94, 92, 95, 93, 96, 94, 97];
function buildSparkline(points: number[], w = 80, h = 28): string {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const xStep = w / (points.length - 1);
  return points
    .map((v, i) => {
      const x = i * xStep;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<RunStatus | 'all'>('all');
  const [datasetFilter, setDatasetFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof PipelineRun>('timestamp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const datasets = useMemo(() => {
    const s = new Set(PIPELINE_RUNS.map(r => r.dataset));
    return ['all', ...Array.from(s)];
  }, []);

  const filtered = useMemo(() => {
    let runs = [...PIPELINE_RUNS];
    if (statusFilter !== 'all') runs = runs.filter(r => r.status === statusFilter);
    if (datasetFilter !== 'all') runs = runs.filter(r => r.dataset === datasetFilter);
    runs.sort((a, b) => {
      const av = a[sortField] as string | number;
      const bv = b[sortField] as string | number;
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return runs;
  }, [statusFilter, datasetFilter, sortField, sortDir]);

  const toggleSort = (field: keyof PipelineRun) => {
    if (sortField === field) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: keyof PipelineRun }) => {
    if (sortField !== field) return <ChevronDown size={12} className="text-[#4A4A4A]" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-[#D4A843]" /> : <ChevronDown size={12} className="text-[#D4A843]" />;
  };

  const statusIcon = {
    success: <CheckCircle size={14} className="text-[#27AE60]" />,
    failed: <XCircle size={14} className="text-[#C0392B]" />,
    halted: <AlertTriangle size={14} className="text-[#F1C40F]" />,
    running: <RefreshCw size={14} className="text-[#3498DB] animate-spin" />,
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AppTopbar title="Dashboard" subtitle="SCX Pipeline Monitor" />

      <div className="p-6 max-w-screen-2xl mx-auto">
        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-3">Last Run</div>
            <div className="flex items-center gap-2 mb-2">
              {statusIcon[latestRun.status]}
              <span className="text-white font-medium text-sm capitalize">{latestRun.status}</span>
            </div>
            <div className="font-data text-xs text-[#6B6B6B]">{timeAgo(latestRun.timestamp)}</div>
            <div className="text-[10px] text-[#4A4A4A] mt-1 truncate">{latestRun.dataset}</div>
          </div>

          <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-3">Success Rate (30d)</div>
            <div className="font-data text-3xl font-bold text-[#27AE60]">{successRate}%</div>
            <svg viewBox="0 0 80 28" className="w-20 h-7 mt-2" fill="none">
              <path d={buildSparkline(sparklinePoints)} stroke="#27AE60" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-3">Avg DQA Score</div>
            <div className={`font-data text-3xl font-bold ${dqaColor(avgDqaScore)}`}>{avgDqaScore}%</div>
            <div className="h-1.5 bg-[#2A2A2A] rounded-full mt-3">
              <div className={`h-full rounded-full ${avgDqaScore >= 90 ? 'bg-[#27AE60]' : avgDqaScore >= 75 ? 'bg-[#F1C40F]' : 'bg-[#E67E22]'}`}
                style={{ width: `${avgDqaScore}%` }} />
            </div>
          </div>

          <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-3">Active Alerts</div>
            <div className="flex items-baseline gap-2">
              <span className={`font-data text-3xl font-bold ${activeAlertCount > 0 ? 'text-[#E67E22]' : 'text-[#27AE60]'}`}>
                {activeAlertCount}
              </span>
              {activeAlertCount > 0 && (
                <span className="text-[10px] font-mono bg-[#E67E22]/10 text-[#E67E22] border border-[#E67E22]/30 px-1.5 py-0.5 rounded">
                  NEEDS REVIEW
                </span>
              )}
            </div>
            <div className="text-[10px] text-[#6B6B6B] mt-2">Click to view alert center</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#6B6B6B]">
            <Filter size={12} />
            Filters:
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as RunStatus | 'all')}
            className="bg-[#1A1A1A] border border-[#3A3A3A] text-[#9A9A9A] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4A843]"
          >
            <option value="all">All statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="halted">Halted</option>
          </select>
          <select
            value={datasetFilter}
            onChange={e => setDatasetFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-[#3A3A3A] text-[#9A9A9A] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4A843]"
          >
            {datasets.map(d => (
              <option key={d} value={d}>{d === 'all' ? 'All datasets' : d}</option>
            ))}
          </select>
          <div className="ml-auto text-xs text-[#6B6B6B] font-mono">{filtered.length} runs</div>
        </div>

        {/* Table */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {[
                    { label: 'Timestamp', field: 'timestamp' as keyof PipelineRun },
                    { label: 'Dataset', field: 'dataset' as keyof PipelineRun },
                    { label: 'Status', field: 'status' as keyof PipelineRun },
                    { label: 'DQA Score', field: 'dqaScore' as keyof PipelineRun },
                    { label: 'DQA Severity', field: 'dqaSeverity' as keyof PipelineRun },
                    { label: 'Drift', field: 'driftSeverity' as keyof PipelineRun },
                    { label: 'Duration', field: 'durationMs' as keyof PipelineRun },
                  ].map(col => (
                    <th
                      key={col.field}
                      className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-[#4A4A4A] cursor-pointer hover:text-[#6B6B6B] select-none"
                      onClick={() => toggleSort(col.field)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <SortIcon field={col.field} />
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-[#4A4A4A] text-right">Report</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(run => (
                  <>
                    <tr
                      key={run.id}
                      className="border-b border-[#1E1E1E] hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                      onClick={() => setExpandedRow(expandedRow === run.id ? null : run.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-data text-xs text-[#CCCCCC]">{formatDateTime(run.timestamp)}</div>
                        <div className="font-data text-[10px] text-[#6B6B6B] mt-0.5">{timeAgo(run.timestamp)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-white font-medium">{run.dataset}</div>
                        <div className="font-data text-[10px] text-[#6B6B6B]">{run.rowCount.toLocaleString()} rows · {run.columnCount} cols</div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={run.status} />
                      </td>
                      <td className="px-4 py-3">
                        {run.dqaScore > 0 ? (
                          <span className={`font-data text-sm font-bold ${dqaColor(run.dqaScore)}`}>{run.dqaScore}%</span>
                        ) : (
                          <span className="text-[#4A4A4A] text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <SeverityBadge severity={run.dqaSeverity} />
                      </td>
                      <td className="px-4 py-3">
                        <SeverityBadge severity={run.driftSeverity} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-data text-xs text-[#9A9A9A]">{formatDuration(run.durationMs)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {run.reportId ? (
                          <button
                            onClick={e => { e.stopPropagation(); toast({ title: 'Opening report', description: run.reportId || '' }); }}
                            className="flex items-center gap-1 ml-auto text-[#D4A843] hover:underline text-xs font-mono"
                          >
                            View <ExternalLink size={10} />
                          </button>
                        ) : (
                          <span className="text-[#4A4A4A] text-xs">—</span>
                        )}
                      </td>
                    </tr>
                    {expandedRow === run.id && (
                      <tr key={`${run.id}-expanded`} className="bg-[#0D0D0D] border-b border-[#2A2A2A]">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <div className="text-[10px] font-mono text-[#4A4A4A] uppercase mb-1">Run ID</div>
                              <div className="font-data text-xs text-[#9A9A9A]">{run.id}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-mono text-[#4A4A4A] uppercase mb-1">Rows Processed</div>
                              <div className="font-data text-sm text-white">{run.rowCount.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-mono text-[#4A4A4A] uppercase mb-1">Columns</div>
                              <div className="font-data text-sm text-white">{run.columnCount}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-mono text-[#4A4A4A] uppercase mb-1">Processing Time</div>
                              <div className="font-data text-sm text-white">{formatDuration(run.durationMs)}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-[#6B6B6B] text-sm">
                      No pipeline runs match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
