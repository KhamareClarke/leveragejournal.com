import { createClient } from '@supabase/supabase-js';

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

    // Query information_schema to get all tables in the public schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
      .order('table_name');

    if (error) {
      // If direct query fails, try using RPC or raw SQL
      console.log('⚠️  Direct query failed, trying alternative method...\n');
      
      // Try to query a system table using raw SQL via RPC
      const { data: tablesData, error: rpcError } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT table_name, table_type 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name;
        `
      });

      if (rpcError) {
        // Last resort: try to list tables by attempting to query common table names
        console.log('📋 Attempting to detect tables by querying common names...\n');
        await detectTablesByQuery();
        return;
      }

      displayTables(tablesData);
      return;
    }

    if (data && data.length > 0) {
      displayTables(data);
    } else {
      console.log('📭 No tables found in the public schema.\n');
      console.log('💡 Based on your code, you might want to create these tables:');
      console.log('   - journal_entries');
      console.log('   - goals');
      console.log('   - foundation');
      console.log('   - users (if not using Supabase Auth)');
    }
  } catch (err) {
    console.error('❌ Error checking tables:', err);
    console.log('\n💡 Trying alternative detection method...\n');
    await detectTablesByQuery();
  }
}

function displayTables(tables: any[]) {
  const userTables = tables.filter(t => t.table_type === 'BASE TABLE');
  const views = tables.filter(t => t.table_type === 'VIEW');

  if (userTables.length > 0) {
    console.log('📊 Tables found:\n');
    userTables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });
    console.log('');
  }

  if (views.length > 0) {
    console.log('👁️  Views found:\n');
    views.forEach((view, index) => {
      console.log(`   ${index + 1}. ${view.table_name} (view)`);
    });
    console.log('');
  }

  if (userTables.length === 0 && views.length === 0) {
    console.log('📭 No tables or views found.\n');
  }

  // Show expected tables based on code
  const expectedTables = ['journal_entries', 'goals', 'foundation'];
  const foundTableNames = userTables.map(t => t.table_name.toLowerCase());
  const missingTables = expectedTables.filter(t => !foundTableNames.includes(t));

  if (missingTables.length > 0) {
    console.log('💡 Expected tables (based on your code) that are missing:');
    missingTables.forEach(table => {
      console.log(`   - ${table}`);
    });
    console.log('');
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
  const foundTables: string[] = [];

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
  } else {
    console.log('📭 No accessible tables found.\n');
    console.log('💡 This could mean:');
    console.log('   - No tables have been created yet');
    console.log('   - Row Level Security (RLS) is blocking access');
    console.log('   - The anon key doesn\'t have the right permissions');
  }
  console.log('');
}

// Run the script
listTables().catch(console.error);




