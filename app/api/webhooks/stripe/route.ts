import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { saveOrderToDb } from '@/lib/orders-db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // Extract order details from session
      const customerEmail = session.customer_email || session.customer_details?.email || '';
      const customerName = session.customer_details?.name || undefined;
      const orderId = session.id;
      const metadata = session.metadata || {};
      
      // Get line items to determine product details
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const productName = lineItems.data[0]?.description || metadata.product || 'Leverage Journal - First Edition A5';
      const quantity = lineItems.data[0]?.quantity || parseInt(metadata.itemCount || '1');
      const amountTotal = session.amount_total || 0;
      const price = `£${(amountTotal / 100).toFixed(2)}`;

      // Get shipping and billing address information
      // Type assertion for webhook session data (shipping_details is included in webhook payload)
      const expandedSession = session as any;
      const shippingAddress = expandedSession.shipping_details?.address || expandedSession.customer_details?.shipping?.address || null;
      const billingAddress = expandedSession.customer_details?.address || null;
      const shippingName = expandedSession.shipping_details?.name || expandedSession.customer_details?.shipping?.name || null;
      const phone = expandedSession.customer_details?.phone || expandedSession.shipping_details?.phone || null;

      // Format addresses
      const formatAddress = (addr: any) => {
        if (!addr) return null;
        const parts = [];
        if (addr.line1) parts.push(addr.line1);
        if (addr.line2) parts.push(addr.line2);
        if (addr.city) parts.push(addr.city);
        if (addr.state) parts.push(addr.state);
        if (addr.postal_code) parts.push(addr.postal_code);
        if (addr.country) parts.push(addr.country);
        return parts.length > 0 ? parts.join(', ') : null;
      };

      const shippingAddressFormatted = formatAddress(shippingAddress);
      const billingAddressFormatted = formatAddress(billingAddress);

      // Only process Leverage Journal orders (save to DB + email)
      const isLeverageJournal =
        productName.toLowerCase().includes('leverage') ||
        productName.toLowerCase().includes('journal') ||
        (metadata.product || '').toLowerCase().includes('leverage-journal');
      if (!isLeverageJournal) {
        return NextResponse.json({ received: true });
      }

      // Save order to database
      const dbResult = await saveOrderToDb({
        stripe_session_id: orderId,
        customer_email: customerEmail,
        customer_name: customerName ?? null,
        phone: phone ?? null,
        product_name: productName,
        quantity,
        amount_total: amountTotal,
        price_display: price,
        currency: (session.currency as string) || 'gbp',
        shipping_address: shippingAddressFormatted,
        billing_address: billingAddressFormatted,
        shipping_address_raw: shippingAddress ?? null,
        billing_address_raw: billingAddress ?? null,
        shipping_name: shippingName ?? null,
        payment_status: 'paid',
      });
      if (dbResult.ok) {
        console.log('[Webhook] Order saved to database:', orderId);
      } else {
        console.warn('[Webhook] Order not saved to DB:', dbResult.error);
      }

      // Send confirmation emails (admin is sent first in sendOrderConfirmationEmail)
      if (customerEmail) {
        const emailResult = await sendOrderConfirmationEmail(
          customerEmail,
          {
            orderId,
            productName,
            price,
            quantity,
            customerName,
            phone: phone || undefined,
            shippingAddress: shippingAddressFormatted,
            shippingAddressRaw: shippingAddress,
            billingAddress: billingAddressFormatted,
            billingAddressRaw: billingAddress,
            shippingName: shippingName || undefined,
          },
          'clarkekhamare@gmail.com'
        );
        if (emailResult.adminMessageId) {
          console.log('[Webhook] Order confirmation emails sent for order', orderId);
        } else {
          console.error('[Webhook] Admin email was NOT sent for order', orderId, '- check EMAIL_USER/EMAIL_PASS on Vercel.');
        }
      } else {
        console.warn('[Webhook] No customer email found for order', orderId);
      }
    } catch (error: any) {
      console.error('Error processing order confirmation:', error);
      // Don't return error - we don't want to fail the webhook
      // Stripe will retry if we return an error
    }
  }

  return NextResponse.json({ received: true });
}
