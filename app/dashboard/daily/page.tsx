'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, BookOpen, Heart, Target, CheckCircle, Smile } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface JournalEntry {
  id?: string;
  entry_date: string;
  day_number?: number;
  gratitude?: string;
  priority_1?: string;
  priority_2?: string;
  priority_3?: string;
  tasks?: Array<{ id: string; text: string; completed: boolean }>;
  reflection?: string;
  mood?: string;
  completed?: boolean;
  streak?: number;
}

export default function DailyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Get today's date
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

  const [entry, setEntry] = useState<JournalEntry>({
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

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }
  }, [user, authLoading]);

  // Load today's entry
  useEffect(() => {
    const loadEntry = async () => {
      if (!user || !today) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          setLoading(false);
          return;
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
          }
        }
      } catch (error) {
        console.error('Failed to load entry:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && today) {
      loadEntry();
    }
  }, [user, today]);

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    if (!user || !today || loading) return;

    const timer = setTimeout(() => {
      handleSave(true); // true = auto-save
    }, 2000);

    return () => clearTimeout(timer);
  }, [entry, user, today, loading]);

  const handleSave = async (isAutoSave = false) => {
    if (!user || !today) return;

    setSaving(true);
    setError(null);
    if (!isAutoSave) {
      setSuccessMessage(null);
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No session token');
      }

      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          entry_date: today,
          gratitude: entry.gratitude,
          priority_1: entry.priority_1,
          priority_2: entry.priority_2,
          priority_3: entry.priority_3,
          tasks: entry.tasks || [],
          reflection: entry.reflection,
          mood: entry.mood,
          completed: entry.completed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save' }));
        throw new Error(errorData.error || 'Failed to save');
      }

      const data = await response.json();
      if (data.entry) {
        setEntry(data.entry);
        setLastSaved(new Date());
        if (!isAutoSave) {
          setSuccessMessage('Entry saved successfully!');
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      }
    } catch (error: any) {
      console.error('Save error:', error);
      setError(error.message || 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const addTask = () => {
    setEntry(prev => ({
      ...prev,
      tasks: [
        ...(prev.tasks || []),
        { id: Date.now().toString(), text: '', completed: false }
      ]
    }));
  };

  const updateTask = (id: string, updates: Partial<{ text: string; completed: boolean }>) => {
    setEntry(prev => ({
      ...prev,
      tasks: (prev.tasks || []).map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  };

  const removeTask = (id: string) => {
    setEntry(prev => ({
      ...prev,
      tasks: (prev.tasks || []).filter(task => task.id !== id)
    }));
  };

  // Early return - don't render anything if not authenticated or still loading
  if (authLoading || loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">
                Daily Journal Entry
              </h1>
              <p className="text-gray-400">
                {new Date(today).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {entry.streak && entry.streak > 0 && (
                  <span className="ml-3 text-yellow-400">🔥 {entry.streak} day streak!</span>
                )}
              </p>
            </div>
            <div className="text-right">
              {lastSaved && (
                <p className="text-xs text-gray-500 mb-2">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </p>
              )}
              <Button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/50 p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </Card>
        )}
        {successMessage && (
          <Card className="bg-green-900/20 border-green-500/50 p-4 mb-6">
            <p className="text-green-400">{successMessage}</p>
          </Card>
        )}

        {/* Journal Form */}
        <div className="space-y-6">
          {/* Gratitude */}
          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <div className="flex items-center mb-4">
              <Heart className="w-5 h-5 text-yellow-400 mr-2" />
              <h2 className="text-xl font-bold text-white">Gratitude</h2>
            </div>
            <textarea
              value={entry.gratitude || ''}
              onChange={(e) => setEntry(prev => ({ ...prev, gratitude: e.target.value }))}
              placeholder="What are you grateful for today?"
              className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-yellow-500 min-h-[100px] resize-y"
            />
          </Card>

          {/* Top 3 Priorities */}
          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <div className="flex items-center mb-4">
              <Target className="w-5 h-5 text-yellow-400 mr-2" />
              <h2 className="text-xl font-bold text-white">Top 3 Priorities</h2>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={entry.priority_1 || ''}
                onChange={(e) => setEntry(prev => ({ ...prev, priority_1: e.target.value }))}
                placeholder="Priority 1"
                className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                value={entry.priority_2 || ''}
                onChange={(e) => setEntry(prev => ({ ...prev, priority_2: e.target.value }))}
                placeholder="Priority 2"
                className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                value={entry.priority_3 || ''}
                onChange={(e) => setEntry(prev => ({ ...prev, priority_3: e.target.value }))}
                placeholder="Priority 3"
                className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
          </Card>

          {/* Tasks */}
          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-yellow-400 mr-2" />
                <h2 className="text-xl font-bold text-white">Tasks</h2>
              </div>
              <Button
                onClick={addTask}
                variant="outline"
                size="sm"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              >
                + Add Task
              </Button>
            </div>
            <div className="space-y-3">
              {(entry.tasks || []).map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
                    className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    value={task.text}
                    onChange={(e) => updateTask(task.id, { text: e.target.value })}
                    placeholder="Enter task..."
                    className={`flex-1 bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 ${
                      task.completed ? 'line-through opacity-50' : ''
                    }`}
                  />
                  <Button
                    onClick={() => removeTask(task.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    ×
                  </Button>
                </div>
              ))}
              {(!entry.tasks || entry.tasks.length === 0) && (
                <p className="text-gray-500 text-sm">No tasks yet. Click "Add Task" to get started.</p>
              )}
            </div>
          </Card>

          {/* Reflection */}
          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-5 h-5 text-yellow-400 mr-2" />
              <h2 className="text-xl font-bold text-white">Reflection</h2>
            </div>
            <textarea
              value={entry.reflection || ''}
              onChange={(e) => setEntry(prev => ({ ...prev, reflection: e.target.value }))}
              placeholder="How did today go? What did you learn?"
              className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-yellow-500 min-h-[150px] resize-y"
            />
          </Card>

          {/* Mood */}
          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <div className="flex items-center mb-4">
              <Smile className="w-5 h-5 text-yellow-400 mr-2" />
              <h2 className="text-xl font-bold text-white">Mood</h2>
            </div>
            <input
              type="text"
              value={entry.mood || ''}
              onChange={(e) => setEntry(prev => ({ ...prev, mood: e.target.value }))}
              placeholder="How are you feeling today?"
              className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
            />
          </Card>

          {/* Complete Entry */}
          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Mark as Complete</h3>
                <p className="text-sm text-gray-400">Mark this entry as complete to update your streak</p>
              </div>
              <input
                type="checkbox"
                checked={entry.completed || false}
                onChange={(e) => setEntry(prev => ({ ...prev, completed: e.target.checked }))}
                className="w-6 h-6 text-yellow-500 rounded focus:ring-yellow-500"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
