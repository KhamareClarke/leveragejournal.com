import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendJournalReminder } from '@/lib/email';

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

// POST: Check and send journal reminders (called by cron)
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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

    let sentCount = 0;
    let skippedCount = 0;

    // Check each user
    for (const user of users.users) {
      if (!user.email) continue;

      // Check if user has entry for today
      const { data: entry, error: entryError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', todayStr)
        .single();

      // If no entry or entry has no content, send reminder
      if (!entry || !hasContent(entry)) {
        try {
          const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
          await sendJournalReminder(user.email, userName);
          sentCount++;
          console.log(`✅ Sent journal reminder to ${user.email}`);
        } catch (emailError: any) {
          console.error(`❌ Failed to send reminder to ${user.email}:`, emailError.message);
        }
      } else {
        skippedCount++;
        console.log(`⏭️ Skipped ${user.email} - already has entry`);
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      skipped: skippedCount,
      total: users.users.length,
    });
  } catch (error: any) {
    console.error('Journal reminder error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reminders' },
      { status: 500 }
    );
  }
}

