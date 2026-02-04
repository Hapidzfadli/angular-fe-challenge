export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
}

export const DEFAULT_NOTIFICATION_DURATION = 3000;

export interface NotificationOptions {
  duration?: number;
}
