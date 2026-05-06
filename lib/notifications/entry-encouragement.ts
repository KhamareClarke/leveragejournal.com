import { supabaseAdmin } from '@/lib/supabase-server';
import { sendTransactionalEmail } from '@/lib/email';

function daysSince(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function fullDate() {
  return new Date().toISOString().split('T')[0];
}

export async function checkAndEncourageFirstEntry(userId: string) {
  const { data: userResp, error: userErr } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (userErr || !userResp.user?.email || !userResp.user.created_at) return { skipped: true };

  const user = userResp.user;
  const email = user.email;
  const name = (user.user_metadata?.name || user.user_metadata?.full_name || email.split('@')[0]) as string;

  const { data: hasEntry } = await supabaseAdmin
    .from('journal_entries')
    .select('id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();
  if (hasEntry) {
    await supabaseAdmin
      .from('profiles')
      .update({ first_entry_date: new Date().toISOString() })
      .eq('id', userId);
    return { skipped: true, reason: 'already_has_entry' };
  }

  const day = daysSince(user.created_at);
  const hour = new Date().getHours();

  if (day >= 1 && hour >= 18) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('first_entry_email_1_sent_at')
      .eq('id', userId)
      .single();

    if (!profile?.first_entry_email_1_sent_at) {
      await sendTransactionalEmail({
        email,
        subject: "You're 2 minutes away from transformation",
        html: `<p>Hi ${name},</p><p>Your first entry takes 2 minutes. Start today and build momentum.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}/dashboard/daily">Start Your Journey</a></p>`,
        text: `Your first entry takes 2 minutes. Start here: ${(process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com')}/dashboard/daily`,
        emailType: 'first_entry_day_1',
        userId,
        recipientName: name,
      });
      await supabaseAdmin
        .from('profiles')
        .update({ first_entry_email_1_sent_at: new Date().toISOString() })
        .eq('id', userId);
    }
  }

  if (day >= 3) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('first_entry_email_2_sent_at')
      .eq('id', userId)
      .single();
    if (!profile?.first_entry_email_2_sent_at) {
      await sendTransactionalEmail({
        email,
        subject: "What's holding you back?",
        html: `<p>Hi ${name},</p><p>Common reasons people hesitate: perfectionism, time, uncertainty. A 2-minute imperfect entry wins.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}/dashboard/daily">Write your first entry</a></p>`,
        text: `Don't overthink it - just write for 2 minutes: ${(process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com')}/dashboard/daily`,
        emailType: 'first_entry_day_3',
        userId,
        recipientName: name,
      });
      await supabaseAdmin
        .from('profiles')
        .update({ first_entry_email_2_sent_at: new Date().toISOString() })
        .eq('id', userId);
    }
  }

  if (day >= 7) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('first_entry_auto_generated_at')
      .eq('id', userId)
      .single();
    if (!profile?.first_entry_auto_generated_at) {
      const { data: entry } = await supabaseAdmin
        .from('journal_entries')
        .insert({
          user_id: userId,
          entry_date: fullDate(),
          day_number: 1,
          gratitude: 'I am grateful for the chance to start fresh.',
          priority_1: 'Write one honest paragraph about today.',
          reflection: 'This entry was auto-generated to help you begin. Edit it to make it yours.',
          mood: 'reflective',
          completed: false,
          tasks: [{ id: 'first-task', text: 'Edit this auto-generated entry', completed: false }],
        })
        .select('id')
        .single();

      await supabaseAdmin
        .from('profiles')
        .update({ first_entry_auto_generated_at: new Date().toISOString() })
        .eq('id', userId);

      await sendTransactionalEmail({
        email,
        subject: 'We created an entry for you',
        html: `<p>Hi ${name},</p><p>We created your first journal entry so you can start instantly.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}/journal">Open your entry</a></p>`,
        text: `We created your first entry. Open it: ${(process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com')}/journal`,
        emailType: 'first_entry_day_7',
        userId,
        recipientName: name,
        metadata: { auto_entry_id: entry?.id || null },
      });
    }
  }

  return { skipped: false };
}

export async function runFirstEntryEncouragementBatch() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw error;
  let processed = 0;
  for (const user of data.users) {
    await checkAndEncourageFirstEntry(user.id);
    processed += 1;
  }
  return { processed };
}
