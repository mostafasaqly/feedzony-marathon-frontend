import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../../core/services/billing.service';
import { MyUsage } from '../../../core/models/billing.model';
import { UsageBar } from '../components/usage-bar/usage-bar';
import { UpgradeModal } from '../components/upgrade-modal/upgrade-modal';

@Component({
  selector: 'app-billing-dashboard',
  imports: [UsageBar, UpgradeModal],
  templateUrl: './billing-dashboard.html',
  styleUrl: './billing-dashboard.scss',
})
export class BillingDashboard implements OnInit {
  usage: MyUsage | null = null;
  loading = true;
  error = '';

  showUpgradeModal = false;
  showLimitModal = false;
  successMessage = '';

  constructor(
    private billing: BillingService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Lemon Squeezy redirects back here with ?checkout=success after payment.
    this.route.queryParams.subscribe((q) => {
      if (q['checkout'] === 'success') {
        this.successMessage = 'Welcome to Pro! 🎉';
        // Webhook may lag a moment — refetch shortly after.
        setTimeout(() => this.load(), 1500);
      }
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.billing.loadUsage().subscribe({
      next: (usage) => {
        this.usage = usage;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load billing information. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get isPro(): boolean {
    return this.usage?.plan?.name === 'Pro';
  }

  get planDescription(): string {
    return this.isPro
      ? 'You have full access to unlimited services, analytics, and notifications.'
      : 'Your Free plan includes the essentials. Upgrade for unlimited access.';
  }

  /** True if any tracked usage metric is at or above 90% of its limit. */
  get nearLimit(): boolean {
    if (!this.usage) return false;
    const u = this.usage.usage;
    return (
      this.overNinety(u.servicesUsed, u.servicesLimit) ||
      this.overNinety(u.feedbackThisMonth, u.feedbackLimit)
    );
  }

  private overNinety(used: number, limit: number): boolean {
    if (limit === -1 || limit <= 0) return false;
    return (used / limit) * 100 >= 90;
  }

  openUpgradeModal(): void {
    this.showUpgradeModal = true;
  }

  closeUpgradeModal(): void {
    this.showUpgradeModal = false;
  }

  onUpgradeConfirmed(): void {
    this.successMessage = 'Welcome to Pro! 🎉';
    this.load();
  }

  goToPlans(): void {
    this.router.navigate(['/plans']);
  }
}
