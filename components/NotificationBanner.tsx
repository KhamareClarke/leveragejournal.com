'use client';

type NotificationBannerProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
};

export function NotificationBanner({ message, type = 'info' }: NotificationBannerProps) {
  const color =
    type === 'success'
      ? 'bg-green-100 text-green-800 border-green-300'
      : type === 'error'
      ? 'bg-red-100 text-red-800 border-red-300'
      : 'bg-blue-100 text-blue-800 border-blue-300';

  return (
    <div className={`w-full border ${color} px-4 py-3 rounded-md text-sm`}>
      {message}
    </div>
  );
}
