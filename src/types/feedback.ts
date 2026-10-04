export interface FeedbackResponse {
  id?: string;
  bookingNumber?: string;
  rating: number;
  content: string;
  createdAt?: string;
  senderName?: string;
  carName?: string;
}

export interface FeedbackDetailResponse {
  rating: number;
  content: string;
  senderName: string;
  createdAt: string;
}

export interface RatingOverview {
  averageRating: number;
  totalRatings: number;
  oneStarCount: number;
  twoStarCount: number;
  threeStarCount: number;
  fourStarCount: number;
  fiveStarCount: number;
}
