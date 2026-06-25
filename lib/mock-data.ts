export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' | 'INFO';
export type RunStatus = 'success' | 'failed' | 'halted' | 'running';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type RuleType = 'drift_severity' | 'mean_shift' | 'volume_change' | 'schema_change' | 'completeness_drop' | 'dqa_severity';
export type PlanId = 'free' | 'starter' | 'professional' | 'enterprise';

export interface PipelineRun {
  id: string;
  timestamp: string;
  dataset: string;
  status: RunStatus;
  dqaSeverity: Severity;
  driftSeverity: Severity;
  durationMs: number;
  reportId: string | null;
  dqaScore: number;
  rowCount: number;
  columnCount: number;
}

export interface DriftColumn {
  column: string;
  meanShiftPct: number;
  varianceRatio: number;
  severity: Severity;
  currentMean: number;
  baselineMean: number;
}

export interface DriftRun {
  runId: string;
  datasetId: string;
  timestamp: string;
  severity: Severity;
  columns: DriftColumn[];
  rowCount: number;
  baselineRowCount: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  ruleType: RuleType;
  severity: Severity;
  title: string;
  description: string;
  status: AlertStatus;
  runId: string;
  dataset: string;
  evidence: Record<string, unknown>;
}

export interface AlertRule {
  id: string;
  type: RuleType;
  column: string | null;
  threshold: number | null;
  enabled: boolean;
  lastTriggered: string | null;
  deliveryChannels: ('email' | 'log')[];
  description: string;
}

export interface Report {
  id: string;
  timestamp: string;
  dataset: string;
  format: 'DOCX' | 'PDF';
  sizeKb: number;
  runId: string;
  dqaScore: number;
  driftSeverity: Severity;
}

export const MOCK_USER = {
  id: 'usr_demo_001',
  name: 'Alex Morgan',
  email: 'demo@savvyanalytics.info',
  plan: 'professional' as PlanId,
  avatarInitials: 'AM',
};

