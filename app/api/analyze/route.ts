import { NextResponse } from 'next/server';

export async function POST() {
  await new Promise(r => setTimeout(r, 500));
  return NextResponse.json({
    runId: `run_${Date.now()}`,
    dqaScore: 94.7,
    dqaSeverity: 'LOW',
    driftSeverity: 'NONE',
    rowCount: 14820,
    columnCount: 9,
    reportId: `rpt_${Date.now()}`,
    insights: [
      'Revenue grew 8.4% compared to the baseline period.',
      'No significant drift detected across monitored columns.',
    ],
  });
}
