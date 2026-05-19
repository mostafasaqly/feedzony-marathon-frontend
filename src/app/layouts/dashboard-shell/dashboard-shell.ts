import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService, User } from '../../core/services/auth';
import { NotificationsService } from '../../core/services/notifications.service';
import { BillingService } from '../../core/services/billing.service';
import { NotificationBell } from '../components/notification-bell/notification-bell';
import { PlanLimitModal, LimitFeature } from '../../pages/billing/components/plan-limit-modal/plan-limit-modal';

@Component({
  selector: 'app-dashboard-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TitleCasePipe,
    AsyncPipe,
    NotificationBell,
    PlanLimitModal,
  ],
  templateUrl: './dashboard-shell.html',
  styleUrl: './dashboard-shell.scss',
})
export class DashboardShell implements OnInit {
  currentUser: User | null = null;

  /** Locked-feature modal state for Free users clicking Pro-only links. */
  showLimitModal = false;
  limitFeature: LimitFeature = 'analytics';

  constructor(
    private auth: AuthService,
    private router: Router,
    public notificationsSvc: NotificationsService,
    public billing: BillingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    // Populate shared plan/usage state once for the whole dashboard.
    this.billing.loadUsage().subscribe({ error: () => {} });
  }

  /** True when the current plan is Free (or usage not yet loaded). */
  isFreePlan(planName: string | null | undefined): boolean {
    return planName !== 'Pro';
  }

  /** Intercept a Pro-only sidebar link for Free users. */
  guardedNavigate(feature: LimitFeature, path: string, isFree: boolean): void {
    if (isFree) {
      this.limitFeature = feature;
      this.showLimitModal = true;
      this.cdr.detectChanges();
      return;
    }
    this.router.navigate([path]);
  }

  closeLimitModal(): void {
    this.showLimitModal = false;
  }

  onLimitUpgrade(): void {
    this.showLimitModal = false;
    this.router.navigate(['/dashboard/billing']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
