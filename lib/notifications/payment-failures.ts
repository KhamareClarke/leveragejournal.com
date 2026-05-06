import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendTransactionalEmail } from '@/lib/email';
import { sendSMS } from '@/lib/sms';

type PaymentFailureInput = {
  email: string;
  amount: number;
  failureReason?: string | null;
  userId?: string | null;
  phone?: string | null;
};

function appUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}${path}`;
}

export async function handlePaymentFailureEvent(event: Stripe.Event) {
  if (event.type !== 'payment_intent.payment_failed') return { ignored: true };
  const intent = event.data.object as Stripe.PaymentIntent;
  const email = intent.receipt_email || '';
  if (!email) return { ignored: true, reason: 'missing_receipt_email' };

  const amount = intent.amount || 0;
  const failureReason = intent.last_payment_error?.message || intent.last_payment_error?.decline_code || 'payment_failed';
  const phone = intent.last_payment_error?.payment_method?.billing_details?.phone || null;
  const userId = (intent.metadata?.userId as string) || null;

  return createAndSendPaymentFailure({
    email,
    amount,
    failureReason,
    phone,
    userId,
  });
}

export async function createAndSendPaymentFailure(input: PaymentFailureInput) {
  const { data: failure, error } = await supabaseAdmin
    .from('payment_failures')
    .insert({
      user_id: input.userId || null,
      email: input.email,
      amount: input.amount,
      failure_reason: input.failureReason || null,
      failed_at: new Date().toISOString(),
      email_sent_immediate: false,
      email_sent_6h: false,
      email_sent_24h: false,
      retry_successful: false,
    })
    .select('*')
    .single();

  if (error || !failure) throw error || new Error('Failed to create payment failure row');

  const retryLink = appUrl(`/checkout?payment=${failure.id}`);
  await sendTransactionalEmail({
    email: input.email,
    subject: "⚠️ Your payment couldn't be processed",
    html: `<p>We tried to process your payment but it was declined.</p><p>Amount: £${(input.amount / 100).toFixed(2)}</p><p><a href="${retryLink}">Retry payment</a></p>`,
    text: `Your payment was declined.\nAmount: £${(input.amount / 100).toFixed(2)}\nRetry: ${retryLink}`,
    emailType: 'payment_failed_immediate',
    userId: input.userId || null,
    metadata: { failure_id: failure.id, failure_reason: input.failureReason || null },
  });

  // SMS provider integration point (Twilio/etc). Kept as stub for now.
  if (input.phone) {
    try {
      await sendSMS({
        to: input.phone,
        body: `Payment failed. Retry: ${retryLink} Reply STOP to unsubscribe.`,
      });
    } catch (smsError: any) {
      console.error(`[Payment SMS] Failed for ${input.email}:`, smsError?.message || smsError);
    }
  }

  await supabaseAdmin.from('payment_failures').update({ email_sent_immediate: true }).eq('id', failure.id);
  return { failureId: failure.id };
}

export async function processScheduledPaymentFailureEmails() {
  const { data: rows, error } = await supabaseAdmin
    .from('payment_failures')
    .select('*')
    .eq('retry_successful', false);
  if (error || !rows) throw error;

  const now = Date.now();
  const result = { sent6h: 0, sent24h: 0 };
  for (const row of rows) {
    const ageHours = (now - new Date(row.failed_at).getTime()) / (1000 * 60 * 60);
    const retryLink = appUrl(`/checkout?payment=${row.id}`);

    if (ageHours >= 6 && !row.email_sent_6h) {
      await sendTransactionalEmail({
        email: row.email,
        subject: 'Payment issue? We can help 🛠️',
        html: `<p>Your payment did not go through. Let's retry it in one click.</p><p><a href="${retryLink}">Retry now</a></p>`,
        text: `Your payment did not go through. Retry now: ${retryLink}`,
        emailType: 'payment_failed_6h',
        userId: row.user_id || null,
        metadata: { failure_id: row.id },
      });
      await supabaseAdmin.from('payment_failures').update({ email_sent_6h: true }).eq('id', row.id);
      result.sent6h += 1;
    }

    if (ageHours >= 24 && !row.email_sent_24h) {
      const discountCode = row.discount_code || `RECOVER10-${String(row.id).slice(0, 6).toUpperCase()}`;
      await sendTransactionalEmail({
        email: row.email,
        subject: 'Last chance: 10% off your order',
        html: `<p>Final reminder: complete your checkout with 10% off.</p><p>Code: <strong>${discountCode}</strong></p><p><a href="${retryLink}">Complete payment</a></p>`,
        text: `Final reminder. Use ${discountCode} for 10% off.\n${retryLink}`,
        emailType: 'payment_failed_24h',
        userId: row.user_id || null,
        metadata: { failure_id: row.id, discount_code: discountCode },
      });
      await supabaseAdmin
        .from('payment_failures')
        .update({ email_sent_24h: true, discount_code: discountCode })
        .eq('id', row.id);
      result.sent24h += 1;
    }
  }

  return result;
}
