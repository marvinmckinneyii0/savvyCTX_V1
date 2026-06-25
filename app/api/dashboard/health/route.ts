import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: '2.4.1',
    engine: 'SCX Intelligence Engine',
    timestamp: new Date().toISOString(),
  });
}
