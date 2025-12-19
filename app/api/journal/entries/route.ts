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

// GET: Retrieve journal entry for a specific date
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const entryDate = searchParams.get('date');
    
    if (!entryDate) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', entryDate)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return NextResponse.json(
        { error: 'Failed to retrieve journal entry', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ entry: data || null });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve journal entry' },
      { status: 500 }
    );
  }
}

// POST: Create or update journal entry
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
      day_number,
      gratitude,
      priority_1,
      priority_2,
      priority_3,
      tasks,
      reflection,
      mood,
      completed
    } = body;

    if (!entry_date) {
      return NextResponse.json(
        { error: 'Entry date is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Always calculate day_number based on first entry date (program start)
    // This ensures consistency even if frontend sends incorrect day_number
    let calculatedDayNumber = 1;
    
    // Get the first entry date (program start date)
    const { data: firstEntry } = await supabase
      .from('journal_entries')
      .select('entry_date')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: true })
      .limit(1)
      .single();
    
    if (firstEntry?.entry_date) {
      // Calculate days since program start
      const [year, month, day] = firstEntry.entry_date.split('-').map(Number);
      const programStartDate = new Date(year, month - 1, day);
      programStartDate.setHours(0, 0, 0, 0);
      
      const [entryYear, entryMonth, entryDay] = entry_date.split('-').map(Number);
      const entryDateObj = new Date(entryYear, entryMonth - 1, entryDay);
      entryDateObj.setHours(0, 0, 0, 0);
      
      const daysSinceStart = Math.floor((entryDateObj.getTime() - programStartDate.getTime()) / (1000 * 60 * 60 * 24));
      calculatedDayNumber = Math.min(90, Math.max(1, daysSinceStart + 1));
    } else {
      // No entries yet, this is day 1
      calculatedDayNumber = 1;
    }

    // Prepare the entry data
    const entryData: any = {
      user_id: user.id,
      entry_date,
      day_number: calculatedDayNumber, // Always required (NOT NULL constraint)
      gratitude: gratitude || null,
      priority_1: priority_1 || null,
      priority_2: priority_2 || null,
      priority_3: priority_3 || null,
      tasks: tasks || [],
      reflection: reflection || null,
      mood: mood || null,
      completed: completed || false,
    };

    // Use upsert to create or update (with timeout to prevent hanging)
    const upsertPromise = supabase
      .from('journal_entries')
      .upsert(entryData, {
        onConflict: 'user_id,entry_date',
        ignoreDuplicates: false
      })
      .select()
      .single();

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database operation timed out after 8 seconds')), 8000)
    );

    let data, error;
    try {
      const result = await Promise.race([upsertPromise, timeoutPromise]) as any;
      data = result.data;
      error = result.error;
    } catch (timeoutErr: any) {
      return NextResponse.json(
        { 
          error: 'Save operation timed out',
          details: 'The database operation took too long. Please check your connection and try again.'
        },
        { status: 504 }
      );
    }

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // Check if table doesn't exist
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Journal entries table not found',
            details: 'Please run the migration: supabase/migrations/004_create_journal_entries_table.sql in Supabase Dashboard → SQL Editor'
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
      
      return NextResponse.json(
        { 
          error: 'Failed to save journal entry', 
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    // Calculate and update streak (non-blocking, with timeout)
    // Don't wait for this - return success immediately
    Promise.race([
      (async () => {
        try {
          const { data: streakData, error: streakError } = await supabase
            .rpc('calculate_user_streak', { p_user_id: user.id });

          if (!streakError && streakData !== null) {
            await supabase
              .from('journal_entries')
              .update({ streak: streakData })
              .eq('user_id', user.id)
              .eq('entry_date', entry_date);
          }
        } catch (err) {
          // Silently fail - streak calculation is not critical
          console.error('Streak calculation failed:', err);
        }
      })(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Streak calculation timeout')), 3000)
      )
    ]).catch(() => {
      // Ignore timeout errors for streak calculation
    });

    return NextResponse.json({ 
      success: true, 
      entry: data 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save journal entry' },
      { status: 500 }
    );
  }
}
