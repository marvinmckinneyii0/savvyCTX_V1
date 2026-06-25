import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name, email, plan } = await req.json();
  return NextResponse.json({
    user: { id: `usr_${Date.now()}`, name, email, plan: plan || 'free' },
    token: 'mock_jwt_token',
  }, { status: 201 });
}
