import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, token } = body;
    if (!userId || !token) {
      return NextResponse.json({ error: 'userId and token are required' }, { status: 400 });
    }

    await supabaseAdmin.from('device_tokens').upsert(
      {
        user_id: userId,
        token,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'token' }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to register push token' }, { status: 500 });
  }
}
