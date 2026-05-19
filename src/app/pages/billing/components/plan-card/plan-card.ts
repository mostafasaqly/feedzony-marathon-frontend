import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Plan } from '../../../../core/models/billing.model';

@Component({
  selector: 'app-plan-card',
  imports: [],
  templateUrl: './plan-card.html',
  styleUrl: './plan-card.scss',
})
export class PlanCard {
  @Input() plan!: Plan;
  @Input() isCurrentPlan = false;
  @Input() billingCycle: 'monthly' | 'yearly' = 'monthly';

  @Output() selectPlan = new EventEmitter<Plan>();

  get isPro(): boolean {
    return this.plan?.name === 'Pro';
  }

  get isFreePlan(): boolean {
    return this.plan?.price === 0;
  }

  /** Effective monthly price after the yearly 20% discount. */
  get displayPrice(): number {
    if (this.isFreePlan) return 0;
    if (this.billingCycle === 'yearly') {
      return Math.round(this.plan.price * 0.8 * 100) / 100;
    }
    return this.plan.price;
  }

  /** Strikethrough original price, shown only on yearly for paid plans. */
  get showStrikethrough(): boolean {
    return this.billingCycle === 'yearly' && !this.isFreePlan;
  }

  get servicesText(): string {
    if (this.plan.maxServices === -1) return 'Unlimited Services';
    return `${this.plan.maxServices} Service${this.plan.maxServices === 1 ? '' : 's'}`;
  }

  get feedbackText(): string {
    if (this.plan.maxFeedback === -1) return 'Unlimited Feedback/month';
    return `${this.plan.maxFeedback} Feedback/month`;
  }

  get ctaLabel(): string {
    if (this.isCurrentPlan) return 'Current Plan';
    if (this.isPro) return 'Upgrade to Pro';
    return 'Downgrade to Free';
  }

  get ctaClass(): string {
    if (this.isCurrentPlan) return 'cta-current';
    if (this.isPro) return 'cta-upgrade';
    return 'cta-downgrade';
  }

  onSelect(): void {
    if (this.isCurrentPlan) return;
    this.selectPlan.emit(this.plan);
  }
}
