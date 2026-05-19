export interface Plan {
  id: string;
  name: string;
  price: number;
  maxServices: number; // -1 = unlimited
  maxFeedback: number; // -1 = unlimited
  hasAnalytics: boolean;
  hasNotifications: boolean;
  lemonVariantId?: string | null;
}

export interface Subscription {
  status: string;
  createdAt?: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string;
}

export interface MyUsage {
  plan: Plan;
  subscription: Subscription;
  usage: {
    servicesUsed: number;
    servicesLimit: number;
    feedbackThisMonth: number;
    feedbackLimit: number;
  };
}

export type PlanName = 'Free' | 'Pro';
