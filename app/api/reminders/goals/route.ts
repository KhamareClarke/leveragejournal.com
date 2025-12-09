import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendGoalProgressReminder } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// POST: Check and send goal progress reminders (called by cron)
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

      // Get user's active goals
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
          const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
          await sendGoalProgressReminder(
            user.email,
            userName,
            goals.map(g => ({ title: g.title, progress: g.progress || 0 }))
          );
          sentCount++;
          console.log(`✅ Sent goal reminder to ${user.email} (${goals.length} goals)`);
        } catch (emailError: any) {
          console.error(`❌ Failed to send reminder to ${user.email}:`, emailError.message);
        }
      } else {
        skippedCount++;
        console.log(`⏭️ Skipped ${user.email} - no active goals`);
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      skipped: skippedCount,
      total: users.users.length,
    });
  } catch (error: any) {
    console.error('Goal reminder error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reminders' },
      { status: 500 }
    );
  }
}

