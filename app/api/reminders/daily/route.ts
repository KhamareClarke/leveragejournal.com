import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendJournalReminder, sendGoalProgressReminder } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Helper to check if entry has content
function hasContent(entry: any): boolean {
  return !!(
    entry?.gratitude?.trim() ||
    entry?.priority_1?.trim() ||
    entry?.priority_2?.trim() ||
    entry?.priority_3?.trim() ||
    (entry?.tasks && Array.isArray(entry.tasks) && entry.tasks.length > 0 && 
     entry.tasks.some((t: any) => t && t.text && t.text.trim().length > 0)) ||
    entry?.reflection?.trim() ||
    entry?.mood?.trim()
  );
}

// Shared function to handle daily reminders
async function handleDailyReminders(request: NextRequest) {
  try {
    // Verify cron secret (optional but recommended)
    // Vercel cron jobs are automatically authenticated, but we can add extra security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const isVercelCron = request.headers.get('x-vercel-signature') || request.headers.get('user-agent')?.includes('vercel-cron');
    
    // If CRON_SECRET is set, require it (unless it's a Vercel cron job)
    if (cronSecret && !isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    let journalSent = 0;
    let journalSkipped = 0;
    let goalsSent = 0;
    let goalsSkipped = 0;
    const journalSentEmails: string[] = [];
    const journalSkippedEmails: string[] = [];
    const goalsSentEmails: string[] = [];
    const goalsSkippedEmails: string[] = [];

    // Check each user
    for (const user of users.users) {
      if (!user.email) continue;

      const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];

      // Check journal entry
      const { data: entry, error: entryError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', todayStr)
        .single();

      // If no entry or entry has no content, send journal reminder
      if (!entry || !hasContent(entry)) {
        try {
          await sendJournalReminder(user.email, userName, user.id);
          journalSent++;
          journalSentEmails.push(user.email);
          console.log(`✅ Sent journal reminder to ${user.email}`);
        } catch (emailError: any) {
          console.error(`❌ Failed to send journal reminder to ${user.email}:`, emailError.message);
        }
      } else {
        journalSkipped++;
        journalSkippedEmails.push(user.email);
        console.log(`⏭️ Skipped journal reminder for ${user.email} - already has entry`);
      }

      // Check goals
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('title, progress')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (goalsError) {
        console.error(`Error fetching goals for ${user.email}:`, goalsError);
        continue;
      }

      // Only send if user has active goals
      if (goals && goals.length > 0) {
        try {
          await sendGoalProgressReminder(
            user.email,
            userName,
            goals.map(g => ({ title: g.title, progress: g.progress || 0 })),
            user.id
          );
          goalsSent++;
          goalsSentEmails.push(user.email);
          console.log(`✅ Sent goal reminder to ${user.email} (${goals.length} goals)`);
        } catch (emailError: any) {
          console.error(`❌ Failed to send goal reminder to ${user.email}:`, emailError.message);
        }
      } else {
        goalsSkipped++;
        goalsSkippedEmails.push(user.email);
        console.log(`⏭️ Skipped goal reminder for ${user.email} - no active goals`);
      }
    }

    return NextResponse.json({
      success: true,
      journal: {
        sent: journalSent,
        skipped: journalSkipped,
        sentTo: journalSentEmails,
        skippedFor: journalSkippedEmails,
      },
      goals: {
        sent: goalsSent,
        skipped: goalsSkipped,
        sentTo: goalsSentEmails,
        skippedFor: goalsSkippedEmails,
      },
      total: users.users.length,
    });
  } catch (error: any) {
    console.error('Daily reminder error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reminders' },
      { status: 500 }
    );
  }
}

// GET: Check and send daily reminders (journal + goals) - called by cron
export async function GET(request: NextRequest) {
  return handleDailyReminders(request);
}

// POST: Check and send daily reminders (journal + goals) - called by cron
export async function POST(request: NextRequest) {
  return handleDailyReminders(request);
}

