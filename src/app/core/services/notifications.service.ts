import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Notification, UnreadCount, NotificationFilter } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private base = environment.apiUrl;

  unreadCount$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  setUnreadCount(count: number): void {
    this.unreadCount$.next(count);
  }

  getAll(filter: NotificationFilter = 'all'): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.base}/notifications`, {
      params: { filter },
    });
  }

  getRecent(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.base}/notifications/recent`);
  }

  getUnreadCount(): Observable<UnreadCount> {
    return this.http.get<UnreadCount>(`${this.base}/notifications/unread-count`).pipe(
      tap(res => this.unreadCount$.next(res.count)),
    );
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.patch<Notification>(`${this.base}/notifications/${id}/read`, {}).pipe(
      tap(() => {
        const current = this.unreadCount$.value;
        if (current > 0) this.unreadCount$.next(current - 1);
      }),
    );
  }

  markAllAsRead(): Observable<{ updated: number }> {
    return this.http.patch<{ updated: number }>(`${this.base}/notifications/read-all`, {}).pipe(
      tap(() => this.unreadCount$.next(0)),
    );
  }
}
