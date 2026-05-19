import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BillingService } from '../../../core/services/billing.service';
import { AuthService } from '../../../core/services/auth';
import { Plan } from '../../../core/models/billing.model';
import { PlanCard } from '../components/plan-card/plan-card';
import { UpgradeModal } from '../components/upgrade-modal/upgrade-modal';

@Component({
  selector: 'app-plans-page',
  imports: [PlanCard, UpgradeModal],
  templateUrl: './plans-page.html',
  styleUrl: './plans-page.scss',
})
export class PlansPage implements OnInit {
  plans: Plan[] = [];
  billingCycle: 'monthly' | 'yearly' = 'monthly';
  currentPlanName: string | null = null;
  loading = true;
  error = '';

  showUpgradeModal = false;

  constructor(
    private billing: BillingService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.billing.getPlans().subscribe({
      next: (plans) => {
        this.plans = Array.isArray(plans) ? plans : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load plans. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });

    if (this.auth.isLoggedIn()) {
      this.billing.getMyPlan().subscribe({
        next: (res) => {
          this.currentPlanName = res?.plan?.name ?? null;
          this.cdr.detectChanges();
        },
        // 404 = no subscription row yet; treat as Free.
        error: () => {
          this.currentPlanName = 'Free';
          this.cdr.detectChanges();
        },
      });
    }
  }

  setCycle(cycle: 'monthly' | 'yearly'): void {
    this.billingCycle = cycle;
  }

  isCurrent(plan: Plan): boolean {
    return !!this.currentPlanName && plan.name === this.currentPlanName;
  }

  onSelectPlan(plan: Plan): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/register']);
      return;
    }

    if (plan.name === 'Pro') {
      this.showUpgradeModal = true;
      return;
    }

    // Free plan — confirm the downgrade.
    if (!confirm('Downgrade to the Free plan? You may lose access to Pro features.')) {
      return;
    }
    this.billing.changePlan('Free').subscribe({
      next: () => {
        this.currentPlanName = 'Free';
        this.billing.loadUsage().subscribe();
        this.cdr.detectChanges();
      },
      error: () => alert('Could not change plan. Please try again.'),
    });
  }

  onUpgradeConfirmed(): void {
    this.currentPlanName = 'Pro';
    this.billing.loadUsage().subscribe();
    this.cdr.detectChanges();
  }

  closeUpgradeModal(): void {
    this.showUpgradeModal = false;
  }
}
