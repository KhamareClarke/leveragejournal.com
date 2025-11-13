// Test script to check verification code creation
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testVerificationCode() {
  console.log('🧪 Testing verification code creation...\n');
  console.log(`📡 Connected to: ${supabaseUrl}\n`);
  console.log(`🔑 Using: ${supabaseServiceKey.substring(0, 20)}... (${supabaseServiceKey.includes('service_role') ? 'Service Role' : 'Anon Key'})\n`);

  const testEmail = `test-${Date.now()}@example.com`;
  const testCode = '123456';
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  try {
    console.log('Attempting to insert verification code...');
    console.log(`Email: ${testEmail}`);
    console.log(`Code: ${testCode}`);
    console.log(`Expires: ${expiresAt.toISOString()}\n`);

    const { data, error } = await supabase
      .from('verification_codes')
      .insert({
        email: testEmail.toLowerCase(),
        code: testCode,
        expires_at: expiresAt.toISOString(),
        used: false,
      })
      .select();

    if (error) {
      console.error('❌ Error:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        console.log('\n💡 Solution: Table does not exist. Run the migration SQL.');
      } else if (error.message?.includes('permission denied') || error.message?.includes('policy')) {
        console.log('\n💡 Solution: RLS policy is blocking. Use service role key or fix policies.');
      } else if (error.code === 'PGRST301') {
        console.log('\n💡 Solution: RLS policy violation. Check policies in Supabase.');
      }
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Success! Verification code created:');
      console.log('   ID:', data[0].id);
      console.log('   Email:', data[0].email);
      console.log('   Code:', data[0].code);
      
      // Clean up test data
      console.log('\n🧹 Cleaning up test data...');
      await supabase
        .from('verification_codes')
        .delete()
        .eq('id', data[0].id);
      console.log('✅ Test data cleaned up');
    } else {
      console.log('⚠️  No data returned');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testVerificationCode();