export const PIPELINE_RUNS: PipelineRun[] = [
  { id: 'run_001', timestamp: '2026-05-07T09:14:32Z', dataset: 'sales_q1_2026.csv', status: 'success', dqaSeverity: 'LOW', driftSeverity: 'NONE', durationMs: 4231, reportId: 'rpt_001', dqaScore: 96.2, rowCount: 14820, columnCount: 18 },
  { id: 'run_002', timestamp: '2026-05-06T16:42:11Z', dataset: 'customer_churn.csv', status: 'success', dqaSeverity: 'MEDIUM', driftSeverity: 'HIGH', durationMs: 6187, reportId: 'rpt_002', dqaScore: 83.4, rowCount: 8922, columnCount: 24 },
  { id: 'run_003', timestamp: '2026-05-06T11:28:54Z', dataset: 'inventory_march.csv', status: 'success', dqaSeverity: 'LOW', driftSeverity: 'MEDIUM', durationMs: 3892, reportId: 'rpt_003', dqaScore: 91.8, rowCount: 5640, columnCount: 12 },
  { id: 'run_004', timestamp: '2026-05-05T20:05:19Z', dataset: 'revenue_by_region.csv', status: 'failed', dqaSeverity: 'CRITICAL', driftSeverity: 'HIGH', durationMs: 1203, reportId: null, dqaScore: 51.3, rowCount: 2110, columnCount: 9 },
  { id: 'run_005', timestamp: '2026-05-05T14:33:07Z', dataset: 'loan_portfolio.csv', status: 'success', dqaSeverity: 'LOW', driftSeverity: 'LOW', durationMs: 8441, reportId: 'rpt_004', dqaScore: 94.7, rowCount: 31200, columnCount: 32 },
  { id: 'run_006', timestamp: '2026-05-04T09:11:44Z', dataset: 'sales_q1_2026.csv', status: 'success', dqaSeverity: 'LOW', driftSeverity: 'NONE', durationMs: 4109, reportId: 'rpt_005', dqaScore: 95.1, rowCount: 14390, columnCount: 18 },
  { id: 'run_007', timestamp: '2026-05-03T18:55:22Z', dataset: 'customer_churn.csv', status: 'halted', dqaSeverity: 'HIGH', driftSeverity: 'NONE', durationMs: 2201, reportId: null, dqaScore: 74.2, rowCount: 8755, columnCount: 24 },
  { id: 'run_008', timestamp: '2026-05-03T10:22:01Z', dataset: 'inventory_march.csv', status: 'success', dqaSeverity: 'LOW', driftSeverity: 'NONE', durationMs: 3671, reportId: 'rpt_006', dqaScore: 93.5, rowCount: 5510, columnCount: 12 },
  { id: 'run_009', timestamp: '2026-05-02T15:40:38Z', dataset: 'revenue_by_region.csv', status: 'success', dqaSeverity: 'MEDIUM', driftSeverity: 'MEDIUM', durationMs: 5033, reportId: 'rpt_007', dqaScore: 87.6, rowCount: 2098, columnCount: 9 },
  { id: 'run_010', timestamp: '2026-05-02T08:14:55Z', dataset: 'loan_portfolio.csv', status: 'success', dqaSeverity: 'LOW', driftSeverity: 'LOW', durationMs: 8820, reportId: 'rpt_008', dqaScore: 95.9, rowCount: 30850, columnCount: 32 },
  { id: 'run_011', timestamp: '2026-05-01T21:07:30Z', dataset: 'sales_q1_2026.csv', status: 'success', dqaSeverity: 'LOW', driftSeverity: 'LOW', durationMs: 4344, reportId: 'rpt_009', dqaScore: 94.0, rowCount: 13980, columnCount: 18 },
  { id: 'run_012', timestamp: '2026-04-30T16:29:18Z', dataset: 'customer_churn.csv', status: 'success', dqaSeverity: 'LOW', driftSeverity: 'NONE', durationMs: 5901, reportId: 'rpt_010', dqaScore: 89.3, rowCount: 8600, columnCount: 24 },
  { id: 'run_013', timestamp: '2026-04-29T11:52:41Z', dataset: 'revenue_by_region.csv', status: 'failed', dqaSeverity: 'HIGH', driftSeverity: 'HIGH', durationMs: 900, reportId: null, dqaScore: 62.1, rowCount: 1990, columnCount: 9 },
  { id: 'run_014', timestamp: '2026-04-28T09:05:55Z', dataset: 'inventory_march.csv', status: 'success', dqaSeverity: 'LOW', driftSeverity: 'NONE', durationMs: 3450, reportId: 'rpt_011', dqaScore: 92.8, rowCount: 5200, columnCount: 12 },
  { id: 'run_015', timestamp: '2026-04-27T14:17:22Z', dataset: 'loan_portfolio.csv', status: 'success', dqaSeverity: 'MEDIUM', driftSeverity: 'MEDIUM', durationMs: 9102, reportId: 'rpt_012', dqaScore: 88.4, rowCount: 29900, columnCount: 32 },
];

