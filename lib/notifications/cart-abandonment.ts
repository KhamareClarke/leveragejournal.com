import { supabaseAdmin } from '@/lib/supabase-server';
import { sendTransactionalEmail } from '@/lib/email';
import { sendSMS } from '@/lib/sms';

function formatPrice(amountPence: number | null | undefined) {
  return `£${((amountPence || 0) / 100).toFixed(2)}`;
}

function cartMinutesAbandoned(createdAt: string) {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60));
}

async function markCartFlag(cartId: string, field: 'email_sent_1h' | 'email_sent_6h' | 'email_sent_24h') {
  await supabaseAdmin.from('carts').update({ [field]: true }).eq('id', cartId);
}

export async function handleCartAbandonment(cartId: string) {
  const { data: cart, error } = await supabaseAdmin.from('carts').select('*').eq('id', cartId).single();
  if (error || !cart) return { skipped: true, reason: 'cart_not_found' };
  if (cart.completed_at) return { skipped: true, reason: 'cart_completed' };

  const minutesAbandoned = cartMinutesAbandoned(cart.abandoned_at || cart.created_at);
  const items = Array.isArray(cart.items) ? cart.items : [];
  const itemNames = items.map((i: any) => i?.name).filter(Boolean).join(', ');
  const checkoutLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}/checkout?cart=${cartId}`;

  if (minutesAbandoned >= 60 && !cart.email_sent_1h && cart.user_email) {
    await sendTransactionalEmail({
      email: cart.user_email,
      subject: 'You left something in your cart 👜',
      html: `<p>Your cart contains: ${itemNames || 'items you selected'}.</p><p>Total: ${formatPrice(cart.total)}</p><p><a href="${checkoutLink}">Return to checkout</a></p>`,
      text: `You left items in your cart.\nTotal: ${formatPrice(cart.total)}\nCheckout: ${checkoutLink}`,
      emailType: 'cart_abandonment_1h',
      userId: cart.user_id || null,
      metadata: { cart_id: cartId },
    });
    await markCartFlag(cartId, 'email_sent_1h');
  }

  if (minutesAbandoned >= 360 && !cart.email_sent_6h) {
    if (cart.user_phone) {
      try {
        await sendSMS({
          to: cart.user_phone,
          body: `Don't miss out! Your cart expires in 18 hours. ${checkoutLink} Reply STOP to unsubscribe.`,
        });
      } catch (smsError: any) {
        console.error(`[Cart SMS] Failed for cart ${cartId}:`, smsError?.message || smsError);
      }
    }
    await markCartFlag(cartId, 'email_sent_6h');
  }

  if (minutesAbandoned >= 1440 && !cart.email_sent_24h && cart.user_email) {
    const discountCode = `SAVE10-${cartId.slice(0, 6).toUpperCase()}`;
    await sendTransactionalEmail({
      email: cart.user_email,
      subject: 'Last chance: Your cart expires in 6 hours',
      html: `<p>Final opportunity to complete your purchase.</p><p>Use code <strong>${discountCode}</strong> for 10% off.</p><p><a href="${checkoutLink}">Complete purchase</a></p>`,
      text: `Last chance for your cart.\nUse ${discountCode} for 10% off.\nCheckout: ${checkoutLink}`,
      emailType: 'cart_abandonment_24h',
      userId: cart.user_id || null,
      metadata: { cart_id: cartId, discount_code: discountCode },
    });
    await markCartFlag(cartId, 'email_sent_24h');
  }

  return { skipped: false };
}
