import { NextRequest, NextResponse } from 'next/server';
import { generateReferralCode } from '@/lib/referrals/referral-system';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    const result = await generateReferralCode(userId);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate referral code' }, { status: 500 });
  }
}
