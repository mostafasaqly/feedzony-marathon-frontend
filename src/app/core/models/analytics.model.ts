export interface OverviewAnalytics {
  totalFeedback: number;
  averageRating: number;
  totalServices: number;
  thisMonth: number;
  ratingDistribution: Record<string, number>;
  feedbackOverTime: { date: string; count: number }[];
  topServices: {
    serviceId: string;
    serviceName: string;
    slug: string;
    totalFeedback: number;
    averageRating: number;
    lastFeedbackAt: string | null;
  }[];
}

export interface ServiceAnalytics {
  serviceId: string;
  serviceName: string;
  totalFeedback: number;
  averageRating: number;
  thisMonth: number;
  ratingDistribution: Record<string, number>;
  feedbackOverTime: { date: string; count: number }[];
  recentFeedback: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
  }[];
}

export type AnalyticsPeriod = 'week' | 'month' | 'all';
