import { supabaseAdmin } from '@/lib/supabase-server';
import { getPushConfig } from '@/lib/push/firebase-config';

export async function sendPushNotification(userId: string, title: string, body: string) {
  const cfg = getPushConfig();

  const { data: tokens } = await supabaseAdmin.from('device_tokens').select('token').eq('user_id', userId);
  const list = (tokens || []).map((t: any) => t.token).filter(Boolean);
  if (list.length === 0) return { success: true, sent: 0 };

  if (!cfg.webhookUrl) {
    return { success: true, sent: 0, reason: 'push_webhook_not_configured' };
  }

  const response = await fetch(cfg.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      body,
      tokens: list,
      userId,
      provider: cfg.provider,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return { success: false, sent: 0, failed: list.length, error: err };
  }

  return { success: true, sent: list.length, failed: 0 };
}
