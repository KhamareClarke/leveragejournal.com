'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Edit, Trash2, Target, Calendar, Trophy, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  due_date?: string;
}

interface Goal {
  id?: string;
  title: string;
  description?: string;
  why?: string;
  how?: string;
  type: 'short' | 'medium' | 'long';
  category?: string;
  timeline?: string;
  reward?: string;
  progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  milestones?: Milestone[];
  entry_date?: string;
  empire_vision?: string;
  financial_freedom_number?: string;
  legacy_impact?: string;
  legacy_goals?: string;
  vision_goals?: string;
  strategic_goals?: string;
}

const GOAL_TYPES = [
  { value: 'short', label: 'Short-term (1-3 months)' },
  { value: 'medium', label: 'Medium-term (3-12 months)' },
  { value: 'long', label: 'Long-term (1+ years)' }
];

function GoalsPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);
  
  // Get today's date (client-side only) - MUST be before any early returns
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

  // Redirect to sign-in if not authenticated - MUST be after all hooks
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

  const [formData, setFormData] = useState<Goal>({
    title: '',
    description: '',
    why: '',
    how: '',
    type: 'short',
    category: '',
    timeline: '',
    reward: '',
    progress: 0,
    status: 'active',
    milestones: [],
    entry_date: today,
    empire_vision: '',
    financial_freedom_number: '',
    legacy_impact: '',
    legacy_goals: '',
    vision_goals: '',
    strategic_goals: '',
  });

  // Load all goals (not just today's)
  useEffect(() => {
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
          const goalsList = data.goals || [];
          
          // Auto-fix: Mark goals with 100% progress as completed
          const goalsToFix = goalsList.filter((g: Goal) => g.progress >= 100 && g.status !== 'completed');
          if (goalsToFix.length > 0 && token) {
            // Fix them in the background
            goalsToFix.forEach(async (goal: Goal) => {
              if (goal.id) {
                try {
                  await fetch(`/api/goals/${goal.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: 'completed' }),
                  });
                } catch (err) {
                  // Silent fail - just log
                  console.error('Failed to auto-fix goal status:', err);
                }
              }
            });
            
            // Update local state immediately
            const fixedGoals = goalsList.map((g: Goal) => 
              g.progress >= 100 && g.status !== 'completed' 
                ? { ...g, status: 'completed' as const }
                : g
            );
            setGoals(fixedGoals);
          } else {
            setGoals(goalsList);
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load goals:', error);
        }
      }
    };

    loadGoals();
  }, [user]);

  const handleInputChange = (field: keyof Goal, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [
        ...(prev.milestones || []),
        { id: Date.now().toString(), title: '', completed: false }
      ]
    }));
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones?.map(m => 
        m.id === id ? { ...m, ...updates } : m
      ) || []
    }));
  };

  const removeMilestone = (id: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones?.filter(m => m.id !== id) || []
    }));
  };

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
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const url = editingGoal ? `/api/goals/${editingGoal.id}` : '/api/goals';
      const method = editingGoal ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          entry_date: today,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save' }));
        throw new Error(errorData.error || 'Failed to save');
      }

      // Success - reset form and reload goals (don't wait for reload)
      setShowForm(false);
      setEditingGoal(null);
      setFormData({
        title: '',
        description: '',
        why: '',
        how: '',
        type: 'short',
        category: '',
        timeline: '',
        reward: '',
        progress: 0,
        status: 'active',
        milestones: [],
        entry_date: today,
        empire_vision: '',
        financial_freedom_number: '',
        legacy_impact: '',
        legacy_goals: '',
        vision_goals: '',
        strategic_goals: '',
      });

      // Show success message
      setSuccessMessage(editingGoal ? 'Goal updated successfully! 🎉' : 'Goal created successfully! 🎉');
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reload goals in background (don't block)
      fetch('/api/goals', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setGoals(data.goals || []);
          }
        })
        .catch(err => console.error('Failed to reload goals:', err));
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setError(error.message || 'Failed to save. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      ...goal,
      milestones: goal.milestones || [],
    });
    setShowForm(true);
  };

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

  const handleUpdateProgress = async (goalId: string, newProgress: number) => {
    if (!user || !goalId) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    setUpdatingProgress(goalId);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No session token');
      }

      // Auto-complete if progress reaches 100%
      const shouldComplete = newProgress >= 100;
      const updatedStatus = shouldComplete ? 'completed' : (goal.status === 'completed' && newProgress < 100 ? 'active' : goal.status);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Update both progress and status in one call
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          progress: newProgress,
          status: updatedStatus
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update' }));
        throw new Error(errorData.error || 'Failed to update progress');
      }

      // Update local state
      setGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          return { ...g, progress: newProgress, status: updatedStatus };
        }
        return g;
      }));

      // Show success message
      if (shouldComplete && goal.status !== 'completed') {
        setSuccessMessage(`🎉 Goal completed! Congratulations! 🎉`);
      } else {
        setSuccessMessage(`Progress updated to ${newProgress}%! 🎉`);
      }
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setError(error.message || 'Failed to update progress');
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setUpdatingProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setGoals(prev => prev.filter(g => g.id !== id));
        setSuccessMessage('Goal deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
      setError('Failed to delete goal');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleNewGoal = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      why: '',
      how: '',
      type: 'short',
      category: '',
      timeline: '',
      reward: '',
      progress: 0,
      status: 'active',
      milestones: [],
      entry_date: today,
      empire_vision: '',
      financial_freedom_number: '',
      legacy_impact: '',
      legacy_goals: '',
      vision_goals: '',
    });
    setShowForm(true);
  };

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
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
                Smart Goals
              </h1>
              <p className="text-gray-400">Set, track, and achieve your goals</p>
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

          {goals.length === 0 ? (
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
                  onClick={handleNewGoal}
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
                <h2 className="text-2xl font-bold">All Goals ({goals.length})</h2>
                <Button
                  onClick={handleNewGoal}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </div>

              {/* Active Goals */}
              {goals.filter(g => g.status !== 'completed').length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Active Goals ({goals.filter(g => g.status !== 'completed').length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.filter(g => g.status !== 'completed').map((goal) => (
                  <Card key={goal.id} className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{goal.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            goal.type === 'short' ? 'bg-blue-500/20 text-blue-400' :
                            goal.type === 'medium' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {goal.type}
                          </span>
                          {goal.category && (
                            <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                              {goal.category}
                            </span>
                          )}
                          {goal.status && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              goal.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              goal.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                              goal.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {goal.status}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(goal)}
                          variant="ghost"
                          size="sm"
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => goal.id && handleDelete(goal.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {goal.description && (
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{goal.description}</p>
                    )}

                    {goal.timeline && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>Target: {new Date(goal.timeline).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm font-bold text-yellow-400">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      {/* Quick progress update */}
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={goal.progress}
                          onChange={(e) => {
                            const newProgress = parseInt(e.target.value);
                            if (goal.id) {
                              handleUpdateProgress(goal.id, newProgress);
                            }
                          }}
                          disabled={updatingProgress === goal.id}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 disabled:opacity-50"
                        />
                        <span className="text-xs text-gray-400 min-w-[35px] text-right">
                          {updatingProgress === goal.id ? '...' : `${goal.progress}%`}
                        </span>
                      </div>
                    </div>

                    {goal.milestones && goal.milestones.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-semibold text-gray-400 mb-2">Milestones:</p>
                        {goal.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-2 text-sm">
                            {milestone.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-600 rounded-full" />
                            )}
                            <span className={milestone.completed ? 'line-through text-gray-500' : 'text-gray-300'}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Goals */}
              {goals.filter(g => g.status === 'completed').length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Completed Goals ({goals.filter(g => g.status === 'completed').length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.filter(g => g.status === 'completed').map((goal) => (
                      <Card key={goal.id} className="bg-green-900/10 border border-green-500/30 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                              {goal.title}
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs px-2 py-1 rounded ${
                                goal.type === 'short' ? 'bg-blue-500/20 text-blue-400' :
                                goal.type === 'medium' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-orange-500/20 text-orange-400'
                              }`}>
                                {goal.type}
                              </span>
                              {goal.category && (
                                <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                                  {goal.category}
                                </span>
                              )}
                              <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                                ✓ Completed
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEdit(goal)}
                              variant="ghost"
                              size="sm"
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => goal.id && handleDelete(goal.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {goal.description && (
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{goal.description}</p>
                        )}

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Progress</span>
                            <span className="text-sm font-bold text-green-400">100%</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                              style={{ width: '100%' }}
                            ></div>
                          </div>
                        </div>

                        {goal.reward && (
                          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-400">
                              <Trophy className="w-4 h-4" />
                              <span className="text-sm font-semibold">Reward: {goal.reward}</span>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => {
              setShowForm(false);
              setEditingGoal(null);
            }}
            variant="outline"
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Goals
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h1>
            <p className="text-gray-400">Set clear, actionable goals with milestones</p>
          </div>
        </div>

        {error && (
          <Card className="bg-red-900/20 border-red-500/50 p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  placeholder="e.g., Learn Spanish"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (What)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 min-h-[100px] resize-none"
                  placeholder="Describe what you want to achieve..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Why (Motivation)
                </label>
                <textarea
                  value={formData.why}
                  onChange={(e) => handleInputChange('why', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 min-h-[100px] resize-none"
                  placeholder="Why is this goal important to you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  How (Action Plan)
                </label>
                <textarea
                  value={formData.how}
                  onChange={(e) => handleInputChange('how', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 min-h-[100px] resize-none"
                  placeholder="How will you achieve this goal?"
                />
              </div>
            </div>
          </Card>

          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Goal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                >
                  {GOAL_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  placeholder="e.g., Career, Health, Learning"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reward
                </label>
                <input
                  type="text"
                  value={formData.reward}
                  onChange={(e) => handleInputChange('reward', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  placeholder="What will you reward yourself with?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Progress (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">My Vision</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🏰 My Empire Vision
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Describe the empire you're building. What does your life look like in 5 years?
                </p>
                <textarea
                  value={formData.empire_vision || ''}
                  onChange={(e) => handleInputChange('empire_vision', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 min-h-[100px] resize-none"
                  placeholder="Describe your empire vision..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  💰 Financial Freedom Number
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  What annual income would give you complete financial freedom?
                </p>
                <textarea
                  value={formData.financial_freedom_number || ''}
                  onChange={(e) => handleInputChange('financial_freedom_number', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 min-h-[80px] resize-none"
                  placeholder="Enter your financial freedom number..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🌍 Legacy Impact
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  How do you want to be remembered? What impact will you leave?
                </p>
                <textarea
                  value={formData.legacy_impact || ''}
                  onChange={(e) => handleInputChange('legacy_impact', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 min-h-[100px] resize-none"
                  placeholder="Describe your legacy impact..."
                />
              </div>
            </div>
          </Card>

          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Goal Timeline Framework</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🏛️ LEGACY (10+ Years)
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  What legacy will you leave? (Enter one goal per line)
                </p>
                <textarea
                  value={formData.legacy_goals || ''}
                  onChange={(e) => handleInputChange('legacy_goals', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 min-h-[120px] resize-none"
                  placeholder="Legacy Goal 1&#10;Legacy Goal 2&#10;Legacy Goal 3..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🌟 VISION (5-10 Years)
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Your ideal life. What does success look like? (Enter one goal per line)
                </p>
                <textarea
                  value={formData.vision_goals || ''}
                  onChange={(e) => handleInputChange('vision_goals', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 min-h-[120px] resize-none"
                  placeholder="Vision Goal 1&#10;Vision Goal 2&#10;Vision Goal 3..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🎯 STRATEGIC (2-5 Years)
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Major milestones for your vision. (Enter one goal per line)
                </p>
                <textarea
                  value={formData.strategic_goals || ''}
                  onChange={(e) => handleInputChange('strategic_goals', e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 min-h-[120px] resize-none"
                  placeholder="Strategic Goal 1&#10;Strategic Goal 2&#10;Strategic Goal 3..."
                />
              </div>
            </div>
          </Card>

          <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Milestones</h3>
              <Button
                type="button"
                onClick={addMilestone}
                variant="outline"
                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </div>
            <div className="space-y-3">
              {formData.milestones?.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={(e) => updateMilestone(milestone.id, { completed: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-700 text-yellow-500 focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                    className="flex-1 bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    placeholder="Milestone title..."
                  />
                  <input
                    type="date"
                    value={milestone.due_date || ''}
                    onChange={(e) => updateMilestone(milestone.id, { due_date: e.target.value })}
                    className="bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                  <Button
                    type="button"
                    onClick={() => removeMilestone(milestone.id)}
                    variant="ghost"
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(!formData.milestones || formData.milestones.length === 0) && (
                <p className="text-gray-500 text-sm italic">No milestones added yet</p>
              )}
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingGoal(null);
              }}
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
              {submitting ? 'Saving...' : editingGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin text-yellow-400 text-4xl">⏳</div>
      </div>
    }>
      <GoalsPageContent />
    </Suspense>
  );
}

