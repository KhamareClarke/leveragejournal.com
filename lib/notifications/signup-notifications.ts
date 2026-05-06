import { supabaseAdmin } from '@/lib/supabase-server';
import { sendTransactionalEmail } from '@/lib/email';

function appUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}${path}`;
}

function firstNameFrom(nameOrEmail: string | null) {
  if (!nameOrEmail) return 'there';
  const name = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
  return name.split(' ')[0] || 'there';
}

export async function sendWelcomeEmail1(user: { id: string; email: string; name: string | null }) {
  const firstName = firstNameFrom(user.name || user.email);
  const subject = "Welcome to Leverage Journal - Let's Transform Your Life";
  const html = `
    <h2>Hi ${firstName},</h2>
    <p>Your transformation starts today.</p>
    <p>You're about to start a 90-day journey that will help you:</p>
    <p>✓ Set and achieve ambitious goals<br/>✓ Build unstoppable momentum<br/>✓ Track your progress with precision</p>
    <p>Getting started:</p>
    <p>1. Create your first journal entry (2 minutes)<br/>2. Set your initial goals (5 minutes)<br/>3. Build your daily habit (2-3 minutes daily)</p>
    <p><a href="${appUrl('/dashboard/daily')}">Create Your First Entry</a></p>
    <p>Video walkthrough: ${appUrl('/support')}</p>
    <p>Help: ${appUrl('/faq')}</p>
    <p>Let's transform together,<br/>The Team</p>
  `;
  const text = `Hi ${firstName},

Your transformation starts today.

You're about to start a 90-day journey.
1) Create your first journal entry
2) Set your initial goals
3) Build your daily habit

Create Your First Entry: ${appUrl('/dashboard/daily')}
Video walkthrough: ${appUrl('/support')}
Help: ${appUrl('/faq')}
`;

  await sendTransactionalEmail({
    email: user.email,
    subject,
    html,
    text,
    emailType: 'welcome_day_1',
    userId: user.id,
    recipientName: firstName,
  });

  await supabaseAdmin
    .from('profiles')
    .update({ welcome_email_sent_at: new Date().toISOString() })
    .eq('id', user.id);
}

export async function processWelcomeSeriesBatch() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw error;

  const now = new Date();
  const results = { day1: 0, day3: 0, day7: 0 };

  for (const user of data.users) {
    if (!user.email || !user.created_at) continue;
    const createdAt = new Date(user.created_at);
    const ageMs = now.getTime() - createdAt.getTime();
    const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    const profileName = (user.user_metadata?.name || user.user_metadata?.full_name || null) as string | null;

    if (ageDays === 0) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('welcome_email_sent_at')
        .eq('id', user.id)
        .single();
      if (!profile?.welcome_email_sent_at) {
        await sendWelcomeEmail1({ id: user.id, email: user.email, name: profileName });
        results.day1 += 1;
      }
    }

    if (ageDays === 3) {
      const sent = await supabaseAdmin
        .from('email_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('email_type', 'welcome_day_3')
        .limit(1)
        .maybeSingle();
      if (!sent.data) {
        await sendTransactionalEmail({
          email: user.email,
          subject: 'Goal Setting Framework',
          html: `<h2>Hi ${firstNameFrom(profileName || user.email)},</h2><p>You're journaling now. Great! Let's set goals.</p><p>Framework:<br/>1. Choose area<br/>2. Make it SMART<br/>3. Break into 30-day milestones<br/>4. Add weekly targets</p><p><a href="${appUrl('/dashboard/goals')}">Set Your First Goal</a></p><p>Help: ${appUrl('/faq')}</p>`,
          text: `Goal Setting Framework\nSet your first goal: ${appUrl('/dashboard/goals')}\nHelp: ${appUrl('/faq')}`,
          emailType: 'welcome_day_3',
          userId: user.id,
          recipientName: firstNameFrom(profileName || user.email),
        });
        results.day3 += 1;
      }
    }

    if (ageDays === 7) {
      const sent = await supabaseAdmin
        .from('email_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('email_type', 'welcome_day_7')
        .limit(1)
        .maybeSingle();
      if (!sent.data) {
        await sendTransactionalEmail({
          email: user.email,
          subject: '🔥 7-Day Challenge - Keep Your Streak?',
          html: `<h2>Hi ${firstNameFrom(profileName || user.email)},</h2><p>You've journaled 7 days! That's better than 95% of people.</p><p>The 30-Day Challenge:<br/>- Write every day<br/>- Watch progress compound<br/>- Build unbreakable habit</p><p><a href="${appUrl('/dashboard/daily')}">Write Today's Entry</a></p><p>Success stories: ${appUrl('/features')}</p>`,
          text: `7-Day Challenge\nWrite Today's Entry: ${appUrl('/dashboard/daily')}\nSuccess stories: ${appUrl('/features')}`,
          emailType: 'welcome_day_7',
          userId: user.id,
          recipientName: firstNameFrom(profileName || user.email),
        });
        results.day7 += 1;
      }
    }
  }

  return results;
}
