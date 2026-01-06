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
      expand: ['data.line_items'], // Expand line items to get product details
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

        return {
          orderId: session.id,
          customerEmail: session.customer_email || session.customer_details?.email || 'No email',
          customerName: session.customer_details?.name || 'Not provided',
          productName,
          quantity,
          price,
          amountTotal: amountTotal / 100, // In pounds
          currency: session.currency?.toUpperCase() || 'GBP',
          paymentStatus: session.payment_status,
          status: session.status,
          createdAt: new Date(session.created * 1000).toISOString(),
          metadata: session.metadata || {},
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
