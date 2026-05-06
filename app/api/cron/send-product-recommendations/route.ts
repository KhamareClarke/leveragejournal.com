import { NextRequest, NextResponse } from 'next/server';
import { sendProductRecommendations } from '@/lib/notifications/product-recommendations';

function authorized(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isVercelCron = request.headers.get('x-vercel-signature') || request.headers.get('user-agent')?.includes('vercel-cron');
  if (!cronSecret) return true;
  return Boolean(isVercelCron || authHeader === `Bearer ${cronSecret}`);
}

async function handler(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await sendProductRecommendations();
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send product recommendations' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
