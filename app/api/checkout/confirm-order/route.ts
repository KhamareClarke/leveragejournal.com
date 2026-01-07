import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Extract order details
    const customerEmail = session.customer_email || session.customer_details?.email || '';
    const customerName = session.customer_details?.name || undefined;
    const orderId = session.id;
    const metadata = session.metadata || {};

    // Get line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const productName = lineItems.data[0]?.description || metadata.product || 'Leverage Journal - First Edition A5';
    const quantity = lineItems.data[0]?.quantity || parseInt(metadata.itemCount || '1');
    const amountTotal = session.amount_total || 0;
    const price = `£${(amountTotal / 100).toFixed(2)}`;

    // Get shipping and billing address information
    const shippingAddress = session.shipping_details?.address || session.customer_details?.shipping?.address || null;
    const billingAddress = session.customer_details?.address || null;
    const shippingName = session.shipping_details?.name || session.customer_details?.shipping?.name || null;
    const phone = session.customer_details?.phone || session.shipping_details?.phone || null;

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
          phone: phone || undefined,
          shippingAddress: shippingAddressFormatted,
          shippingAddressRaw: shippingAddress,
          billingAddress: billingAddressFormatted,
          billingAddressRaw: billingAddress,
          shippingName: shippingName || undefined,
        },
        'clarkekhamare@gmail.com' // Admin email
      );

      return NextResponse.json({ 
        success: true, 
        message: 'Order confirmation emails sent' 
      });
    } else {
      return NextResponse.json(
        { error: 'No customer email found' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error sending order confirmation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send order confirmation' },
      { status: 500 }
    );
  }
}
