import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '@/lib/email';

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

      // Send confirmation emails
      if (customerEmail) {
        await sendOrderConfirmationEmail(
          customerEmail,
          {
            orderId,
            productName,
            price,
            quantity,
            customerName,
          },
          'clarkekhamare@gmail.com' // Admin email
        );
        
        console.log(`Order confirmation emails sent for order ${orderId}`);
      } else {
        console.warn(`No customer email found for order ${orderId}`);
      }
    } catch (error: any) {
      console.error('Error processing order confirmation:', error);
      // Don't return error - we don't want to fail the webhook
      // Stripe will retry if we return an error
    }
  }

  return NextResponse.json({ received: true });
}
