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

// GET: Retrieve a specific goal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Goal not found', details: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ goal: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve goal' },
      { status: 500 }
    );
  }
}

// PUT: Update a goal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      empire_vision,
      financial_freedom_number,
      legacy_impact,
      legacy_goals,
      vision_goals,
      strategic_goals
    } = body;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title?.trim() || null;
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (why !== undefined) updateData.why = why?.trim() || null;
    if (how !== undefined) updateData.how = how?.trim() || null;
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = category?.trim() || null;
    if (timeline !== undefined) updateData.timeline = timeline || null;
    if (reward !== undefined) updateData.reward = reward?.trim() || null;
    if (progress !== undefined) updateData.progress = progress;
    if (status !== undefined) updateData.status = status;
    if (milestones !== undefined) updateData.milestones = milestones;
    if (empire_vision !== undefined) updateData.empire_vision = empire_vision?.trim() || null;
    if (financial_freedom_number !== undefined) updateData.financial_freedom_number = financial_freedom_number?.trim() || null;
    if (legacy_impact !== undefined) updateData.legacy_impact = legacy_impact?.trim() || null;
    if (legacy_goals !== undefined) updateData.legacy_goals = legacy_goals?.trim() || null;
    if (vision_goals !== undefined) updateData.vision_goals = vision_goals?.trim() || null;
    if (strategic_goals !== undefined) updateData.strategic_goals = strategic_goals?.trim() || null;

    // Add timeout to prevent hanging
    const updatePromise = supabase
      .from('goals')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database operation timed out after 5 seconds')), 5000)
    );

    let data, error;
    try {
      const result = await Promise.race([updatePromise, timeoutPromise]) as any;
      if (result.error) {
        error = result.error;
      } else {
        data = result.data;
      }
    } catch (timeoutErr: any) {
      return NextResponse.json(
        {
          error: 'Update operation timed out',
          details: 'The database operation took too long. Please check your connection and try again.'
        },
        { status: 504 }
      );
    }

    if (error) {
      return NextResponse.json(
        { 
          error: 'Failed to update goal', 
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
      { error: error.message || 'Failed to update goal' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Add timeout to prevent hanging
    const deletePromise = supabase
      .from('goals')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database operation timed out after 5 seconds')), 5000)
    );

    let error;
    try {
      const result = await Promise.race([deletePromise, timeoutPromise]) as any;
      error = result.error;
    } catch (timeoutErr: any) {
      return NextResponse.json(
        {
          error: 'Delete operation timed out',
          details: 'The database operation took too long. Please check your connection and try again.'
        },
        { status: 504 }
      );
    }

    if (error) {
      return NextResponse.json(
        { 
          error: 'Failed to delete goal', 
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete goal' },
      { status: 500 }
    );
  }
}

