import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTestEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// POST: Send test emails to all registered users
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    if (!users.users || users.users.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No registered users found',
        sent: 0,
        total: 0
      });
    }

    let sentCount = 0;
    let failedCount = 0;
    const failedEmails: string[] = [];

    // Send test email to each user
    for (const user of users.users) {
      if (!user.email) {
        console.log(`⏭️ Skipped user ${user.id} - no email address`);
        continue;
      }

      try {
        const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
        await sendTestEmail(user.email, userName, user.id);
        sentCount++;
        console.log(`✅ Sent test email to ${user.email}`);
      } catch (emailError: any) {
        failedCount++;
        failedEmails.push(user.email);
        console.error(`❌ Failed to send test email to ${user.email}:`, emailError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Test emails sent to ${sentCount} out of ${users.users.length} users`,
      sent: sentCount,
      failed: failedCount,
      total: users.users.length,
      failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send test emails' },
      { status: 500 }
    );
  }
}

