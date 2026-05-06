import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendTransactionalEmail } from '@/lib/email';
import { awardLoyaltyPoints } from '@/lib/loyalty/loyalty-system';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com';

function randomCodePart(len: number) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < len; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateRandomCode() {
  return `REF-${randomCodePart(5)}-${randomCodePart(5)}`;
}

export async function generateReferralCode(userId: string) {
  for (let i = 0; i < 10; i += 1) {
    const code = generateRandomCode();
    const { error } = await supabaseAdmin.from('referral_codes').insert({
      user_id: userId,
      code,
      created_at: new Date().toISOString(),
    });
    if (!error) {
      return {
        code,
        share_link: `${APP_URL}?ref=${code}`,
        short_link: `${APP_URL}/ref/${code.substring(4)}`,
      };
    }
  }
  throw new Error('Failed to generate unique referral code');
}

export async function trackReferralClick(code: string) {
  const { data: row, error } = await supabaseAdmin.from('referral_codes').select('clicks').eq('code', code).single();
  if (error || !row) {
    throw error || new Error('Referral code not found');
  }
  await supabaseAdmin.from('referral_codes').update({ clicks: (row.clicks || 0) + 1 }).eq('code', code);

  cookies().set('referral_code', code, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  });

  return { success: true };
}

export async function applyReferralReward(code: string, newUserId: string, orderId?: string | null) {
  const { data: referralCode, error } = await supabaseAdmin
    .from('referral_codes')
    .select('*')
    .eq('code', code)
    .single();
  if (error || !referralCode) return { skipped: true, reason: 'invalid_code' };
  if (referralCode.user_id === newUserId) return { skipped: true, reason: 'self_referral' };

  const existing = await supabaseAdmin
    .from('referral_conversions')
    .select('id')
    .eq('code', code)
    .eq('new_user_id', newUserId)
    .maybeSingle();
  if (existing.data) return { skipped: true, reason: 'already_converted' };

  const { data: conversion } = await supabaseAdmin
    .from('referral_conversions')
    .insert({
      code,
      new_user_id: newUserId,
      order_id: orderId || null,
      converted_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  await supabaseAdmin
    .from('referral_codes')
    .update({ conversions: (referralCode.conversions || 0) + 1 })
    .eq('id', referralCode.id);

  await supabaseAdmin.from('referral_rewards').insert({
    user_id: referralCode.user_id,
    amount: 2000,
    status: 'pending',
  });

  await awardLoyaltyPoints(referralCode.user_id, 10, 'referral', `referral:${conversion?.id || code}:${newUserId}`);

  const referrerUser = await supabaseAdmin.auth.admin.getUserById(referralCode.user_id);
  const newUser = await supabaseAdmin.auth.admin.getUserById(newUserId);

  if (referrerUser.data.user?.email) {
    await sendTransactionalEmail({
      email: referrerUser.data.user.email,
      subject: '🎉 Your friend joined!',
      html: '<p>You earned £20 credit from your referral.</p>',
      text: 'Your friend joined. You earned £20 credit.',
      emailType: 'referral_referrer_reward',
      userId: referralCode.user_id,
      metadata: { code, new_user_id: newUserId },
    });
  }

  if (newUser.data.user?.email) {
    await sendTransactionalEmail({
      email: newUser.data.user.email,
      subject: 'Welcome! You have 10% off',
      html: '<p>Your friend referred you. Enjoy 10% off your next purchase.</p>',
      text: 'Welcome! You have 10% off.',
      emailType: 'referral_new_user_reward',
      userId: newUserId,
      metadata: { code },
    });
  }

  const conversionCount = (referralCode.conversions || 0) + 1;
  if (conversionCount === 5) {
    await supabaseAdmin.from('profiles').update({ is_ambassador: true }).eq('id', referralCode.user_id);
    if (referrerUser.data.user?.email) {
      await sendTransactionalEmail({
        email: referrerUser.data.user.email,
        subject: "👑 You're now an Ambassador!",
        html: '<p>You referred 5 people. Welcome to Ambassador status.</p>',
        text: "You're now an Ambassador after 5 referrals.",
        emailType: 'referral_ambassador_promotion',
        userId: referralCode.user_id,
        metadata: { conversion_count: conversionCount },
      });
    }
  }

  return { skipped: false, conversionCount };
}

export async function processReferrals() {
  const { data: pendingRewards, error } = await supabaseAdmin
    .from('referral_rewards')
    .select('*')
    .eq('status', 'pending');
  if (error) throw error;

  // Keep as pending by default; this cron can be expanded
  return { pendingRewards: pendingRewards?.length || 0 };
}
