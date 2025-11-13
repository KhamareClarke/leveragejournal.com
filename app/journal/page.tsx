'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function JournalPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [entriesByDay, setEntriesByDay] = useState<Record<number, any>>({});
  const [reviewsByWeek, setReviewsByWeek] = useState<Record<number, any>>({});
  const [foundations, setFoundations] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [joinDate, setJoinDate] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin?redirect=/journal');
      return;
    }

    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/journal/generate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEntriesByDay(data.entriesByDay || {});
        setReviewsByWeek(data.reviewsByWeek || {});
        setFoundations(data.foundations || []);
        setGoals(data.goals || []);
        setUserName(data.userName || '');
        setJoinDate(data.joinDate || '');
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update iframe when entries are loaded
  useEffect(() => {
    if (!loading) {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        // Use postMessage to send entries, reviews, foundation, goals, and user info (more reliable than direct access)
        iframe.contentWindow.postMessage({
          type: 'JOURNAL_ENTRIES',
          entriesByDay: entriesByDay,
          reviewsByWeek: reviewsByWeek,
          foundations: foundations,
          goals: goals,
          userName: userName,
          joinDate: joinDate
        }, '*');
        
        // Also set directly as fallback
        (iframe.contentWindow as any).userEntriesByDay = entriesByDay;
        (iframe.contentWindow as any).userReviewsByWeek = reviewsByWeek;
        (iframe.contentWindow as any).userFoundationEntries = foundations;
        (iframe.contentWindow as any).userGoals = goals;
        (iframe.contentWindow as any).userName = userName;
        (iframe.contentWindow as any).userJoinDate = joinDate;
      }
    }
  }, [entriesByDay, reviewsByWeek, foundations, goals, userName, joinDate, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin text-yellow-400 text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <iframe 
        src="/leverage/index.html" 
        className="w-full h-screen border-0"
        title="Leverage Journal"
        onLoad={(e) => {
          // Pass entries, reviews, and foundation data to iframe when it loads
          const iframe = e.currentTarget;
          if (iframe.contentWindow) {
            // Use postMessage
            iframe.contentWindow.postMessage({
              type: 'JOURNAL_ENTRIES',
              entriesByDay: entriesByDay,
              reviewsByWeek: reviewsByWeek,
              foundations: foundations,
              goals: goals,
              userName: userName,
              joinDate: joinDate
            }, '*');
            
            // Also set directly as fallback
            (iframe.contentWindow as any).userEntriesByDay = entriesByDay;
            (iframe.contentWindow as any).userReviewsByWeek = reviewsByWeek;
            (iframe.contentWindow as any).userFoundationEntries = foundations;
            (iframe.contentWindow as any).userGoals = goals;
            (iframe.contentWindow as any).userName = userName;
            (iframe.contentWindow as any).userJoinDate = joinDate;
          }
        }}
      />
    </div>
  );
}

