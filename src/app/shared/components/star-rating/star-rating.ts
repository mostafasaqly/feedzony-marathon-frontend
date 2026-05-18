import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  imports: [CommonModule],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  @Input() rating = 0;
  @Input() readonly = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() ratingChange = new EventEmitter<number>();

  hovered = 0;
  stars = [1, 2, 3, 4, 5];

  readonly labels: Record<number, string> = {
    1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
  };

  constructor(private cdr: ChangeDetectorRef) {}

  get activeRating(): number {
    return this.readonly ? this.rating : (this.hovered || this.rating);
  }

  get label(): string {
    return this.labels[this.rating] ?? '';
  }

  onHover(star: number): void {
    if (this.readonly) return;
    this.hovered = star;
    this.cdr.markForCheck();
  }

  onLeave(): void {
    if (this.readonly) return;
    this.hovered = 0;
    this.cdr.markForCheck();
  }

  onSelect(star: number): void {
    if (this.readonly) return;
    this.rating = star;
    this.ratingChange.emit(star);
    this.cdr.markForCheck();
  }
}
