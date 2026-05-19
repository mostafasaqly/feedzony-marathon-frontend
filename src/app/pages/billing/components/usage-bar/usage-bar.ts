import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-usage-bar',
  imports: [],
  templateUrl: './usage-bar.html',
  styleUrl: './usage-bar.scss',
})
export class UsageBar {
  @Input() label = '';
  @Input() used = 0;
  @Input() limit = 0; // -1 = unlimited
  @Input() loading = false;

  get isUnlimited(): boolean {
    return this.limit === -1;
  }

  get limitText(): string {
    return this.isUnlimited ? 'Unlimited' : String(this.limit);
  }

  /** Bar fill percentage, clamped to 0–100. */
  get percent(): number {
    if (this.isUnlimited) return 100;
    if (this.limit <= 0) return 0;
    const pct = (this.used / this.limit) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }

  get overLimit(): boolean {
    return !this.isUnlimited && this.limit > 0 && this.used > this.limit;
  }

  /** Color class driven by usage percentage. */
  get colorClass(): string {
    if (this.isUnlimited) return 'green';
    if (this.overLimit) return 'over';
    const pct = (this.used / this.limit) * 100;
    if (pct >= 90) return 'red';
    if (pct >= 70) return 'amber';
    return 'green';
  }
}
