import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (email === 'demo@savvyanalytics.info' && password === 'demo123') {
    return NextResponse.json({
      user: { id: 'usr_demo_001', name: 'Alex Morgan', email, plan: 'professional' },
      token: 'mock_jwt_token',
    });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
