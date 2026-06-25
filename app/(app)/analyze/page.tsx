'use client';

import { useState, useCallback, useEffect } from 'react';
import { AppTopbar } from '@/components/app-topbar';
import { SeverityBadge } from '@/components/severity-badge';
import { getAuthUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, X, CircleCheck as CheckCircle, CircleAlert as AlertCircle, ChevronDown, Loader as Loader2, Download, FileText, Lock, Zap, RefreshCw } from 'lucide-react';

type Stage = 'idle' | 'uploading' | 'dqa' | 'drift' | 'insights' | 'rendering' | 'done' | 'error';

const stageLabels: Record<Stage, string> = {
  idle: '',
  uploading: 'Uploading & validating...',
  dqa: 'Running DQA checks...',
  drift: 'Detecting drift...',
  insights: 'Generating insights...',
  rendering: 'Rendering report...',
  done: 'Complete',
  error: 'Failed',
};

const stageOrder: Stage[] = ['uploading', 'dqa', 'drift', 'insights', 'rendering', 'done'];

const mockColumns = {
  date: ['order_date', 'created_at', 'transaction_date'],
  numeric: ['revenue_usd', 'units_sold', 'discount_pct', 'margin', 'customer_ltv'],
  categorical: ['region', 'product_category', 'sales_channel', 'status'],
};

const mockResults = {
  dqaScore: 94.7,
  dqaSeverity: 'LOW' as const,
  driftSeverity: 'NONE' as const,
  rowCount: 14820,
  columnCount: 9,
  issues: [
    { column: 'discount_pct', type: 'Outlier', severity: 'LOW' as const, detail: '3 values exceed 100%' },
    { column: 'customer_ltv', type: 'Missing values', severity: 'LOW' as const, detail: '1.8% null rate (267 rows)' },
  ],
  insights: [
    'Revenue grew 8.4% compared to the baseline period, driven primarily by the Western region (+14.2%).',
    'Units sold per transaction declined 2.1% — margin held steady, suggesting a modest shift toward higher-value SKUs.',
    'Sales channel mix is stable; e-commerce represents 38% of revenue, up from 34% in baseline.',
    'No significant drift detected across monitored columns. Baseline is eligible for rotation after 2 more clean runs.',
  ],
};

