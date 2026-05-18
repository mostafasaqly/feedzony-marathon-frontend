import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { OverviewAnalytics, AnalyticsPeriod } from '../../../core/models/analytics.model';
import { KpiCard } from '../components/kpi-card/kpi-card';
import { RatingDistributionChart } from '../components/rating-distribution-chart/rating-distribution-chart';
import { FeedbackOverTimeChart } from '../components/feedback-over-time-chart/feedback-over-time-chart';
import { TopServicesTable } from '../components/top-services-table/top-services-table';

@Component({
  selector: 'app-analytics-overview',
  imports: [CommonModule, RouterLink, KpiCard, RatingDistributionChart, FeedbackOverTimeChart, TopServicesTable],
  templateUrl: './analytics-overview.html',
  styleUrl: './analytics-overview.scss',
})
export class AnalyticsOverview implements OnInit {
  period: AnalyticsPeriod = 'month';
  data: OverviewAnalytics | null = null;
  loading = true;
  error: string | null = null;

  readonly periods: { value: AnalyticsPeriod; label: string }[] = [
    { value: 'week', label: '7 Days' },
    { value: 'month', label: '30 Days' },
    { value: 'all', label: 'All Time' },
  ];

  constructor(private analytics: AnalyticsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetch();
  }

  setPeriod(p: AnalyticsPeriod): void {
    if (this.period === p) return;
    this.period = p;
    this.fetch();
  }

  retry(): void {
    this.fetch();
  }

  get avgRatingDisplay(): string {
    if (!this.data) return '—';
    return this.data.averageRating > 0 ? this.data.averageRating.toFixed(1) : '—';
  }

  private fetch(): void {
    this.loading = true;
    this.error = null;
    this.analytics.getOverview(this.period).subscribe({
      next: d => {
        this.data = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load analytics. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
