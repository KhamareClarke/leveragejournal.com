'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { NotificationToast } from '@/components/NotificationToast';

type NotificationType = 'success' | 'error' | 'info';
type NotificationItem = { id: string; message: string; type: NotificationType };

type NotificationContextType = {
  addNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (message: string, type: NotificationType = 'info') => {
    const item = { id: id(), message, type };
    setNotifications((prev) => [...prev, item]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    }, 3000);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const value = useMemo(() => ({ addNotification, removeNotification }), []);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {notifications.map((n) => (
          <NotificationToast key={n.id} message={n.message} type={n.type} onDismiss={() => removeNotification(n.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
