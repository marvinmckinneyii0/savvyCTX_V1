import { NextResponse } from 'next/server';
import { z } from 'zod';
import { humanizeText } from '@/lib/humanize';

const requestSchema = z
  .object({
    text: z.string().min(1, 'text is required').max(20_000, 'text must be 20,000 characters or fewer'),
    voice: z
      .enum(['clear-thinker', 'casual-storyteller', 'sharp-opinionated', 'warm-professional', 'mirror'])
      .default('clear-thinker'),
    contentType: z.enum(['general', 'linkedin', 'email', 'marketing', 'report']).default('general'),
    writingSamples: z.string().max(12_000, 'writingSamples must be 12,000 characters or fewer').optional(),
    preferLlm: z.boolean().default(true),
  })
  .superRefine((value, ctx) => {
    if (value.voice === 'mirror' && !value.writingSamples?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['writingSamples'],
        message: 'writingSamples is required when voice is mirror',
      });
    }
  });

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid humanize request.',
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const result = await humanizeText(parsed.data);
  return NextResponse.json(result);
}
