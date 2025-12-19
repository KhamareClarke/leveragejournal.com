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

// GET: Generate personalized journal HTML with user entries
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    
    // Get all journal entries ordered by date
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('entry_date, day_number, gratitude, priority_1, priority_2, priority_3, tasks, reflection, mood')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to retrieve entries', details: error.message },
        { status: 500 }
      );
    }

    // Get all weekly reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('weekly_reviews')
      .select('week_number, wins, obstacles, lessons, next_steps')
      .eq('user_id', user.id)
      .order('week_number', { ascending: true });

    // Don't fail if reviews table doesn't exist or has no data
    const weeklyReviews = reviewsError ? [] : (reviews || []);

    // Get all foundation entries
    const { data: foundationEntries, error: foundationError } = await supabase
      .from('foundation')
      .select('id, entry_date, my_why, what_drives_me, what_im_done_with, who_im_building_for, my_vision, my_values, my_skills, influences, books_that_shaped_me, mentors_role_models, core_principles, lessons_learned, accountability_partner, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    // Don't fail if foundation table doesn't exist or has no data
    const foundations = foundationError ? [] : (foundationEntries || []);
    
    console.log('📊 Journal API: Foundation entries loaded:', foundations.length);
    if (foundations.length > 0) {
      console.log('📊 First foundation entry keys:', Object.keys(foundations[0]));
      console.log('📊 Foundation fields check:', {
        what_drives_me: foundations[0].what_drives_me ? 'exists' : 'missing',
        books_that_shaped_me: foundations[0].books_that_shaped_me ? 'exists' : 'missing',
        my_values: foundations[0].my_values ? 'exists' : 'missing'
      });
    }

    // Get all goals (excluding progress tracker)
    const { data: goalsData, error: goalsError } = await supabase
      .from('goals')
      .select('id, title, description, why, how, type, category, timeline, reward, status, milestones, entry_date, created_at, empire_vision, financial_freedom_number, legacy_impact, legacy_goals, vision_goals, strategic_goals')
      .eq('user_id', user.id)
      .eq('status', 'active') // Only active goals
      .order('created_at', { ascending: true });

    // Don't fail if goals table doesn't exist or has no data
    const goals = goalsError ? [] : (goalsData || []);
    
    console.log('📊 Journal API: Goals loaded:', goals.length);
    if (goals.length > 0) {
      console.log('📊 Goals by type:', {
        short: goals.filter((g: any) => g.type === 'short').length,
        medium: goals.filter((g: any) => g.type === 'medium').length,
        long: goals.filter((g: any) => g.type === 'long').length
      });
    }

    // Create a map of entries by day_number for quick lookup
    const entriesByDay = new Map<number, any>();
    entries?.forEach(entry => {
      if (entry.day_number) {
        entriesByDay.set(entry.day_number, entry);
      }
    });

    // Create a map of reviews by week_number for quick lookup
    const reviewsByWeek = new Map<number, any>();
    weeklyReviews.forEach(review => {
      if (review.week_number) {
        reviewsByWeek.set(review.week_number, review);
      }
    });

    // Get user name and join date
    const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '';

    // Return entries, reviews, foundation, goals, and user info for client-side journal generation
    const responseData = { 
      entries: entries || [],
      entriesByDay: Object.fromEntries(entriesByDay),
      reviews: weeklyReviews || [],
      reviewsByWeek: Object.fromEntries(reviewsByWeek),
      foundations: foundations || [],
      goals: goals || [],
      userName: userName,
      joinDate: joinDate
    };
    
    console.log('📊 Journal API: Returning data with', responseData.foundations.length, 'foundation entries');
    
    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate journal' },
      { status: 500 }
    );
  }
}

