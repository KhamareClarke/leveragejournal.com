import { supabaseAdmin } from '@/lib/supabase-server';
import { sendTransactionalEmail } from '@/lib/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com';

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function discountCode(percent: number, id: string) {
  return `LJ${percent}-${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

export async function sendProductRecommendations() {
  const { data: views, error } = await supabaseAdmin
    .from('product_views')
    .select('*')
    .eq('purchased', false)
    .order('viewed_at', { ascending: true });

  if (error || !views) throw error || new Error('Failed to load product views');

  const result = { day2: 0, day5: 0, day7: 0 };

  for (const view of views) {
    const days = daysSince(view.viewed_at || view.created_at);
    const email = view.user_email;
    if (!email) continue;

    if (days >= 2 && !view.email_1_sent) {
      await sendTransactionalEmail({
        email,
        subject: 'Still thinking about Leverage Journal?',
        html: `<p>People love the structure, momentum, and clarity this journal creates.</p><p><a href="${APP_URL}">See why users rate it 4.9/5</a></p>`,
        text: `Still thinking about it? See why people love it: ${APP_URL}`,
        emailType: 'product_reco_day_2',
        userId: view.user_id || null,
        metadata: { product_view_id: view.id },
      });
      await supabaseAdmin.from('product_views').update({ email_1_sent: true }).eq('id', view.id);
      result.day2 += 1;
    }

    if (days >= 5 && !view.email_2_sent) {
      const code = discountCode(10, view.id);
      await sendTransactionalEmail({
        email,
        subject: '🎁 Limited time: 10% off',
        html: `<p>Use code <strong>${code}</strong> for 10% off.</p><p>Expires in 48 hours.</p><p><a href="${APP_URL}">Claim offer</a></p>`,
        text: `10% off code: ${code}. Expires in 48 hours. ${APP_URL}`,
        emailType: 'product_reco_day_5',
        userId: view.user_id || null,
        metadata: { product_view_id: view.id, discount_code: code, discount_percent: 10 },
      });
      await supabaseAdmin.from('product_views').update({ email_2_sent: true }).eq('id', view.id);
      result.day5 += 1;
    }

    if (days >= 7 && !view.email_3_sent) {
      const code = discountCode(15, view.id);
      await sendTransactionalEmail({
        email,
        subject: 'Last chance: 15% off exclusive pricing',
        html: `<p>This is our best offer: 15% off with code <strong>${code}</strong>.</p><p><a href="${APP_URL}">Complete your order</a></p>`,
        text: `Last chance: 15% off with code ${code}. ${APP_URL}`,
        emailType: 'product_reco_day_7',
        userId: view.user_id || null,
        metadata: { product_view_id: view.id, discount_code: code, discount_percent: 15 },
      });
      await supabaseAdmin.from('product_views').update({ email_3_sent: true }).eq('id', view.id);
      result.day7 += 1;
    }
  }

  return result;
}
