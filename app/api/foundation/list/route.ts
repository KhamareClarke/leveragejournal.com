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

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }

  return user;
}

// GET: Retrieve all foundation entries for the user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use service role key for server-side operations (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    
    // Add timeout to prevent hanging
    const queryPromise = supabase
      .from('foundation')
      .select('id, entry_date, my_why, what_drives_me, what_im_done_with, who_im_building_for, my_vision, my_values, my_skills, influences, books_that_shaped_me, mentors_role_models, core_principles, lessons_learned, accountability_partner, created_at, updated_at')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 2000)
    );

    let result;
    try {
      result = await Promise.race([queryPromise, timeoutPromise]) as any;
    } catch (timeoutErr: any) {
      return NextResponse.json(
        { error: 'Request timed out', entries: [] },
        { status: 504 }
      );
    }

    const { data, error } = result;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to retrieve foundation entries', details: error.message, entries: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({ entries: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve foundation entries' },
      { status: 500 }
    );
  }
}

