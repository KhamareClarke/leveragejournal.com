import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMilestoneReminder } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Shared function to handle milestone reminders
async function handleMilestoneReminders(request: NextRequest) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const isVercelCron = request.headers.get('x-vercel-signature') || request.headers.get('user-agent')?.includes('vercel-cron');
    
    // Allow Vercel cron or valid secret
    if (!isVercelCron && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch users', details: usersError.message },
        { status: 500 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    let sentCount = 0;
    let skippedCount = 0;
    const sentEmails: string[] = [];
    const skippedEmails: string[] = [];

    // Check each user
    for (const user of users.users) {
      if (!user.email) continue;

      const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];

      // Get user's active goals with milestones
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('id, title, milestones')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (goalsError) {
        console.error(`Error fetching goals for ${user.email}:`, goalsError);
        continue;
      }

      if (!goals || goals.length === 0) {
        skippedCount++;
        skippedEmails.push(user.email);
        continue;
      }

      // Check each goal for upcoming milestones
      let hasUpcomingMilestones = false;
      
      for (const goal of goals) {
        if (!goal.milestones || !Array.isArray(goal.milestones) || goal.milestones.length === 0) {
          continue;
        }

        // Filter incomplete milestones with due dates
        const upcomingMilestones = goal.milestones.filter((m: any) => {
          if (m.completed) return false;
          if (!m.due_date) return false;
          
          const dueDate = new Date(m.due_date);
          dueDate.setHours(0, 0, 0, 0);
          
          // Check if milestone is due within the next 7 days or overdue
          const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          // Send reminder if:
          // - Overdue (daysUntil < 0)
          // - Due today (daysUntil === 0)
          // - Due in 1-7 days (1 <= daysUntil <= 7)
          return daysUntil <= 7;
        });

        if (upcomingMilestones.length > 0) {
          hasUpcomingMilestones = true;
          
          try {
            await sendMilestoneReminder(
              user.email,
              userName,
              goal.title,
              goal.milestones,
              user.id
            );
            sentCount++;
            sentEmails.push(user.email);
            console.log(`✅ Sent milestone reminder to ${user.email} for goal: ${goal.title} (${upcomingMilestones.length} milestones)`);
            
            // Only send one email per user (for the first goal with upcoming milestones)
            break;
          } catch (emailError: any) {
            console.error(`❌ Failed to send milestone reminder to ${user.email}:`, emailError.message);
          }
        }
      }

      if (!hasUpcomingMilestones) {
        skippedCount++;
        skippedEmails.push(user.email);
        console.log(`⏭️ Skipped ${user.email} - no upcoming milestones`);
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      skipped: skippedCount,
      total: users.users.length,
      sentTo: sentEmails,
      skippedFor: skippedEmails,
    });
  } catch (error: any) {
    console.error('Milestone reminder error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reminders' },
      { status: 500 }
    );
  }
}

// GET: Check and send milestone reminders (called by cron)
export async function GET(request: NextRequest) {
  return handleMilestoneReminders(request);
}

// POST: Manual trigger (for testing)
export async function POST(request: NextRequest) {
  return handleMilestoneReminders(request);
}
