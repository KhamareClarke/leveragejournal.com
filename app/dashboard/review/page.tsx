'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, Calendar, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WeeklyReview {
  id?: string;
  week_start_date: string;
  week_end_date?: string;
  week_number?: number;
  wins?: string;
  obstacles?: string;
  lessons?: string;
  next_steps?: string;
  ai_summary?: string;
  trends?: string;
  insights?: string;
}

function ReviewPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
      weekEnd: formatLocalDate(weekEnd)
    };
  };

  // Load program start date
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

  const [review, setReview] = useState<WeeklyReview>({
    week_start_date: '',
    week_end_date: '',
    wins: '',
    obstacles: '',
    lessons: '',
    next_steps: '',
  });

  // Update review when week dates are loaded
  useEffect(() => {
    if (weekStartStr && weekEndStr) {
      setReview(prev => ({
        ...prev,
        week_start_date: weekStartStr,
        week_end_date: weekEndStr,
      }));
    }
  }, [weekStartStr, weekEndStr]);

  // Load existing review for this week
  useEffect(() => {
    const loadReview = async () => {
      if (!user || !weekStartStr) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) return;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`/api/reviews?week_start=${weekStartStr}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data.reviews && data.reviews.length > 0) {
            setReview(data.reviews[0]);
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load review:', error);
        }
      }
    };

    loadReview();
  }, [user, weekStartStr]);

  const handleChange = (field: keyof WeeklyReview, value: string) => {
    setReview(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No session token');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...review,
          week_start_date: weekStartStr,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save' }));
        throw new Error(errorData.error || 'Failed to save');
      }

      setSuccessMessage('Weekly review saved successfully! 🎉');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setError(error.message || 'Failed to save. Please try again.');
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">
              Weekly Review
            </h1>
            <p className="text-gray-400">Reflect on your week and plan ahead</p>
            <div className="flex items-center justify-center gap-2 text-yellow-400 mt-2">
              <Calendar className="w-4 h-4" />
              <span className="font-semibold">
                {new Date(weekStartStr).toLocaleDateString()} - {new Date(weekEndStr).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {successMessage && (
          <Card className="bg-green-900/20 border-green-500/50 p-4 mb-6">
            <p className="text-green-400 font-semibold">{successMessage}</p>
          </Card>
        )}

        {error && (
          <Card className="bg-red-900/20 border-red-500/50 p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Wins This Week
            </h3>
            <textarea
              value={review.wins || ''}
              onChange={(e) => handleChange('wins', e.target.value)}
              className="w-full h-32 bg-neutral-800 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-yellow-500"
              placeholder="What went well this week? What achievements are you proud of?"
            />
          </Card>

          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Obstacles</h3>
            <textarea
              value={review.obstacles || ''}
              onChange={(e) => handleChange('obstacles', e.target.value)}
              className="w-full h-32 bg-neutral-800 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-yellow-500"
              placeholder="What challenges did you face? What obstacles got in your way?"
            />
          </Card>

          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Lessons Learned</h3>
            <textarea
              value={review.lessons || ''}
              onChange={(e) => handleChange('lessons', e.target.value)}
              className="w-full h-32 bg-neutral-800 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-yellow-500"
              placeholder="What did you learn this week? What insights did you gain?"
            />
          </Card>

          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Next Steps</h3>
            <textarea
              value={review.next_steps || ''}
              onChange={(e) => handleChange('next_steps', e.target.value)}
              className="w-full h-32 bg-neutral-800 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-yellow-500"
              placeholder="What will you focus on next week? What adjustments will you make?"
            />
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {submitting ? 'Saving...' : 'Save Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin text-yellow-400 text-4xl">⏳</div>
      </div>
    }>
      <ReviewPageContent />
    </Suspense>
  );
}

