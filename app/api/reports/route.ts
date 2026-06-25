import { NextResponse } from 'next/server';
import { REPORTS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ reports: REPORTS });
}
