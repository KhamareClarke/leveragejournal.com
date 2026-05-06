import { NextRequest, NextResponse } from 'next/server';
import { checkStockLevels } from '@/lib/inventory/stock-management';

function authorized(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isVercelCron = request.headers.get('x-vercel-signature') || request.headers.get('user-agent')?.includes('vercel-cron');
  if (!cronSecret) return true;
  return Boolean(isVercelCron || authHeader === `Bearer ${cronSecret}`);
}

async function handler(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const result = await checkStockLevels();
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to check stock levels' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
