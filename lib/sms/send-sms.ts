import { supabaseAdmin } from '@/lib/supabase-server';
import { sendTransactionalEmail } from '@/lib/email';
import { sendSMS } from '@/lib/sms';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com';

export async function sendOrderSMS(orderId: string, phoneNumber: string) {
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    throw error || new Error('Order not found for SMS');
  }

  const message = `MyLeverageJournal: Order confirmed! #${order.stripe_session_id || order.id}
Track: ${APP_URL}/order/${order.id}
Questions? Reply HELP
Reply STOP to unsubscribe`;

  try {
    await sendSMS({
      to: phoneNumber,
      body: message,
    });

    await supabaseAdmin.from('orders').update({ sms_sent: true }).eq('id', orderId);
    return { success: true };
  } catch (smsError: any) {
    console.error('SMS failed:', smsError?.message || smsError);

    await sendTransactionalEmail({
      email: order.customer_email,
      subject: 'Order Confirmed',
      html: `<p>${message.replace(/\n/g, '<br/>')}</p>`,
      text: message,
      emailType: 'order_sms_fallback_email',
      metadata: { order_id: order.id },
    });

    return { success: false, fallbackEmailSent: true };
  }
}
