import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServicesService } from '../../../core/services/services.service';
import { BillingService } from '../../../core/services/billing.service';
import { Service } from '../../../core/models/service.model';
import { MyUsage } from '../../../core/models/billing.model';
import { environment } from '../../../../environments/environment';
import { PlanLimitModal } from '../../billing/components/plan-limit-modal/plan-limit-modal';

@Component({
  selector: 'app-service-list',
  imports: [CommonModule, RouterLink, PlanLimitModal],
  templateUrl: './service-list.html',
  styleUrl: './service-list.scss',
})
export class ServiceList implements OnInit, OnDestroy {
  services: Service[] = [];
  loading = true;
  error = '';
  copiedId: string | null = null;

  usage: MyUsage | null = null;
  showLimitModal = false;
  private usageSub?: Subscription;

  constructor(
    private svc: ServicesService,
    private billing: BillingService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
    // Use the shared usage state — no extra HTTP call.
    this.usageSub = this.billing.currentUsage$.subscribe((u) => {
      this.usage = u;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.usageSub?.unsubscribe();
  }

  /** True when the Free plan service limit has been reached. */
  get atServiceLimit(): boolean {
    if (!this.usage) return false;
    const { plan, usage } = this.usage;
    if (plan.maxServices === -1) return false;
    return usage.servicesUsed >= usage.servicesLimit;
  }

  /** Blocked click on the create button — show the limit modal. */
  onCreateBlocked(): void {
    this.showLimitModal = true;
  }

  closeLimitModal(): void {
    this.showLimitModal = false;
  }

  onLimitUpgrade(): void {
    this.showLimitModal = false;
    this.router.navigate(['/dashboard/billing']);
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.svc.getAll().subscribe({
      next: (list) => {
        this.services = Array.isArray(list) ? list : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load services. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  publicLink(slug: string): string {
    return `${environment.publicUrl}/f/${slug}`;
  }

  copyLink(service: Service): void {
    navigator.clipboard.writeText(this.publicLink(service.slug)).then(() => {
      this.copiedId = service.id;
      setTimeout(() => (this.copiedId = null), 2000);
    });
  }

  edit(id: string): void {
    this.router.navigate(['/dashboard/services', id, 'edit']);
  }

  viewFeedback(id: string): void {
    this.router.navigate(['/dashboard/feedback', id]);
  }

  confirmDelete(service: Service): void {
    if (!confirm(`Delete "${service.name}"? This cannot be undone.`)) return;
    this.svc.delete(service.id).subscribe({
      next: () => {
        this.load();
        // Reflect the freed-up slot in shared usage state.
        this.billing.loadUsage().subscribe({ error: () => {} });
      },
      error: () => alert('Failed to delete service. Please try again.'),
    });
  }

  truncate(text: string | undefined, max: number): string {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '…' : text;
  }
}
