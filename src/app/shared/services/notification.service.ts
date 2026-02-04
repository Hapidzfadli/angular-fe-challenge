import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification, NotificationType, DEFAULT_NOTIFICATION_DURATION, NotificationOptions } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private show(message: string, type: NotificationType, options?: NotificationOptions): void {
    const duration = options?.duration ?? DEFAULT_NOTIFICATION_DURATION;
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration
    };

    const current = this.notifications.value;
    this.notifications.next([...current, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(notification.id), duration);
    }
  }

  showSuccess(message: string, options?: NotificationOptions): void {
    this.show(message, 'success', options);
  }

  showWarning(message: string, options?: NotificationOptions): void {
    this.show(message, 'warning', options);
  }

  showError(message: string, options?: NotificationOptions): void {
    this.show(message, 'error', options);
  }

  showInfo(message: string, options?: NotificationOptions): void {
    this.show(message, 'info', options);
  }

  remove(id: string): void {
    const current = this.notifications.value;
    this.notifications.next(current.filter(n => n.id !== id));
  }

  clear(): void {
    this.notifications.next([]);
  }
}
