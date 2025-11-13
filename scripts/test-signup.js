// Test script to check Supabase signup configuration
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignup() {
  console.log('🧪 Testing Supabase signup configuration...\n');
  console.log(`📡 Connected to: ${supabaseUrl}\n`);

  // Test with a dummy email (won't actually create account)
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testpassword123';

  try {
    console.log('Attempting signup with test credentials...');
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      console.error('❌ Signup Error:', error.message);
      console.error('   Status:', error.status);
      console.error('   Name:', error.name);
      
      if (error.message.toLowerCase().includes('signups') || 
          error.message.toLowerCase().includes('disabled')) {
        console.log('\n💡 Solution:');
        console.log('   1. Go to Supabase Dashboard → Authentication → Providers');
        console.log('   2. Enable "Email" provider');
        console.log('   3. Turn OFF "Confirm email" for testing (optional)');
        console.log('   4. Save and try again');
      }
      return;
    }

    if (data.user) {
      console.log('✅ Signup successful!');
      console.log('   User ID:', data.user.id);
      console.log('   Email:', data.user.email);
      console.log('   Session:', data.session ? 'Active' : 'Requires email confirmation');
      
      // Clean up test user if session exists
      if (data.session) {
        console.log('\n🧹 Cleaning up test user...');
        await supabase.auth.signOut();
      }
    } else {
      console.log('⚠️  User creation initiated but requires email confirmation');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testSignup();




