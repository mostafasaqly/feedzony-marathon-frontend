import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ServicesService } from '../../../core/services/services.service';
import { Service } from '../../../core/models/service.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-service-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './service-list.html',
  styleUrl: './service-list.scss',
})
export class ServiceList implements OnInit {
  services: Service[] = [];
  loading = true;
  error = '';
  copiedId: string | null = null;

  constructor(private svc: ServicesService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();
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
      next: () => this.load(),
      error: () => alert('Failed to delete service. Please try again.'),
    });
  }

  truncate(text: string | undefined, max: number): string {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '…' : text;
  }
}
