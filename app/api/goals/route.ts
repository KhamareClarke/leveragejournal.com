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

// GET: Retrieve goals for the user (optionally filtered by date)
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
      .from('goals')
      .select('*')
      .eq('user_id', user.id);

    if (entryDate) {
      query = query.eq('entry_date', entryDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to retrieve goals', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ goals: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve goals' },
      { status: 500 }
    );
  }
}

// POST: Create a new goal
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
      title,
      description,
      why,
      how,
      type,
      category,
      timeline,
      reward,
      progress,
      status,
      milestones,
      entry_date,
      empire_vision,
      financial_freedom_number,
      legacy_impact,
      legacy_goals,
      vision_goals,
      strategic_goals
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Goal title is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Use today's date if not provided
    const entryDate = entry_date || new Date().toISOString().split('T')[0];

    // Prepare the goal data
    const goalData: any = {
      user_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      why: why?.trim() || null,
      how: how?.trim() || null,
      type: type || 'short',
      category: category?.trim() || null,
      timeline: timeline || null,
      reward: reward?.trim() || null,
      progress: progress || 0,
      status: status || 'active',
      milestones: milestones || [],
      entry_date: entryDate,
      empire_vision: empire_vision?.trim() || null,
      financial_freedom_number: financial_freedom_number?.trim() || null,
      legacy_impact: legacy_impact?.trim() || null,
      legacy_goals: legacy_goals?.trim() || null,
      vision_goals: vision_goals?.trim() || null,
      strategic_goals: strategic_goals?.trim() || null,
    };

    // Add timeout to prevent hanging
    const insertPromise = supabase
      .from('goals')
      .insert(goalData)
      .select()
      .single();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database operation timed out after 5 seconds')), 5000)
    );

    let data, error;
    try {
      const result = await Promise.race([insertPromise, timeoutPromise]) as any;
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
          error: 'Failed to create goal', 
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      goal: data 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create goal' },
      { status: 500 }
    );
  }
}