export default function AnalyzePage() {
  const { toast } = useToast();
  const [user, setUser] = useState<{ plan: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState<Stage>('idle');
  const [stageProgress, setStageProgress] = useState(0);
  const [outputFormat, setOutputFormat] = useState<'DOCX' | 'PDF'>('PDF');
  const [config, setConfig] = useState({ dateCol: 'order_date', metricCols: ['revenue_usd', 'units_sold'], categoryCols: ['region', 'product_category'] });

  useEffect(() => {
    const u = getAuthUser();
    setUser(u);
    if (u?.plan === 'free') setOutputFormat('DOCX');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith('.csv')) {
      setFile(dropped);
      toast({ title: 'File loaded', description: dropped.name });
    } else {
      toast({ title: 'Invalid file', description: 'Please upload a CSV file.', variant: 'destructive' });
    }
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const runPipeline = async () => {
    if (!file) return;
    const stages: Stage[] = ['uploading', 'dqa', 'drift', 'insights', 'rendering', 'done'];
    const durations = [800, 1200, 1000, 1500, 900, 0];

    for (let i = 0; i < stages.length - 1; i++) {
      setStage(stages[i]);
      setStageProgress(0);
      const steps = 10;
      for (let s = 0; s <= steps; s++) {
        await new Promise(r => setTimeout(r, durations[i] / steps));
        setStageProgress(s * 10);
      }
    }
    setStage('done');
    setStageProgress(100);
    toast({ title: 'Pipeline complete', description: `Report ready — DQA: ${mockResults.dqaScore}%` });
  };

  const currentStageIdx = stageOrder.indexOf(stage);
  const isFree = user?.plan === 'free';
  const reportsUsed = 47;
  const reportsLimit = isFree ? 3 : 100;
  const reportsRemaining = reportsLimit - (isFree ? 1 : reportsUsed);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AppTopbar title="Upload & Analyze" subtitle="SCX Intelligence Engine" />
      <div className="p-6 max-w-5xl mx-auto">
        {isFree && (
          <div className="flex items-center justify-between bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl px-5 py-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-[#D4A843]">
              <Zap size={14} />
              <span className="font-mono">{reportsRemaining} of {reportsLimit} reports remaining this month</span>
            </div>
            <button className="text-xs bg-[#D4A843] text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-[#E8C469]">
              Upgrade Plan
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Upload + Config */}
          <div className="lg:col-span-3 space-y-5">
            {/* Drop zone */}
            {!file ? (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  dragging ? 'border-[#D4A843] bg-[#D4A843]/5' : 'border-[#3A3A3A] hover:border-[#D4A843]/50 hover:bg-[#1A1A1A]'
                }`}
              >
                <Upload size={32} className="mx-auto text-[#D4A843] mb-4" />
                <div className="font-semibold text-white mb-2">Drop your CSV file here</div>
                <div className="text-sm text-[#6B6B6B] mb-4">or click to browse</div>
                <label className="cursor-pointer bg-[#1A1A1A] border border-[#3A3A3A] text-[#9A9A9A] px-4 py-2 rounded-lg text-sm hover:border-[#D4A843]/50 transition-colors">
                  Choose file
                  <input type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
                </label>
                <div className="mt-4 text-[10px] font-mono text-[#4A4A4A]">CSV only · Max 50 MB (Free) / 2 GB (Pro)</div>
              </div>
            ) : (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#D4A843]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <File size={20} className="text-[#D4A843]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{file.name}</div>
                  <div className="text-xs text-[#6B6B6B] mt-0.5">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
                {stage === 'idle' && (
                  <button onClick={() => setFile(null)} className="p-2 text-[#6B6B6B] hover:text-white hover:bg-[#2A2A2A] rounded-lg">
                    <X size={14} />
                  </button>
                )}
                {stage === 'done' && <CheckCircle size={20} className="text-[#27AE60] flex-shrink-0" />}
              </div>
            )}

            {/* Config */}
            {file && stage === 'idle' && (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 space-y-5">
                <div className="font-semibold text-white">Analysis Configuration</div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Date column</label>
                  <select
                    value={config.dateCol}
                    onChange={e => setConfig(c => ({ ...c, dateCol: e.target.value }))}
                    className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4A843]"
                  >
                    {mockColumns.date.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Metric columns</label>
                  <div className="flex flex-wrap gap-2">
                    {mockColumns.numeric.map(col => (
                      <button
                        key={col}
                        onClick={() => setConfig(c => ({
                          ...c,
                          metricCols: c.metricCols.includes(col) ? c.metricCols.filter(x => x !== col) : [...c.metricCols, col]
                        }))}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                          config.metricCols.includes(col)
                            ? 'bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/30'
                            : 'bg-[#1A1A1A] border border-[#3A3A3A] text-[#6B6B6B] hover:border-[#4A4A4A]'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Category columns</label>
                  <div className="flex flex-wrap gap-2">
                    {mockColumns.categorical.map(col => (
                      <button
                        key={col}
                        onClick={() => setConfig(c => ({
                          ...c,
                          categoryCols: c.categoryCols.includes(col) ? c.categoryCols.filter(x => x !== col) : [...c.categoryCols, col]
                        }))}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                          config.categoryCols.includes(col)
                            ? 'bg-[#3498DB]/10 text-[#3498DB] border border-[#3498DB]/30'
                            : 'bg-[#1A1A1A] border border-[#3A3A3A] text-[#6B6B6B] hover:border-[#4A4A4A]'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">Output format</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => !isFree && setOutputFormat('DOCX')}
                      className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                        outputFormat === 'DOCX'
                          ? 'bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/30'
                          : 'bg-[#1A1A1A] border border-[#3A3A3A] text-[#6B6B6B]'
                      }`}
                    >
                      DOCX
                    </button>
                    <button
                      onClick={() => {
                        if (isFree) { toast({ title: 'PDF requires Starter or higher', description: 'Upgrade to generate PDF reports.', variant: 'destructive' }); return; }
                        setOutputFormat('PDF');
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-mono transition-all flex items-center gap-1.5 ${
                        outputFormat === 'PDF'
                          ? 'bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/30'
                          : 'bg-[#1A1A1A] border border-[#3A3A3A] text-[#6B6B6B]'
                      }`}
                    >
                      PDF
                      {isFree && <Lock size={10} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={runPipeline}
                  disabled={reportsRemaining <= 0}
                  className="w-full bg-[#D4A843] hover:bg-[#E8C469] disabled:opacity-40 text-black font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#D4A843]/20 text-sm"
                >
                  Run Analysis
                </button>
              </div>
            )}

            {/* Progress */}
            {stage !== 'idle' && stage !== 'done' && stage !== 'error' && (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Loader2 size={16} className="text-[#D4A843] animate-spin" />
                  <span className="text-white font-medium">{stageLabels[stage]}</span>
                </div>
                <div className="space-y-2">
                  {stageOrder.slice(0, -1).map((s, idx) => {
                    const sIdx = stageOrder.indexOf(s);
                    const currentIdx = stageOrder.indexOf(stage);
                    const done = sIdx < currentIdx;
                    const active = s === stage;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          done ? 'bg-[#27AE60]' : active ? 'bg-[#D4A843]' : 'bg-[#2A2A2A]'
                        }`}>
                          {done ? <CheckCircle size={10} className="text-white" /> : <span className="text-[10px] text-black font-bold">{idx + 1}</span>}
                        </div>
                        <div className={`text-sm ${done ? 'text-[#6B6B6B]' : active ? 'text-white' : 'text-[#3A3A3A]'}`}>
                          {stageLabels[s]}
                        </div>
                        {active && (
                          <div className="flex-1 h-1 bg-[#2A2A2A] rounded-full overflow-hidden ml-2">
                            <div className="h-full bg-[#D4A843] rounded-full transition-all" style={{ width: `${stageProgress}%` }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 space-y-5">
            {stage === 'done' ? (
              <>
                {/* Score card */}
                <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-4">SCX Analysis Results</div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#1A1A1A] rounded-xl p-3">
                      <div className="text-[10px] text-[#6B6B6B] mb-1">DQA Score</div>
                      <div className="font-data text-2xl font-bold text-[#27AE60]">{mockResults.dqaScore}%</div>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-xl p-3">
                      <div className="text-[10px] text-[#6B6B6B] mb-1">Drift</div>
                      <SeverityBadge severity={mockResults.driftSeverity} size="md" />
                    </div>
                    <div className="bg-[#1A1A1A] rounded-xl p-3">
                      <div className="text-[10px] text-[#6B6B6B] mb-1">Rows</div>
                      <div className="font-data text-sm text-white">{mockResults.rowCount.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-xl p-3">
                      <div className="text-[10px] text-[#6B6B6B] mb-1">Columns</div>
                      <div className="font-data text-sm text-white">{mockResults.columnCount}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => toast({ title: 'Downloading report...', description: `${file?.name} — ${outputFormat}` })}
                    className="w-full flex items-center justify-center gap-2 bg-[#D4A843] hover:bg-[#E8C469] text-black font-semibold py-2.5 rounded-xl text-sm transition-all"
                  >
                    <Download size={14} />
                    Download {outputFormat} Report
                  </button>
                </div>

                {/* Issues */}
                {mockResults.issues.length > 0 && (
                  <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-3">DQA Issues ({mockResults.issues.length})</div>
                    <div className="space-y-2.5">
                      {mockResults.issues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-3 bg-[#1A1A1A] rounded-lg px-3 py-2.5">
                          <SeverityBadge severity={issue.severity} />
                          <div>
                            <div className="text-xs font-medium text-white">{issue.column}</div>
                            <div className="text-[10px] text-[#6B6B6B]">{issue.type}: {issue.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights */}
                <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B]">SCX Insights</div>
                  </div>
                  <ul className="space-y-2.5">
                    {mockResults.insights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#CCCCCC] leading-relaxed">
                        <span className="text-[#D4A843] font-mono text-xs mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => { setFile(null); setStage('idle'); }}
                  className="w-full flex items-center justify-center gap-2 border border-[#3A3A3A] text-[#9A9A9A] hover:text-white hover:border-[#4A4A4A] py-2.5 rounded-xl text-sm transition-colors"
                >
                  <RefreshCw size={14} /> Analyze another file
                </button>
              </>
            ) : (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#4A4A4A] mb-4">Pipeline stages</div>
                <div className="space-y-3">
                  {[
                    { step: '01', label: 'Ingest & Validate', desc: 'Schema detection, encoding check' },
                    { step: '02', label: 'DQA Assessment', desc: '6 quality categories scored' },
                    { step: '03', label: 'Drift Detection', desc: 'Baseline comparison across columns' },
                    { step: '04', label: 'Compute & Analyze', desc: 'Statistical analysis layer' },
                    { step: '05', label: 'Generate Narrative', desc: 'AI insight generation' },
                    { step: '06', label: 'Render Report', desc: `DOCX${isFree ? '' : ' / PDF'} output generation` },
                  ].map(({ step, label, desc }) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                        <span className="font-data text-[10px] text-[#4A4A4A]">{step}</span>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-[#6B6B6B]">{label}</div>
                        <div className="text-[10px] text-[#3A3A3A]">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
