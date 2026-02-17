import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '@/lib/email';

const ADMIN_EMAIL = 'clarkekhamare@gmail.com';

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

function formatAddress(addr: any): string | null {
  if (!addr) return null;
  const parts = [];
  if (addr.line1) parts.push(addr.line1);
  if (addr.line2) parts.push(addr.line2);
  if (addr.city) parts.push(addr.city);
  if (addr.state) parts.push(addr.state);
  if (addr.postal_code) parts.push(addr.postal_code);
  if (addr.country) parts.push(addr.country);
  return parts.length > 0 ? parts.join(', ') : null;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured' },
        { status: 500 }
      );
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: 'EMAIL_USER and EMAIL_PASS must be set to send emails' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });

    // Collect all complete checkout sessions (paginate) – no expand on list (Stripe doesn't allow it for shipping_details)
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

    const results: { orderId: string; sent: boolean; error?: string }[] = [];
    let sent = 0;
    let failed = 0;
    let firstSmtpError: string | null = null;

    for (const session of allSessions) {
      let lineItems = session.line_items?.data || [];
      if (lineItems.length === 0) {
        const items = await stripe.checkout.sessions.listLineItems(session.id);
        lineItems = items.data;
      }
      const productName = lineItems[0]?.description || session.metadata?.product || 'Leverage Journal - First Edition A5';
      const metadataProduct = session.metadata?.product;

      if (!isLeverageJournalOrder(productName, metadataProduct)) {
        continue; // skip non–Leverage Journal orders
      }

      // Retrieve session (this API version doesn't support expanding shipping_details on retrieve)
      const fullSession = await stripe.checkout.sessions.retrieve(session.id);
      const expandedSession = fullSession as any;
      const customerEmail = fullSession.customer_email || expandedSession.customer_details?.email || '';
      if (!customerEmail) {
        results.push({ orderId: session.id, sent: false, error: 'No customer email' });
        failed++;
        continue;
      }

      const quantity = lineItems[0]?.quantity || parseInt(String(session.metadata?.itemCount || '1'));
      const amountTotal = session.amount_total || 0;
      const price = `£${(amountTotal / 100).toFixed(2)}`;
      const shippingAddress = expandedSession.shipping_details?.address || expandedSession.customer_details?.shipping?.address || null;
      const billingAddress = expandedSession.customer_details?.address || null;
      const shippingName = expandedSession.shipping_details?.name || expandedSession.customer_details?.shipping?.name || null;
      const phone = expandedSession.customer_details?.phone || expandedSession.shipping_details?.phone || null;

      try {
        const emailResult = await sendOrderConfirmationEmail(
          customerEmail,
          {
            orderId: session.id,
            productName,
            price,
            quantity,
            customerName: expandedSession.customer_details?.name || undefined,
            phone: phone || undefined,
            shippingAddress: formatAddress(shippingAddress),
            shippingAddressRaw: shippingAddress,
            billingAddress: formatAddress(billingAddress),
            billingAddressRaw: billingAddress,
            shippingName: shippingName || undefined,
          },
          ADMIN_EMAIL
        );
        if (emailResult.adminMessageId) {
          sent++;
          results.push({ orderId: session.id, sent: true });
        } else {
          failed++;
          const errMsg = (emailResult as any).lastError || 'Email send returned no message ID';
          if (!firstSmtpError) firstSmtpError = errMsg;
          results.push({ orderId: session.id, sent: false, error: errMsg });
        }
      } catch (err: any) {
        failed++;
        const msg = err?.message || String(err);
        if (!firstSmtpError) firstSmtpError = msg;
        results.push({ orderId: session.id, sent: false, error: msg });
        console.error('[Send-all-emails] Order', session.id, msg);
      }
    }

    console.log('[Send-all-emails] Done. Sent:', sent, 'Failed:', failed);
    return NextResponse.json({
      success: true,
      total: allSessions.length,
      leverageJournalProcessed: results.length,
      sent,
      failed,
      firstSmtpError: firstSmtpError || undefined,
      results,
    });
  } catch (error: any) {
    console.error('Send-all-emails error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send order emails' },
      { status: 500 }
    );
  }
}
