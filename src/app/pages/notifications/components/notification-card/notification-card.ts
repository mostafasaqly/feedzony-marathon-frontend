import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../../core/models/notification.model';
import { timeAgo } from '../../../../core/utils/time.util';

@Component({
  selector: 'app-notification-card',
  imports: [CommonModule],
  templateUrl: './notification-card.html',
  styleUrl: './notification-card.scss',
})
export class NotificationCard {
  @Input() notification!: Notification;
  @Input() compact = false;

  @Output() markRead = new EventEmitter<string>();
  @Output() clicked = new EventEmitter<Notification>();

  timeAgo = timeAgo;

  get truncatedMessage(): string {
    const msg = this.notification.message;
    return msg.length > 60 ? msg.slice(0, 60) + '…' : msg;
  }

  onMarkRead(event: Event): void {
    event.stopPropagation();
    this.markRead.emit(this.notification.id);
  }

  onClick(): void {
    this.clicked.emit(this.notification);
  }
}
