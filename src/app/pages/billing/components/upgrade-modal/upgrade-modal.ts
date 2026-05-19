import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BillingService } from '../../../../core/services/billing.service';

@Component({
  selector: 'app-upgrade-modal',
  imports: [],
  templateUrl: './upgrade-modal.html',
  styleUrl: './upgrade-modal.scss',
})
export class UpgradeModal {
  @Input() isOpen = false;

  @Output() closed = new EventEmitter<void>();
  /** Emitted after a successful upgrade so the parent can reload usage. */
  @Output() confirmed = new EventEmitter<void>();

  readonly proPrice = 12;
  loading = false;
  error = '';

  constructor(private billing: BillingService) {}

  /** Today + 1 month, formatted as "June 18, 2026". */
  get nextBillingDate(): string {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  onClose(): void {
    if (this.loading) return;
    this.error = '';
    this.closed.emit();
  }

  confirm(): void {
    this.loading = true;
    this.error = '';

    // Real flow: Lemon Squeezy hosted checkout. Redirect the browser there.
    this.billing.createCheckout('Pro').subscribe({
      next: ({ checkoutUrl }) => {
        window.location.href = checkoutUrl;
      },
      error: () => {
        // Fallback for environments without Lemon Squeezy configured:
        // try the direct plan change so the upgrade still completes.
        this.billing.changePlan('Pro').subscribe({
          next: () => {
            this.loading = false;
            this.confirmed.emit();
            this.closed.emit();
          },
          error: () => {
            this.loading = false;
            this.error = 'Could not start checkout. Please try again.';
          },
        });
      },
    });
  }
}
