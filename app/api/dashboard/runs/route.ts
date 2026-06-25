import { NextResponse } from 'next/server';
import { PIPELINE_RUNS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ runs: PIPELINE_RUNS });
}
