import { supabaseAdmin } from '@/lib/supabase-server';

export type OrderRow = {
  stripe_session_id: string;
  customer_email: string;
  customer_name: string | null;
  phone: string | null;
  product_name: string;
  quantity: number;
  amount_total: number;
  price_display: string;
  currency?: string;
  shipping_address: string | null;
  billing_address: string | null;
  shipping_address_raw: object | null;
  billing_address_raw: object | null;
  shipping_name: string | null;
  payment_status?: string;
};

/**
 * Upsert a Leverage Journal order into the database.
 * Uses stripe_session_id as unique key so confirm-order and webhook can both call without duplicates.
 */
export async function saveOrderToDb(order: OrderRow): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { ok: false, error: 'Supabase not configured' };
    }
    const { error } = await supabaseAdmin.from('orders').upsert(
      {
        stripe_session_id: order.stripe_session_id,
        customer_email: order.customer_email,
        customer_name: order.customer_name ?? null,
        phone: order.phone ?? null,
        product_name: order.product_name,
        quantity: order.quantity,
        amount_total: order.amount_total,
        price_display: order.price_display,
        currency: (order.currency || 'gbp').toLowerCase(),
        shipping_address: order.shipping_address ?? null,
        billing_address: order.billing_address ?? null,
        shipping_address_raw: order.shipping_address_raw ?? null,
        billing_address_raw: order.billing_address_raw ?? null,
        shipping_name: order.shipping_name ?? null,
        payment_status: order.payment_status || 'paid',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'stripe_session_id' }
    );
    if (error) {
      console.error('[Orders DB] Upsert error:', error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e: any) {
    console.error('[Orders DB] Error:', e?.message || e);
    return { ok: false, error: e?.message || String(e) };
  }
}
