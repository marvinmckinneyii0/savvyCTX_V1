import { NextResponse } from 'next/server';
import { ALERTS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ alerts: ALERTS });
}
