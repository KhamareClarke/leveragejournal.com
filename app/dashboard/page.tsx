'use client';

import { useState, useEffect } from 'react';
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

// Daily Flow Tab Component
function DailyFlowTab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  const router = useRouter();
  // Use local date to avoid timezone issues (same as daily journal page)
  const today = typeof window !== 'undefined' ? (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })() : '';
  
  // Initialize with preloaded data
  const [todayEntry, setTodayEntry] = useState<any>(preloadedData?.journalTodayEntry || null);
  const [streak, setStreak] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Use preloaded data only on initial mount
  useEffect(() => {
    if (preloadedData?.journalTodayEntry && !todayEntry) {
      const entry = preloadedData.journalTodayEntry;
      // Check if entry has actual content
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
      if (hasContent) {
        setTodayEntry(entry);
        if (entry.streak) {
          setStreak(entry.streak);
        }
      }
    }
    if (preloadedData?.journalList && preloadedData.journalList.length > 0 && streak === 0) {
      const todayEntryData = preloadedData.journalList.find((e: any) => e.entry_date === today);
      if (todayEntryData && todayEntryData.streak) {
        setStreak(todayEntryData.streak);
      } else if (preloadedData.journalList[0]?.streak) {
        setStreak(preloadedData.journalList[0].streak);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  useEffect(() => {
    // Skip if we already have data
    if (todayEntry || streak > 0) {
      return;
    }

    const checkTodayEntry = async () => {
      if (!user || !today) {
        return;
      }
      
      // Don't set loading - show content immediately, load in background
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          return;
        }

        // Make both API calls in parallel for faster loading (with shorter timeout)
        const controller1 = new AbortController();
        const controller2 = new AbortController();
        const timeout1 = setTimeout(() => controller1.abort(), 5000); // 5 second timeout
        const timeout2 = setTimeout(() => controller2.abort(), 5000);

        const fetchPromises = [
          fetch(`/api/journal/entries?date=${today}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            signal: controller1.signal,
          }).catch(err => {
            if (err.name !== 'AbortError') console.error('Entry fetch error:', err);
            return { ok: false, json: async () => ({ entry: null }) };
          }),
          fetch('/api/journal/list', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            signal: controller2.signal,
          }).catch(err => {
            if (err.name !== 'AbortError') console.error('List fetch error:', err);
            return { ok: false, json: async () => ({ entries: [] }) };
          })
        ];

        const [entryResponse, listResponse] = await Promise.all(fetchPromises);

        clearTimeout(timeout1);
        clearTimeout(timeout2);

        // Process today's entry
        if (entryResponse.ok) {
          const data = await entryResponse.json();
          if (data.entry) {
            // Check if entry has actual content (same logic as daily journal page)
            const hasContent = !!(
              data.entry.gratitude?.trim() ||
              data.entry.priority_1?.trim() ||
              data.entry.priority_2?.trim() ||
              data.entry.priority_3?.trim() ||
              (data.entry.tasks && Array.isArray(data.entry.tasks) && data.entry.tasks.length > 0 && 
               data.entry.tasks.some((t: any) => t && t.text && t.text.trim().length > 0)) ||
              data.entry.reflection?.trim() ||
              data.entry.mood?.trim()
            );
            if (hasContent) {
              setTodayEntry(data.entry);
              // Set streak from today's entry if available
              if (data.entry.streak) {
                setStreak(data.entry.streak);
              }
            } else {
              // Clear todayEntry if no content
              setTodayEntry(null);
            }
          } else {
            setTodayEntry(null);
          }
        } else {
          setTodayEntry(null);
        }

        // Process entries list for streak
        if (listResponse.ok) {
          const listData = await listResponse.json();
          if (listData.entries && listData.entries.length > 0) {
            // Try to get streak from today's entry first
            const todayEntryData = listData.entries.find((e: any) => e.entry_date === today);
            if (todayEntryData && todayEntryData.streak) {
              setStreak(todayEntryData.streak);
            } else {
              // Otherwise get from the most recent entry
              const mostRecent = listData.entries[0];
              if (mostRecent && mostRecent.streak) {
                setStreak(mostRecent.streak);
              } else {
                // Calculate streak from completed entries (same logic as daily journal page)
                const completedEntries = listData.entries.filter((e: any) => {
                  const hasContent = !!(
                    e.gratitude?.trim() ||
                    e.priority_1?.trim() ||
                    e.priority_2?.trim() ||
                    e.priority_3?.trim() ||
                    (e.tasks && Array.isArray(e.tasks) && e.tasks.length > 0 && 
                     e.tasks.some((t: any) => t && t.text && t.text.trim().length > 0)) ||
                    e.reflection?.trim() ||
                    e.mood?.trim()
                  );
                  return hasContent;
                });
                
                // Sort by date descending
                completedEntries.sort((a: any, b: any) => 
                  new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
                );
                
                // Calculate consecutive days from today backwards
                let calculatedStreak = 0;
                const todayDate = new Date(today);
                for (let i = 0; i < completedEntries.length; i++) {
                  const entryDate = new Date(completedEntries[i].entry_date);
                  const diffDays = Math.floor((todayDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
                  
                  if (diffDays === i) {
                    calculatedStreak++;
                  } else {
                    break;
                  }
                }
                
                setStreak(calculatedStreak);
              }
            }
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to check today entry:', error);
        }
        // Don't block UI on error - just continue with default state
      }
    };

    checkTodayEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, today, refreshKey]); // Keep independent

  const handleGoToJournal = () => {
    router.push('/dashboard/daily');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">Tactical Execution</h2>
        <p className="text-gray-400">Digital version of your 180 daily pages - 90-day transformation</p>
      </div>

      {todayEntry ? (
        // Entry already filled
        <Card className="bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/30 rounded-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">You are already done! 🎉</h3>
          <p className="text-gray-300 mb-6">Today's journal entry has been completed.</p>
          <div className="flex items-center justify-center gap-2 text-yellow-400 mb-6">
            <Flame className="w-6 h-6" />
            <span className="text-xl font-bold">Streak: {streak} days 🔥</span>
          </div>
          <Link href="/dashboard/daily">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <BookOpen className="w-4 h-4 mr-2" />
              View All Entries
            </Button>
          </Link>
        </Card>
      ) : (
        // Entry not filled - show benefits and button
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-yellow-400" />
              Benefits of Daily Journaling
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <Brain className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Mental Clarity</h4>
                  <p className="text-gray-400 text-sm">Organize your thoughts and reduce mental clutter</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Goal Achievement</h4>
                  <p className="text-gray-400 text-sm">Track progress and stay focused on priorities</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Heart className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Gratitude Practice</h4>
                  <p className="text-gray-400 text-sm">Cultivate positivity and appreciation daily</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Personal Growth</h4>
                  <p className="text-gray-400 text-sm">Reflect on experiences and learn from each day</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <Button 
              onClick={handleGoToJournal}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-6 text-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Start Today's Journal Entry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('home');
  const [tabKey, setTabKey] = useState(0); // Force remount on tab change
  const [currentDay, setCurrentDay] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  
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

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?redirect=/dashboard');
    }
  }, [user, authLoading, router]);

  // Show loading screen while auth is being checked (with timeout fallback)
  useEffect(() => {
    // Timeout fallback - if loading takes more than 10 seconds, assume error
    if (authLoading) {
      const timeout = setTimeout(() => {
        console.error('Auth loading timeout - forcing redirect');
        router.push('/auth/signin?redirect=/dashboard');
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
            console.log('✅ Stats loaded:', statsData);
          } else if (statsRes instanceof Response) {
            const errorText = await statsRes.text().catch(() => 'Unknown error');
            console.error('❌ Stats response not OK:', statsRes.status, errorText);
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
          console.error('❌ Error parsing stats:', err);
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
            console.log('✅ Insights loaded:', insightsData);
          } else if (insightsRes instanceof Response) {
            const errorText = await insightsRes.text().catch(() => 'Unknown error');
            console.error('❌ Insights response not OK:', insightsRes.status, errorText);
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
          console.error('❌ Error parsing insights:', err);
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
            console.log('Foundation entries loaded:', newData.foundationEntries.length);
          } else if (foundationRes instanceof Response) {
            console.warn('Foundation response not OK:', foundationRes.status);
          }
        } catch (err) {
          console.error('Error parsing foundation:', err);
        }

        try {
          if (goalsRes.ok && goalsRes instanceof Response) {
            const goalsData = await goalsRes.json();
            newData.goals = goalsData.goals || [];
            console.log('Goals loaded:', newData.goals.length);
          } else if (goalsRes instanceof Response) {
            console.warn('Goals response not OK:', goalsRes.status);
          }
        } catch (err) {
          console.error('Error parsing goals:', err);
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

  const navigationItems = [
    { id: 'home', label: 'AI Dashboard', icon: Brain, badge: null, description: 'Intelligent overview' },
    { id: 'foundation', label: 'Foundation', icon: Building2, badge: null, description: 'Core values & vision' },
    { id: 'goals', label: 'Smart Goals', icon: Target, badge: '4', description: 'AI-powered planning' },
    { id: 'do', label: 'Daily Flow', icon: BookOpen, badge: null, description: 'Execution tracking' },
    { id: 'achieve', label: 'Progress AI', icon: Trophy, badge: null, description: 'Performance analytics' },
    { id: 'stats', label: 'Insights', icon: BarChart3, badge: 'NEW', description: 'Advanced metrics' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null, description: 'Preferences' }
  ];

// Home Tab Component
function HomeTab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(preloadedData?.stats || null);
  const [insights, setInsights] = useState<any>(preloadedData?.insights || null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Use preloaded data when available
  useEffect(() => {
    console.log('HomeTab: preloadedData changed', preloadedData);
    // Use preloaded data if available (even if null, it means data was loaded)
    if (preloadedData !== undefined) {
      if (preloadedData?.stats !== undefined) {
        setStats(preloadedData.stats);
        console.log('HomeTab: Set stats', preloadedData.stats);
      }
      if (preloadedData?.insights !== undefined) {
        setInsights(preloadedData.insights);
        console.log('HomeTab: Set insights', preloadedData.insights);
      }
    }
  }, [preloadedData]);

  useEffect(() => {
    // Only fetch if no preloaded data and no existing data
    if (stats !== null || insights !== null) {
      return;
    }

    const loadData = async () => {
      if (!user) {
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const [statsResponse, insightsResponse] = await Promise.all([
          fetch('/api/progress/stats', {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal,
          }).catch(() => ({ ok: false })),
          fetch('/api/insights', {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal,
          }).catch(() => ({ ok: false }))
        ]);

        clearTimeout(timeoutId);

        if (statsResponse.ok && statsResponse instanceof Response) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        if (insightsResponse.ok && insightsResponse instanceof Response) {
          const insightsData = await insightsResponse.json();
          setInsights(insightsData);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load home data:', error);
        }
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey]); // Removed preloadedData from deps to prevent re-fetching

  const getMomentumLabel = (score: number) => {
    if (score >= 80) return 'Elite Performance';
    if (score >= 60) return 'High Performance';
    if (score >= 40) return 'Good Progress';
    return 'Getting Started';
  };

  const totalGoals = insights?.totalGoals || 0;
  const activeGoals = totalGoals - (insights?.goalsCompleted || 0);
  const daysCompleted = stats?.daysCompleted || insights?.daysCompleted || 0;
  const currentStreak = stats?.currentStreak || insights?.currentStreak || 0;
  const aiScore = insights?.momentumScore || 0;
  const weeklyProgress = stats?.weeklyProgress || 0;
  const goalsProgress = insights?.goalsProgress || 0;

  // Always show content - even with zero values
  console.log('HomeTab rendering with:', { stats, insights, daysCompleted, currentStreak });

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 p-6 group hover:shadow-xl hover:shadow-blue-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{activeGoals}</div>
          <div className="text-sm text-gray-400 mb-2">Active Goals</div>
          <div className="text-xs text-green-400">{insights?.goalsCompleted || 0} completed</div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 p-6 group hover:shadow-xl hover:shadow-green-500/20 transition-all">
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

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 p-6 group hover:shadow-xl hover:shadow-purple-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{aiScore}</div>
          <div className="text-sm text-gray-400 mb-2">AI Score</div>
          <div className="text-xs text-yellow-400">{getMomentumLabel(aiScore)}</div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 p-6 group hover:shadow-xl hover:shadow-yellow-500/20 transition-all">
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
}

// Foundation Tab Component
function FoundationTab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  const router = useRouter();
  const [entriesList, setEntriesList] = useState<any[]>(preloadedData?.foundationEntries || []);
  // If preloadedData exists (even if empty), data is loaded
  const [dataLoaded, setDataLoaded] = useState(preloadedData?.foundationEntries !== undefined);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
}


// Goals Tab Component
function GoalsTab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  const router = useRouter();
  const [goalsList, setGoalsList] = useState<any[]>(preloadedData?.goals || []);
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

  // Use preloaded data only on initial mount
  useEffect(() => {
    if (preloadedData?.goals && goalsList.length === 0) {
      setGoalsList(preloadedData.goals);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
}


// Insights Tab Component
function InsightsTab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<any>(preloadedData?.insights || null);
  // If preloadedData exists (even if insights is null), data loading is complete
  const [loading, setLoading] = useState(preloadedData?.insights === undefined);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Use preloaded data when available
  useEffect(() => {
    if (preloadedData?.insights !== undefined) {
      setInsights(preloadedData.insights);
      setLoading(false);
    }
  }, [preloadedData]);

  useEffect(() => {
    // Skip if data is already loaded (even if insights is null)
    if (!loading) {
      return;
    }

    const loadInsights = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          setLoading(false);
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('/api/insights', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setInsights(data);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Failed to load insights' }));
          setError(errorData.error || 'Failed to load insights');
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setError('Failed to load insights. Please try again.');
          console.error('Failed to load insights:', error);
        } else {
          setError('Request timed out. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey]); // Keep independent

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full"
                  style={{ width: `${insights?.goalsProgress || 0}%` }}
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
}

// Progress AI Tab Component
function ProgressAITab({ preloadedData }: { preloadedData?: any }) {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(preloadedData?.stats || null);
  const [currentReview, setCurrentReview] = useState<any>(null);
  const [loadingReview, setLoadingReview] = useState(false); // Start with false - don't block UI
  // If preloadedData exists (even if stats is null), data loading is complete
  const [loadingStats, setLoadingStats] = useState(preloadedData?.stats === undefined);
  const [programStartDate, setProgramStartDate] = useState<string | null>(null);
  const [weekStartStr, setWeekStartStr] = useState<string>('');
  const [weekEndStr, setWeekEndStr] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Use preloaded data when available
  useEffect(() => {
    if (preloadedData?.stats !== undefined) {
      setStats(preloadedData.stats);
      setLoadingStats(false);
    }
  }, [preloadedData]);

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
  }, [user, refreshKey]);

  // Load progress stats
  useEffect(() => {
    // Skip if data is already loaded (even if stats is null)
    if (!loadingStats) {
      return;
    }

    const loadData = async () => {
      if (!user) {
        setLoadingStats(false);
        return;
      }

      // Only set loading if we don't have stats
      if (!stats) {
        setLoadingStats(true);
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          setLoadingStats(false);
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced to 3 seconds

        // Load stats (this will calculate week based on program start)
        const statsResponse = await fetch('/api/progress/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }


        clearTimeout(timeoutId);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load data:', error);
        }
      } finally {
        setLoadingStats(false);
        setLoadingReview(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey, stats]); // Keep independent - removed weekStartStr to separate review loading

  // Load current week's review (separate effect that runs when weekStartStr is available)
  useEffect(() => {
    if (!weekStartStr || !user) {
      return;
    }

    // Don't reload if we already have a review for this week
    if (currentReview && currentReview.week_start_date === weekStartStr) {
      return;
    }

    const loadReview = async () => {
      setLoadingReview(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          setLoadingReview(false);
          return;
        }

        const reviewController = new AbortController();
        const reviewTimeoutId = setTimeout(() => reviewController.abort(), 3000); // 3 second timeout

        try {
          // First try to load by week_start_date
          let reviewResponse = await fetch(`/api/reviews?week_start=${weekStartStr}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            signal: reviewController.signal,
          });

          clearTimeout(reviewTimeoutId);

          if (reviewResponse.ok) {
            const reviewData = await reviewResponse.json();
            if (reviewData.reviews && reviewData.reviews.length > 0) {
              const review = reviewData.reviews[0];
              console.log('📊 Review loaded by week_start_date:', { 
                week_start_date: review.week_start_date, 
                week_number: review.week_number,
                hasWins: !!review.wins,
                hasLessons: !!review.lessons,
                hasNextSteps: !!review.next_steps
              });
              setCurrentReview(review);
              setLoadingReview(false);
              return;
            }
          }

          // If no review found by week_start_date, try loading all reviews and find by week_number
          console.log('📊 No review found by week_start_date, trying to load all reviews...');
          const allReviewsResponse = await fetch(`/api/reviews`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            signal: reviewController.signal,
          });

          if (allReviewsResponse.ok) {
            const allReviewsData = await allReviewsResponse.json();
            if (allReviewsData.reviews && allReviewsData.reviews.length > 0) {
              // Calculate current week number based on program start
              const programStart = programStartDate ? new Date(programStartDate) : null;
              if (programStart) {
                const weekStart = new Date(weekStartStr);
                const daysDiff = Math.floor((weekStart.getTime() - programStart.getTime()) / (1000 * 60 * 60 * 24));
                const currentWeekNumber = Math.floor(daysDiff / 7) + 1;
                
                // Find review by week_number
                const review = allReviewsData.reviews.find((r: any) => r.week_number === currentWeekNumber);
                if (review) {
                  console.log('📊 Review found by week_number:', { 
                    week_number: review.week_number,
                    week_start_date: review.week_start_date,
                    hasWins: !!review.wins,
                    hasLessons: !!review.lessons,
                    hasNextSteps: !!review.next_steps
                  });
                  setCurrentReview(review);
                  setLoadingReview(false);
                  return;
                }
              }
              
              // If still no match, use the most recent review
              const mostRecentReview = allReviewsData.reviews[0];
              console.log('📊 Using most recent review:', { 
                week_number: mostRecentReview.week_number,
                week_start_date: mostRecentReview.week_start_date
              });
              setCurrentReview(mostRecentReview);
            } else {
              console.log('📊 No reviews found in database');
              setCurrentReview(null);
            }
          } else {
            console.error('Failed to load all reviews:', allReviewsResponse.status);
            setCurrentReview(null);
          }
        } catch (reviewError: any) {
          clearTimeout(reviewTimeoutId);
          if (reviewError.name !== 'AbortError') {
            console.error('Failed to load review:', reviewError);
          }
          setCurrentReview(null);
        } finally {
          setLoadingReview(false);
        }
      } catch (error: any) {
        console.error('Failed to load review:', error);
        setLoadingReview(false);
        setCurrentReview(null);
      }
    };

    loadReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, weekStartStr, programStartDate, refreshKey]); // Run when weekStartStr or programStartDate changes

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white flex">
      {/* Modern Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} transition-all duration-300 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl border-r border-yellow-500/20 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-yellow-500/20">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* AI Status Card */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <Card className="bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border border-yellow-500/30 p-4">
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
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setTabKey(prev => prev + 1); // Force remount by incrementing key
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 hover:shadow-lg'
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
          
          {/* Journal Link - Opens Printable Journal */}
          <Link
            href="/journal"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group border-2 ${
              'border-yellow-500/50 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 hover:shadow-lg'
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
                    PDF
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  View & print your journal
                </p>
              </div>
            )}
          </Link>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-yellow-500/20">
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
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-gray-400">
                {navigationItems.find(item => item.id === activeTab)?.description || 'Welcome back'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 focus:bg-white/10"
                />
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-green-400/10 border border-green-500/30 rounded-xl px-3 py-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Live</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Tab Content */}
          {activeTab === 'home' && <HomeTab key={`home-${tabKey}`} preloadedData={preloadedData} />}
          {activeTab === 'foundation' && <FoundationTab key={`foundation-${tabKey}`} preloadedData={preloadedData} />}
          {activeTab === 'goals' && <GoalsTab key={`goals-${tabKey}`} preloadedData={preloadedData} />}
          {activeTab === 'do' && <DailyFlowTab key={`daily-${tabKey}`} preloadedData={preloadedData} />}
          {activeTab === 'achieve' && <ProgressAITab key={`progress-${tabKey}`} preloadedData={preloadedData} />}
          {activeTab === 'stats' && <InsightsTab key={`insights-${tabKey}`} preloadedData={preloadedData} />}
          {activeTab === 'plan' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">Goal Timeline Framework</h2>
                <p className="text-gray-400">Strategic goal planning with AI-powered insights</p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create New Goal
              </Button>
            </div>

            {/* Create New Goal Interface */}
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Create New Goal</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Goal Title</label>
                    <input
                      data-testid="goal-title"
                      className="w-full bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Enter your goal title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">What (Specific Outcome)</label>
                    <textarea
                      data-testid="goal-what"
                      className="w-full h-20 bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-yellow-500"
                      placeholder="What exactly do you want to achieve?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Why (Your Motivation)</label>
                    <textarea
                      data-testid="goal-why"
                      className="w-full h-20 bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-yellow-500"
                      placeholder="Why is this goal important to you?"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">When (Timeline)</label>
                    <input
                      data-testid="goal-when"
                      type="date"
                      className="w-full bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">How (Action Steps)</label>
                    <textarea
                      data-testid="goal-how"
                      className="w-full h-20 bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-yellow-500"
                      placeholder="How will you achieve this goal?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Reward</label>
                    <input
                      data-testid="goal-reward"
                      className="w-full bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="How will you celebrate achieving this?"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Key Milestones</label>
                <div className="space-y-2">
                  {[1, 2, 3].map((milestone) => (
                    <div key={milestone} className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-yellow-500" />
                      <input
                        data-testid={`milestone-${milestone}`}
                        className="flex-1 bg-black/20 border border-yellow-500/30 rounded p-2 text-white text-sm focus:outline-none focus:border-yellow-500"
                        placeholder={`Milestone ${milestone}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                  <Save className="w-4 h-4 mr-2" />
                  Save Goal
                </Button>
              </div>
            </Card>

            {/* Goal Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
