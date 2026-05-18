export interface Feedback {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  service: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface FeedbackStats {
  totalCount: number;
  averageRating: number;
  thisMonth: number;
}