export const ALERTS: Alert[] = [
  { id: 'alrt_001', timestamp: '2026-05-06T16:43:00Z', ruleType: 'drift_severity', severity: 'HIGH', title: 'High drift detected in customer_churn.csv', description: 'Mean shift >15% detected in 3 columns: churn_probability, days_since_login, support_tickets', status: 'active', runId: 'run_002', dataset: 'customer_churn.csv', evidence: { columnsAffected: 3, maxShift: '22.4%', baseline: '2026-04-15' } },
  { id: 'alrt_002', timestamp: '2026-05-05T20:06:00Z', ruleType: 'dqa_severity', severity: 'CRITICAL', title: 'Critical DQA failure — revenue_by_region.csv', description: 'Data quality score dropped to 51.3%. Completeness fell below 60% threshold in revenue_usd column.', status: 'active', runId: 'run_004', dataset: 'revenue_by_region.csv', evidence: { dqaScore: 51.3, completeness: '58.2%', columnIssues: ['revenue_usd', 'region_code'] } },
  { id: 'alrt_003', timestamp: '2026-05-05T14:34:00Z', ruleType: 'mean_shift', severity: 'LOW', title: 'Minor mean shift in loan_portfolio.csv', description: 'LTV ratio mean shifted by 6.2% from baseline. Within acceptable range.', status: 'acknowledged', runId: 'run_005', dataset: 'loan_portfolio.csv', evidence: { column: 'ltv_ratio', shift: '6.2%', baseline: 0.74, current: 0.786 } },
  { id: 'alrt_004', timestamp: '2026-05-03T18:56:00Z', ruleType: 'completeness_drop', severity: 'HIGH', title: 'Completeness drop halted pipeline — customer_churn.csv', description: 'Pipeline halted due to completeness dropping below 70% threshold in 2 required columns.', status: 'resolved', runId: 'run_007', dataset: 'customer_churn.csv', evidence: { columns: ['email_verified', 'last_purchase_date'], completeness: ['61%', '58%'] } },
  { id: 'alrt_005', timestamp: '2026-05-02T15:41:00Z', ruleType: 'volume_change', severity: 'MEDIUM', title: 'Row volume declined 5.2% in revenue_by_region.csv', description: 'Dataset row count dropped from 2,210 to 2,098 — a 5.1% decrease from baseline expectations.', status: 'resolved', runId: 'run_009', dataset: 'revenue_by_region.csv', evidence: { previous: 2210, current: 2098, changePct: '-5.1%' } },
  { id: 'alrt_006', timestamp: '2026-04-29T11:53:00Z', ruleType: 'schema_change', severity: 'HIGH', title: 'Schema change detected — revenue_by_region.csv', description: 'Column "fx_adjusted_revenue" removed from dataset. This breaks 2 downstream monitoring rules.', status: 'resolved', runId: 'run_013', dataset: 'revenue_by_region.csv', evidence: { removedColumns: ['fx_adjusted_revenue'], addedColumns: [] } },
  { id: 'alrt_007', timestamp: '2026-04-28T09:06:00Z', ruleType: 'drift_severity', severity: 'NONE', title: 'Clean run — no drift — inventory_march.csv', description: 'All monitored columns within baseline thresholds. Baseline eligible for rotation.', status: 'resolved', runId: 'run_014', dataset: 'inventory_march.csv', evidence: { cleanRunStreak: 3, baselineAge: '21 days' } },
  { id: 'alrt_008', timestamp: '2026-04-27T14:18:00Z', ruleType: 'mean_shift', severity: 'MEDIUM', title: 'Moderate mean shift — loan_portfolio.csv', description: 'interest_rate_avg shifted 11.3% from baseline. Monitor for continued trend.', status: 'acknowledged', runId: 'run_015', dataset: 'loan_portfolio.csv', evidence: { column: 'interest_rate_avg', shift: '11.3%', baseline: 6.82, current: 7.59 } },
];

export const ALERT_RULES: AlertRule[] = [
  { id: 'rule_001', type: 'drift_severity', column: null, threshold: null, enabled: true, lastTriggered: '2026-05-06T16:43:00Z', deliveryChannels: ['email', 'log'], description: 'Alert on any HIGH or CRITICAL drift severity across all datasets' },
  { id: 'rule_002', type: 'dqa_severity', column: null, threshold: 70, enabled: true, lastTriggered: '2026-05-05T20:06:00Z', deliveryChannels: ['email', 'log'], description: 'Alert when DQA score falls below 70%' },
  { id: 'rule_003', type: 'mean_shift', column: 'churn_probability', threshold: 10, enabled: false, lastTriggered: '2026-05-06T16:43:00Z', deliveryChannels: ['log'], description: 'Detect mean shift >10% in churn_probability column' },
  { id: 'rule_004', type: 'volume_change', column: null, threshold: 5, enabled: false, lastTriggered: '2026-05-02T15:41:00Z', deliveryChannels: ['email'], description: 'Alert on row count change >5% from baseline' },
  { id: 'rule_005', type: 'schema_change', column: null, threshold: null, enabled: false, lastTriggered: '2026-04-29T11:53:00Z', deliveryChannels: ['email', 'log'], description: 'Alert when dataset schema changes (columns added or removed)' },
];

