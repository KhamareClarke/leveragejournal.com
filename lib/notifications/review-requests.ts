import { supabaseAdmin } from '@/lib/supabase-server';
import { sendTransactionalEmail } from '@/lib/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com';

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export async function sendReviewRequests() {
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: true });

  if (error || !orders) throw error || new Error('Failed to load orders');

  let day10Sent = 0;
  let day30Sent = 0;

  for (const order of orders) {
    const days = daysSince(order.created_at);
    const email = order.customer_email;
    if (!email) continue;

    if (days >= 10 && !order.review_requested_at) {
      await sendTransactionalEmail({
        email,
        subject: "How's your Leverage Journal?",
        html: `<p>We'd love your feedback.</p><p><a href="${APP_URL}/reviews/${order.id}">Leave a review</a></p><p>Rate us: 1 ⭐ to 5 ⭐</p>`,
        text: `We'd love your feedback. Review here: ${APP_URL}/reviews/${order.id}`,
        emailType: 'review_request_day_10',
        metadata: { order_id: order.id },
      });
      await supabaseAdmin
        .from('orders')
        .update({ review_requested_at: new Date().toISOString() })
        .eq('id', order.id);
      day10Sent += 1;
    }

    if (days >= 30 && !order.review_submitted) {
      const existing = await supabaseAdmin
        .from('email_logs')
        .select('id')
        .eq('email', email)
        .eq('email_type', 'testimonial_request_day_30')
        .eq('metadata->>order_id', String(order.id))
        .limit(1)
        .maybeSingle();
      if (!existing.data) {
        await sendTransactionalEmail({
          email,
          subject: 'Your transformation story (share it with others)',
          html: `<p>We are featuring user transformations.</p><p><a href="${APP_URL}/testimonials/${order.id}">Share your story</a></p><p>If featured, you receive a £50 Amazon gift card.</p>`,
          text: `Share your story: ${APP_URL}/testimonials/${order.id} (£50 Amazon gift card if featured)`,
          emailType: 'testimonial_request_day_30',
          metadata: { order_id: order.id },
        });
        day30Sent += 1;
      }
    }
  }

  return { day10Sent, day30Sent };
}
