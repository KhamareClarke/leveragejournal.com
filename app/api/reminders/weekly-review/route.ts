import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWeeklyReviewReminder } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Helper to calculate current week number
function getCurrentWeekNumber(firstEntryDate: string): number {
  const [year, month, day] = firstEntryDate.split('-').map(Number);
  const programStart = new Date(year, month - 1, day);
  programStart.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const daysSinceStart = Math.floor((today.getTime() - programStart.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(daysSinceStart / 7) + 1;
}

// Helper to get week start date
function getWeekStartDate(firstEntryDate: string): string {
  const [year, month, day] = firstEntryDate.split('-').map(Number);
  const programStart = new Date(year, month - 1, day);
  programStart.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const daysSinceStart = Math.floor((today.getTime() - programStart.getTime()) / (1000 * 60 * 60 * 24));
  const currentWeek = Math.floor(daysSinceStart / 7);
  
  const weekStart = new Date(programStart);
  weekStart.setDate(programStart.getDate() + (currentWeek * 7));
  
  return weekStart.toISOString().split('T')[0];
}

// POST: Check and send weekly review reminders (called by cron)
export async function POST(request: NextRequest) {
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

    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    let sentCount = 0;
    let skippedCount = 0;

    // Check each user
    for (const user of users.users) {
      if (!user.email) continue;

      // Get first entry date to calculate week
      const { data: firstEntry } = await supabase
        .from('journal_entries')
        .select('entry_date')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: true })
        .limit(1)
        .single();

      if (!firstEntry?.entry_date) {
        skippedCount++;
        continue; // User hasn't started yet
      }

      const weekNumber = getCurrentWeekNumber(firstEntry.entry_date);
      const weekStartDate = getWeekStartDate(firstEntry.entry_date);

      // Check if user has filled weekly review for this week
      const { data: review, error: reviewError } = await supabase
        .from('weekly_reviews')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_number', weekNumber)
        .single();

      // If no review, send reminder
      if (!review || reviewError) {
        try {
          const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
          await sendWeeklyReviewReminder(user.email, userName, weekNumber);
          sentCount++;
          console.log(`✅ Sent weekly review reminder to ${user.email} (Week ${weekNumber})`);
        } catch (emailError: any) {
          console.error(`❌ Failed to send reminder to ${user.email}:`, emailError.message);
        }
      } else {
        skippedCount++;
        console.log(`⏭️ Skipped ${user.email} - already has Week ${weekNumber} review`);
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      skipped: skippedCount,
      total: users.users.length,
    });
  } catch (error: any) {
    console.error('Weekly review reminder error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reminders' },
      { status: 500 }
    );
  }
}

