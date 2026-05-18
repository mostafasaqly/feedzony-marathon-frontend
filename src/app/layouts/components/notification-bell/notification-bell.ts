import { Component, OnInit, OnDestroy, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../../../core/services/notifications.service';
import { NotificationDropdown } from '../notification-dropdown/notification-dropdown';

@Component({
  selector: 'app-notification-bell',
  imports: [CommonModule, NotificationDropdown],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.scss',
})
export class NotificationBell implements OnInit, OnDestroy {
  unreadCount = 0;
  isOpen = false;

  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private sub = new Subscription();

  constructor(
    private svc: NotificationsService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.svc.unreadCount$.subscribe(count => {
        this.unreadCount = count;
        this.cdr.detectChanges();
      }),
    );
    this.fetchCount();
    this.pollInterval = setInterval(() => this.fetchCount(), 30000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.sub.unsubscribe();
  }

  get badgeLabel(): string {
    return this.unreadCount > 9 ? '9+' : String(this.unreadCount);
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  onDropdownClosed(): void {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
        this.cdr.detectChanges();
      }
    }
  }

  private fetchCount(): void {
    this.svc.getUnreadCount().subscribe();
  }
}
