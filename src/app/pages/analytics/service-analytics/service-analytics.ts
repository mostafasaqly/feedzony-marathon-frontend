import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ServiceAnalytics as ServiceAnalyticsModel, AnalyticsPeriod } from '../../../core/models/analytics.model';
import { KpiCard } from '../components/kpi-card/kpi-card';
import { RatingDistributionChart } from '../components/rating-distribution-chart/rating-distribution-chart';
import { FeedbackOverTimeChart } from '../components/feedback-over-time-chart/feedback-over-time-chart';
import { StarRating } from '../../../shared/components/star-rating/star-rating';

@Component({
  selector: 'app-service-analytics',
  imports: [CommonModule, RouterLink, KpiCard, RatingDistributionChart, FeedbackOverTimeChart, StarRating],
  templateUrl: './service-analytics.html',
  styleUrl: './service-analytics.scss',
})
export class ServiceAnalytics implements OnInit {
  serviceId = '';
  period: AnalyticsPeriod = 'month';
  data: ServiceAnalyticsModel | null = null;
  loading = true;
  error: string | null = null;

  readonly periods: { value: AnalyticsPeriod; label: string }[] = [
    { value: 'week', label: '7 Days' },
    { value: 'month', label: '30 Days' },
    { value: 'all', label: 'All Time' },
  ];

  constructor(
    private route: ActivatedRoute,
    private analytics: AnalyticsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId') ?? '';
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

  relativeDate(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  }

  private fetch(): void {
    this.loading = true;
    this.error = null;
    this.analytics.getServiceAnalytics(this.serviceId, this.period).subscribe({
      next: d => {
        this.data = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load service analytics. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
