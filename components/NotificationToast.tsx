'use client';

type NotificationToastProps = {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
};

export function NotificationToast({ message, type, onDismiss }: NotificationToastProps) {
  const color =
    type === 'success'
      ? 'bg-green-600'
      : type === 'error'
      ? 'bg-red-600'
      : 'bg-blue-600';

  return (
    <div className={`${color} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[260px]`}>
      <span className="text-sm flex-1">{message}</span>
      <button className="text-white/90 hover:text-white" onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}
