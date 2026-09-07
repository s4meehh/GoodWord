export type CustomerStatus =
  | 'QUEUED'
  | 'DISPATCHED'
  | 'CLICKED'
  | 'CONVERTED'
  | 'INTERCEPTED'
  | 'OPTED_OUT';

export type PosSource = 'Square' | 'Stripe' | 'Clover' | 'Manual' | 'Webhook' | 'Zapier';

export interface AuditEvent {
  id: string;
  step: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  timestamp: string;
  iconType: 'receipt' | 'clock' | 'message-square' | 'mouse-pointer' | 'star' | 'shield-alert' | 'ban';
  details?: Record<string, string | number | boolean>;
}

export interface CustomerRecord {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  maskedPhone: string;
  email?: string;
  posSource: PosSource;
  referenceId?: string;
  transactionAmount?: number;
  status: CustomerStatus;
  createdAt: string;
  scheduledAt: string;
  sentAt?: string;
  clickedAt?: string;
  convertedAt?: string;
  interceptedAt?: string;
  rating?: number;
  ratingSentiment?: 'positive' | 'negative' | 'none';
  googleReviewUrl?: string;
  carrierDeliveryStatus?: 'delivered' | 'sent' | 'queued' | 'undelivered';
  twilioSid?: string;
  userAgent?: string;
  coolingDelayHours: number;
  auditTrail: AuditEvent[];
  privateFeedback?: {
    id: string;
    rating: number;
    comment: string;
    contactPreference: 'Phone' | 'Email';
    resolved: boolean;
    managerNotes?: string;
    createdAt: string;
    resolvedAt?: string;
  };
}

export interface Tenant {
  id: string;
  name: string;
  industry: 'Dental' | 'MedSpa' | 'HVAC' | 'Automotive' | 'Legal';
  googlePlaceId: string;
  googleMapsReviewUrl: string;
  apiKey: string;
  webhookSecret: string;
  defaultDelayHours: number;
  smsTemplate: string;
  businessPhone: string;
  accentColor: string;
}

export type DateRange = '7D' | '30D' | '90D' | 'ALL';

export interface DashboardMetrics {
  dispatchedInvites: number;
  deliverySuccessRate: number; // e.g. 98.4
  starConversionRate: number; // e.g. 74.2
  interceptedNegatives: number; // shield count
  reviewVelocityHours: number; // e.g. 4.6
  totalTransactions: number;
  activeInQueue: number;
  dispatchedChangePercent: number;
  conversionChangePercent: number;
  shieldChangePercent: number;
  velocityChangePercent: number;
}

export type ActiveNavTab =
  | 'dashboard'
  | 'feedback'
  | 'delivery'
  | 'integrations'
  | 'export'
  | 'funnel-preview';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
