'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Edit, Trash2, Save, Calendar, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FoundationEntry {
  id?: string;
  entry_date: string;
  my_why?: string; // Keep for backward compatibility
  what_drives_me?: string;
  what_im_done_with?: string;
  who_im_building_for?: string;
  my_vision?: string; // Keep for backward compatibility
  my_values?: string;
  my_skills?: string;
  influences?: string; // Keep for backward compatibility
  books_that_shaped_me?: string;
  mentors_role_models?: string;
  core_principles?: string;
  lessons_learned?: string;
  accountability_partner?: string;
  created_at?: string;
  updated_at?: string;
}

// Foundation sections organized by main categories
const foundationSections = [
  // MY WHY section
  { 
    id: 'what_drives_me', 
    title: '🔥 What Drives Me', 
    placeholder: 'What is your deepest motivation? What gets you up in the morning?', 
    isTextarea: true,
    category: 'MY WHY'
  },
  { 
    id: 'what_im_done_with', 
    title: '😤 What I\'m Done With', 
    placeholder: 'What are you absolutely done tolerating in your life?', 
    isTextarea: true,
    category: 'MY WHY'
  },
  { 
    id: 'who_im_building_for', 
    title: '❤️ Who/What I\'m Building For', 
    placeholder: 'Who are you building this empire for? Who depends on your success?', 
    isTextarea: true,
    category: 'MY WHY'
  },
  // MY INFLUENCES section
  { 
    id: 'books_that_shaped_me', 
    title: '📚 Books That Shaped Me', 
    placeholder: 'List the 5 books that most influenced your thinking (one per line):', 
    isTextarea: true,
    category: 'MY INFLUENCES'
  },
  { 
    id: 'mentors_role_models', 
    title: '👥 Mentors & Role Models', 
    placeholder: 'Who do you study and learn from? (Living or historical)', 
    isTextarea: true,
    category: 'MY INFLUENCES'
  },
  { 
    id: 'core_principles', 
    title: '💡 Core Principles', 
    placeholder: 'What are your 3 most important life principles?', 
    isTextarea: true,
    category: 'MY INFLUENCES'
  },
  // Other sections
  { 
    id: 'my_values', 
    title: 'My Values', 
    placeholder: 'What principles guide your decisions?', 
    isTextarea: true 
  },
  { 
    id: 'my_skills', 
    title: 'My Skills & Talents', 
    placeholder: 'What are you naturally good at?', 
    isTextarea: true 
  },
  { 
    id: 'lessons_learned', 
    title: 'Lessons Learned', 
    placeholder: 'Key insights from your journey...', 
    isTextarea: true 
  },
  { 
    id: 'accountability_partner', 
    title: 'Accountability Partner', 
    placeholder: 'Who keeps you accountable?', 
    isTextarea: true 
  }
];

function FoundationPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [foundations, setFoundations] = useState<FoundationEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFoundation, setEditingFoundation] = useState<FoundationEntry | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Reset submitting state if it gets stuck (increased to 35 seconds to match API timeout)
  useEffect(() => {
    if (submitting) {
      const timeout = setTimeout(() => {
        console.warn('⚠️ Foundation: Submitting state stuck, resetting...');
        setSubmitting(false);
        setError('Save operation timed out. Please check your connection and try again.');
      }, 35000); // 35 second timeout (longer than API timeout)
      
      return () => clearTimeout(timeout);
    }
  }, [submitting]);
  
  // Get today's date (client-side only)
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

  const [formData, setFormData] = useState<FoundationEntry>({
    entry_date: today || '',
    my_why: '',
    my_vision: '', // Keep for backward compatibility
    my_values: '',
    my_skills: '',
    influences: '',
    lessons_learned: '',
    accountability_partner: '',
  });

  // Redirect to sign-in if not authenticated - MUST be after all hooks
  useEffect(() => {
    if (!authLoading && !user) {
      // Use window.location for immediate redirect to prevent blank page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }
  }, [user, authLoading]);

  // Ensure entry_date is set when today changes
  useEffect(() => {
    if (today && !formData.entry_date) {
      setFormData(prev => ({ ...prev, entry_date: today }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  // Load all foundation entries
  useEffect(() => {
    const loadFoundations = async () => {
      if (!user) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) return;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('/api/foundation/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setFoundations(data.entries || []);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load foundations:', error);
        }
      }
    };

    loadFoundations();
  }, [user]);

  const handleChange = (sectionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: value
    }));
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, entry_date: date }));
  };

  const handleCreateNew = () => {
    setFormData({
      entry_date: today,
      my_why: '', // Keep for backward compatibility
      what_drives_me: '',
      what_im_done_with: '',
      who_im_building_for: '',
      my_vision: '', // Keep for backward compatibility
      my_values: '',
      my_skills: '',
      influences: '', // Keep for backward compatibility
      books_that_shaped_me: '',
      mentors_role_models: '',
      core_principles: '',
      lessons_learned: '',
      accountability_partner: '',
    });
    setEditingFoundation(null);
    setShowForm(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleEdit = (foundation: FoundationEntry) => {
    setFormData({
      id: foundation.id,
      entry_date: foundation.entry_date,
      my_why: foundation.my_why || '', // Keep for backward compatibility
      what_drives_me: foundation.what_drives_me || foundation.my_why || '', // Migrate old my_why to what_drives_me
      what_im_done_with: foundation.what_im_done_with || '',
      who_im_building_for: foundation.who_im_building_for || '',
      my_vision: foundation.my_vision || '', // Keep for backward compatibility
      my_values: foundation.my_values || '',
      my_skills: foundation.my_skills || '',
      influences: foundation.influences || '', // Keep for backward compatibility
      books_that_shaped_me: foundation.books_that_shaped_me || '',
      mentors_role_models: foundation.mentors_role_models || foundation.influences || '', // Migrate old influences
      core_principles: foundation.core_principles || '',
      lessons_learned: foundation.lessons_learned || '',
      accountability_partner: foundation.accountability_partner || '',
    });
    setEditingFoundation(foundation);
    setShowForm(true);
    setError(null);
    setSuccessMessage(null);
  };

  // Load foundation entry by ID from query params
  useEffect(() => {
    const entryId = searchParams.get('id');
    if (entryId && user) {
      const loadEntry = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;

          if (!token) return;

          const response = await fetch(`/api/foundation/${entryId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.foundation) {
              handleEdit(data.foundation);
            }
          }
        } catch (error: any) {
          console.error('Failed to load foundation entry:', error);
        }
      };

      loadEntry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user]);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this foundation entry?')) {
      return;
    }

    setDeletingId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No session token');
      }

      const response = await fetch(`/api/foundation/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      // Reload foundations
      const listResponse = await fetch('/api/foundation/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (listResponse.ok) {
        const data = await listResponse.json();
        setFoundations(data.entries || []);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to delete foundation entry');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔘 Foundation: Form submitted', { submitting, user: !!user });
    
    // Prevent multiple submissions
    if (submitting) {
      console.warn('⚠️ Foundation: Already submitting, ignoring duplicate submission');
      return;
    }
    
    if (!user) {
      console.error('❌ Foundation: No user found');
      setError('You must be logged in to save');
      return;
    }

    console.log('🔘 Foundation: Starting save process...');
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No session token');
      }

      console.log('💾 Foundation: Starting save...', { 
        editingFoundation: !!editingFoundation,
        url: editingFoundation ? `/api/foundation/${editingFoundation.id}` : '/api/foundation',
        formData: formData
      });

      const url = editingFoundation ? `/api/foundation/${editingFoundation.id}` : '/api/foundation';
      const method = editingFoundation ? 'PUT' : 'POST';

      // Add timeout to prevent hanging (30 seconds - increased for slow connections)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error('❌ Foundation: Request timeout after 30 seconds');
        controller.abort();
      }, 30000);

      let response: Response;
      try {
        response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Save request timed out. Please check your connection and try again.');
        }
        throw fetchError;
      }

      console.log('💾 Foundation: Response received:', response.status, response.ok, response.statusText);

      if (!response.ok) {
        let errorData;
        try {
          const text = await response.text();
          console.error('❌ Foundation: Response text:', text);
          errorData = JSON.parse(text);
        } catch (e) {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('❌ Foundation: Save error:', errorData);
        throw new Error(errorData.error || errorData.details || `Failed to save (${response.status})`);
      }

      let result;
      try {
        const text = await response.text();
        console.log('💾 Foundation: Response text:', text);
        result = JSON.parse(text);
        console.log('✅ Foundation: Save successful:', result);
      } catch (parseError: any) {
        console.error('❌ Foundation: Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      setSuccessMessage(editingFoundation ? 'Foundation entry updated successfully!' : 'Foundation entry created successfully!');
      
      // Reload foundations in background (don't block on this)
      setTimeout(async () => {
        try {
          const listResponse = await fetch('/api/foundation/list', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (listResponse.ok) {
            const data = await listResponse.json();
            setFoundations(data.entries || []);
          }
        } catch (listError: any) {
          console.error('Failed to reload foundations list:', listError);
          // Silent fail - just continue
        }
      }, 500);

      // Close form after a brief delay
      setTimeout(() => {
        setShowForm(false);
        setEditingFoundation(null);
        setSuccessMessage(null);
        setSubmitting(false);
      }, 1500);
    } catch (error: any) {
      console.error('❌ Foundation: Save failed:', error);
      setError(error.message || 'Failed to save. Please try again.');
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

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
              Sacred Commitment
            </h1>
            <p className="text-gray-400">Chapter 1 - Build your foundation for transformation</p>
          </div>
        </div>

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

        {!showForm ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Your Foundation Entries</h2>
              <Button
                onClick={handleCreateNew}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Foundation
              </Button>
            </div>

            {foundations.length === 0 ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {foundations.map((foundation) => (
                  <Card key={foundation.id} className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-semibold">{formatDate(foundation.entry_date)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(foundation)}
                          variant="ghost"
                          size="sm"
                          className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => foundation.id && handleDelete(foundation.id)}
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === foundation.id}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {/* MY WHY section */}
                      {(foundation.what_drives_me || foundation.what_im_done_with || foundation.who_im_building_for || foundation.my_why) && (
                        <div>
                          <h4 className="text-sm font-semibold text-yellow-400 mb-2">MY WHY</h4>
                          {foundation.what_drives_me && (
                            <div className="ml-4 mb-2">
                              <p className="text-xs text-gray-400 mb-1">🔥 What Drives Me</p>
                              <p className="text-gray-300 text-sm line-clamp-2">{foundation.what_drives_me}</p>
                            </div>
                          )}
                          {foundation.what_im_done_with && (
                            <div className="ml-4 mb-2">
                              <p className="text-xs text-gray-400 mb-1">😤 What I'm Done With</p>
                              <p className="text-gray-300 text-sm line-clamp-2">{foundation.what_im_done_with}</p>
                            </div>
                          )}
                          {foundation.who_im_building_for && (
                            <div className="ml-4 mb-2">
                              <p className="text-xs text-gray-400 mb-1">❤️ Who/What I'm Building For</p>
                              <p className="text-gray-300 text-sm line-clamp-2">{foundation.who_im_building_for}</p>
                            </div>
                          )}
                          {foundation.my_why && !foundation.what_drives_me && (
                            <div className="ml-4 mb-2">
                              <p className="text-xs text-gray-400 mb-1">My Why</p>
                              <p className="text-gray-300 text-sm line-clamp-2">{foundation.my_why}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                  {/* MY VISION section - removed, now appears as static template in journal */}
                  
                      {/* MY INFLUENCES section */}
                      {(foundation.books_that_shaped_me || foundation.mentors_role_models || foundation.core_principles || foundation.influences) && (
                        <div>
                          <h4 className="text-sm font-semibold text-yellow-400 mb-2">MY INFLUENCES</h4>
                          {foundation.books_that_shaped_me && (
                            <div className="ml-4 mb-2">
                              <p className="text-xs text-gray-400 mb-1">📚 Books That Shaped Me</p>
                              <p className="text-gray-300 text-sm line-clamp-2">{foundation.books_that_shaped_me}</p>
                            </div>
                          )}
                          {foundation.mentors_role_models && (
                            <div className="ml-4 mb-2">
                              <p className="text-xs text-gray-400 mb-1">👥 Mentors & Role Models</p>
                              <p className="text-gray-300 text-sm line-clamp-2">{foundation.mentors_role_models}</p>
                            </div>
                          )}
                          {foundation.core_principles && (
                            <div className="ml-4 mb-2">
                              <p className="text-xs text-gray-400 mb-1">💡 Core Principles</p>
                              <p className="text-gray-300 text-sm line-clamp-2">{foundation.core_principles}</p>
                            </div>
                          )}
                          {foundation.influences && !foundation.mentors_role_models && (
                            <div className="ml-4 mb-2">
                              <p className="text-xs text-gray-400 mb-1">Influences</p>
                              <p className="text-gray-300 text-sm line-clamp-2">{foundation.influences}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {foundation.my_values && (
                        <div>
                          <h4 className="text-sm font-semibold text-yellow-400 mb-1">My Values</h4>
                          <p className="text-gray-300 text-sm line-clamp-2">{foundation.my_values}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingFoundation ? 'Edit Foundation Entry' : 'Create New Foundation Entry'}
              </h2>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setEditingFoundation(null);
                  setError(null);
                  setSuccessMessage(null);
                }}
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              >
                Cancel
              </Button>
            </div>

            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              onKeyDown={(e) => {
                // Allow Enter key to submit
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
            >
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <label className="block text-sm font-semibold text-white mb-2">
                  Entry Date
                </label>
                <input
                  type="date"
                  value={formData.entry_date || today}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                  required
                />
              </Card>

              {foundationSections.map((section) => {
                const value = formData[section.id as keyof FoundationEntry] || '';
                const isTextarea = section.isTextarea !== false; // Default to textarea
                return (
                  <Card key={section.id} className="bg-neutral-900/50 border border-yellow-600/20">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                      {isTextarea ? (
                        <textarea
                          value={value}
                          onChange={(e) => handleChange(section.id, e.target.value)}
                          className="w-full h-32 bg-neutral-800 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-yellow-500"
                          placeholder={section.placeholder}
                        />
                      ) : (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleChange(section.id, e.target.value)}
                          className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                          placeholder={section.placeholder}
                        />
                      )}
                    </div>
                  </Card>
                );
              })}

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFoundation(null);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  variant="outline"
                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  onClick={(e) => {
                    console.log('🔘 Foundation: Save button clicked', { 
                      submitting, 
                      user: !!user,
                      formData: formData
                    });
                    // Don't prevent default - let form submit normally
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                  style={{ pointerEvents: submitting ? 'none' : 'auto' }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {submitting ? 'Saving...' : editingFoundation ? 'Update Foundation' : 'Save Foundation'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FoundationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin text-yellow-400 text-4xl">⏳</div>
      </div>
    }>
      <FoundationPageContent />
    </Suspense>
  );
}
