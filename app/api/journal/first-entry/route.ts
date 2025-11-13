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

// GET: Get the first journal entry date for calculating day numbers
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
    
    // Get the earliest entry date for this user
    const { data, error } = await supabase
      .from('journal_entries')
      .select('entry_date')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: true })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to retrieve first entry', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      firstEntryDate: data?.entry_date || null 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve first entry' },
      { status: 500 }
    );
  }
}




