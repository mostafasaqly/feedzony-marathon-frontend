import { Component, EventEmitter, Input, Output } from '@angular/core';

export type LimitFeature = 'service' | 'feedback' | 'analytics' | 'notifications';

interface LimitContent {
  title: string;
  message: string;
}

@Component({
  selector: 'app-plan-limit-modal',
  imports: [],
  templateUrl: './plan-limit-modal.html',
  styleUrl: './plan-limit-modal.scss',
})
export class PlanLimitModal {
  @Input() isOpen = false;
  @Input() feature: LimitFeature = 'service';

  @Output() closed = new EventEmitter<void>();
  @Output() upgrade = new EventEmitter<void>();

  private readonly content: Record<LimitFeature, LimitContent> = {
    service: {
      title: 'Service Limit Reached',
      message:
        'Your Free plan allows 1 service. Upgrade to Pro for unlimited services.',
    },
    feedback: {
      title: 'Feedback Limit Reached',
      message:
        "You've reached your monthly feedback limit. Upgrade to Pro for unlimited feedback.",
    },
    analytics: {
      title: 'Analytics is a Pro Feature',
      message: 'Upgrade to Pro to unlock full analytics for all your services.',
    },
    notifications: {
      title: 'Notifications is a Pro Feature',
      message: 'Upgrade to Pro to receive real-time feedback notifications.',
    },
  };

  get title(): string {
    return this.content[this.feature].title;
  }

  get message(): string {
    return this.content[this.feature].message;
  }

  onClose(): void {
    this.closed.emit();
  }

  onUpgrade(): void {
    this.upgrade.emit();
  }
}
