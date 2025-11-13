// Check Supabase email confirmation settings
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkEmailSettings() {
  console.log('🔍 Checking Supabase email settings...\n');
  console.log(`📡 Connected to: ${supabaseUrl}\n`);

  // Try to sign up a test user to see if email confirmation is required
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testpassword123';

  try {
    console.log('Testing signup to check email confirmation status...\n');
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    if (data.user) {
      console.log('✅ User created successfully');
      console.log('   User ID:', data.user.id);
      console.log('   Email:', data.user.email);
      console.log('   Email Confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
      console.log('   Session:', data.session ? 'Active (Email confirmation DISABLED)' : 'None (Email confirmation ENABLED)');
      
      if (data.session) {
        console.log('\n💡 Email confirmation is DISABLED');
        console.log('   → You can sign in immediately without email confirmation');
        console.log('   → No emails will be sent');
      } else {
        console.log('\n💡 Email confirmation is ENABLED');
        console.log('   → Emails should be sent (check spam folder)');
        console.log('   → To disable: Go to Supabase Dashboard → Authentication → Providers → Email → Turn OFF "Confirm email"');
      }

      // Clean up test user
      if (data.session) {
        await supabase.auth.signOut();
      }
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkEmailSettings();




