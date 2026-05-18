import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FeedbackService } from '../../../core/services/feedback.service';
import { Feedback, FeedbackStats } from '../../../core/models/feedback.model';
import { StarRating } from '../../../shared/components/star-rating/star-rating';

@Component({
  selector: 'app-feedback-list',
  imports: [CommonModule, RouterLink, StarRating],
  templateUrl: './feedback-list.html',
  styleUrl: './feedback-list.scss',
})
export class FeedbackList implements OnInit {
  allFeedback: Feedback[] = [];
  filtered: Feedback[] = [];
  stats: FeedbackStats | null = null;
  loading = true;
  error = '';
  serviceId = '';
  pageTitle = 'All Feedback';
  selectedService = 'all';

  constructor(
    private feedbackSvc: FeedbackService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId') ?? '';
    if (this.serviceId) {
      this.loadByService();
    } else {
      this.loadAll();
    }
  }

  get uniqueServices(): { id: string; name: string }[] {
    const map = new Map<string, string>();
    this.allFeedback.forEach(f => map.set(f.service.id, f.service.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }

  get averageDisplay(): string {
    if (!this.stats) return '—';
    return this.stats.averageRating > 0 ? this.stats.averageRating.toFixed(1) : '—';
  }

  private loadAll(): void {
    this.loading = true;
    this.feedbackSvc.getAll().subscribe({
      next: (list) => {
        this.allFeedback = list;
        this.filtered = list;
        this.buildAggregateStats(list);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load feedback. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadByService(): void {
    this.loading = true;
    this.feedbackSvc.getByService(this.serviceId).subscribe({
      next: (list) => {
        this.allFeedback = list;
        this.filtered = list;
        if (list.length > 0) {
          this.pageTitle = `Feedback for ${list[0].service.name}`;
        }
        this.feedbackSvc.getStats(this.serviceId).subscribe({
          next: (s) => {
            this.stats = s;
            this.cdr.detectChanges();
          },
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load feedback. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private buildAggregateStats(list: Feedback[]): void {
    if (list.length === 0) {
      this.stats = { totalCount: 0, averageRating: 0, thisMonth: 0 };
      return;
    }
    const now = new Date();
    const thisMonth = list.filter(f => {
      const d = new Date(f.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const avg = list.reduce((sum, f) => sum + f.rating, 0) / list.length;
    this.stats = { totalCount: list.length, averageRating: avg, thisMonth };
  }

  filterByService(serviceId: string): void {
    this.selectedService = serviceId;
    this.filtered = serviceId === 'all'
      ? this.allFeedback
      : this.allFeedback.filter(f => f.service.id === serviceId);
    this.cdr.detectChanges();
  }

  relativeDate(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  }
}
