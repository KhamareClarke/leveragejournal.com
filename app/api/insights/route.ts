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

// Calculate Momentum Score (0-100) - now includes missed days penalty
function calculateMomentumScore(
  daysCompleted: number,
  currentStreak: number,
  goalsCompleted: number,
  totalGoals: number,
  weeklyProgress: number,
  missedDays: number = 0,
  totalDaysSinceStart: number = 0
): number {
  // Weighted calculation:
  // - Days completed: 30% (max 90 days = 30 points)
  // - Current streak: 25% (max 90 days = 25 points)
  // - Goals completion: 25% (100% = 25 points)
  // - Weekly progress: 20% (100% = 20 points)
  // - Missed days penalty: reduces score based on completion rate
  
  const daysScore = Math.min(30, (daysCompleted / 90) * 30);
  const streakScore = Math.min(25, (currentStreak / 90) * 25);
  const goalsScore = totalGoals > 0 ? (goalsCompleted / totalGoals) * 25 : 0;
  const weeklyScore = (weeklyProgress / 100) * 20;
  
  // Calculate completion rate and apply penalty for missed days
  let baseScore = daysScore + streakScore + goalsScore + weeklyScore;
  
  // If we have missed days, reduce score based on completion rate
  if (totalDaysSinceStart > 0 && missedDays > 0) {
    const completionRate = daysCompleted / totalDaysSinceStart;
    // Apply penalty: reduce score by up to 20% based on missed days
    const penalty = Math.min(20, (missedDays / totalDaysSinceStart) * 20);
    baseScore = baseScore * (1 - penalty / 100);
  }
  
  return Math.max(0, Math.round(baseScore));
}