export const REPORTS: Report[] = [
  { id: 'rpt_001', timestamp: '2026-05-07T09:18:44Z', dataset: 'sales_q1_2026.csv', format: 'PDF', sizeKb: 284, runId: 'run_001', dqaScore: 96.2, driftSeverity: 'NONE' },
  { id: 'rpt_002', timestamp: '2026-05-06T16:49:22Z', dataset: 'customer_churn.csv', format: 'DOCX', sizeKb: 198, runId: 'run_002', dqaScore: 83.4, driftSeverity: 'HIGH' },
  { id: 'rpt_003', timestamp: '2026-05-06T11:34:18Z', dataset: 'inventory_march.csv', format: 'PDF', sizeKb: 156, runId: 'run_003', dqaScore: 91.8, driftSeverity: 'MEDIUM' },
  { id: 'rpt_004', timestamp: '2026-05-05T14:41:09Z', dataset: 'loan_portfolio.csv', format: 'PDF', sizeKb: 421, runId: 'run_005', dqaScore: 94.7, driftSeverity: 'LOW' },
  { id: 'rpt_005', timestamp: '2026-05-04T09:17:22Z', dataset: 'sales_q1_2026.csv', format: 'PDF', sizeKb: 279, runId: 'run_006', dqaScore: 95.1, driftSeverity: 'NONE' },
  { id: 'rpt_006', timestamp: '2026-05-03T10:28:44Z', dataset: 'inventory_march.csv', format: 'DOCX', sizeKb: 148, runId: 'run_008', dqaScore: 93.5, driftSeverity: 'NONE' },
  { id: 'rpt_007', timestamp: '2026-05-02T15:47:03Z', dataset: 'revenue_by_region.csv', format: 'PDF', sizeKb: 192, runId: 'run_009', dqaScore: 87.6, driftSeverity: 'MEDIUM' },
  { id: 'rpt_008', timestamp: '2026-05-02T08:22:30Z', dataset: 'loan_portfolio.csv', format: 'DOCX', sizeKb: 389, runId: 'run_010', dqaScore: 95.9, driftSeverity: 'LOW' },
  { id: 'rpt_009', timestamp: '2026-05-01T21:14:18Z', dataset: 'sales_q1_2026.csv', format: 'PDF', sizeKb: 271, runId: 'run_011', dqaScore: 94.0, driftSeverity: 'LOW' },
  { id: 'rpt_010', timestamp: '2026-04-30T16:36:52Z', dataset: 'customer_churn.csv', format: 'PDF', sizeKb: 203, runId: 'run_012', dqaScore: 89.3, driftSeverity: 'NONE' },
  { id: 'rpt_011', timestamp: '2026-04-28T09:12:22Z', dataset: 'inventory_march.csv', format: 'DOCX', sizeKb: 141, runId: 'run_014', dqaScore: 92.8, driftSeverity: 'NONE' },
  { id: 'rpt_012', timestamp: '2026-04-27T14:25:44Z', dataset: 'loan_portfolio.csv', format: 'PDF', sizeKb: 408, runId: 'run_015', dqaScore: 88.4, driftSeverity: 'MEDIUM' },
];

