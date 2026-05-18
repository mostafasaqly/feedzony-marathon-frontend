import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServicesService } from '../../../core/services/services.service';
import { generateSlug } from '../../../core/utils/slug';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-service',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-service.html',
  styleUrl: './edit-service.scss',
})
export class EditService implements OnInit {
  form!: FormGroup;
  loading = false;
  fetchLoading = true;
  error = '';
  fetchError = '';
  serviceId = '';
  slugManuallyEdited = false;

  readonly publicUrl = environment.publicUrl;

  constructor(
    private fb: FormBuilder,
    private svc: ServicesService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.maxLength(300)]],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    });

    this.form.get('name')!.valueChanges.subscribe((val: string) => {
      if (!this.slugManuallyEdited) {
        this.form.get('slug')!.setValue(generateSlug(val), { emitEvent: false });
      }
    });

    this.form.get('slug')!.valueChanges.subscribe(() => {
      this.slugManuallyEdited = true;
    });

    this.serviceId = this.route.snapshot.paramMap.get('id') ?? '';
    this.svc.getOne(this.serviceId).subscribe({
      next: (service) => {
        this.slugManuallyEdited = true;
        this.form.patchValue({
          name: service.name,
          description: service.description ?? '',
          slug: service.slug,
        });
        this.fetchLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.fetchError = 'Failed to load service.';
        this.fetchLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get f() { return this.form.controls; }
  get descLength(): number { return (this.form.get('description')?.value ?? '').length; }
  get slugPreview(): string { return this.form.get('slug')?.value ?? ''; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const { name, description, slug } = this.form.value;

    this.svc.update(this.serviceId, { name, description, slug }).subscribe({
      next: () => this.router.navigate(['/dashboard/services']),
      error: (err) => {
        this.loading = false;
        if (err?.status === 409) {
          this.error = 'This slug is already taken. Please try another.';
        } else {
          this.error = 'Failed to update service. Please try again.';
        }
        this.cdr.detectChanges();
      },
    });
  }
}
