import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  imports: [CommonModule],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
})
export class KpiCard {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() icon = '';
  @Input() trend?: number;
  @Input() loading = false;

  get trendPositive(): boolean {
    return (this.trend ?? 0) >= 0;
  }

  get trendLabel(): string {
    if (this.trend === undefined || this.trend === null) return '';
    const sign = this.trend >= 0 ? '+' : '';
    return `${sign}${this.trend}% vs last period`;
  }
}
