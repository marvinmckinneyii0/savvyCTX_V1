import { NextResponse } from 'next/server';
import { USAGE } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ usage: USAGE });
}
