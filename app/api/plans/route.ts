import { NextResponse } from 'next/server';
import { PLANS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ plans: PLANS });
}
