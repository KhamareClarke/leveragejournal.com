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

// Helper to check if entry has content
function hasContent(entry: any): boolean {
  return !!(
    entry.gratitude?.trim() ||
    entry.priority_1?.trim() ||
    entry.priority_2?.trim() ||
    entry.priority_3?.trim() ||
    (entry.tasks && Array.isArray(entry.tasks) && entry.tasks.length > 0 && 
     entry.tasks.some((t: any) => t && t.text && t.text.trim().length > 0)) ||
    entry.reflection?.trim() ||
    entry.mood?.trim()
  );
}

// Calculate Momentum Score (0-100)
function calculateMomentumScore(
  daysCompleted: number,
  currentStreak: number,
  goalsCompleted: number,
  totalGoals: number,
  weeklyProgress: number
): number {
  // Weighted calculation:
  // - Days completed: 30% (max 90 days = 30 points)
  // - Current streak: 25% (max 90 days = 25 points)
  // - Goals completion: 25% (100% = 25 points)
  // - Weekly progress: 20% (100% = 20 points)
  
  const daysScore = Math.min(30, (daysCompleted / 90) * 30);
  const streakScore = Math.min(25, (currentStreak / 90) * 25);
  const goalsScore = totalGoals > 0 ? (goalsCompleted / totalGoals) * 25 : 0;
  const weeklyScore = (weeklyProgress / 100) * 20;
  
  return Math.round(daysScore + streakScore + goalsScore + weeklyScore);
}

// GET: Get insights and metrics for the user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      console.error('❌ Insights API: No user found in request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ Insights API: User authenticated:', user.email, 'ID:', user.id);

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all journal entries
    console.log('📊 Insights API: Fetching journal entries for user_id:', user.id);
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('entry_date, streak, completed, gratitude, priority_1, priority_2, priority_3, tasks, reflection, mood')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false });

    if (journalError) {
      console.error('❌ Insights API: Journal entries error:', journalError);
      return NextResponse.json(
        { error: 'Failed to retrieve journal entries', details: journalError.message },
        { status: 500 }
      );
    }

    console.log('📊 Insights API: Found', journalEntries?.length || 0, 'journal entries');

    // Get all goals
    console.log('📊 Insights API: Fetching goals for user_id:', user.id);
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('progress, status, created_at')
      .eq('user_id', user.id);
    
    if (goalsError) {
      console.error('❌ Insights API: Goals error:', goalsError);
    } else {
      console.log('📊 Insights API: Found', goals?.length || 0, 'goals');
    }

    // Don't fail if goals table doesn't exist - just use empty array
    if (goalsError && goalsError.code !== 'PGRST116' && goalsError.code !== '42P01') {
      return NextResponse.json(
        { error: 'Failed to retrieve goals', details: goalsError.message },
        { status: 500 }
      );
    }
    
    // Use empty array if goals table doesn't exist
    const safeGoals = goalsError ? [] : (goals || []);

    // Get all weekly reviews (handle if table doesn't exist)
    let reviews = [];
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('weekly_reviews')
      .select('week_start_date, week_number')
      .eq('user_id', user.id)
      .order('week_start_date', { ascending: false });

    if (reviewsError && reviewsError.code !== 'PGRST116' && reviewsError.code !== '42P01') {
      // Only fail if it's not a "table doesn't exist" error
      return NextResponse.json(
        { error: 'Failed to retrieve reviews', details: reviewsError.message },
        { status: 500 }
      );
    }
    
    reviews = reviewsData || [];

    // Calculate statistics
    const entriesWithContent = (journalEntries || []).filter(hasContent);
    const daysCompleted = entriesWithContent.length;
    
    // Current streak (from most recent entry or calculate)
    const currentStreak = entriesWithContent.length > 0 
      ? (entriesWithContent[0]?.streak || 0)
      : 0;

    // Goals statistics
    const totalGoals = safeGoals.length;
    const goalsCompleted = safeGoals.filter((g: any) => g.status === 'completed').length;
    const goalsProgress = totalGoals > 0 ? Math.round((goalsCompleted / totalGoals) * 100) : 0;

    // Weekly progress (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    const weeklyEntries = entriesWithContent.filter((e: any) => {
      const [year, month, day] = e.entry_date.split('-').map(Number);
      const entryDate = new Date(year, month - 1, day);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate >= sevenDaysAgo && entryDate <= today;
    });
    const weeklyProgress = Math.min(100, Math.round((weeklyEntries.length / 7) * 100));

    // Calculate Momentum Score
    const momentumScore = calculateMomentumScore(
      daysCompleted,
      currentStreak,
      goalsCompleted,
      totalGoals,
      weeklyProgress
    );

    // Get first entry date for trend calculation
    const firstEntry = entriesWithContent.length > 0 
      ? entriesWithContent[entriesWithContent.length - 1]
      : null;

    // Calculate trend (entries in last 7 days vs previous 7 days)
    const last7Days = entriesWithContent.filter((e: any) => {
      const [year, month, day] = e.entry_date.split('-').map(Number);
      const entryDate = new Date(year, month - 1, day);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate >= sevenDaysAgo && entryDate <= today;
    }).length;

    const previous7DaysStart = new Date(sevenDaysAgo);
    previous7DaysStart.setDate(sevenDaysAgo.getDate() - 7);
    const previous7Days = entriesWithContent.filter((e: any) => {
      const [year, month, day] = e.entry_date.split('-').map(Number);
      const entryDate = new Date(year, month - 1, day);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate >= previous7DaysStart && entryDate < sevenDaysAgo;
    }).length;

    const trend = last7Days - previous7Days;
    const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable';

    // Weekly reviews completed
    const reviewsCompleted = reviews.length;

    const response = {
      daysCompleted,
      currentStreak,
      goalsCompleted,
      totalGoals,
      goalsProgress,
      weeklyProgress,
      momentumScore,
      reviewsCompleted,
      trend,
      trendDirection,
      firstEntryDate: firstEntry?.entry_date || null
    };
    
    console.log('✅ Insights API: Returning response:', response);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve insights' },
      { status: 500 }
    );
  }
}

