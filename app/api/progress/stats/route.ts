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

// GET: Get progress statistics for the user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      console.error('❌ Stats API: No user found in request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ Stats API: User authenticated:', user.email, 'ID:', user.id);

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Get first day of current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayStr = firstDayOfMonth.toISOString().split('T')[0];

    // Run all queries in parallel for faster response
    console.log('📊 Stats API: Fetching data for user_id:', user.id);
    const [firstEntryResult, journalEntriesResult, goalsResult] = await Promise.all([
      supabase
        .from('journal_entries')
        .select('entry_date')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: true })
        .limit(1)
        .single(),
      supabase
        .from('journal_entries')
        .select('entry_date, streak, completed, gratitude, priority_1, priority_2, priority_3, tasks, reflection, mood')
        .eq('user_id', user.id),
      supabase
        .from('goals')
        .select('progress, status')
        .eq('user_id', user.id)
    ]);
    
    console.log('📊 Stats API: First entry result:', firstEntryResult.error ? 'Error: ' + firstEntryResult.error.message : 'Success');
    console.log('📊 Stats API: Journal entries count:', journalEntriesResult.data?.length || 0, journalEntriesResult.error ? 'Error: ' + journalEntriesResult.error.message : '');
    console.log('📊 Stats API: Goals count:', goalsResult.data?.length || 0, goalsResult.error ? 'Error: ' + goalsResult.error.message : '');

    const { data: firstEntry, error: firstEntryError } = firstEntryResult;
    const { data: journalEntries, error: journalError } = journalEntriesResult;
    const { data: goals, error: goalsError } = goalsResult;

    if (journalError) {
      return NextResponse.json(
        { error: 'Failed to retrieve journal entries', details: journalError.message },
        { status: 500 }
      );
    }

    if (goalsError) {
      return NextResponse.json(
        { error: 'Failed to retrieve goals', details: goalsError.message },
        { status: 500 }
      );
    }

    let currentDay = 1;
    let programStartDate: Date | null = null;
    let weekStartDate: Date | null = null;
    let weekEndDate: Date | null = null;

    if (firstEntry?.entry_date) {
      // Parse as local date to avoid timezone issues
      const [year, month, day] = firstEntry.entry_date.split('-').map(Number);
      programStartDate = new Date(year, month - 1, day);
      programStartDate.setHours(0, 0, 0, 0);
      
      const daysSinceStart = Math.floor((today.getTime() - programStartDate.getTime()) / (1000 * 60 * 60 * 24));
      currentDay = Math.min(90, Math.max(1, daysSinceStart + 1));
      
      // Calculate current week dates based on program start
      const currentWeek = Math.floor(daysSinceStart / 7);
      weekStartDate = new Date(programStartDate);
      weekStartDate.setDate(programStartDate.getDate() + (currentWeek * 7));
      weekStartDate.setHours(0, 0, 0, 0);
      
      weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      weekEndDate.setHours(23, 59, 59, 999);
    } else {
      // If no entries, use today as program start
      programStartDate = new Date(today);
      weekStartDate = new Date(today);
      weekEndDate = new Date(today);
      weekEndDate.setDate(today.getDate() + 6);
    }

    // Calculate statistics
    const entriesWithContent = (journalEntries || []).filter(hasContent);
    const totalEntries = entriesWithContent.length;

    // Weekly progress (entries this week based on program week, not calendar week)
    let weeklyProgress = 0;
    if (weekStartDate && weekEndDate) {
      const weeklyEntries = entriesWithContent.filter((e: any) => {
        // Parse entry date as local date
        const [year, month, day] = e.entry_date.split('-').map(Number);
        const entryDate = new Date(year, month - 1, day);
        entryDate.setHours(0, 0, 0, 0);
        // Check if entry is within the current program week
        const isInWeek = entryDate >= weekStartDate && entryDate <= weekEndDate;
        return isInWeek;
      });
      // Calculate percentage: (entries this week / 7 days) * 100
      weeklyProgress = Math.min(100, Math.round((weeklyEntries.length / 7) * 100));
    }

    // Monthly progress (entries this month)
    const monthlyEntries = entriesWithContent.filter((e: any) => {
      const entryDate = new Date(e.entry_date);
      return entryDate >= firstDayOfMonth;
    });
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const monthlyProgress = `${monthlyEntries.length}/${daysInMonth}`;

    // Days completed (total entries with content)
    const daysCompleted = totalEntries;

    // 90-day progress
    const progress90Day = Math.min(100, Math.round((totalEntries / 90) * 100));

    // Current streak
    const currentStreak = entriesWithContent.length > 0 
      ? (entriesWithContent[0]?.streak || 0)
      : 0;

    // Goals completed
    const goalsCompleted = (goals || []).filter((g: any) => g.status === 'completed').length;
    const totalGoals = (goals || []).length;
    const goalsProgress = totalGoals > 0 ? Math.round((goalsCompleted / totalGoals) * 100) : 0;

    const response = {
      weeklyProgress,
      monthlyProgress,
      daysCompleted,
      progress90Day,
      currentDay,
      currentStreak,
      goalsCompleted,
      totalGoals,
      goalsProgress
    };
    
    console.log('✅ Stats API: Returning response:', response);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve progress stats' },
      { status: 500 }
    );
  }
}

