import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../core/services/notifications.service';
import { Notification, NotificationFilter } from '../../../core/models/notification.model';
import { NotificationCard } from '../components/notification-card/notification-card';

@Component({
  selector: 'app-notification-list',
  imports: [CommonModule, NotificationCard],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.scss',
})
export class NotificationList implements OnInit {
  notifications: Notification[] = [];
  activeFilter: NotificationFilter = 'all';
  unreadCount = 0;
  loading = true;
  error: string | null = null;
  markingAll = false;

  readonly filters: { value: NotificationFilter; label: () => string }[] = [
    { value: 'all', label: () => 'All' },
    { value: 'unread', label: () => `Unread (${this.unreadCount})` },
    { value: 'read', label: () => 'Read' },
  ];

  readonly skeletons = [1, 2, 3];

  constructor(
    private svc: NotificationsService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.svc.unreadCount$.subscribe(count => {
      this.unreadCount = count;
      this.cdr.detectChanges();
    });
    this.fetchAll();
  }

  setFilter(f: NotificationFilter): void {
    if (this.activeFilter === f) return;
    this.activeFilter = f;
    this.fetch(f);
  }

  markAllAsRead(): void {
    this.markingAll = true;
    this.svc.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({ ...n, read: true }));
        this.markingAll = false;
        if (this.activeFilter === 'unread') this.notifications = [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.markingAll = false;
        this.cdr.detectChanges();
      },
    });
  }

  onMarkRead(id: string): void {
    this.svc.markAsRead(id).subscribe({
      next: () => {
        const idx = this.notifications.findIndex(n => n.id === id);
        if (idx !== -1) {
          this.notifications[idx] = { ...this.notifications[idx], read: true };
          if (this.activeFilter === 'unread') {
            this.notifications.splice(idx, 1);
          }
        }
        this.cdr.detectChanges();
      },
    });
  }

  onCardClicked(notification: Notification): void {
    if (!notification.read) this.onMarkRead(notification.id);
    this.router.navigate(['/dashboard/feedback']);
  }

  get emptyMessage(): string {
    if (this.activeFilter === 'unread') return "You're all caught up! 🎉";
    if (this.activeFilter === 'read') return 'No read notifications';
    return 'You have no notifications yet';
  }

  private fetchAll(): void {
    this.loading = true;
    this.svc.getAll('all').subscribe({
      next: list => {
        this.notifications = list;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load notifications. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private fetch(filter: NotificationFilter): void {
    this.loading = true;
    this.error = null;
    this.svc.getAll(filter).subscribe({
      next: list => {
        this.notifications = list;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load notifications. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  retry(): void {
    this.fetch(this.activeFilter);
  }
}
