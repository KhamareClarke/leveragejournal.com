const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.log('\nPlease set one of the following:');
  console.log('  - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('  - SUPABASE_URL and SUPABASE_ANON_KEY');
  console.log('  - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.log('\nYou can create a .env.local file with:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=your-project-url');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    console.log('🔍 Checking Supabase tables...\n');
    console.log(`📡 Connected to: ${supabaseUrl}\n`);

    // Try to detect tables by attempting to query them
    await detectTablesByQuery();
    
    // Also try to get table info if we have service role key
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await getTableDetails();
    }
  } catch (err) {
    console.error('❌ Error checking tables:', err);
  }
}

async function detectTablesByQuery() {
  // Try to query tables that might exist based on the codebase
  const possibleTables = [
    'journal_entries',
    'goals',
    'foundation',
    'users',
    'profiles',
    'journal',
    'goal',
  ];

  console.log('🔍 Testing for table existence...\n');
  const foundTables = [];

  for (const tableName of possibleTables) {
    try {
      const { error } = await supabase.from(tableName).select('*').limit(0);
      if (!error) {
        foundTables.push(tableName);
        console.log(`   ✅ ${tableName}`);
      }
    } catch (err) {
      // Table doesn't exist or we don't have access
    }
  }

  if (foundTables.length > 0) {
    console.log(`\n📊 Found ${foundTables.length} accessible table(s):\n`);
    foundTables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table}`);
    });
    console.log('');
  } else {
    console.log('📭 No accessible tables found.\n');
    console.log('💡 This could mean:');
    console.log('   - No tables have been created yet');
    console.log('   - Row Level Security (RLS) is blocking access');
    console.log('   - The anon key doesn\'t have the right permissions');
    console.log('\n💡 Based on your code, you might want to create these tables:');
    console.log('   - journal_entries');
    console.log('   - goals');
    console.log('   - foundation');
  }
  console.log('');
}

async function getTableDetails() {
  try {
    // Try to get column information for found tables
    console.log('📋 Getting table details...\n');
    // This would require a custom RPC function or direct database access
    console.log('💡 For detailed schema information, check your Supabase dashboard:');
    console.log('   https://supabase.com/dashboard/project/_/editor');
  } catch (err) {
    // Ignore errors
  }
}

// Run the script
listTables().catch(console.error);




