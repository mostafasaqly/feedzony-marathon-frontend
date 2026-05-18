import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OverviewAnalytics } from '../../../../core/models/analytics.model';

@Component({
  selector: 'app-top-services-table',
  imports: [CommonModule],
  templateUrl: './top-services-table.html',
  styleUrl: './top-services-table.scss',
})
export class TopServicesTable {
  @Input() services: OverviewAnalytics['topServices'] = [];
  @Input() loading = false;

  constructor(private router: Router) {}

  get displayedServices(): OverviewAnalytics['topServices'] {
    return this.services.slice(0, 5);
  }

  get hasMore(): boolean {
    return this.services.length > 5;
  }

  navigate(serviceId: string): void {
    this.router.navigate(['/dashboard/analytics', serviceId]);
  }

  relativeDate(dateStr: string | null): string {
    if (!dateStr) return 'Never';
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
}
