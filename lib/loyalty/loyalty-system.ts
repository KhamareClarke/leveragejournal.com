import { supabaseAdmin } from '@/lib/supabase-server';
import { sendTransactionalEmail } from '@/lib/email';

export function calculateTier(points: number) {
  if (points < 50) return 'bronze';
  if (points < 150) return 'silver';
  if (points < 300) return 'gold';
  return 'platinum';
}

export async function awardLoyaltyPoints(
  userId: string,
  points: number,
  type: 'purchase' | 'review' | 'referral',
  sourceKey?: string
) {
  if (sourceKey) {
    const existing = await supabaseAdmin
      .from('loyalty_transactions')
      .select('id')
      .eq('source_key', sourceKey)
      .maybeSingle();
    if (existing.data) {
      return { skipped: true, reason: 'already_awarded' };
    }
  }

  const { data: existingAccount } = await supabaseAdmin
    .from('loyalty_accounts')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!existingAccount) {
    await supabaseAdmin.from('loyalty_accounts').insert({
      user_id: userId,
      points: 0,
      tier: 'bronze',
    });
  }

  const { data: account } = await supabaseAdmin
    .from('loyalty_accounts')
    .select('*')
    .eq('user_id', userId)
    .single();

  const newPoints = (account?.points || 0) + points;
  const oldTier = account?.tier || 'bronze';
  const newTier = calculateTier(newPoints);

  await supabaseAdmin.from('loyalty_accounts').update({ points: newPoints, tier: newTier }).eq('user_id', userId);

  await supabaseAdmin.from('loyalty_transactions').insert({
    user_id: userId,
    points,
    transaction_type: type,
    source_key: sourceKey || null,
  });

  if (newTier !== oldTier) {
    const { data: userResp } = await supabaseAdmin.auth.admin.getUserById(userId);
    const email = userResp.user?.email;
    if (email) {
      const tierBenefits: Record<string, string> = {
        silver: 'Free shipping',
        gold: '50% off next purchase',
        platinum: 'VIP status + monthly rewards',
      };

      await sendTransactionalEmail({
        email,
        subject: `🎉 You're ${newTier}!`,
        html: `<p>You reached <strong>${newTier}</strong> status.</p><p>Benefits: ${tierBenefits[newTier] || 'Exclusive rewards'}</p>`,
        text: `You're ${newTier}. Benefits: ${tierBenefits[newTier] || 'Exclusive rewards'}`,
        emailType: 'loyalty_tier_up',
        userId,
        metadata: { old_tier: oldTier, new_tier: newTier, points: newPoints },
      });
    }
  }

  return { skipped: false, points: newPoints, tier: newTier };
}
