import { NextRequest, NextResponse } from 'next/server';
import { trackReferralClick } from '@/lib/referrals/referral-system';

export async function GET(request: NextRequest) {
  try {
    const code = new URL(request.url).searchParams.get('code');
    if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });
    await trackReferralClick(code);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to track referral click' }, { status: 500 });
  }
}
