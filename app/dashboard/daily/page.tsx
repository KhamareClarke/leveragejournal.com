'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  BookOpen, 
  ArrowLeft, 
  Save, 
  Heart,
  Target,
  CheckCircle,
  Brain,
  Smile,
  Flame,
  Calendar,
  Plus,
  Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface JournalEntry {
  id?: string;
  entry_date: string;
  day_number?: number;
  gratitude: string;
  priority_1: string;
  priority_2: string;
  priority_3: string;
  tasks: { id: string; text: string; completed: boolean }[];
  reflection: string;
  mood: string;
  completed: boolean;
  streak?: number;
}

const MOODS = [
  '😊 Happy',
  '🙏 Grateful',
  '🎯 Focused',
  '💪 Motivated',
  '😌 Peaceful',
  '🔥 Energized',
  '💡 Inspired',
  '🌟 Excited'
];

export default function DailyJournal() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [entriesList, setEntriesList] = useState<any[]>([]);
  
  // Get today's date (client-side only) - use local date to avoid timezone issues
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
  
  const [entry, setEntry] = useState<JournalEntry>({
    entry_date: '',
    gratitude: '',
    priority_1: '',
    priority_2: '',
    priority_3: '',
    tasks: [],
    reflection: '',
    mood: '',
    completed: false,
  });
  
  // Update entry date when today is set
  useEffect(() => {
    if (today) {
      setEntry(prev => ({ ...prev, entry_date: today }));
    }
  }, [today]);

  // Calculate day number: Day 1 = today
  const calculateDayFromToday = (date: string) => {
    if (!today || !date) return 1;
    const todayDate = new Date(today);
    const selectedDateObj = new Date(date);
    const diffTime = selectedDateObj.getTime() - todayDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(90, diffDays));
  };

  // Load all entries
  const loadEntries = useCallback(async () => {
    if (!user || !today) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No session token');
      }

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/journal/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to load entries');
      }

      const data = await response.json();
      const entries = data.entries || [];
      setEntriesList(entries);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setError('Request timed out. Please refresh the page.');
      } else {
        setError(error.message || 'Failed to load entries');
      }
      setEntriesList([]);
    } finally {
      setLoading(false);
    }
  }, [user, today]);

  // Load today's entry for form
  const loadTodaysEntry = useCallback(async () => {
    if (!user) return;

    try {
      const { data: { session } = {} } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No session token');
      }

      const response = await fetch(`/api/journal/entries?date=${today}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.entry) {
          setEntry({
            ...data.entry,
            tasks: data.entry.tasks || [],
          });
        } else {
          // Initialize new entry for today
          setEntry({
            entry_date: today,
            day_number: 1,
            gratitude: '',
            priority_1: '',
            priority_2: '',
            priority_3: '',
            tasks: [],
            reflection: '',
            mood: '',
            completed: false,
          });
        }
      }
    } catch (error: any) {
      console.error('Failed to load today\'s entry:', error);
    }
  }, [user, today]);

  // Submit entry (only for today)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No session token');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...entry,
          entry_date: today || new Date().toISOString().split('T')[0], // Force today's date
          day_number: 1, // Day 1 = today
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to submit' }));
        const errorMessage = errorData.details 
          ? `${errorData.error}: ${errorData.details}` 
          : errorData.error || `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Success - go back to list view and reload entries
      setShowForm(false);
      await loadEntries();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setError('Submit request timed out. Please check your connection and try again.');
      } else {
        setError(error.message || 'Failed to submit entry. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (field: keyof JournalEntry, value: any) => {
    setEntry(prev => ({ ...prev, [field]: value }));
  };

  // Add task
  const addTask = () => {
    setEntry(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: Date.now().toString(), text: '', completed: false }]
    }));
  };

  // Update task
  const updateTask = (id: string, updates: Partial<JournalEntry['tasks'][0]>) => {
    setEntry(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  };

  // Remove task
  const removeTask = (id: string) => {
    setEntry(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
    }));
  };

  // Handle "Today's Entry" button click
  const handleTodaysEntryClick = async () => {
    await loadTodaysEntry();
    setShowForm(true);
  };

  // View a specific entry (read-only)
  const handleViewEntry = async (entryDate: string) => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No session token');
      }

      const response = await fetch(`/api/journal/entries?date=${entryDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.entry) {
          setEntry({
            ...data.entry,
            tasks: data.entry.tasks || [],
          });
          setShowForm(true);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load entry');
    }
  };

  // Load entries on mount (only once)
  useEffect(() => {
    if (user && today) {
      loadEntries();
    }
  }, [user, today]); // Removed loadEntries from dependencies to prevent re-renders

  // Redirect if not authenticated (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && !user && !loading) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);
  
  // Wait for today to be set (client-side only)
  if (!user || !today || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin text-yellow-400 text-4xl">⏳</div>
      </div>
    );
  }

  // Helper function to check if an entry has actual content
  const hasActualContent = (entry: any) => {
    if (!entry) return false;
    
    // Check if any meaningful content exists
    const hasGratitude = entry.gratitude && entry.gratitude.trim().length > 0;
    const hasPriority1 = entry.priority_1 && entry.priority_1.trim().length > 0;
    const hasPriority2 = entry.priority_2 && entry.priority_2.trim().length > 0;
    const hasPriority3 = entry.priority_3 && entry.priority_3.trim().length > 0;
    const hasTasks = entry.tasks && Array.isArray(entry.tasks) && entry.tasks.length > 0 && 
                     entry.tasks.some((t: any) => t && t.text && t.text.trim().length > 0);
    const hasReflection = entry.reflection && entry.reflection.trim().length > 0;
    const hasMood = entry.mood && entry.mood.trim().length > 0;
    
    // Entry must have at least one field with actual content
    return hasGratitude || hasPriority1 || hasPriority2 || hasPriority3 || hasTasks || hasReflection || hasMood;
  };

  // Generate list of days - include all entries from database plus next 90 days from today
  const generateDaysList = () => {
    if (!today) return [];
    const daysMap = new Map<string, any>();
    const todayDate = new Date(today);
    
    // First, generate 90 days starting from TODAY (Day 1 = today)
    for (let i = 0; i < 90; i++) {
      const date = new Date(todayDate);
      date.setDate(todayDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayNumber = i + 1; // Day 1 = today, Day 2 = tomorrow, etc.
      const entryData = entriesList.find(e => e.entry_date === dateStr);
      const hasEntry = entryData && hasActualContent(entryData);
      
      daysMap.set(dateStr, {
        date: dateStr,
        dayNumber,
        hasEntry,
        entry: entryData,
        isToday: dateStr === today,
        isPast: dateStr < today,
      });
    }
    
    // Then, add any past entries from database that aren't in the 90-day range
    entriesList.forEach((entryData) => {
      if (entryData.entry_date && entryData.entry_date < today) {
        // Only add past entries that aren't already in the map
        if (!daysMap.has(entryData.entry_date)) {
          daysMap.set(entryData.entry_date, {
            date: entryData.entry_date,
            dayNumber: 0, // Past entries don't get a day number (they're before Day 1)
            hasEntry: hasActualContent(entryData),
            entry: entryData,
            isToday: false,
            isPast: true,
          });
        }
      }
    });
    
    // Convert map to array and sort by date
    const daysArray = Array.from(daysMap.values());
    daysArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return daysArray;
  };

  const daysList = generateDaysList();
  // Only count entries with actual content
  const totalEntries = entriesList.filter(e => hasActualContent(e)).length;
  
  // Calculate streak - try to get from entries, or calculate from completed entries
  const calculateStreak = () => {
    if (entriesList.length === 0) return 0;
    
    // First, try to get streak from today's entry or most recent entry
    const todayEntry = entriesList.find(e => e.entry_date === today && hasActualContent(e));
    if (todayEntry && todayEntry.streak) {
      return todayEntry.streak;
    }
    
    const mostRecent = entriesList.find(e => hasActualContent(e));
    if (mostRecent && mostRecent.streak) {
      return mostRecent.streak;
    }
    
    // If no streak value, calculate from consecutive completed entries
    const completedEntries = entriesList
      .filter(e => hasActualContent(e))
      .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime());
    
    if (completedEntries.length === 0) return 0;
    
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
    
    return calculatedStreak;
  };
  
  const currentStreak = calculateStreak();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-yellow-400" />
                Daily Journal
              </h1>
              <p className="text-gray-400 mt-2">90-Day Transformation Journey</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <Flame className="w-5 h-5" />
                <span className="font-semibold">{currentStreak} Day Streak</span>
              </div>
              <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-xl px-4 py-2">
                <span className="text-yellow-400 font-bold">{totalEntries} / 90 Days</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Progress Tracker - Only show if there are entries */}
        {totalEntries > 0 && (
          <div className="mb-8 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-yellow-400" />
                90-Day Journey Progress
              </h3>
              <span className="text-yellow-400 font-bold text-xl">{Math.round((totalEntries / 90) * 100)}% Complete</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-4 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${Math.min((totalEntries / 90) * 100, 100)}%` }}
              >
                {totalEntries > 0 && (
                  <span className="text-xs font-bold text-black">{totalEntries}</span>
                )}
              </div>
            </div>
            
            {/* Milestone Markers */}
            <div className="flex justify-between text-xs text-gray-400">
              <span className={totalEntries >= 1 ? 'text-yellow-400 font-bold' : ''}>Day 1</span>
              <span className={totalEntries >= 30 ? 'text-yellow-400 font-bold' : ''}>Day 30</span>
              <span className={totalEntries >= 60 ? 'text-yellow-400 font-bold' : ''}>Day 60</span>
              <span className={totalEntries >= 90 ? 'text-yellow-400 font-bold' : ''}>Day 90</span>
            </div>
          </div>
        )}

        {!showForm ? (
          // LIST VIEW - Show all entries
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">All Entries</h2>
              {!entriesList.some(e => e.entry_date === today) && (
                <Button
                  onClick={handleTodaysEntryClick}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Today's Entry
                </Button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin text-yellow-400 text-4xl mb-4">⏳</div>
                <p className="text-gray-400">Loading entries...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {daysList.map((day) => (
                  <Card
                    key={day.date}
                    className={`bg-neutral-900/50 border p-4 cursor-pointer transition-all ${
                      day.hasEntry
                        ? 'border-yellow-500/50 hover:border-yellow-500'
                        : day.isPast
                        ? 'border-gray-700 opacity-60'
                        : 'border-gray-700'
                    }`}
                    onClick={() => {
                      if (day.hasEntry) {
                        handleViewEntry(day.date);
                      } else if (day.isToday && !day.hasEntry) {
                        handleTodaysEntryClick();
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {day.dayNumber ? (
                          <span className="text-yellow-400 font-bold">Day {day.dayNumber}</span>
                        ) : (
                          <span className="text-gray-500 text-sm">Past Entry</span>
                        )}
                        {day.isToday && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Today</span>
                        )}
                      </div>
                      {day.hasEntry && (
                        <span className="text-green-400 text-sm">✓</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    {day.hasEntry && day.entry && (
                      <ul className="list-disc list-inside space-y-1 text-xs text-gray-300 mt-2">
                        {day.entry.gratitude && (
                          <li className="truncate">{day.entry.gratitude.substring(0, 50)}...</li>
                        )}
                        {day.entry.priority_1 && (
                          <li>Priority: {day.entry.priority_1}</li>
                        )}
                        {day.entry.mood && (
                          <li>Mood: {day.entry.mood.split(' ')[0]}</li>
                        )}
                      </ul>
                    )}
                    {!day.hasEntry && day.isPast && (
                      <p className="text-gray-500 text-xs italic">No entry</p>
                    )}
                    {!day.hasEntry && !day.isPast && (
                      <p className="text-yellow-400/60 text-xs">Not started</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          // FORM VIEW - Only for today's entry
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Today's Entry - Day 1</h2>
                <p className="text-gray-400 text-sm">{new Date(today).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}</p>
              </div>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setEntry({
                    entry_date: today,
                    gratitude: '',
                    priority_1: '',
                    priority_2: '',
                    priority_3: '',
                    tasks: [],
                    reflection: '',
                    mood: '',
                    completed: false,
                  });
                }}
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to List
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Gratitude */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-semibold">Gratitude</h2>
                </div>
                <textarea
                  value={entry.gratitude}
                  onChange={(e) => handleChange('gratitude', e.target.value)}
                  placeholder="What are you grateful for today?"
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 min-h-[100px] resize-none"
                />
              </Card>

              {/* Top 3 Priorities */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-semibold">Top 3 Priorities</h2>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((num) => (
                    <input
                      key={num}
                      type="text"
                      value={entry[`priority_${num}` as keyof JournalEntry] as string || ''}
                      onChange={(e) => handleChange(`priority_${num}` as keyof JournalEntry, e.target.value)}
                      placeholder={`Priority ${num}`}
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    />
                  ))}
                </div>
              </Card>

              {/* Tasks */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-xl font-semibold">Tasks</h2>
                  </div>
                  <Button
                    type="button"
                    onClick={addTask}
                    variant="outline"
                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                  >
                    + Add Task
                  </Button>
                </div>
                <div className="space-y-2">
                  {entry.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-700 text-yellow-500 focus:ring-yellow-500"
                      />
                      <input
                        type="text"
                        value={task.text}
                        onChange={(e) => updateTask(task.id, { text: e.target.value })}
                        placeholder="Enter task..."
                        className={`flex-1 bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 ${
                          task.completed ? 'line-through text-gray-500' : ''
                        }`}
                      />
                      <Button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  {entry.tasks.length === 0 && (
                    <p className="text-gray-500 text-sm italic">No tasks yet. Click "Add Task" to get started.</p>
                  )}
                </div>
              </Card>

              {/* Reflection */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-semibold">Reflection</h2>
                </div>
                <textarea
                  value={entry.reflection}
                  onChange={(e) => handleChange('reflection', e.target.value)}
                  placeholder="How did today go? What did you learn?"
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 min-h-[150px] resize-none"
                />
              </Card>

              {/* Mood */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Smile className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-semibold">How are you feeling?</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {MOODS.map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => handleChange('mood', mood)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        entry.mood === mood
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                          : 'border-gray-700 bg-neutral-800 text-gray-300 hover:border-yellow-500/50'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Complete Toggle - Only show if entry is new (not already filled) */}
              {(() => {
                // Check if entry has actual content (already filled)
                const hasContent = !!(
                  entry.gratitude?.trim() ||
                  entry.priority_1?.trim() ||
                  entry.priority_2?.trim() ||
                  entry.priority_3?.trim() ||
                  (entry.tasks && entry.tasks.length > 0 && entry.tasks.some((t: any) => t.text?.trim())) ||
                  entry.reflection?.trim() ||
                  entry.mood?.trim()
                );
                
                // Only show toggle if entry doesn't have an id AND doesn't have content yet
                return !entry.id && !hasContent;
              })() && (
                <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Mark as Complete</h3>
                      <p className="text-sm text-gray-400">Mark this entry as complete to maintain your streak</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={entry.completed}
                        onChange={(e) => handleChange('completed', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-500"></div>
                    </label>
                  </div>
                </Card>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEntry({
                      entry_date: today,
                      gratitude: '',
                      priority_1: '',
                      priority_2: '',
                      priority_3: '',
                      tasks: [],
                      reflection: '',
                      mood: '',
                      completed: false,
                    });
                  }}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Entry'
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
