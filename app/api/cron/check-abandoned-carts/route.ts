import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { handleCartAbandonment } from '@/lib/notifications/cart-abandonment';

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
    const { data: carts, error } = await supabaseAdmin
      .from('carts')
      .select('id, completed_at')
      .is('completed_at', null);

    if (error) {
      throw error;
    }

    let processed = 0;
    for (const cart of carts || []) {
      await handleCartAbandonment(cart.id);
      processed += 1;
    }

    return NextResponse.json({ success: true, processed });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process abandoned carts' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
