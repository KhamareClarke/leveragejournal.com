import { sendTransactionalEmail } from '@/lib/email';
import { supabaseAdmin } from '@/lib/supabase-server';

type CampaignDef = {
  name: string;
  code: string;
  discount: number;
  start: { month: number; day: number };
  end: { month: number; day: number };
  emails: Array<{ day: number; subject: string }>;
};

const SEASONAL_CAMPAIGNS: CampaignDef[] = [
  {
    name: 'Black Friday',
    code: 'BF50',
    discount: 50,
    start: { month: 11, day: 24 },
    end: { month: 11, day: 27 },
    emails: [
      { day: -7, subject: 'Mark your calendar' },
      { day: -1, subject: 'Setup reminders' },
      { day: 0, subject: '🔥 BLACK FRIDAY LIVE' },
    ],
  },
  {
    name: 'New Year',
    code: 'NY30',
    discount: 30,
    start: { month: 1, day: 1 },
    end: { month: 1, day: 15 },
    emails: [
      { day: -3, subject: 'Transform in 2025' },
      { day: 0, subject: 'New goals start NOW' },
    ],
  },
  {
    name: 'Summer',
    code: 'SUM25',
    discount: 25,
    start: { month: 6, day: 15 },
    end: { month: 7, day: 15 },
    emails: [{ day: 0, subject: 'Plan your summer goals' }],
  },
];

function dateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

export async function processCampaigns() {
  const today = new Date();
  const y = today.getUTCFullYear();
  const todayStr = dateStr(today);

  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  const allUsers = users?.users || [];
  let emailsSent = 0;

  for (const c of SEASONAL_CAMPAIGNS) {
    const startDate = new Date(Date.UTC(y, c.start.month - 1, c.start.day));
    const endDate = new Date(Date.UTC(y, c.end.month - 1, c.end.day));

    await supabaseAdmin.from('campaigns').upsert(
      {
        name: c.name,
        discount_code: c.code,
        discount_percent: c.discount,
        start_date: dateStr(startDate),
        end_date: dateStr(endDate),
      },
      { onConflict: 'discount_code' }
    );

    for (const email of c.emails) {
      const sendDate = new Date(startDate);
      sendDate.setUTCDate(sendDate.getUTCDate() + email.day);
      if (dateStr(sendDate) !== todayStr) continue;

      for (const user of allUsers) {
        if (!user.email) continue;
        await sendTransactionalEmail({
          email: user.email,
          subject: email.subject,
          html: `<p>${c.name} campaign is live.</p><p>Use code <strong>${c.code}</strong> for ${c.discount}% off.</p>`,
          text: `${c.name} campaign. Code ${c.code} for ${c.discount}% off.`,
          emailType: 'seasonal_campaign',
          userId: user.id,
          metadata: { campaign: c.name, code: c.code },
        });
        emailsSent += 1;
      }
    }
  }

  return { emailsSent };
}
