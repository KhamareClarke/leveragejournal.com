import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Helper to get user from request
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  // Add timeout to prevent hanging
  const getUserPromise = supabase.auth.getUser(token);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Authentication timeout')), 5000)
  );

  try {
    const result = await Promise.race([getUserPromise, timeoutPromise]) as any;
    const { data: { user }, error } = result;
    
    if (error || !user) {
      console.error('❌ Foundation API: Auth error:', error?.message);
      return null;
    }

    return user;
  } catch (error: any) {
    console.error('❌ Foundation API: Auth timeout or error:', error?.message);
    return null;
  }
}

// GET: Retrieve foundation data for the user (optionally filtered by date)
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const entryDate = searchParams.get('entry_date');

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    let query = supabase
      .from('foundation')
      .select('*')
      .eq('user_id', user.id);

    if (entryDate) {
      query = query.eq('entry_date', entryDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return NextResponse.json(
        { error: 'Failed to retrieve foundation data', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ foundations: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve foundation data' },
      { status: 500 }
    );
  }
}

// POST: Create or update foundation data
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      entry_date,
      my_why, // Keep for backward compatibility
      what_drives_me,
      what_im_done_with,
      who_im_building_for,
      my_vision, // Keep for backward compatibility
      my_values,
      my_skills,
      influences, // Keep for backward compatibility
      books_that_shaped_me,
      mentors_role_models,
      core_principles,
      lessons_learned,
      accountability_partner
    } = body;

    // Use service role key for server-side operations (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Use today's date if not provided
    const entryDate = entry_date || new Date().toISOString().split('T')[0];

    // Prepare the foundation data
    const foundationData: any = {
      user_id: user.id,
      entry_date: entryDate,
      my_why: my_why || null, // Keep for backward compatibility
      what_drives_me: what_drives_me || null,
      what_im_done_with: what_im_done_with || null,
      who_im_building_for: who_im_building_for || null,
      my_vision: my_vision || null, // Keep for backward compatibility
      my_values: my_values || null,
      my_skills: my_skills || null,
      influences: influences || null, // Keep for backward compatibility
      books_that_shaped_me: books_that_shaped_me || null,
      mentors_role_models: mentors_role_models || null,
      core_principles: core_principles || null,
      lessons_learned: lessons_learned || null,
      accountability_partner: accountability_partner || null,
    };

    console.log('💾 Foundation API: Creating entry for user:', user.email, 'ID:', user.id);

    // Insert new foundation entry (allow multiple entries per day)
    let { data, error } = await supabase
      .from('foundation')
      .insert(foundationData)
      .select()
      .single();

    console.log('💾 Foundation API: Insert result - Error:', error?.message, 'Data:', data ? JSON.stringify(data) : 'None');

    if (error) {
      console.error('❌ Supabase error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // Check if table doesn't exist
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Foundation table not found',
            details: 'Please run the migration: supabase/migrations/005_create_foundation_table.sql in Supabase Dashboard → SQL Editor'
          },
          { status: 500 }
        );
      }
      
      // Check for RLS policy issues
      if (error.code === '42501' || error.message?.includes('permission denied')) {
        return NextResponse.json(
          { 
            error: 'Permission denied',
            details: 'RLS policies may be blocking this operation. Please check your Supabase RLS policies.'
          },
          { status: 403 }
        );
      }

      // Check for unique constraint violation (if migration wasn't run)
      if (error.code === '23505' || error.message?.includes('unique constraint')) {
        return NextResponse.json(
          { 
            error: 'Foundation entry already exists',
            details: 'You already have a foundation entry. Please update it instead, or run migration 009_remove_foundation_unique_constraint.sql to allow multiple entries.'
          },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to save foundation data', 
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    // If insert succeeded but no data returned, try to fetch it
    if (!data) {
      console.warn('⚠️ Foundation API: Insert succeeded but no data returned, fetching...');
      const { data: fetchedData, error: fetchError } = await supabase
        .from('foundation')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', entryDate)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !fetchedData) {
        console.error('❌ Foundation API: Failed to fetch inserted data:', fetchError?.message);
        return NextResponse.json({ 
          success: true, 
          foundation: null,
          message: 'Entry saved but could not retrieve it. Please refresh the page.'
        });
      }

      data = fetchedData;
    }

    console.log('✅ Foundation API: Successfully created entry:', data?.id);
    return NextResponse.json({ 
      success: true, 
      foundation: data 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save foundation data' },
      { status: 500 }
    );
  }
}


