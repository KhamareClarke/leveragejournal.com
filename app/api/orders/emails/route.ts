import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function isLeverageJournalOrder(productName: string, metadataProduct?: string): boolean {
  const productNameLower = productName.toLowerCase();
  const meta = (metadataProduct || '').toLowerCase();
  return (
    productNameLower.includes('leverage') ||
    productNameLower.includes('journal') ||
    productNameLower.includes('leveragejournel') ||
    meta.includes('leverage-journal') ||
    meta === 'leverage-journal'
  );
}

/**
 * GET /api/orders/emails
 * Returns all past Leverage Journal order customer emails (order id, date, email, name).
 */
export async function GET() {
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

    const allSessions: Stripe.Checkout.Session[] = [];
    let startingAfter: string | undefined;
    do {
      const list = await stripe.checkout.sessions.list({
        limit: 100,
        status: 'complete',
        starting_after: startingAfter,
      });
      allSessions.push(...list.data);
      startingAfter = list.has_more && list.data.length ? list.data[list.data.length - 1].id : undefined;
    } while (startingAfter);

    const orders: { orderId: string; email: string; name: string; date: string }[] = [];

    for (const session of allSessions) {
      let lineItems = session.line_items?.data || [];
      if (lineItems.length === 0) {
        const items = await stripe.checkout.sessions.listLineItems(session.id);
        lineItems = items.data;
      }
      const productName = lineItems[0]?.description || session.metadata?.product || 'Leverage Journal - First Edition A5';
      const metadataProduct = session.metadata?.product;

      if (!isLeverageJournalOrder(productName, metadataProduct)) continue;

      const email = session.customer_email || (session as any).customer_details?.email || '';
      if (!email) continue;

      const name = (session as any).customer_details?.name || session.customer_details?.name || '';
      orders.push({
        orderId: session.id,
        email,
        name: name || '—',
        date: new Date(session.created * 1000).toISOString().slice(0, 19).replace('T', ' '),
      });
    }

    // Sort newest first
    orders.sort((a, b) => b.date.localeCompare(a.date));

    const emailsOnly = orders.map((o) => o.email);
    const uniqueEmails = Array.from(new Set(emailsOnly));

    return NextResponse.json({
      total: orders.length,
      uniqueEmails: uniqueEmails.length,
      emails: uniqueEmails,
      orders: orders,
    });
  } catch (error: any) {
    console.error('Error fetching order emails:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch order emails' },
      { status: 500 }
    );
  }
}