// GET: Get insights and metrics for the user
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('entry_date, streak, completed, gratitude, priority_1, priority_2, priority_3, tasks, reflection, mood')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false });

    if (journalError) {
      return NextResponse.json(
        { error: 'Failed to retrieve journal entries', details: journalError.message },
        { status: 500 }
      );
    }

    // Get all goals
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('progress, status, created_at')
      .eq('user_id', user.id);

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
    
    // Get account creation date or first entry date
    let startDate: Date;
    if ((user as any)?.created_at) {
      startDate = new Date((user as any).created_at);
      startDate.setHours(0, 0, 0, 0);
    } else if (entriesWithContent.length > 0) {
      // Use first entry date if no account creation date
      const firstEntryDate = entriesWithContent[entriesWithContent.length - 1]?.entry_date;
      if (firstEntryDate) {
        const [year, month, day] = firstEntryDate.split('-').map(Number);
        startDate = new Date(year, month - 1, day);
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate = today;
      }
    } else {
      startDate = today;
    }
    
    // Calculate total days from start to today
    const totalDaysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate missed days (days that have passed without entries)
    const filledDates = new Set(entriesWithContent.map((e: any) => e.entry_date));
    const missedDates: string[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      if (!filledDates.has(dateStr)) {
        missedDates.push(dateStr);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const missedDays = missedDates.length;
    
    // Current streak (from most recent entry or calculate)
    const currentStreak = entriesWithContent.length > 0 
      ? (entriesWithContent[0]?.streak || 0)
      : 0;

    // Goals statistics - only count active goals, not completed ones
    const allGoals = safeGoals || [];
    const activeGoalsList = allGoals.filter((g: any) => g.status !== 'completed');
    const totalGoals = activeGoalsList.length; // Only count active goals
    const goalsCompleted = allGoals.filter((g: any) => g.status === 'completed').length;
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

    // Calculate Momentum Score (with missed days penalty)
    const momentumScore = calculateMomentumScore(
      daysCompleted,
      currentStreak,
      goalsCompleted,
      totalGoals,
      weeklyProgress,
      missedDays,
      totalDaysSinceStart
    );

    // Generate score explanation
    const scoreExplanation: string[] = [];
    if (momentumScore === 0) {
      scoreExplanation.push("Start by completing your first journal entry to begin earning points.");
      if (daysCompleted === 0) {
        scoreExplanation.push("You haven't completed any journal entries yet.");
      } else {
        scoreExplanation.push(`You have ${daysCompleted} entries but need a 3-day streak to start earning points.`);
      }
    } else if (momentumScore < 20) {
      scoreExplanation.push("Low score due to limited journal entries. Complete more daily entries to increase your score.");
      if (currentStreak === 0) {
        scoreExplanation.push("Build a 3-day streak to significantly boost your score.");
      }
      if (missedDays > 0) {
        scoreExplanation.push(`You've missed ${missedDays} days - consistency is key for a higher score.`);
      }
    } else if (momentumScore < 40) {
      scoreExplanation.push("Getting started! Keep journaling daily to build momentum.");
      if (currentStreak < 3) {
        scoreExplanation.push("Complete 3 consecutive days to start your streak and boost your score.");
      }
    } else if (momentumScore < 60) {
      scoreExplanation.push("Good progress! You're building consistent habits.");
      if (weeklyProgress < 70) {
        scoreExplanation.push("Aim for daily entries this week to reach the next level.");
      }
    } else if (momentumScore < 80) {
      scoreExplanation.push("Strong performance! You're maintaining good consistency.");
      if (goalsCompleted === 0 && totalGoals > 0) {
        scoreExplanation.push("Complete some goals to push your score even higher.");
      }
    } else {
      scoreExplanation.push("Excellent! You're performing at an elite level.");
    }

    // Add specific factors affecting score
    const daysScore = Math.min(30, (daysCompleted / 90) * 30);
    const streakScore = currentStreak >= 3 ? Math.min(25, (currentStreak / 90) * 25) : 0;
    const goalsScore = totalGoals > 0 ? (goalsCompleted / totalGoals) * 25 : 0;
    const weeklyScore = (weeklyProgress / 100) * 20;
    
    scoreExplanation.push(`Days completed: ${Math.round(daysScore)}/30 points`);
    if (currentStreak >= 3) {
      scoreExplanation.push(`Streak bonus: ${Math.round(streakScore)}/25 points`);
    } else {
      scoreExplanation.push("Streak: 0/25 points (need 3+ consecutive days)");
    }
    if (totalGoals > 0) {
      scoreExplanation.push(`Goals progress: ${Math.round(goalsScore)}/25 points`);
    } else {
      scoreExplanation.push("Goals: 0/25 points (set goals to earn points)");
    }
    scoreExplanation.push(`Weekly progress: ${Math.round(weeklyScore)}/20 points`);

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

    // Calculate actual streak (only if 3+ consecutive days)
    let actualStreak = 0;
    if (entriesWithContent.length > 0) {
      const sortedEntries = [...entriesWithContent].sort((a, b) => 
        new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
      );
      const filledDatesSet = new Set(sortedEntries.map((e: any) => e.entry_date));
      
      // Check consecutive days from today backwards
      let consecutiveCount = 0;
      const checkDate = new Date(today);
      
      while (consecutiveCount < 90) {
        const year = checkDate.getFullYear();
        const month = String(checkDate.getMonth() + 1).padStart(2, '0');
        const day = String(checkDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        if (filledDatesSet.has(dateStr)) {
          consecutiveCount++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      // Only count as streak if 3+ consecutive days
      actualStreak = consecutiveCount >= 3 ? consecutiveCount : 0;
    }

    // Analyze patterns in journal entries for deeper insights
    const patternAnalysis: any = {
      moodPatterns: {},
      taskCompletionRate: 0,
      priorityConsistency: 0,
      reflectionDepth: 0,
      gratitudeFrequency: 0,
    };

    if (entriesWithContent.length > 0) {
      // Analyze mood patterns
      const moods: string[] = [];
      let tasksTotal = 0;
      let tasksCompleted = 0;
      let hasPriorities = 0;
      let hasReflections = 0;
      let hasGratitude = 0;

      entriesWithContent.forEach((entry: any) => {
        if (entry.mood?.trim()) {
          moods.push(entry.mood.trim().toLowerCase());
        }
        if (entry.tasks && Array.isArray(entry.tasks)) {
          tasksTotal += entry.tasks.length;
          tasksCompleted += entry.tasks.filter((t: any) => t.completed).length;
        }
        if (entry.priority_1?.trim() || entry.priority_2?.trim() || entry.priority_3?.trim()) {
          hasPriorities++;
        }
        if (entry.reflection?.trim() && entry.reflection.trim().length > 50) {
          hasReflections++;
        }
        if (entry.gratitude?.trim()) {
          hasGratitude++;
        }
      });

      // Calculate patterns
      patternAnalysis.taskCompletionRate = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;
      patternAnalysis.priorityConsistency = Math.round((hasPriorities / entriesWithContent.length) * 100);
      patternAnalysis.reflectionDepth = Math.round((hasReflections / entriesWithContent.length) * 100);
      patternAnalysis.gratitudeFrequency = Math.round((hasGratitude / entriesWithContent.length) * 100);

      // Find most common mood
      if (moods.length > 0) {
        const moodCounts: Record<string, number> = {};
        moods.forEach(mood => {
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
        patternAnalysis.mostCommonMood = mostCommonMood[0];
        patternAnalysis.moodFrequency = Math.round((mostCommonMood[1] / moods.length) * 100);
      }
    }

    // Generate AI insights and suggestions based on patterns
    const aiSuggestions: string[] = [];
    const aiRecommendations: any[] = [];
    
    // Always provide at least one suggestion
    if (daysCompleted === 0) {
      // No entries yet
      aiSuggestions.push("🌟 Welcome! Start your journaling journey today. Complete your first entry to begin tracking your progress.");
      aiSuggestions.push("💡 Journaling helps you reflect, set priorities, and track your growth. Every entry matters!");
      aiRecommendations.push({
        type: 'habit',
        title: 'Start Your Journaling Habit',
        description: 'Begin with just 5 minutes daily. Write one thing you\'re grateful for and one priority for the day.',
        priority: 'high'
      });
    } else {
      // Streak-based suggestions
      if (actualStreak >= 7) {
        aiSuggestions.push("🔥 Amazing! You're on a " + actualStreak + "-day streak. This consistency is building powerful habits!");
      } else if (actualStreak >= 3) {
        aiSuggestions.push("💪 Great job maintaining your " + actualStreak + "-day streak! Keep the momentum going.");
      } else if (actualStreak > 0 && actualStreak < 3) {
        aiSuggestions.push("🎯 You're close! Complete " + (3 - actualStreak) + " more day" + (3 - actualStreak > 1 ? 's' : '') + " to start your streak.");
      } else {
        aiSuggestions.push("📝 You've logged " + daysCompleted + " entr" + (daysCompleted !== 1 ? 'ies' : 'y') + ". Complete 3 days in a row to start your streak!");
      }
      
      // Missed days suggestions
      if (missedDays > 0) {
        const completionRate = totalDaysSinceStart > 0 ? (daysCompleted / totalDaysSinceStart) * 100 : 0;
        if (completionRate < 50) {
          aiSuggestions.push("⚠️ You've missed " + missedDays + " day" + (missedDays !== 1 ? 's' : '') + ". Focus on consistency - even 5 minutes daily makes a difference.");
        } else if (completionRate < 70) {
          aiSuggestions.push("📊 You're at " + Math.round(completionRate) + "% completion. Try to fill entries daily to improve your progress.");
        } else {
          aiSuggestions.push("✅ Good progress! You've completed " + Math.round(completionRate) + "% of days. Keep it up!");
        }
      }
      
      // Weekly pattern suggestions
      if (weeklyProgress < 50 && weeklyEntries.length < 7) {
        aiSuggestions.push("📅 This week you've completed " + weeklyEntries.length + " out of 7 days. Aim for daily entries to build momentum.");
      } else if (weeklyProgress >= 100) {
        aiSuggestions.push("🌟 Perfect week! You've completed all 7 days. This consistency is building strong habits!");
      }
      
      // Goals suggestions
      if (totalGoals > 0) {
        if (goalsProgress === 100) {
          aiSuggestions.push("🎉 Congratulations! You've completed all your goals. Consider setting new ones to keep growing!");
        } else if (goalsProgress < 30) {
          const activeGoalsCount = totalGoals - goalsCompleted;
          aiSuggestions.push("🎯 You have " + activeGoalsCount + " active goal" + (activeGoalsCount !== 1 ? 's' : '') + ". Break them into smaller daily actions in your journal.");
        }
      } else {
        aiSuggestions.push("💡 Consider setting goals to track your progress. Goals give your journal entries more purpose.");
      }
      
      // Trend-based suggestions
      if (trendDirection === 'up' && last7Days > 0) {
        aiSuggestions.push("📈 Your activity is increasing! You logged " + last7Days + " entr" + (last7Days !== 1 ? 'ies' : 'y') + " this week vs " + previous7Days + " last week. Great momentum!");
      } else if (trendDirection === 'down' && last7Days > 0) {
        aiSuggestions.push("📉 Your activity decreased this week. Don't worry - every day is a fresh start. Get back on track today!");
      }
      
      // Always add an encouraging message if we have entries
      if (aiSuggestions.length === 0) {
        aiSuggestions.push("📝 Keep up the great work! Your journaling habit is building momentum.");
      }

      // Generate pattern-based recommendations
      
      // Task completion recommendations
      if (patternAnalysis.taskCompletionRate < 50 && patternAnalysis.taskCompletionRate > 0) {
        aiRecommendations.push({
          type: 'habit',
          title: 'Improve Task Completion',
          description: `You're completing ${patternAnalysis.taskCompletionRate}% of tasks. Try breaking larger tasks into smaller, actionable steps.`,
          priority: 'medium'
        });
      } else if (patternAnalysis.taskCompletionRate >= 80) {
        aiRecommendations.push({
          type: 'progress',
          title: 'Excellent Task Management',
          description: `You're completing ${patternAnalysis.taskCompletionRate}% of tasks! Keep up this strong execution.`,
          priority: 'low'
        });
      }

      // Priority consistency recommendations
      if (patternAnalysis.priorityConsistency < 70) {
        aiRecommendations.push({
          type: 'habit',
          title: 'Set Daily Priorities',
          description: `You're setting priorities ${patternAnalysis.priorityConsistency}% of the time. Writing down your top 3 priorities daily helps maintain focus.`,
          priority: 'high'
        });
      }

      // Reflection depth recommendations
      if (patternAnalysis.reflectionDepth < 50) {
        aiRecommendations.push({
          type: 'habit',
          title: 'Deepen Your Reflections',
          description: `Try writing longer reflections (50+ words) to gain deeper insights from your experiences.`,
          priority: 'medium'
        });
      }

      // Gratitude frequency recommendations
      if (patternAnalysis.gratitudeFrequency < 80) {
        aiRecommendations.push({
          type: 'habit',
          title: 'Practice Daily Gratitude',
          description: `Gratitude practice is powerful. Try writing at least one thing you're grateful for each day.`,
          priority: 'high'
        });
      }

      // Mood pattern recommendations
      if (patternAnalysis.mostCommonMood) {
        const mood = patternAnalysis.mostCommonMood;
        if (['sad', 'tired', 'stressed', 'anxious', 'frustrated'].some(m => mood.includes(m))) {
          aiRecommendations.push({
            type: 'barrier',
            title: 'Address Negative Patterns',
            description: `Your most common mood is "${mood}". Consider focusing on gratitude and reflection to shift your mindset.`,
            priority: 'high'
          });
        } else if (['happy', 'grateful', 'energized', 'focused', 'motivated'].some(m => mood.includes(m))) {
          aiRecommendations.push({
            type: 'progress',
            title: 'Positive Mindset',
            description: `Great! Your most common mood is "${mood}". Keep nurturing this positive energy.`,
            priority: 'low'
          });
        }
      }

      // Streak-based recommendations
      if (actualStreak >= 7) {
        aiRecommendations.push({
          type: 'progress',
          title: 'Maintain Your Streak',
          description: `You're on a ${actualStreak}-day streak! Consistency is key - keep going!`,
          priority: 'low'
        });
      } else if (actualStreak === 0 && daysCompleted > 0) {
        aiRecommendations.push({
          type: 'barrier',
          title: 'Build Consistency',
          description: 'Complete 3 consecutive days to start your streak. Consistency builds powerful habits.',
          priority: 'high'
        });
      }

      // Missed days recommendations
      if (missedDays > 0) {
        const completionRate = totalDaysSinceStart > 0 ? (daysCompleted / totalDaysSinceStart) * 100 : 0;
        if (completionRate < 50) {
          aiRecommendations.push({
            type: 'barrier',
            title: 'Overcome Consistency Barriers',
            description: `You've missed ${missedDays} days (${Math.round(100 - completionRate)}% completion). Set a daily reminder or journal at the same time each day.`,
            priority: 'high'
          });
        }
      }

      // Goals recommendations
      if (totalGoals === 0) {
        aiRecommendations.push({
          type: 'goal',
          title: 'Set Your Goals',
          description: 'Setting specific goals gives your journal entries purpose. Create goals that align with your vision.',
          priority: 'high'
        });
      } else if (goalsProgress < 30) {
        const activeGoalsCount = totalGoals - goalsCompleted;
        aiRecommendations.push({
          type: 'goal',
          title: 'Accelerate Goal Progress',
          description: `You have ${activeGoalsCount} active goals at ${goalsProgress}% completion. Break them into weekly milestones.`,
          priority: 'medium'
        });
      }
    }

    // Ensure at least one recommendation
    if (aiRecommendations.length === 0) {
      aiRecommendations.push({
        type: 'progress',
        title: 'Keep Going!',
        description: 'You\'re making great progress. Continue journaling daily to build momentum.',
        priority: 'low'
      });
    }

    const response = {
      daysCompleted,
      currentStreak: actualStreak, // Use calculated streak
      goalsCompleted,
      totalGoals,
      goalsProgress,
      weeklyProgress,
      momentumScore,
      reviewsCompleted,
      trend,
      trendDirection,
      firstEntryDate: firstEntry?.entry_date || null,
      missedDays,
      totalDaysSinceStart,
      missedDates: missedDates.slice(0, 30), // Return first 30 missed dates
      aiSuggestions, // Add AI suggestions
      aiRecommendations, // Add detailed recommendations
      patternAnalysis, // Add pattern analysis data
      scoreExplanation // Add score explanation
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

