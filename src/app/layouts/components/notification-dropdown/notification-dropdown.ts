import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NotificationsService } from '../../../core/services/notifications.service';
import { Notification } from '../../../core/models/notification.model';
import { NotificationCard } from '../../../pages/notifications/components/notification-card/notification-card';

@Component({
  selector: 'app-notification-dropdown',
  imports: [CommonModule, RouterLink, NotificationCard],
  templateUrl: './notification-dropdown.html',
  styleUrl: './notification-dropdown.scss',
})
export class NotificationDropdown implements OnChanges {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() countChanged = new EventEmitter<number>();

  notifications: Notification[] = [];
  loading = true;

  constructor(
    private svc: NotificationsService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.load();
    }
  }

  load(): void {
    this.loading = true;
    this.svc.getRecent().subscribe({
      next: list => {
        this.notifications = list;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  markAllAsRead(): void {
    this.svc.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({ ...n, read: true }));
        this.countChanged.emit(0);
        this.cdr.detectChanges();
      },
    });
  }

  onCardClicked(notification: Notification): void {
    if (!notification.read) {
      this.svc.markAsRead(notification.id).subscribe({
        next: () => {
          const idx = this.notifications.findIndex(n => n.id === notification.id);
          if (idx !== -1) this.notifications[idx] = { ...this.notifications[idx], read: true };
          const newCount = this.notifications.filter(n => !n.read).length;
          this.countChanged.emit(newCount);
          this.cdr.detectChanges();
        },
      });
    }
    this.router.navigate(['/dashboard/feedback']);
    this.closed.emit();
  }

  get hasUnread(): boolean {
    return this.notifications.some(n => !n.read);
  }

  readonly skeletons = [1, 2, 3];
}
