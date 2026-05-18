import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from '../../core/services/services.service';
import { FeedbackService } from '../../core/services/feedback.service';
import { Service } from '../../core/models/service.model';
import { StarRating } from '../../shared/components/star-rating/star-rating';

type View = 'loading' | 'form' | 'success' | 'not-found';

@Component({
  selector: 'app-public-feedback',
  imports: [CommonModule, ReactiveFormsModule, StarRating],
  templateUrl: './public-feedback.html',
  styleUrl: './public-feedback.scss',
})
export class PublicFeedback implements OnInit {
  service: Partial<Service> | null = null;
  view: View = 'loading';
  form!: FormGroup;
  submitting = false;
  submitError = '';
  submittedRating = 0;
  slug = '';

  constructor(
    private route: ActivatedRoute,
    private svc: ServicesService,
    private feedbackSvc: FeedbackService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.maxLength(500)],
    });

    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.svc.getBySlug(this.slug).subscribe({
      next: (s) => {
        this.service = s;
        this.view = 'form';
        this.cdr.detectChanges();
      },
      error: () => {
        this.view = 'not-found';
        this.cdr.detectChanges();
      },
    });
  }

  get commentLength(): number {
    return this.form.get('comment')?.value?.length ?? 0;
  }

  get selectedRating(): number {
    return this.form.get('rating')?.value ?? 0;
  }

  onRatingChange(rating: number): void {
    this.form.get('rating')!.setValue(rating);
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.form.invalid || this.selectedRating === 0) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.submitError = '';
    const { rating, comment } = this.form.value;

    this.feedbackSvc.submit(this.slug, { rating, comment: comment || undefined }).subscribe({
      next: () => {
        this.submittedRating = rating;
        this.view = 'success';
        this.submitting = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.submitError = 'Something went wrong. Please try again.';
        this.submitting = false;
        this.cdr.detectChanges();
      },
    });
  }

  resetForm(): void {
    this.form.reset({ rating: 0, comment: '' });
    this.submitError = '';
    this.view = 'form';
    this.cdr.detectChanges();
  }
}
