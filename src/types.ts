export type ActiveTab = 'dashboard' | 'customers' | 'campaigns' | 'reviews' | 'settings';

export type CustomerReviewStatus = 'Sent' | 'Reviewed' | 'Pending';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  dateVisited: string;
  status: CustomerReviewStatus;
  notes?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1-5 stars
  text: string;
  date: string;
  source: 'Google Reviews' | 'Direct';
  avatarColor?: string;
}

export interface ChartDayData {
  day: string;
  count: number;
}

export interface DashboardStats {
  totalCustomers: number;
  totalReviews: number;
  reviewsSent: number;
  responseRate: number; // percentage, e.g. 80
  averageRating: number; // e.g. 4.8
  fiveStarCount: number; // e.g. 10
}

export interface CampaignConfig {
  messageTemplate: string;
  delayOption: 'Immediate' | '1 hour' | '2 hours';
}

export interface BusinessSettings {
  googleReviewUrl: string;
  webhookUrl: string;
  businessName: string;
  phone: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message?: string;
}
