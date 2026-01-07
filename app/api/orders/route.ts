import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const startingAfter = searchParams.get('starting_after') || undefined;

    // Retrieve all checkout sessions (paid orders)
    const sessions = await stripe.checkout.sessions.list({
      limit,
      starting_after: startingAfter,
      status: 'complete', // Only completed/paid sessions
      expand: ['data.line_items', 'data.shipping_details', 'data.customer_details'], // Expand to get shipping and customer details
    });

    // Format orders with details and filter for Leverage Journal only
    const allOrders = await Promise.all(
      sessions.data.map(async (session) => {
        // Get line items if not already expanded
        let lineItems = session.line_items?.data || [];
        if (lineItems.length === 0) {
          const items = await stripe.checkout.sessions.listLineItems(session.id);
          lineItems = items.data;
        }

        const productName = lineItems[0]?.description || session.metadata?.product || 'Leverage Journal - First Edition A5';
        const quantity = lineItems[0]?.quantity || parseInt(session.metadata?.itemCount || '1');
        const amountTotal = session.amount_total || 0;
        const price = `£${(amountTotal / 100).toFixed(2)}`;

        // Get shipping and billing address information
        // Type assertion for expanded session data
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

        return {
          orderId: session.id,
          customerEmail: session.customer_email || session.customer_details?.email || 'No email',
          customerName: session.customer_details?.name || shippingName || 'Not provided',
          phone: phone || 'Not provided',
          productName,
          quantity,
          price,
          amountTotal: amountTotal / 100, // In pounds
          currency: session.currency?.toUpperCase() || 'GBP',
          paymentStatus: session.payment_status,
          status: session.status,
          createdAt: new Date(session.created * 1000).toISOString(),
          metadata: session.metadata || {},
          // Address information
          shippingAddress: formatAddress(shippingAddress),
          shippingAddressRaw: shippingAddress,
          billingAddress: formatAddress(billingAddress),
          billingAddressRaw: billingAddress,
          shippingName: shippingName,
        };
      })
    );

    // Filter to only show Leverage Journal orders
    const orders = allOrders.filter(order => {
      const productNameLower = order.productName.toLowerCase();
      const metadataProduct = order.metadata?.product?.toLowerCase() || '';
      
      // Check if it's a Leverage Journal order
      return (
        productNameLower.includes('leverage') ||
        productNameLower.includes('journal') ||
        productNameLower.includes('leveragejournel') ||
        metadataProduct.includes('leverage-journal') ||
        metadataProduct === 'leverage-journal'
      );
    });

    return NextResponse.json({
      orders,
      hasMore: sessions.has_more,
      total: orders.length,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
