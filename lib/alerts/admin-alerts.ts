import { sendTransactionalEmail } from '@/lib/email';
import { sendSMS } from '@/lib/sms/send-sms';
import { supabaseAdmin } from '@/lib/supabase-server';

async function getPaymentFailureRate() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const failures = await supabaseAdmin
    .from('payment_failures')
    .select('id', { count: 'exact', head: true })
    .gte('failed_at', since);
  const orders = await supabaseAdmin
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since);

  const failCount = failures.count || 0;
  const orderCount = orders.count || 0;
  if (orderCount === 0) return 0;
  return failCount / orderCount;
}

async function getChurnRate() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const users = await supabaseAdmin.auth.admin.listUsers();
  const total = users.data.users.length || 0;
  if (total === 0) return 0;

  const { count: activeCount } = await supabaseAdmin
    .from('journal_entries')
    .select('user_id', { count: 'exact', head: true })
    .gte('created_at', since);

  const active = activeCount || 0;
  const churn = Math.max(0, (total - active) / total);
  return churn;
}

async function getStockLevel(productName: string) {
  const { data } = await supabaseAdmin.from('inventory').select('stock_level').ilike('product_name', productName).maybeSingle();
  return data?.stock_level ?? 0;
}

async function sendAlert(alert: { severity: 'high' | 'medium'; title: string; message: string }) {
  if (!process.env.ADMIN_EMAIL) return;
  await sendTransactionalEmail({
    email: process.env.ADMIN_EMAIL,
    subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
    html: `<p>${alert.message}</p>`,
    text: alert.message,
    emailType: 'admin_threshold_alert',
    metadata: alert,
  });

  if (alert.severity === 'high' && process.env.ADMIN_PHONE) {
    await sendSMS(process.env.ADMIN_PHONE, `[ALERT] ${alert.title}: ${alert.message}`);
  }
}

export async function checkAndAlert() {
  const sent: string[] = [];

  const failureRate = await getPaymentFailureRate();
  if (failureRate > 0.05) {
    await sendAlert({
      severity: 'high',
      title: 'High payment failures',
      message: `${(failureRate * 100).toFixed(1)}% payment failures`,
    });
    sent.push('payment_failures');
  }

  const churnRate = await getChurnRate();
  if (churnRate > 0.1) {
    await sendAlert({
      severity: 'medium',
      title: 'Churn spike',
      message: `${(churnRate * 100).toFixed(1)}% churn this week`,
    });
    sent.push('churn');
  }

  const stock = await getStockLevel('leverage-journal');
  if (stock < 5) {
    await sendAlert({
      severity: 'high',
      title: 'Critical stock',
      message: `Only ${stock} units left. Reorder now.`,
    });
    sent.push('stock');
  }

  return { sent };
}
