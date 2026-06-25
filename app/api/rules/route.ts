import { NextResponse } from 'next/server';
import { ALERT_RULES } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ rules: ALERT_RULES });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({
    ...body,
    id: `rule_${Date.now()}`,
    enabled: true,
    lastTriggered: null,
  }, { status: 201 });
}
