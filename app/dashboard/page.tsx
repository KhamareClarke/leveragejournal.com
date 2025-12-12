'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Home, 
  Building2, 
  Target, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  Settings,
  LogOut,
  User,
  Plus,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Edit,
  Save,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  Zap,
  Brain,
  Sparkles,
  TrendingUp,
  Activity,
  Flame,
  Heart
} from 'lucide-react';

// Daily Flow Tab Component - Memoized for instant switching
const DailyFlowTab = memo(function DailyFlowTab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  const router = useRouter();
  const [allEntries, setAllEntries] = useState<any[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [accountCreatedDate, setAccountCreatedDate] = useState<string>('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Use local date to avoid timezone issues (same as daily journal page)
  const today = typeof window !== 'undefined' ? (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })() : '';
  
  // Use preloaded data directly - instant rendering, no state updates needed
  const todayEntry = useMemo(() => {
    if (preloadedData?.journalTodayEntry) {
      const entry = preloadedData.journalTodayEntry;
      const hasContent = !!(
        entry.gratitude?.trim() ||
        entry.priority_1?.trim() ||
        entry.priority_2?.trim() ||
        entry.priority_3?.trim() ||
        (entry.tasks && Array.isArray(entry.tasks) && entry.tasks.length > 0 && 
         entry.tasks.some((t: any) => t && t.text && t.text.trim().length > 0)) ||
        entry.reflection?.trim() ||
        entry.mood?.trim()
      );
      return hasContent ? entry : null;
    }
    return null;
  }, [preloadedData?.journalTodayEntry]);

  const streak = useMemo(() => {
    if (todayEntry?.streak) return todayEntry.streak;
    if (preloadedData?.journalList && preloadedData.journalList.length > 0) {
      const todayEntryData = preloadedData.journalList.find((e: any) => e.entry_date === today);
      if (todayEntryData?.streak) return todayEntryData.streak;
      if (preloadedData.journalList[0]?.streak) return preloadedData.journalList[0].streak;
    }
    return 0;
  }, [todayEntry, preloadedData?.journalList, today]);

  // Load all entries since account creation
  useEffect(() => {
    const loadAllEntries = async () => {
      if (!user) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          setLoadingEntries(false);
          return;
        }

        // Fetch all journal entries first
        const response = await fetch('/api/journal/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const entries = data.entries || [];
          setAllEntries(entries);

          // Also fetch insights for AI suggestions
          try {
            const insightsResponse = await fetch('/api/insights', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (insightsResponse.ok) {
              const insightsData = await insightsResponse.json();
              console.log('AI Suggestions received:', insightsData.aiSuggestions);
              if (insightsData.aiSuggestions && Array.isArray(insightsData.aiSuggestions) && insightsData.aiSuggestions.length > 0) {
                setAiSuggestions(insightsData.aiSuggestions);
              } else {
                // Fallback: generate suggestions from local data
                const localSuggestions: string[] = [];
                if (entries.length === 0) {
                  localSuggestions.push("🌟 Welcome! Start your journaling journey today. Complete your first entry to begin tracking your progress.");
                } else {
                  const filledCount = entries.filter(e => hasContent(e)).length;
                  if (filledCount > 0) {
                    localSuggestions.push("📝 You've logged " + filledCount + " entr" + (filledCount !== 1 ? 'ies' : 'y') + ". Keep building your journaling habit!");
                  }
                }
                if (localSuggestions.length > 0) {
                  setAiSuggestions(localSuggestions);
                }
              }
            }
          } catch (insightsError) {
            // Fallback suggestions
            if (allEntries.length === 0) {
              setAiSuggestions(["🌟 Welcome! Start your journaling journey today."]);
            }
          }

          // Use the earliest entry date as start date, or account creation date, or today
          if (entries.length > 0) {
            // Find earliest entry date
            const sortedEntries = [...entries].sort((a, b) => 
              new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
            );
            const earliestDate = sortedEntries[0].entry_date;
            setAccountCreatedDate(earliestDate);
          } else if (user.created_at) {
            // No entries yet, use account creation date
            const createdDate = new Date(user.created_at);
            const year = createdDate.getFullYear();
            const month = String(createdDate.getMonth() + 1).padStart(2, '0');
            const day = String(createdDate.getDate()).padStart(2, '0');
            setAccountCreatedDate(`${year}-${month}-${day}`);
          } else {
            // Fallback to today
            setAccountCreatedDate(today);
          }
        }
        } catch (error) {
          // Silent fail
        } finally {
        setLoadingEntries(false);
      }
    };

    if (user) {
      loadAllEntries();
    }
  }, [user, today]);

  // Generate exactly 90 days from account creation/first entry date
  const allDays = useMemo(() => {
    if (!accountCreatedDate) {
      // If no start date yet, at least show today
      return today ? [today] : [];
    }

    const startDate = new Date(accountCreatedDate + 'T00:00:00');
    const days: string[] = [];
    const currentDate = new Date(startDate);

    // Generate exactly 90 days from the start date (90-day program)
    for (let i = 0; i < 90; i++) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      days.push(`${year}-${month}-${day}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days; // Oldest first (chronological order)
  }, [accountCreatedDate, today]);

  // Helper to check if entry has content
  const hasContent = (entry: any): boolean => {
    return !!(
      entry?.gratitude?.trim() ||
      entry?.priority_1?.trim() ||
      entry?.priority_2?.trim() ||
      entry?.priority_3?.trim() ||
      (entry?.tasks && Array.isArray(entry.tasks) && entry.tasks.length > 0 && 
       entry.tasks.some((t: any) => t && t.text && t.text.trim().length > 0)) ||
      entry?.reflection?.trim() ||
      entry?.mood?.trim()
    );
  };

  // Get entry for a specific date
  const getEntryForDate = (date: string) => {
    return allEntries.find(e => e.entry_date === date);
  };

  const handleGoToJournal = (date?: string) => {
    if (date) {
      router.push(`/dashboard/daily?date=${date}`);
    } else {
    router.push('/dashboard/daily');
    }
  };

  const filledCount = allEntries.filter(e => hasContent(e)).length;
  const totalDays = allDays.length; // Total days from start to today (or 90 days)
  // Only count missing days for dates that have passed (up to today)
  const todayDate = today ? new Date(today + 'T00:00:00') : new Date();
  const daysUpToToday = allDays.filter(date => {
    const dateObj = new Date(date + 'T00:00:00');
    return dateObj <= todayDate;
  }).length;
  const missingDays = Math.max(0, daysUpToToday - filledCount); // Only count missing days up to today

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">Tactical Execution</h2>
        <p className="text-gray-400">Digital version of your 180 daily pages - 90-day transformation</p>
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{filledCount}</div>
            <div className="text-sm text-gray-400 mt-1">Entries Filled</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{missingDays}</div>
            <div className="text-sm text-gray-400 mt-1">Missing Days</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-green-400">{totalDays}</div>
            <div className="text-sm text-gray-400 mt-1">Total Days</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-400">{streak >= 3 ? streak : 0}</div>
            <div className="text-sm text-gray-400 mt-1">Streak</div>
            {streak >= 3 && (
              <div className="text-xs text-orange-400 mt-1 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3" />
                Active
              </div>
            )}
            {streak > 0 && streak < 3 && (
              <div className="text-xs text-gray-500 mt-1">Need 3 days</div>
            )}
          </div>
        </div>
      </Card>

      {/* Today's Entry Status */}
      {todayEntry ? (
        <Card className="bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-4 sm:p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Today's entry completed! 🎉</h3>
          <Button 
            onClick={() => handleGoToJournal()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mt-4"
          >
              <BookOpen className="w-4 h-4 mr-2" />
            Edit Today's Entry
            </Button>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-xl p-4 sm:p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Start Today's Journal Entry</h3>
          <Button 
            onClick={() => handleGoToJournal()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Start Today's Entry
          </Button>
        </Card>
      )}

      {/* AI Suggestions - Logic-based insights */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
            <h3 className="text-xl font-bold text-white">AI Insights & Suggestions</h3>
            <p className="text-sm text-gray-400">Logic-based interpretation of your journal patterns</p>
                </div>
              </div>
        <div className="space-y-3">
          {(aiSuggestions.length > 0 || (preloadedData?.insights?.aiSuggestions && preloadedData.insights.aiSuggestions.length > 0)) ? (
            (aiSuggestions.length > 0 ? aiSuggestions : preloadedData.insights.aiSuggestions).map((suggestion: string, index: number) => {
              // Determine icon and color based on suggestion content
              let icon = Sparkles;
              let bgColor = 'bg-blue-500/10';
              let borderColor = 'border-blue-500/30';
              let textColor = 'text-blue-400';
              
              if (suggestion.includes('🔥') || suggestion.includes('streak')) {
                icon = Flame;
                bgColor = 'bg-green-500/10';
                borderColor = 'border-green-500/30';
                textColor = 'text-green-400';
              } else if (suggestion.includes('⚠️') || suggestion.includes('missed')) {
                icon = Calendar;
                bgColor = 'bg-red-500/10';
                borderColor = 'border-red-500/30';
                textColor = 'text-red-400';
              } else if (suggestion.includes('📈') || suggestion.includes('increasing')) {
                icon = TrendingUp;
                bgColor = 'bg-green-500/10';
                borderColor = 'border-green-500/30';
                textColor = 'text-green-400';
              } else if (suggestion.includes('📉') || suggestion.includes('decreased')) {
                icon = TrendingUp;
                bgColor = 'bg-yellow-500/10';
                borderColor = 'border-yellow-500/30';
                textColor = 'text-yellow-400';
              } else if (suggestion.includes('🎯') || suggestion.includes('goal')) {
                icon = Target;
                bgColor = 'bg-yellow-500/10';
                borderColor = 'border-yellow-500/30';
                textColor = 'text-yellow-400';
              }
              
              const IconComponent = icon;
              
              return (
                <div key={index} className={`p-4 ${bgColor} border ${borderColor} rounded-lg`}>
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`w-5 h-5 ${textColor} flex-shrink-0 mt-0.5`} />
                    <p className={`text-sm ${textColor.replace('text-', 'text-').replace('-400', '-300')}`}>
                      {suggestion}
                    </p>
                </div>
              </div>
              );
            })
          ) : (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">Start journaling to receive personalized AI insights and suggestions!</p>
                </div>
              </div>
          )}
            </div>
          </Card>

      {/* All Entries Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">All Daily Entries</h3>
        {loadingEntries ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading entries...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {allDays.map((date) => {
              const entry = getEntryForDate(date);
              const isFilled = entry && hasContent(entry);
              const isToday = date === today;
              const dateObj = new Date(date + 'T00:00:00');
              const todayObj = new Date(today + 'T00:00:00');
              const isFuture = dateObj > todayObj;
              const isPast = dateObj < todayObj;
              
              // Only allow clicking on today (if not filled) or filled entries (to view)
              const canClick = (isToday && !isFilled) || (isFilled);
              const isDisabled = isFuture || (isPast && !isFilled);
              
              return (
                <Card
                  key={date}
                  onClick={() => {
                    if (canClick && !isDisabled) {
                      handleGoToJournal(date);
                    }
                  }}
                  className={`transition-all ${
                    canClick && !isDisabled
                      ? 'cursor-pointer hover:scale-105'
                      : 'cursor-not-allowed opacity-50'
                  } ${
                    isFilled
                      ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/50'
                      : 'bg-neutral-800/50 border-gray-700/50'
                  } ${isToday ? 'ring-2 ring-yellow-500/50' : ''} ${isFuture ? 'opacity-30' : ''}`}
                >
                  <div className="p-3 sm:p-4 text-center">
                    <div className={`text-xs sm:text-sm font-semibold mb-1 ${
                      isFilled ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    {isFilled ? (
                      <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto" />
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto border-2 border-dashed border-gray-600 rounded flex items-center justify-center">
                        <span className="text-gray-600 text-xs">—</span>
        </div>
      )}
                    {isToday && (
                      <div className="mt-2 text-xs text-yellow-400 font-semibold">Today</div>
                    )}
                    {isFuture && (
                      <div className="mt-2 text-xs text-gray-500">Future</div>
                    )}
                    {isPast && !isFilled && (
                      <div className="mt-2 text-xs text-gray-500">Missed</div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

// Home Tab Component - Memoized for instant switching
const HomeTab = memo(function HomeTab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  // Use preloaded data directly - instant rendering, no fetching
  const stats = useMemo(() => preloadedData?.stats || null, [preloadedData?.stats]);
  const insights = useMemo(() => preloadedData?.insights || null, [preloadedData?.insights]);


  // Memoize computed values for performance
  // Get goals from preloadedData to calculate active goals correctly
  const allGoalsFromData = useMemo(() => preloadedData?.goals || [], [preloadedData?.goals]);
  const activeGoalsList = useMemo(() => 
    allGoalsFromData.filter((g: any) => g.status !== 'completed'), 
    [allGoalsFromData]
  );
  const totalGoals = useMemo(() => activeGoalsList.length, [activeGoalsList.length]);
  const activeGoals = useMemo(() => totalGoals, [totalGoals]);
  const goalsCompleted = useMemo(() => 
    allGoalsFromData.filter((g: any) => g.status === 'completed').length,
    [allGoalsFromData]
  );
  const daysCompleted = useMemo(() => stats?.daysCompleted || insights?.daysCompleted || 0, [stats?.daysCompleted, insights?.daysCompleted]);
  const currentStreak = useMemo(() => stats?.currentStreak || insights?.currentStreak || 0, [stats?.currentStreak, insights?.currentStreak]);
  const aiScore = useMemo(() => insights?.momentumScore || 0, [insights?.momentumScore]);
  const scoreExplanation = useMemo(() => insights?.scoreExplanation || [], [insights?.scoreExplanation]);
  const weeklyProgress = useMemo(() => stats?.weeklyProgress || 0, [stats?.weeklyProgress]);
  const goalsProgress = useMemo(() => insights?.goalsProgress || 0, [insights?.goalsProgress]);
  const missedDays = useMemo(() => insights?.missedDays || 0, [insights?.missedDays]);
  const missedDates = useMemo(() => insights?.missedDates || [], [insights?.missedDates]);
  const totalDaysSinceStart = useMemo(() => insights?.totalDaysSinceStart || 0, [insights?.totalDaysSinceStart]);
  const aiRecommendations = useMemo(() => insights?.aiRecommendations || [], [insights?.aiRecommendations]);
  const patternAnalysis = useMemo(() => insights?.patternAnalysis || null, [insights?.patternAnalysis]);
  
  const getMomentumLabel = useCallback((score: number) => {
    if (score >= 80) return 'Elite Performance';
    if (score >= 60) return 'High Performance';
    if (score >= 40) return 'Good Progress';
    return 'Getting Started';
  }, []);

  return (
    <div className="space-y-8">
      {/* AI-Powered Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border border-yellow-500/30 rounded-3xl p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/30">
              <Brain className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-gray-400 text-lg">
                {user?.email ? (
                  <span className="text-yellow-400">Logged in as: {user.email}</span>
                ) : null}
                <br />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">AI Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">High Performance Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 p-4 sm:p-5 md:p-6 group hover:shadow-xl hover:shadow-blue-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{activeGoals}</div>
          <div className="text-sm text-gray-400 mb-2">Active Goals</div>
          <div className="text-xs text-green-400">{goalsCompleted} completed</div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 p-4 sm:p-5 md:p-6 group hover:shadow-xl hover:shadow-green-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{daysCompleted}</div>
          <div className="text-sm text-gray-400 mb-2">Days Logged</div>
          <div className="text-xs text-green-400">{currentStreak}-day streak 🔥</div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 p-4 sm:p-5 md:p-6 group hover:shadow-xl hover:shadow-purple-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{aiScore}</div>
          <div className="text-sm text-gray-400 mb-2">AI Score</div>
          <div className="text-xs text-yellow-400">{getMomentumLabel(aiScore)}</div>
          {scoreExplanation.length > 0 && (
            <div className="mt-2 pt-2 border-t border-purple-500/20">
              <div className="text-xs text-gray-400 mb-1">Why this score:</div>
              {scoreExplanation.slice(0, 2).map((reason: string, idx: number) => (
                <div key={idx} className="text-xs text-gray-300 mb-1">• {reason}</div>
              ))}
              {scoreExplanation.length > 2 && (
                <details className="mt-1">
                  <summary className="text-xs text-purple-400 cursor-pointer hover:text-purple-300">
                    View all factors ({scoreExplanation.length})
                  </summary>
                  <div className="mt-2 space-y-1">
                    {scoreExplanation.slice(2).map((reason: string, idx: number) => (
                      <div key={idx + 2} className="text-xs text-gray-300">• {reason}</div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 p-4 sm:p-5 md:p-6 group hover:shadow-xl hover:shadow-yellow-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{weeklyProgress}%</div>
          <div className="text-sm text-gray-400 mb-2">Weekly Progress</div>
          <div className="text-xs text-green-400">{weeklyProgress >= 70 ? 'Above average' : weeklyProgress >= 50 ? 'On track' : 'Keep going'}</div>
        </Card>
      </div>

      {/* Missed Days Information */}
      {missedDays > 0 && (
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Missed Days</h3>
              <p className="text-sm text-gray-400">You missed {missedDays} day{missedDays !== 1 ? 's' : ''} since you started</p>
            </div>
          </div>
          {totalDaysSinceStart > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Completion Rate</span>
                <span className="text-sm font-semibold text-white">
                  {Math.round((daysCompleted / totalDaysSinceStart) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (daysCompleted / totalDaysSinceStart) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
          {missedDates.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Recent missed dates:</p>
              <div className="flex flex-wrap gap-2">
                {missedDates.slice(0, 10).map((date: string) => (
                  <span
                    key={date}
                    className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-300"
                  >
                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                ))}
                {missedDates.length > 10 && (
                  <span className="px-2 py-1 bg-gray-700/50 border border-gray-600/30 rounded text-xs text-gray-400">
                    +{missedDates.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* AI Recommendations Layer - Pattern Analysis */}
      {aiRecommendations.length > 0 && (
        <Card className="bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-purple-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">AI Recommendations</h3>
              <p className="text-sm text-gray-400">Analyzed from your journal patterns</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {aiRecommendations.map((rec: any, index: number) => {
              const priorityColors: Record<string, string> = {
                high: 'border-red-500/50 bg-red-500/10',
                medium: 'border-yellow-500/50 bg-yellow-500/10',
                low: 'border-green-500/50 bg-green-500/10'
              };
              const typeIcons: Record<string, any> = {
                habit: Target,
                goal: Trophy,
                barrier: Activity,
                progress: TrendingUp
              };
              const typeColors: Record<string, string> = {
                habit: 'text-blue-400',
                goal: 'text-yellow-400',
                barrier: 'text-red-400',
                progress: 'text-green-400'
              };
              
              const IconComponent = typeIcons[rec.type] || Sparkles;
              const bgColor = priorityColors[rec.priority] || 'border-gray-500/50 bg-gray-500/10';
              const iconColor = typeColors[rec.type] || 'text-purple-400';
              
              return (
                <div key={index} className={`p-4 rounded-lg border ${bgColor}`}>
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-white">{rec.title}</h4>
                        {rec.priority === 'high' && (
                          <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">High Priority</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">{rec.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pattern Analysis Summary */}
          {patternAnalysis && (
            <div className="mt-6 pt-6 border-t border-purple-500/20">
              <h4 className="text-lg font-bold text-white mb-4">Your Journal Patterns</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {patternAnalysis.taskCompletionRate > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{patternAnalysis.taskCompletionRate}%</div>
                    <div className="text-xs text-gray-400 mt-1">Task Completion</div>
                  </div>
                )}
                {patternAnalysis.priorityConsistency > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{patternAnalysis.priorityConsistency}%</div>
                    <div className="text-xs text-gray-400 mt-1">Priority Setting</div>
                  </div>
                )}
                {patternAnalysis.reflectionDepth > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{patternAnalysis.reflectionDepth}%</div>
                    <div className="text-xs text-gray-400 mt-1">Deep Reflections</div>
                  </div>
                )}
                {patternAnalysis.gratitudeFrequency > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{patternAnalysis.gratitudeFrequency}%</div>
                    <div className="text-xs text-gray-400 mt-1">Gratitude Practice</div>
                  </div>
                )}
              </div>
              {patternAnalysis.mostCommonMood && (
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-400">Most Common Mood</div>
                  <div className="text-lg font-semibold text-white mt-1 capitalize">{patternAnalysis.mostCommonMood}</div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* AI Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border border-yellow-500/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Recommendations</h3>
              <p className="text-xs text-gray-400">Powered by your data patterns</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-medium">Focus on your 3 priorities today</p>
                <p className="text-gray-400 text-sm">You're {weeklyProgress}% through weekly goals - maintain momentum!</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-medium">Schedule your weekly review</p>
                <p className="text-gray-400 text-sm">Best time: Tomorrow at 2 PM based on your patterns</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Performance Insights</h3>
              <p className="text-xs text-gray-400">Real-time analytics</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Weekly Momentum</span>
                <span className="text-sm font-bold text-green-400">{weeklyProgress > 0 ? `+${weeklyProgress}%` : `${weeklyProgress}%`}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" style={{width: `${Math.min(100, weeklyProgress)}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Goal Completion Rate</span>
                <span className="text-sm font-bold text-yellow-400">{goalsProgress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full" style={{width: `${Math.min(100, goalsProgress)}%`}}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
});

// Foundation Tab Component - Memoized for instant switching
const FoundationTab = memo(function FoundationTab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  const router = useRouter();
  // Use preloaded data directly - instant rendering
  const [entriesList, setEntriesList] = useState(() => preloadedData?.foundationEntries || []);
  const [dataLoaded, setDataLoaded] = useState(() => preloadedData?.foundationEntries !== undefined);
  const [today, setToday] = useState(() => {
    if (typeof window !== 'undefined') {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setToday(`${year}-${month}-${day}`);
    }
  }, []);

  // Use preloaded data when available
  useEffect(() => {
    if (preloadedData?.foundationEntries !== undefined) {
      setEntriesList(preloadedData.foundationEntries || []);
      setDataLoaded(true);
    }
  }, [preloadedData]);

  // Load all foundation entries if not preloaded
  useEffect(() => {
    // Skip if data is already loaded (even if empty)
    if (dataLoaded) {
      return;
    }

    const loadEntries = async () => {
      if (!user) {
        setDataLoaded(true);
        return;
      }

      setDataLoaded(false);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          setDataLoaded(true);
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const response = await fetch('/api/foundation/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const entries = data.entries || [];
          setEntriesList(entries);
        } else {
          setEntriesList([]);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load foundation entries:', error);
        }
        setEntriesList([]);
      } finally {
        setDataLoaded(true);
      }
    };

    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey]); // Removed preloadedData from deps

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleCreateNew = () => {
    router.push('/dashboard/foundation');
  };

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">
          Sacred Commitment
        </h2>
          <p className="text-gray-400">Chapter 1 - Build your foundation for transformation</p>
        </div>


      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Your Foundation Entries</h3>
        <Button
          onClick={handleCreateNew}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Foundation
        </Button>
      </div>

      {!dataLoaded ? (
        <Card className="bg-neutral-900/50 border border-yellow-600/20 p-8 text-center">
          <div className="animate-spin text-yellow-400 text-2xl mb-4">⏳</div>
          <p className="text-gray-400">Loading foundation entries...</p>
        </Card>
      ) : entriesList.length === 0 ? (
        <Card className="bg-neutral-900/50 border border-yellow-600/20 p-8 text-center">
          <Building2 className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No foundation entries yet.</p>
          <p className="text-gray-500 text-sm mb-6">Start building your foundation by creating your first entry.</p>
          <Button
            onClick={handleCreateNew}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Foundation Entry
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {entriesList.map((entry: any) => (
            <Card key={entry.id} className="bg-neutral-900/50 border border-yellow-600/20 p-6 hover:border-yellow-500/50 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/foundation?id=${entry.id}`)}>
              <div className="flex items-center gap-2 text-yellow-400 mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold">{formatDate(entry.entry_date)}</span>
              </div>
              <div className="space-y-2">
                {entry.my_why && (
                  <div>
                    <h4 className="text-xs font-semibold text-yellow-400 mb-1">My Why</h4>
                    <p className="text-gray-300 text-sm line-clamp-2">{entry.my_why}</p>
                  </div>
                )}
                {entry.my_vision && (
                  <div>
                    <h4 className="text-xs font-semibold text-yellow-400 mb-1">My Vision</h4>
                    <p className="text-gray-300 text-sm line-clamp-2">{entry.my_vision}</p>
                  </div>
                )}
                {entry.my_values && (
                  <div>
                    <h4 className="text-xs font-semibold text-yellow-400 mb-1">My Values</h4>
                    <p className="text-gray-300 text-sm line-clamp-2">{entry.my_values}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}


      </div>
    );
});


// Goals Tab Component - Memoized for instant switching
const GoalsTab = memo(function GoalsTab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  const router = useRouter();
  // Use preloaded data directly - instant rendering
  const [goalsList, setGoalsList] = useState(() => preloadedData?.goals || []);
  const [today, setToday] = useState(() => {
    if (typeof window !== 'undefined') {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setToday(`${year}-${month}-${day}`);
    }
  }, []);

  const [refreshKey, setRefreshKey] = useState(0);

  // Use preloaded data when available
  useEffect(() => {
    if (preloadedData?.goals !== undefined) {
      setGoalsList(preloadedData.goals || []);
    }
  }, [preloadedData]);

  // Load all goals if not preloaded
  useEffect(() => {
    // Skip if we already have data
    if (goalsList.length > 0) {
      return;
    }

    const loadGoals = async () => {
      if (!user) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) return;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('/api/goals', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setGoalsList(data.goals || []);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load goals:', error);
        }
      }
    };

    loadGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey]); // Keep independent

  const hasTodayGoals = goalsList.length > 0;

  const handleGoToGoals = () => {
    router.push('/dashboard/goals');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">
          Smart Goals
        </h2>
        <p className="text-gray-400">Set, track, and achieve your goals</p>
            </div>

      {!hasTodayGoals ? (
        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-500/30 p-8 mb-8">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              Set Your Goals Today
            </h3>
            
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">🎯</span>
                <div>
                  <p className="font-semibold text-white mb-1">Clarity & Focus</p>
                  <p className="text-gray-300 text-sm">
                    Clear goals give you direction and help you prioritize what truly matters.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">📈</span>
                <div>
                  <p className="font-semibold text-white mb-1">Track Progress</p>
                  <p className="text-gray-300 text-sm">
                    Monitor your advancement and celebrate milestones along the way.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">🏆</span>
                <div>
                  <p className="font-semibold text-white mb-1">Achievement & Rewards</p>
                  <p className="text-gray-300 text-sm">
                    Set meaningful rewards to stay motivated and recognize your accomplishments.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-black/30 rounded-lg border border-yellow-500/20">
              <p className="text-yellow-300 italic text-lg mb-2">
                "A goal without a plan is just a wish."
              </p>
              <p className="text-gray-400 text-sm">— Antoine de Saint-Exupéry</p>
            </div>

            <Button
              onClick={handleGoToGoals}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mt-6 px-8 py-6 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Goal
                  </Button>
                </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Today's Goals ({goalsList.length})</h3>
            <Button
              onClick={handleGoToGoals}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
              </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {goalsList.slice(0, 4).map((goal) => (
              <Card key={goal.id} className="bg-neutral-900/50 border border-yellow-600/20 p-4 cursor-pointer hover:border-yellow-500/50 transition-colors" onClick={handleGoToGoals}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-bold text-white">{goal.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    goal.type === 'short' ? 'bg-blue-500/20 text-blue-400' :
                    goal.type === 'medium' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {goal.type}
                  </span>
                </div>
                {goal.description && (
                  <p className="text-gray-300 text-sm mb-2 line-clamp-2">{goal.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Progress: {goal.progress}%</span>
                  <ChevronRight className="w-4 h-4 text-yellow-400" />
                </div>
          </Card>
        ))}
          </div>

          {goalsList.length > 4 && (
            <div className="text-center">
              <Button
                onClick={handleGoToGoals}
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              >
                View All {goalsList.length} Goals
              </Button>
            </div>
          )}
        </div>
      )}
      </div>
    );
});


// Insights Tab Component - Memoized for instant switching
const InsightsTab = memo(function InsightsTab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  const [insightsData, setInsightsData] = useState<any>(preloadedData?.insights || null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  
  // Use preloaded data if available, otherwise fetch
  const insights = useMemo(() => insightsData || preloadedData?.insights || null, [insightsData, preloadedData?.insights]);
  const loading = useMemo(() => loadingInsights || (preloadedData?.insights === undefined && !insightsData), [loadingInsights, preloadedData?.insights, insightsData]);
  
  // Use preloadedData immediately, only fetch if missing
  useEffect(() => {
    if (!user) return;
    
    // Use preloadedData if available
    if (preloadedData?.insights && Object.keys(preloadedData.insights).length > 0 && !insightsData) {
      setInsightsData(preloadedData.insights);
      return;
    }
    
    // Only fetch if we don't have any insights data
    if (insightsData && Object.keys(insightsData).length > 0) return;
    
    // Quick fetch with timeout
    const fetchInsights = async () => {
      setLoadingInsights(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        
        if (!token) {
          setLoadingInsights(false);
          return;
        }
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('/api/insights', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeout);
        
        if (response.ok) {
          const data = await response.json();
          setInsightsData(data);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          // Silent fail - use preloaded data if available
        }
      } finally {
        setLoadingInsights(false);
      }
    };
    
    fetchInsights();
  }, [user]);
  
  const error = null; // No error state needed

  const getMomentumColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMomentumLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getTrendIcon = (direction: string) => {
    if (direction === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (direction === 'down') return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">
          Insights Dashboard
        </h2>
        <p className="text-gray-400">Track your transformation progress</p>
      </div>

      {error && (
        <Card className="bg-red-900/20 border-red-500/50 p-4">
          <p className="text-red-400">{error}</p>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin text-yellow-400 text-4xl mb-4">⏳</div>
          <div className="ml-4">
            <p className="text-gray-400 text-lg">Loading insights...</p>
          </div>
        </div>
      ) : (
        <>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5 text-blue-400 mr-2" />
            <div className="text-3xl font-bold text-yellow-400">{insights?.daysCompleted || 0}</div>
          </div>
          <div className="text-sm text-gray-400">Days Completed</div>
          {insights?.trend !== 0 && (
            <div className={`text-xs mt-1 flex items-center justify-center gap-1 ${
              insights?.trend > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {getTrendIcon(insights?.trendDirection || 'stable')}
              <span>{insights?.trend > 0 ? '+' : ''}{insights?.trend || 0} from last week</span>
            </div>
          )}
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-purple-400 mr-2" />
            <div className="text-3xl font-bold text-yellow-400">
              {insights?.goalsCompleted || 0}/{insights?.totalGoals || 0}
            </div>
          </div>
          <div className="text-sm text-gray-400">Goals Achieved</div>
          <div className="text-xs text-green-400 mt-1">{insights?.goalsProgress || 0}% completion</div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Flame className="w-5 h-5 text-orange-400 mr-2" />
            <div className="text-3xl font-bold text-yellow-400">{insights?.currentStreak || 0}</div>
          </div>
          <div className="text-sm text-gray-400">Current Streak</div>
          <div className="text-xs text-green-400 mt-1">
            {(insights?.currentStreak || 0) > 0 ? '🔥 Keep it up!' : 'Start your streak today!'}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="w-5 h-5 text-green-400 mr-2" />
            <div className={`text-3xl font-bold ${getMomentumColor(insights?.momentumScore || 0)}`}>
              {insights?.momentumScore || 0}
            </div>
          </div>
          <div className="text-sm text-gray-400">Momentum Score</div>
          <div className={`text-xs mt-1 ${getMomentumColor(insights?.momentumScore || 0)}`}>
            {getMomentumLabel(insights?.momentumScore || 0)}
          </div>
        </Card>
      </div>

      {/* Progress Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Momentum Score Breakdown */}
        <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Momentum Score Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Days Completed</span>
                <span className="text-sm font-bold text-yellow-400">
                  {Math.min(30, Math.round(((insights?.daysCompleted || 0) / 90) * 30))}/30
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                  style={{ width: `${Math.min(100, ((insights?.daysCompleted || 0) / 90) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Current Streak</span>
                <span className="text-sm font-bold text-yellow-400">
                  {Math.min(25, Math.round(((insights?.currentStreak || 0) / 90) * 25))}/25
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full"
                  style={{ width: `${Math.min(100, ((insights?.currentStreak || 0) / 90) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Goals Completion</span>
                <span className="text-sm font-bold text-yellow-400">
                  {(insights?.totalGoals || 0) > 0 ? Math.round(((insights?.goalsCompleted || 0) / (insights?.totalGoals || 1)) * 25) : 0}/25
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full"
                  style={{ width: `${Math.min(100, insights?.goalsProgress || 0)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Weekly Progress</span>
                <span className="text-sm font-bold text-yellow-400">
                  {Math.round(((insights?.weeklyProgress || 0) / 100) * 20)}/20
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                  style={{ width: `${insights?.weeklyProgress || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Activity Summary */}
        <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-yellow-400" />
            Activity Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">Journal Entries</div>
                  <div className="text-lg font-bold text-white">{insights?.daysCompleted || 0}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-400">Goals Set</div>
                  <div className="text-lg font-bold text-white">{insights?.totalGoals || 0}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Completed</div>
                <div className="text-lg font-bold text-green-400">{insights?.goalsCompleted || 0}</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-sm text-gray-400">Weekly Reviews</div>
                  <div className="text-lg font-bold text-white">{insights?.reviewsCompleted || 0}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm text-gray-400">Weekly Progress</div>
                  <div className="text-lg font-bold text-white">{insights?.weeklyProgress || 0}%</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Momentum Score Card */}
      <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-500/30 p-8">
        <div className="text-center">
          <div className={`text-6xl font-bold mb-4 ${getMomentumColor(insights?.momentumScore || 0)}`}>
            {insights?.momentumScore || 0}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Momentum Score</h3>
          <p className={`text-lg font-semibold mb-4 ${getMomentumColor(insights?.momentumScore || 0)}`}>
            {getMomentumLabel(insights?.momentumScore || 0)}
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Your momentum score is calculated based on your journal entries, goal completion, 
            current streak, and weekly activity. Keep up the great work!
          </p>
        </div>
      </Card>
        </>
      )}
    </div>
  );
});

// Progress AI Tab Component - Memoized for instant switching
const ProgressAITab = memo(function ProgressAITab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  const router = useRouter();
  // Use preloaded data directly - instant rendering
  const stats = useMemo(() => preloadedData?.stats || null, [preloadedData?.stats]);
  const loadingStats = useMemo(() => preloadedData?.stats === undefined, [preloadedData?.stats]);
  const [currentReview, setCurrentReview] = useState<any>(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [programStartDate, setProgramStartDate] = useState<string | null>(null);
  const [weekStartStr, setWeekStartStr] = useState<string>('');
  const [weekEndStr, setWeekEndStr] = useState<string>('');

  // Format dates as YYYY-MM-DD using local timezone
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate week start/end based on program start date
  const calculateWeekDates = (startDate: string) => {
    // Use local date to avoid timezone issues
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse start date as local date (YYYY-MM-DD format)
    const [year, month, day] = startDate.split('-').map(Number);
    const programStart = new Date(year, month - 1, day);
    programStart.setHours(0, 0, 0, 0);
    
    // Calculate days since program started (including today)
    const daysDiff = Math.floor((today.getTime() - programStart.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate which week we're in (0-indexed, so week 0 = first week)
    // Week 0: days 0-6, Week 1: days 7-13, etc.
    const currentWeek = Math.floor(daysDiff / 7);
    
    // Calculate the start date of current week (program start + (currentWeek * 7 days))
    const weekStart = new Date(programStart);
    weekStart.setDate(programStart.getDate() + (currentWeek * 7));
    weekStart.setHours(0, 0, 0, 0);
    
    // Calculate the end date of current week (6 days after week start)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return {
      weekStart: formatLocalDate(weekStart),
      weekEnd: formatLocalDate(weekEnd),
      weekEnded: today > weekEnd
    };
  };

  // Load program start date and calculate week dates
  useEffect(() => {
    const loadProgramStart = async () => {
      if (!user) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) return;

        // Get first journal entry date (program start)
        const response = await fetch('/api/journal/first-entry', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // API returns firstEntryDate, not first_entry_date
          const startDate = data.firstEntryDate || data.first_entry_date;
          
          if (startDate) {
            setProgramStartDate(startDate);
            const weekDates = calculateWeekDates(startDate);
            setWeekStartStr(weekDates.weekStart);
            setWeekEndStr(weekDates.weekEnd);
          } else {
            // If no journal entries, use today as start date
            const today = formatLocalDate(new Date());
            setProgramStartDate(today);
            const weekDates = calculateWeekDates(today);
            setWeekStartStr(weekDates.weekStart);
            setWeekEndStr(weekDates.weekEnd);
          }
        }
      } catch (error: any) {
        console.error('Failed to load program start:', error);
        // Fallback to today
        const today = formatLocalDate(new Date());
        setProgramStartDate(today);
        const weekDates = calculateWeekDates(today);
        setWeekStartStr(weekDates.weekStart);
        setWeekEndStr(weekDates.weekEnd);
      }
    };

    loadProgramStart();
  }, [user]);

  // Skip stats fetching - use preloaded data only for instant rendering

  // Load review only when needed - use useMemo for instant display
  // Review loading is kept minimal - only when weekStartStr changes
  useEffect(() => {
    if (!weekStartStr || !user || (currentReview && currentReview.week_start_date === weekStartStr)) {
      return;
    }

    // Quick review fetch with timeout
    const loadReview = async () => {
      setLoadingReview(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) {
          setLoadingReview(false);
          return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        const response = await fetch(`/api/reviews?week_start=${weekStartStr}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal,
        });

        clearTimeout(timeout);
        if (response.ok) {
          const data = await response.json();
          if (data.reviews?.[0]) {
            setCurrentReview(data.reviews[0]);
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') console.error('Review fetch error:', error);
      } finally {
        setLoadingReview(false);
      }
    };

    loadReview();
  }, [user, weekStartStr, currentReview]);

  const handleGoToReview = () => {
    router.push('/dashboard/review');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">
          Progress AI
        </h2>
        <p className="text-gray-400">Performance analytics and insights</p>
      </div>

      {loadingStats ? (
        <div className="text-center py-12">
          <div className="animate-spin text-yellow-400 text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Loading progress data...</p>
        </div>
      ) : (
        <>
          {/* Progress Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6 text-center">
              <h4 className="text-lg font-bold text-white mb-2">Weekly Progress</h4>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats?.weeklyProgress || 0}%</div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats?.weeklyProgress || 0}%` }}
                ></div>
              </div>
            </Card>
            <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6 text-center">
              <h4 className="text-lg font-bold text-white mb-2">Monthly Progress</h4>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats?.monthlyProgress || '0/30'}</div>
              <div className="text-sm text-gray-400">Days Completed</div>
            </Card>
            <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6 text-center">
              <h4 className="text-lg font-bold text-white mb-2">90-Day Progress</h4>
              <div className="text-3xl font-bold text-yellow-400 mb-2">Day {stats?.currentDay || 1}</div>
              <div className="text-sm text-gray-400">of 90 Days</div>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white">Days Completed</h4>
                <Calendar className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats?.daysCompleted || 0}</div>
              <div className="text-sm text-gray-400">Total journal entries with content</div>
            </Card>
            <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white">Current Streak</h4>
                <Flame className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats?.currentStreak || 0} days</div>
              <div className="text-sm text-gray-400">Consecutive days completed</div>
            </Card>
          </div>
        </>
      )}

      {/* Weekly Review Section */}
      {currentReview ? (
        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-500/30 p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Weekly Review
              </h3>
              <div className="text-sm text-gray-400">
                {new Date(weekStartStr).toLocaleDateString()} - {new Date(weekEndStr).toLocaleDateString()}
              </div>
            </div>

            {/* Check if review has any content */}
            {currentReview.wins || currentReview.obstacles || currentReview.lessons || currentReview.next_steps ? (
              <>
                {currentReview.wins && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">🏆 Wins This Week</h4>
                    <p className="text-gray-300 whitespace-pre-wrap bg-black/20 p-4 rounded-lg border border-yellow-500/20">
                      {currentReview.wins}
                    </p>
                  </div>
                )}

                {currentReview.obstacles && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">🚧 Obstacles</h4>
                    <p className="text-gray-300 whitespace-pre-wrap bg-black/20 p-4 rounded-lg border border-yellow-500/20">
                      {currentReview.obstacles}
                    </p>
                  </div>
                )}

                {currentReview.lessons && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">📚 Lessons Learned</h4>
                    <p className="text-gray-300 whitespace-pre-wrap bg-black/20 p-4 rounded-lg border border-yellow-500/20">
                      {currentReview.lessons}
                    </p>
                  </div>
                )}

                {currentReview.next_steps && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">🎯 Next Steps</h4>
                    <p className="text-gray-300 whitespace-pre-wrap bg-black/20 p-4 rounded-lg border border-yellow-500/20">
                      {currentReview.next_steps}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <p className="text-xl font-semibold text-yellow-400 mb-2">
                  Your weekly review is already filled!
                </p>
                <p className="text-gray-400">
                  You've completed your review for this week. You can edit it if needed.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <Button
                onClick={handleGoToReview}
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Review
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-500/30 p-8">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              Weekly Review
            </h3>
            <p className="text-gray-300">
              Reflect on your week, celebrate wins, learn from obstacles, and plan for next week.
            </p>
            <Button
              onClick={handleGoToReview}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mt-6 px-8 py-6 text-lg"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Start Weekly Review
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
});

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('home');
  const [currentDay, setCurrentDay] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Preload all data when dashboard opens
  const [preloadedData, setPreloadedData] = useState<any>({
    stats: null,
    insights: null,
    foundationEntries: null,
    goals: null,
    journalTodayEntry: null,
    journalList: null,
  });
  const [dataPreloaded, setDataPreloaded] = useState(false);

  // Check URL parameter for tab and set it
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      // Map URL parameter to tab ID
      const tabMap: { [key: string]: string } = {
        'stats': 'stats',
        'insights': 'stats',
        'home': 'home',
        'foundation': 'foundation',
        'goals': 'goals',
        'do': 'do',
        'daily': 'do',
        'achieve': 'achieve',
        'progress': 'achieve',
        'plan': 'plan'
      };
      const tabId = tabMap[tabParam] || 'home';
      if (tabId !== activeTab) {
        setActiveTab(tabId);
      }
    }
  }, [searchParams, activeTab]);

  // Redirect to sign-in if not authenticated - MUST happen before any content renders
  useEffect(() => {
    if (!authLoading && !user) {
      // Use window.location for immediate redirect to prevent blank page
      // Preserve the full URL including query parameters
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/auth/signin?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
  }, [user, authLoading]);

  // Show loading screen while auth is being checked (with timeout fallback)
  useEffect(() => {
    // Timeout fallback - if loading takes more than 10 seconds, assume error
    if (authLoading) {
      const timeout = setTimeout(() => {
        console.error('Auth loading timeout - forcing redirect');
        const currentPath = typeof window !== 'undefined' 
          ? window.location.pathname + window.location.search 
          : '/dashboard';
        router.push(`/auth/signin?redirect=${encodeURIComponent(currentPath)}`);
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [authLoading, router]);

  // Preload all data on mount (must be before any conditional returns)
  useEffect(() => {
    const preloadAllData = async () => {
      if (!user) {
        setDataPreloaded(true);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        console.log('🔑 Dashboard: Session check - User:', user?.email, 'Token exists:', !!token);

        if (!token) {
          console.error('❌ Dashboard: No token found');
          setDataPreloaded(true);
          return;
        }

        console.log('🔑 Dashboard: Token found, fetching data for user:', user?.email);

        // Get today's date in local format (YYYY-MM-DD)
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        // Fetch all data in parallel with better error handling
        const [statsRes, insightsRes, foundationRes, goalsRes, journalTodayRes, journalListRes] = await Promise.all([
          fetch('/api/progress/stats', {
            headers: { 'Authorization': `Bearer ${token}` },
          }).catch((err) => {
            console.error('Stats fetch error:', err);
            return { ok: false };
          }),
          fetch('/api/insights', {
            headers: { 'Authorization': `Bearer ${token}` },
          }).catch((err) => {
            console.error('Insights fetch error:', err);
            return { ok: false };
          }),
          fetch('/api/foundation/list', {
            headers: { 'Authorization': `Bearer ${token}` },
          }).catch((err) => {
            console.error('Foundation fetch error:', err);
            return { ok: false };
          }),
          fetch('/api/goals', {
            headers: { 'Authorization': `Bearer ${token}` },
          }).catch((err) => {
            console.error('Goals fetch error:', err);
            return { ok: false };
          }),
          fetch(`/api/journal/entries?date=${todayStr}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }).catch((err) => {
            console.error('Journal today fetch error:', err);
            return { ok: false };
          }),
          fetch('/api/journal/list', {
            headers: { 'Authorization': `Bearer ${token}` },
          }).catch((err) => {
            console.error('Journal list fetch error:', err);
            return { ok: false };
          }),
        ]);

        const newData: any = {
          stats: null,
          insights: null,
          foundationEntries: [],
          goals: [],
          journalTodayEntry: null,
          journalList: [],
        };

        try {
          if (statsRes.ok && statsRes instanceof Response) {
            const statsData = await statsRes.json();
            newData.stats = statsData;
          } else if (statsRes instanceof Response) {
            const errorText = await statsRes.text().catch(() => 'Unknown error');
            // Set default stats so UI can render
            newData.stats = {
              weeklyProgress: 0,
              monthlyProgress: '0/30',
              daysCompleted: 0,
              progress90Day: 0,
              currentDay: 1,
              currentStreak: 0,
              goalsCompleted: 0,
              totalGoals: 0,
              goalsProgress: 0
            };
          }
        } catch (err) {
          // Silent fail
          // Set default stats on error
          newData.stats = {
            weeklyProgress: 0,
            monthlyProgress: '0/30',
            daysCompleted: 0,
            progress90Day: 0,
            currentDay: 1,
            currentStreak: 0,
            goalsCompleted: 0,
            totalGoals: 0,
            goalsProgress: 0
          };
        }

        try {
          if (insightsRes.ok && insightsRes instanceof Response) {
            const insightsData = await insightsRes.json();
            newData.insights = insightsData;
          } else if (insightsRes instanceof Response) {
            const errorText = await insightsRes.text().catch(() => 'Unknown error');
            // Set default insights so UI can render
            newData.insights = {
              daysCompleted: 0,
              currentStreak: 0,
              totalGoals: 0,
              goalsCompleted: 0,
              goalsProgress: 0,
              momentumScore: 0,
              trend: 0,
              trendDirection: 'stable'
            };
          }
        } catch (err) {
          // Silent fail
          // Set default insights on error
          newData.insights = {
            daysCompleted: 0,
            currentStreak: 0,
            totalGoals: 0,
            goalsCompleted: 0,
            goalsProgress: 0,
            momentumScore: 0,
            trend: 0,
            trendDirection: 'stable'
          };
        }

        try {
          if (foundationRes.ok && foundationRes instanceof Response) {
            const foundationData = await foundationRes.json();
            newData.foundationEntries = foundationData.entries || [];
          } else if (foundationRes instanceof Response) {
            // Silent fail
          }
        } catch (err) {
          // Silent fail
        }

        try {
          if (goalsRes.ok && goalsRes instanceof Response) {
            const goalsData = await goalsRes.json();
            newData.goals = goalsData.goals || [];
          } else if (goalsRes instanceof Response) {
            // Silent fail
          }
        } catch (err) {
          // Silent fail
        }

        try {
          if (journalTodayRes.ok && journalTodayRes instanceof Response) {
            const journalData = await journalTodayRes.json();
            newData.journalTodayEntry = journalData.entry;
            console.log('Journal today entry loaded:', newData.journalTodayEntry ? 'Yes' : 'No');
          } else if (journalTodayRes instanceof Response) {
            console.warn('Journal today response not OK:', journalTodayRes.status);
          }
        } catch (err) {
          console.error('Error parsing journal today:', err);
        }

        try {
          if (journalListRes.ok && journalListRes instanceof Response) {
            const journalListData = await journalListRes.json();
            newData.journalList = journalListData.entries || [];
            console.log('Journal list loaded:', newData.journalList.length);
          } else if (journalListRes instanceof Response) {
            console.warn('Journal list response not OK:', journalListRes.status);
          }
        } catch (err) {
          console.error('Error parsing journal list:', err);
        }

        console.log('✅ Final preloaded data:', newData);
        console.log('✅ Setting dataPreloaded to true');
        // Always set data (even if empty) so UI can render
        setPreloadedData(newData);
        setDataPreloaded(true);
        console.log('✅ Data preloaded successfully');
      } catch (error) {
        console.error('Failed to preload data:', error);
        // Set empty data structure so UI can render
        setPreloadedData({
          stats: null,
          insights: null,
          foundationEntries: [],
          goals: [],
          journalTodayEntry: null,
          journalList: [],
        });
        setDataPreloaded(true);
      }
    };

    preloadAllData();
  }, [user]);

  // Early return - don't render anything if not authenticated or still loading
  // MUST be after all hooks are declared
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const navigationItems = [
    { id: 'home', label: 'AI Dashboard', icon: Brain, badge: null, description: 'Intelligent overview' },
    { id: 'foundation', label: 'Foundation', icon: Building2, badge: null, description: 'Core values & vision' },
    { id: 'goals', label: 'Smart Goals', icon: Target, badge: '4', description: 'AI-powered planning' },
    { id: 'do', label: 'Daily Flow', icon: BookOpen, badge: null, description: 'Execution tracking' },
    { id: 'achieve', label: 'Progress AI', icon: Trophy, badge: null, description: 'Performance analytics' },
    { id: 'stats', label: 'Insights', icon: BarChart3, badge: 'NEW', description: 'Advanced metrics' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null, description: 'Preferences' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Modern Sidebar - Mobile Responsive */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'w-20' : 'w-80'} 
        transition-all duration-300 
        bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl 
        border-r border-yellow-500/20 
        flex flex-col
        lg:flex
      `}>
        {/* Sidebar Header */}
        <div className="p-4 sm:p-6 border-b border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Brain className="w-5 h-5 text-black" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                    Leverage AI™
                  </h1>
                  <p className="text-xs text-gray-400">Digital Command Center</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
              >
                <X className="w-5 h-5" />
            </Button>
            </div>
          </div>
        </div>

        {/* AI Status Card */}
        {!sidebarCollapsed && (
          <div className="p-3 sm:p-4">
            <Card className="bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border border-yellow-500/30 p-3 sm:p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">AI Score</span>
                    <span className="text-lg font-bold text-yellow-400">--</span>
                  </div>
                  <p className="text-xs text-gray-400">Momentum: --</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false); // Close mobile menu on click
              }}
              className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all group touch-manipulation min-h-[44px] ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 hover:shadow-lg active:bg-white/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activeTab === item.id
                  ? 'bg-black/20'
                  : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <item.icon className="w-4 h-4" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        activeTab === item.id
                          ? 'bg-black/30 text-black'
                          : 'bg-yellow-500 text-black'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${
                    activeTab === item.id ? 'text-black/70' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              )}
            </button>
          ))}
          
          {/* Journal Link - Opens Printable Journal in New Tab */}
          <div className="space-y-2">
            <Link
              href="/journal"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all group border-2 touch-manipulation min-h-[44px] ${
                'border-yellow-500/50 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 hover:shadow-lg active:bg-yellow-500/20'
              }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-yellow-500/20 group-hover:bg-yellow-500/30">
                <BookOpen className="w-4 h-4" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Printable Journal</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      New Tab
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    View & print your journal
                  </p>
                </div>
              )}
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-3 sm:p-4 border-t border-yellow-500/20">
          <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {authLoading ? 'Loading...' : (user?.name || user?.email?.split('@')[0] || 'User')}
                </p>
                <p className="text-xs text-gray-400">
                  {authLoading ? 'Signing in...' : (user?.email || '')}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut();
                router.push('/auth/signin');
              }}
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header - Mobile Responsive */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 p-2 touch-manipulation min-w-[44px] min-h-[44px]"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                {navigationItems.find(item => item.id === activeTab)?.description || 'Welcome back'}
              </p>
            </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
              <div className="relative hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 w-32 md:w-48 text-sm"
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 p-2 touch-manipulation min-w-[44px] min-h-[44px]"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-green-400/10 border border-green-500/30 rounded-xl px-3 py-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Live</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content - Mobile Responsive */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Tab Content - Memoized for instant switching */}
          {activeTab === 'home' && <HomeTab preloadedData={preloadedData} />}
          {activeTab === 'foundation' && <FoundationTab preloadedData={preloadedData} />}
          {activeTab === 'goals' && <GoalsTab preloadedData={preloadedData} />}
          {activeTab === 'do' && <DailyFlowTab preloadedData={preloadedData} />}
          {activeTab === 'achieve' && <ProgressAITab preloadedData={preloadedData} />}
          {activeTab === 'stats' && <InsightsTab preloadedData={preloadedData} />}
          {activeTab === 'plan' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-1 sm:mb-2">Goal Timeline Framework</h2>
                <p className="text-xs sm:text-sm text-gray-400">Strategic goal planning with AI-powered insights</p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold shadow-lg w-full sm:w-auto touch-manipulation min-h-[44px] text-sm sm:text-base">
                <Plus className="w-4 h-4 mr-2" />
                Create New Goal
              </Button>
            </div>

            {/* Create New Goal Interface */}
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Create New Goal</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Goal Title</label>
                    <input
                      data-testid="goal-title"
                      className="w-full bg-black/20 border border-yellow-500/30 rounded-lg p-2.5 sm:p-3 text-white text-sm sm:text-base focus:outline-none focus:border-yellow-500 touch-manipulation min-h-[44px]"
                      placeholder="Enter your goal title..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">What (Specific Outcome)</label>
                    <textarea
                      data-testid="goal-what"
                      className="w-full h-20 sm:h-24 bg-black/20 border border-yellow-500/30 rounded-lg p-2.5 sm:p-3 text-white text-sm sm:text-base resize-none focus:outline-none focus:border-yellow-500 touch-manipulation"
                      placeholder="What exactly do you want to achieve?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Why (Your Motivation)</label>
                    <textarea
                      data-testid="goal-why"
                      className="w-full h-20 sm:h-24 bg-black/20 border border-yellow-500/30 rounded-lg p-2.5 sm:p-3 text-white text-sm sm:text-base resize-none focus:outline-none focus:border-yellow-500 touch-manipulation"
                      placeholder="Why is this goal important to you?"
                    />
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">When (Timeline)</label>
                    <input
                      data-testid="goal-when"
                      type="date"
                      className="w-full bg-black/20 border border-yellow-500/30 rounded-lg p-2.5 sm:p-3 text-white text-sm sm:text-base focus:outline-none focus:border-yellow-500 touch-manipulation min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">How (Action Steps)</label>
                    <textarea
                      data-testid="goal-how"
                      className="w-full h-20 sm:h-24 bg-black/20 border border-yellow-500/30 rounded-lg p-2.5 sm:p-3 text-white text-sm sm:text-base resize-none focus:outline-none focus:border-yellow-500 touch-manipulation"
                      placeholder="How will you achieve this goal?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Reward</label>
                    <input
                      data-testid="goal-reward"
                      className="w-full bg-black/20 border border-yellow-500/30 rounded-lg p-2.5 sm:p-3 text-white text-sm sm:text-base focus:outline-none focus:border-yellow-500 touch-manipulation min-h-[44px]"
                      placeholder="How will you celebrate achieving this?"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Key Milestones</label>
                <div className="space-y-2">
                  {[1, 2, 3].map((milestone) => (
                    <div key={milestone} className="flex items-center space-x-2 sm:space-x-3">
                      <input type="checkbox" className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 touch-manipulation min-w-[44px] min-h-[44px] flex-shrink-0" />
                      <input
                        data-testid={`milestone-${milestone}`}
                        className="flex-1 bg-black/20 border border-yellow-500/30 rounded p-2 sm:p-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 touch-manipulation min-h-[44px]"
                        placeholder={`Milestone ${milestone}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex justify-end">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full sm:w-auto touch-manipulation min-h-[44px] text-sm sm:text-base">
                  <Save className="w-4 h-4 mr-2" />
                  Save Goal
                </Button>
              </div>
            </Card>

            {/* Goal Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { category: 'Short-Term', color: 'green', goals: [
                  { title: 'Complete Morning Routine', progress: 85, due: 'This Week', description: 'Establish consistent 6 AM wake-up and exercise routine' },
                  { title: 'Read 2 Books', progress: 60, due: 'End of Month', description: 'Focus on personal development and leadership books' }
                ]},
                { category: 'Medium-Term', color: 'blue', goals: [
                  { title: 'Launch Side Business', progress: 40, due: '3 Months', description: 'Build and launch digital product with $5K revenue goal' },
                  { title: 'Fitness Transformation', progress: 70, due: '6 Months', description: 'Lose 20 pounds and build lean muscle mass' }
                ]},
                { category: 'Long-Term', color: 'purple', goals: [
                  { title: 'Career Advancement', progress: 25, due: '1 Year', description: 'Secure promotion to senior leadership position' },
                  { title: 'Financial Freedom', progress: 15, due: '5 Years', description: 'Build $100K investment portfolio and passive income' }
                ]}
              ].map(({ category, color, goals }) => (
                <Card key={category} className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/5 border border-${color}-500/30 p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{category} Goals</h3>
                    <div className={`w-3 h-3 bg-${color}-400 rounded-full`}></div>
                  </div>
                  <div className="space-y-4">
                    {goals.map((goal, index) => (
                      <div key={index} className="bg-black/20 p-4 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{goal.title}</h4>
                          <CheckCircle className={`w-4 h-4 text-${color}-400`} />
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{goal.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-yellow-400">Due: {goal.due}</span>
                            <span className={`text-${color}-400 font-medium`}>{goal.progress}% Complete</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r from-${color}-500 to-${color}-400 h-2 rounded-full transition-all`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Account Settings</h2>
              <p className="text-gray-400">Manage your profile and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Profile Info */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      data-testid="profile-name"
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      defaultValue={user?.name || user?.email?.split('@')[0] || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      data-testid="profile-email"
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      defaultValue={user?.email || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                    <input
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-gray-400"
                      value={user?.id || ''}
                      disabled
                    />
                  </div>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Save className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </div>
              </Card>

              {/* Security */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Security</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      data-testid="current-password"
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      data-testid="new-password"
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      data-testid="confirm-password"
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Change Password
                  </Button>
                </div>
              </Card>

              {/* QR Code Connection */}
              <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-600/30 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Connect Physical Journal</h3>
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-neutral-800 rounded-lg mx-auto flex items-center justify-center">
                    <div className="text-6xl">📱</div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Scan the QR code in your physical Leverage Journal™ to sync your progress
                  </p>
                  <Button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={() => window.location.href = '/connect'}
                  >
                    Connect QR Code
                  </Button>
                </div>
              </Card>

              {/* Profile Photo Upload */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Profile Photo</h3>
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center">
                    <User className="w-12 h-12 text-black" />
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      data-testid="profile-photo-upload"
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Upload Photo
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">JPG, PNG or GIF (max 5MB)</p>
                </div>
              </Card>

              {/* Account Status */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Account Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Account Type</span>
                    <span className="text-yellow-400 font-semibold">Premium</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Member Since</span>
                    <span className="text-white">January 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Journal Connected</span>
                    <span className="text-green-400">✓ Synced</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Data Backup</span>
                    <span className="text-green-400">✓ Enabled</span>
                  </div>
                </div>
              </Card>

              {/* Logout */}
              <Card className="bg-red-900/20 border border-red-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Account Actions</h3>
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm mb-4">
                    Sign out of your account. You'll need to sign in again to access your dashboard.
                  </p>
                  <Button 
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={async () => {
                      await signOut();
                      router.push('/auth/signin');
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
        </main>
      </div>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}