export const DRIFT_RUNS: Record<string, DriftRun[]> = {
  'customer_churn': [
    { runId: 'run_002', datasetId: 'customer_churn', timestamp: '2026-05-06T16:42:11Z', severity: 'HIGH', rowCount: 8922, baselineRowCount: 8600, columns: [
      { column: 'churn_probability', meanShiftPct: 22.4, varianceRatio: 1.84, severity: 'HIGH', currentMean: 0.342, baselineMean: 0.279 },
      { column: 'days_since_login', meanShiftPct: 15.7, varianceRatio: 1.41, severity: 'HIGH', currentMean: 18.4, baselineMean: 15.9 },
      { column: 'support_tickets', meanShiftPct: 8.2, varianceRatio: 1.12, severity: 'MEDIUM', currentMean: 2.1, baselineMean: 1.94 },
      { column: 'account_age_days', meanShiftPct: 2.1, varianceRatio: 0.98, severity: 'NONE', currentMean: 412, baselineMean: 403 },
    ]},
    { runId: 'run_012', datasetId: 'customer_churn', timestamp: '2026-04-30T16:29:18Z', severity: 'NONE', rowCount: 8600, baselineRowCount: 8450, columns: [
      { column: 'churn_probability', meanShiftPct: 1.2, varianceRatio: 1.02, severity: 'NONE', currentMean: 0.281, baselineMean: 0.278 },
      { column: 'days_since_login', meanShiftPct: 2.8, varianceRatio: 1.05, severity: 'NONE', currentMean: 16.3, baselineMean: 15.9 },
      { column: 'support_tickets', meanShiftPct: 0.9, varianceRatio: 0.99, severity: 'NONE', currentMean: 1.95, baselineMean: 1.93 },
    ]},
  ],
  'sales_q1_2026': [
    { runId: 'run_001', datasetId: 'sales_q1_2026', timestamp: '2026-05-07T09:14:32Z', severity: 'NONE', rowCount: 14820, baselineRowCount: 14390, columns: [
      { column: 'revenue_usd', meanShiftPct: 1.4, varianceRatio: 1.01, severity: 'NONE', currentMean: 4820.4, baselineMean: 4754.1 },
      { column: 'units_sold', meanShiftPct: 2.1, varianceRatio: 1.03, severity: 'NONE', currentMean: 12.8, baselineMean: 12.5 },
    ]},
    { runId: 'run_006', datasetId: 'sales_q1_2026', timestamp: '2026-05-04T09:11:44Z', severity: 'NONE', rowCount: 14390, baselineRowCount: 13980, columns: [
      { column: 'revenue_usd', meanShiftPct: 0.9, varianceRatio: 1.00, severity: 'NONE', currentMean: 4756.2, baselineMean: 4713.8 },
    ]},
  ],
};

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    badge: null,
    cta: 'Get Started — Free Forever',
    ctaNote: 'No credit card required',
    features: [
      { text: '3 reports per month', included: true },
      { text: 'DQA across all 6 detection categories', included: true },
      { text: 'Basic drift detection (mean shift + volume)', included: true },
      { text: 'Docx report output only', included: true },
      { text: '1 monitoring rule', included: true },
      { text: '50 MB data processing / month', included: true },
      { text: 'Community support', included: true },
      { text: '"Powered by SavvyCortex" watermark', included: true },
      { text: 'PDF report output', included: false },
      { text: 'Email alert delivery', included: false },
      { text: 'Scheduled reporting', included: false },
      { text: 'SCX Research (Recommendation Agent)', included: false },
    ],
    reportsLimit: 3,
    dataLimitMb: 50,
    rulesLimit: 1,
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 49,
    annualPrice: 39,
    badge: null,
    cta: 'Start 14-Day Free Trial',
    ctaNote: null,
    features: [
      { text: '25 reports per month', included: true },
      { text: 'Full DQA + basic drift detection', included: true },
      { text: 'Docx & PDF report generation', included: true },
      { text: '5 monitoring rules', included: true },
      { text: 'Email alert delivery', included: true },
      { text: '500 MB data processing / month', included: true },
      { text: 'No watermark on reports', included: true },
      { text: 'Email support (48h response)', included: true },
      { text: 'Scheduled reporting', included: false },
      { text: 'SCX Research (Recommendation Agent)', included: false },
      { text: 'Branded report templates', included: false },
    ],
    reportsLimit: 25,
    dataLimitMb: 500,
    rulesLimit: 5,
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 149,
    annualPrice: 119,
    badge: 'Most Popular',
    cta: 'Start 14-Day Free Trial',
    ctaNote: null,
    features: [
      { text: '100 reports per month', included: true },
      { text: 'Full drift engine (PSI, schema, categorical, variance)', included: true },
      { text: 'Unlimited monitoring rules', included: true },
      { text: 'Scheduled reporting (daily/weekly/monthly)', included: true },
      { text: 'Branded report templates', included: true },
      { text: 'SCX Research (Recommendation Agent)', included: true },
      { text: '2 GB data processing / month', included: true },
      { text: 'Priority processing queue', included: true },
      { text: 'Email support (24h response)', included: true },
      { text: 'REST API access', included: false },
      { text: 'Time-series forecasting', included: false },
      { text: 'Industry vertical adapters', included: false },
    ],
    reportsLimit: 100,
    dataLimitMb: 2048,
    rulesLimit: -1,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: null,
    annualPrice: null,
    badge: null,
    cta: 'Contact Sales',
    ctaNote: null,
    features: [
      { text: 'Unlimited reports', included: true },
      { text: 'REST API access (v1) with webhook delivery', included: true },
      { text: 'Natural language data querying', included: true },
      { text: 'Time-series forecasting', included: true },
      { text: 'Industry vertical adapters', included: true },
      { text: 'Custom branding on all outputs', included: true },
      { text: 'Unlimited data processing', included: true },
      { text: 'Multi-user team access with RBAC', included: true },
      { text: 'Dedicated support channel', included: true },
      { text: 'SLA guarantee', included: true },
    ],
    reportsLimit: -1,
    dataLimitMb: -1,
    rulesLimit: -1,
  },
];

export const USAGE = {
  plan: 'professional',
  reportsUsed: 47,
  reportsLimit: 100,
  dataMbUsed: 1241,
  dataMbLimit: 2048,
  rulesUsed: 2,
  rulesLimit: -1,
  billingCycleStart: '2026-05-01',
  billingCycleEnd: '2026-05-31',
  nextBillingDate: '2026-06-01',
  monthlyPrice: 149,
};

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = (ms / 1000).toFixed(1);
  return `${s}s`;
}

export function formatBytes(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
