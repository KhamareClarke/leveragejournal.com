import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

// GET: Get list of all journal entries for the user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get all entries ordered by date (include all fields for content checking)
    const { data, error } = await supabase
      .from('journal_entries')
      .select('id, entry_date, day_number, gratitude, priority_1, priority_2, priority_3, tasks, reflection, mood, completed, streak')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to retrieve entries', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ entries: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve entries' },
      { status: 500 }
    );
  }
}

