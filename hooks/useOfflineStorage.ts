'use client';

import { useState, useEffect } from 'react';

interface JournalEntry {
  id: string;
  day: number;
  date: string;
  gratitude: string;
  priorities: string[];
  tasks: { id: string; text: string; completed: boolean }[];
  reflection: string;
  mood: string;
  synced: boolean;
}

interface Goal {
  id: string;
  title: string;
  what: string;
  why: string;
  when: string;
  how: string;
  reward: string;
  milestones: { id: string; text: string; completed: boolean }[];
  category: 'short-term' | 'medium-term' | 'long-term';
  progress: number;
  synced: boolean;
}

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize IndexedDB
  const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('LeverageJournalDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create journal entries store
        if (!db.objectStoreNames.contains('journalEntries')) {
          const journalStore = db.createObjectStore('journalEntries', { keyPath: 'id' });
          journalStore.createIndex('day', 'day', { unique: false });
          journalStore.createIndex('synced', 'synced', { unique: false });
        }

        // Create goals store
        if (!db.objectStoreNames.contains('goals')) {
          const goalsStore = db.createObjectStore('goals', { keyPath: 'id' });
          goalsStore.createIndex('category', 'category', { unique: false });
          goalsStore.createIndex('synced', 'synced', { unique: false });
        }

        // Create foundation store
        if (!db.objectStoreNames.contains('foundation')) {
          const foundationStore = db.createObjectStore('foundation', { keyPath: 'id' });
          foundationStore.createIndex('synced', 'synced', { unique: false });
        }
      };
    });
  };

  // Save journal entry
  const saveJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'synced'>): Promise<string> => {
    const db = await initDB();
    const id = `journal_${entry.day}_${Date.now()}`;
    const fullEntry: JournalEntry = {
      ...entry,
      id,
      synced: isOnline
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['journalEntries'], 'readwrite');
      const store = transaction.objectStore('journalEntries');
      const request = store.put(fullEntry);

      request.onsuccess = () => {
        if (!isOnline) {
          setPendingSyncCount(prev => prev + 1);
          // Register for background sync
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
              // Background sync will be handled by service worker
              console.log('Service worker ready for background sync');
            });
          }
        }
        resolve(id);
      };
      request.onerror = () => reject(request.error);
    });
  };

  // Get journal entry by day
  const getJournalEntry = async (day: number): Promise<JournalEntry | null> => {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['journalEntries'], 'readonly');
      const store = transaction.objectStore('journalEntries');
      const index = store.index('day');
      const request = index.get(day);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  };

  // Save goal
  const saveGoal = async (goal: Omit<Goal, 'id' | 'synced'>): Promise<string> => {
    const db = await initDB();
    const id = `goal_${Date.now()}`;
    const fullGoal: Goal = {
      ...goal,
      id,
      synced: isOnline
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['goals'], 'readwrite');
      const store = transaction.objectStore('goals');
      const request = store.put(fullGoal);

      request.onsuccess = () => {
        if (!isOnline) {
          setPendingSyncCount(prev => prev + 1);
        }
        resolve(id);
      };
      request.onerror = () => reject(request.error);
    });
  };

  // Get all goals
  const getGoals = async (): Promise<Goal[]> => {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['goals'], 'readonly');
      const store = transaction.objectStore('goals');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  };

  // Get pending sync items
  const getPendingSyncItems = async (): Promise<{ journals: JournalEntry[]; goals: Goal[] }> => {
    const db = await initDB();
    
    const getUnsyncedJournals = (): Promise<JournalEntry[]> => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['journalEntries'], 'readonly');
        const store = transaction.objectStore('journalEntries');
        const index = store.index('synced');
        const request = index.getAll(IDBKeyRange.only(false));

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    };

    const getUnsyncedGoals = (): Promise<Goal[]> => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['goals'], 'readonly');
        const store = transaction.objectStore('goals');
        const index = store.index('synced');
        const request = index.getAll(IDBKeyRange.only(false));

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    };

    const [journals, goals] = await Promise.all([
      getUnsyncedJournals(),
      getUnsyncedGoals()
    ]);

    return { journals, goals };
  };

  // Mark item as synced
  const markAsSynced = async (type: 'journal' | 'goal', id: string): Promise<void> => {
    const db = await initDB();
    const storeName = type === 'journal' ? 'journalEntries' : 'goals';
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.synced = true;
          const putRequest = store.put(item);
          putRequest.onsuccess = () => {
            setPendingSyncCount(prev => Math.max(0, prev - 1));
            resolve();
          };
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  };

  // Sync all pending items when back online
  const syncPendingItems = async (): Promise<void> => {
    if (!isOnline) return;

    try {
      const { journals, goals } = await getPendingSyncItems();
      
      // Sync journals
      for (const journal of journals) {
        try {
          // This would be the actual API call - Faiz will implement
          await fetch('/api/journal/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(journal)
          });
          await markAsSynced('journal', journal.id);
        } catch (error) {
          console.error('Failed to sync journal:', journal.id, error);
        }
      }

      // Sync goals
      for (const goal of goals) {
        try {
          // This would be the actual API call - Faiz will implement
          await fetch('/api/goals/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(goal)
          });
          await markAsSynced('goal', goal.id);
        } catch (error) {
          console.error('Failed to sync goal:', goal.id, error);
        }
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingSyncCount > 0) {
      syncPendingItems();
    }
  }, [isOnline, pendingSyncCount]);

  return {
    isOnline,
    pendingSyncCount,
    saveJournalEntry,
    getJournalEntry,
    saveGoal,
    getGoals,
    getPendingSyncItems,
    syncPendingItems,
    markAsSynced
  };
}
