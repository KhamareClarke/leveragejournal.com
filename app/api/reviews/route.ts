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

// Helper to get Monday of a given date
function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Helper to get Sunday of a given week
function getSundayOfWeek(monday: Date): Date {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return sunday;
}

// GET: Retrieve weekly reviews for the user
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
    const weekStart = searchParams.get('week_start');

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Add timeout to prevent hanging
    let query = supabase
      .from('weekly_reviews')
      .select('*')
      .eq('user_id', user.id);

    if (weekStart) {
      query = query.eq('week_start_date', weekStart);
    }

    const queryPromise = query.order('week_start_date', { ascending: false });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 2000)
    );

    let result;
    try {
      result = await Promise.race([queryPromise, timeoutPromise]) as any;
    } catch (timeoutErr: any) {
      return NextResponse.json(
        { error: 'Request timed out', reviews: [] },
        { status: 504 }
      );
    }

    const { data, error } = result;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to retrieve reviews', details: error.message, reviews: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({ reviews: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve reviews' },
      { status: 500 }
    );
  }
}

// POST: Create or update a weekly review
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
      week_start_date,
      wins,
      obstacles,
      lessons,
      next_steps,
      ai_summary,
      trends,
      insights
    } = body;

    if (!week_start_date) {
      return NextResponse.json(
        { error: 'Week start date is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Calculate week end date (Sunday)
    const monday = new Date(week_start_date);
    const sunday = getSundayOfWeek(monday);

    // Calculate week number (assuming 90-day program starts from a reference date)
    // For now, we'll calculate based on the week start date
    const today = new Date();
    const programStart = new Date(today);
    programStart.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)); // Get Monday of current week
    const weeksDiff = Math.floor((monday.getTime() - programStart.getTime()) / (1000 * 60 * 60 * 24 * 7));
    const weekNumber = Math.max(1, weeksDiff + 1);

    // Prepare the review data
    const reviewData: any = {
      user_id: user.id,
      week_start_date: week_start_date,
      week_end_date: sunday.toISOString().split('T')[0],
      week_number: weekNumber,
      wins: wins?.trim() || null,
      obstacles: obstacles?.trim() || null,
      lessons: lessons?.trim() || null,
      next_steps: next_steps?.trim() || null,
      ai_summary: ai_summary?.trim() || null,
      trends: trends?.trim() || null,
      insights: insights?.trim() || null,
    };

    // Add timeout to prevent hanging
    const upsertPromise = supabase
      .from('weekly_reviews')
      .upsert(reviewData, {
        onConflict: 'user_id,week_start_date',
        ignoreDuplicates: false
      })
      .select()
      .single();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database operation timed out after 5 seconds')), 5000)
    );

    let data, error;
    try {
      const result = await Promise.race([upsertPromise, timeoutPromise]) as any;
      if (result.error) {
        error = result.error;
      } else {
        data = result.data;
      }
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
      return NextResponse.json(
        { 
          error: 'Failed to save review', 
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      review: data 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save review' },
      { status: 500 }
    );
  }
}

