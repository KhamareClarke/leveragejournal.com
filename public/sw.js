const CACHE_NAME = 'leverage-journal-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/auth/signin',
  '/auth/signup',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline journal entries
self.addEventListener('sync', (event) => {
  if (event.tag === 'journal-sync') {
    event.waitUntil(syncJournalEntries());
  }
});

// Push notifications for goal reminders
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time to update your journal!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open-journal',
        title: 'Open Journal',
        icon: '/icons/journal-action.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-action.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Leverage Journal™', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open-journal') {
    event.waitUntil(
      clients.openWindow('/dashboard?tab=do')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
  } else {
    // Default action - open dashboard
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Sync journal entries when back online
async function syncJournalEntries() {
  try {
    // Get pending journal entries from IndexedDB
    const pendingEntries = await getPendingJournalEntries();
    
    for (const entry of pendingEntries) {
      try {
        await fetch('/api/journal/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry)
        });
        
        // Remove from pending after successful sync
        await removePendingEntry(entry.id);
      } catch (error) {
        console.log('Failed to sync entry:', entry.id);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingJournalEntries() {
  // Implementation for getting pending entries from IndexedDB
  return [];
}

async function removePendingEntry(id) {
  // Implementation for removing synced entries from IndexedDB
}
