import { sendTransactionalEmail } from '@/lib/email';
import { supabaseAdmin } from '@/lib/supabase-server';

function hoursSince(dateStr?: string | null) {
  if (!dateStr) return Infinity;
  return (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60);
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com';

export async function decrementStock(productName: string, quantity: number) {
  const { data: item } = await supabaseAdmin
    .from('inventory')
    .select('*')
    .ilike('product_name', productName)
    .maybeSingle();
  if (!item) return { skipped: true };

  const next = Math.max(0, (item.stock_level || 0) - quantity);
  await supabaseAdmin.from('inventory').update({ stock_level: next, updated_at: new Date().toISOString() }).eq('id', item.id);
  return { skipped: false, stock_level: next };
}

export async function checkStockLevels() {
  const { data: inventory, error } = await supabaseAdmin.from('inventory').select('*');
  if (error || !inventory) throw error || new Error('Failed to load inventory');

  const adminEmail = process.env.ADMIN_EMAIL;
  let lowAlerts = 0;
  let criticalAlerts = 0;
  let disabled = 0;

  for (const item of inventory) {
    const productName = item.product_name || 'Product';
    const stock = item.stock_level || 0;

    if (adminEmail && stock < (item.low_stock_threshold || 50) && hoursSince(item.low_stock_last_alert_at) >= 24) {
      await sendTransactionalEmail({
        email: adminEmail,
        subject: 'Stock running low',
        html: `<p>${productName}: ${stock} units remaining.</p>`,
        text: `${productName}: ${stock} units remaining.`,
        emailType: 'stock_low_alert',
        metadata: { inventory_id: item.id, stock_level: stock },
      });
      await supabaseAdmin.from('inventory').update({ low_stock_last_alert_at: new Date().toISOString() }).eq('id', item.id);
      lowAlerts += 1;
    }

    if (adminEmail && stock < (item.critical_stock_threshold || 10) && hoursSince(item.critical_stock_last_alert_at) >= 12) {
      await sendTransactionalEmail({
        email: adminEmail,
        subject: 'CRITICAL: Stock critical',
        html: `<p>${productName}: ${stock} units left.</p>`,
        text: `${productName}: ${stock} units left.`,
        emailType: 'stock_critical_alert',
        metadata: { inventory_id: item.id, stock_level: stock },
      });
      await supabaseAdmin
        .from('inventory')
        .update({ critical_stock_last_alert_at: new Date().toISOString() })
        .eq('id', item.id);
      criticalAlerts += 1;

      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      for (const user of users?.users || []) {
        if (!user.email) continue;
        await sendTransactionalEmail({
          email: user.email,
          subject: '⚠️ Limited availability!',
          html: `<p>Only ${stock} left of ${productName}. Order now.</p><p><a href="${APP_URL}">Order now</a></p>`,
          text: `Only ${stock} left of ${productName}. ${APP_URL}`,
          emailType: 'stock_customer_urgency',
          userId: user.id,
          metadata: { inventory_id: item.id, stock_level: stock },
        });
      }
    }

    if (stock === 0 && item.is_active !== false) {
      await supabaseAdmin
        .from('inventory')
        .update({ is_active: false, waitlist_enabled: true, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      disabled += 1;
    }
  }

  return { lowAlerts, criticalAlerts, disabled };
}
