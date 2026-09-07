import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  CustomerRecord,
  CustomerStatus,
  DashboardMetrics,
  DateRange,
  Tenant,
  ToastMessage,
  ActiveNavTab,
  AuditEvent,
} from '../types';
import { INITIAL_CUSTOMERS, INITIAL_TENANTS } from '../data/seedData';

interface AppContextType {
  tenants: Tenant[];
  activeTenant: Tenant;
  setActiveTenantId: (id: string) => void;
  customers: CustomerRecord[];
  filteredCustomers: CustomerRecord[];
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  activeNavTab: ActiveNavTab;
  setActiveNavTab: (tab: ActiveNavTab) => void;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  quickSendOpen: boolean;
  setQuickSendOpen: (open: boolean) => void;
  funnelCustomerId: string;
  setFunnelCustomerId: (id: string) => void;
  metrics: DashboardMetrics;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  quickSendInvite: (data: {
    name: string;
    phone: string;
    referenceId?: string;
    sendImmediately: boolean;
  }) => void;
  simulateIncomingWebhook: (payload: {
    customer_name: string;
    customer_phone: string;
    transaction_amount: number;
    reference_id: string;
    pos_source: 'Square' | 'Stripe' | 'Clover' | 'Manual';
  }) => void;
  cancelQueuedSms: (customerId: string) => void;
  resendInviteNow: (customerId: string) => void;
  recordFunnelRating: (
    customerId: string,
    rating: number,
    feedbackText?: string,
    contactPref?: 'Phone' | 'Email'
  ) => void;
  resolveFeedbackTicket: (customerId: string, managerNotes: string) => void;
  updateSmsTemplate: (template: string, delayHours: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [activeTenantId, setActiveTenantId] = useState<string>('tenant-apex');
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [dateRange, setDateRange] = useState<DateRange>('30D');
  const [activeNavTab, setActiveNavTab] = useState<ActiveNavTab>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [quickSendOpen, setQuickSendOpen] = useState<boolean>(false);
  const [funnelCustomerId, setFunnelCustomerId] = useState<string>('cust-103');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const activeTenant = useMemo(() => {
    return tenants.find((t) => t.id === activeTenantId) || tenants[0];
  }, [tenants, activeTenantId]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter customers by tenant and date range
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (c.tenantId !== activeTenantId) return false;
      const createdTime = new Date(c.createdAt).getTime();
      const now = new Date('2026-09-07T12:46:52Z').getTime();
      const diffDays = (now - createdTime) / (1000 * 3600 * 24);

      if (dateRange === '7D') return diffDays <= 7;
      if (dateRange === '30D') return diffDays <= 30;
      if (dateRange === '90D') return diffDays <= 90;
      return true;
    });
  }, [customers, activeTenantId, dateRange]);

  // Dynamically calculate KPIs
  const metrics = useMemo<DashboardMetrics>(() => {
    const tenantCustomers = filteredCustomers;
    const totalTransactions = tenantCustomers.length;
    const dispatched = tenantCustomers.filter((c) =>
      ['DISPATCHED', 'CLICKED', 'CONVERTED', 'INTERCEPTED'].includes(c.status)
    );
    const converted = tenantCustomers.filter((c) => c.status === 'CONVERTED');
    const intercepted = tenantCustomers.filter((c) => c.status === 'INTERCEPTED');
    const activeInQueue = tenantCustomers.filter((c) => c.status === 'QUEUED').length;

    const dispatchedCount = dispatched.length;
    const conversionRate =
      dispatchedCount > 0
        ? parseFloat(((converted.length / dispatchedCount) * 100).toFixed(1))
        : 0;

    // Calculate average review velocity (hours from created to converted/intercepted)
    let totalVelocityHours = 0;
    let velocityCount = 0;

    tenantCustomers.forEach((c) => {
      const endTimestamp = c.convertedAt || c.interceptedAt;
      if (endTimestamp && c.createdAt) {
        const diff = (new Date(endTimestamp).getTime() - new Date(c.createdAt).getTime()) / (1000 * 3600);
        if (diff > 0) {
          totalVelocityHours += diff;
          velocityCount++;
        }
      }
    });

    const avgVelocity =
      velocityCount > 0 ? parseFloat((totalVelocityHours / velocityCount).toFixed(1)) : 2.4;

    return {
      dispatchedInvites: dispatchedCount,
      deliverySuccessRate: 98.4,
      starConversionRate: conversionRate || 74.2,
      interceptedNegatives: intercepted.length,
      reviewVelocityHours: avgVelocity,
      totalTransactions,
      activeInQueue,
      dispatchedChangePercent: 18.4,
      conversionChangePercent: 6.2,
      shieldChangePercent: 12.5,
      velocityChangePercent: -14.1,
    };
  }, [filteredCustomers]);

  const maskPhoneNumber = (rawPhone: string): string => {
    const cleaned = rawPhone.replace(/\D/g, '');
    if (cleaned.length >= 4) {
      const last4 = cleaned.slice(-4);
      return `+1 ••• ••• ${last4}`;
    }
    return '+1 ••• ••• 4821';
  };

  const quickSendInvite = ({
    name,
    phone,
    referenceId,
    sendImmediately,
  }: {
    name: string;
    phone: string;
    referenceId?: string;
    sendImmediately: boolean;
  }) => {
    const newId = `cust-${Date.now().toString().slice(-4)}`;
    const nowIso = new Date().toISOString();
    const delayHours = sendImmediately ? 0 : activeTenant.defaultDelayHours;
    const scheduledDate = new Date(Date.now() + delayHours * 3600 * 1000).toISOString();
    const status: CustomerStatus = sendImmediately ? 'DISPATCHED' : 'QUEUED';

    const auditTrail: AuditEvent[] = [
      {
        id: `aud-${Date.now()}-1`,
        step: 1,
        title: 'Manual Quick Send Triggered',
        description: `Dispatched via staff dashboard. Reference: ${referenceId || 'N/A'}.`,
        timestamp: 'Just now',
        iconType: 'receipt',
        details: { mode: sendImmediately ? 'Immediate' : `${delayHours}h cooling delay` },
      },
      {
        id: `aud-${Date.now()}-2`,
        step: 2,
        title: sendImmediately ? 'Immediate Dispatch Override' : 'Scheduled in Queue',
        description: sendImmediately
          ? 'Cooling delay bypassed by authorized staff member.'
          : `Scheduled to dispatch in ${delayHours} hours to respect customer cooling window.`,
        timestamp: 'Just now',
        iconType: 'clock',
      },
    ];

    if (sendImmediately) {
      auditTrail.push({
        id: `aud-${Date.now()}-3`,
        step: 3,
        title: 'SMS Dispatched',
        description: `Twilio carrier SMS routed to ${phone}. Verified delivery.`,
        timestamp: 'Just now',
        iconType: 'message-square',
        details: { sid: `SM${Math.random().toString(36).substring(2, 12)}`, carrier: 'Verizon' },
      });
    }

    const newRecord: CustomerRecord = {
      id: newId,
      tenantId: activeTenant.id,
      name,
      phone,
      maskedPhone: maskPhoneNumber(phone),
      posSource: 'Manual',
      referenceId: referenceId || `MAN-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionAmount: 450.0,
      status,
      createdAt: nowIso,
      scheduledAt: scheduledDate,
      sentAt: sendImmediately ? nowIso : undefined,
      carrierDeliveryStatus: sendImmediately ? 'delivered' : undefined,
      twilioSid: sendImmediately ? `SM${Math.random().toString(36).substring(2, 14)}` : undefined,
      coolingDelayHours: delayHours,
      auditTrail,
    };

    setCustomers((prev) => [newRecord, ...prev]);
    setFunnelCustomerId(newId);

    addToast({
      type: 'success',
      title: sendImmediately ? 'SMS Dispatched Instantly' : 'Customer Queued for Review',
      message: sendImmediately
        ? `Review invite sent to ${name} via Twilio.`
        : `${name} scheduled for SMS dispatch in ${delayHours} hours.`,
    });
  };

  const simulateIncomingWebhook = (payload: {
    customer_name: string;
    customer_phone: string;
    transaction_amount: number;
    reference_id: string;
    pos_source: 'Square' | 'Stripe' | 'Clover' | 'Manual';
  }) => {
    const newId = `cust-${Date.now().toString().slice(-4)}`;
    const nowIso = new Date().toISOString();
    const delayHours = activeTenant.defaultDelayHours;
    const scheduledDate = new Date(Date.now() + delayHours * 3600 * 1000).toISOString();

    const auditTrail: AuditEvent[] = [
      {
        id: `aud-${Date.now()}-1`,
        step: 1,
        title: 'Transaction Ingested',
        description: `${payload.pos_source} webhook captured payment ($${payload.transaction_amount.toFixed(2)}).`,
        timestamp: 'Just now',
        iconType: 'receipt',
        details: { source: `${payload.pos_source} API`, invoice: payload.reference_id },
      },
      {
        id: `aud-${Date.now()}-2`,
        step: 2,
        title: 'Scheduled in Queue',
        description: `Cooling delay of ${delayHours} hours applied per tenant config.`,
        timestamp: 'Just now',
        iconType: 'clock',
      },
    ];

    const newRecord: CustomerRecord = {
      id: newId,
      tenantId: activeTenant.id,
      name: payload.customer_name,
      phone: payload.customer_phone,
      maskedPhone: maskPhoneNumber(payload.customer_phone),
      posSource: payload.pos_source,
      referenceId: payload.reference_id,
      transactionAmount: payload.transaction_amount,
      status: 'QUEUED',
      createdAt: nowIso,
      scheduledAt: scheduledDate,
      coolingDelayHours: delayHours,
      auditTrail,
    };

    setCustomers((prev) => [newRecord, ...prev]);
    setFunnelCustomerId(newId);

    addToast({
      type: 'info',
      title: `POS Webhook Captured (${payload.pos_source})`,
      message: `Received $${payload.transaction_amount.toFixed(2)} transaction for ${payload.customer_name}. Scheduled in cooling queue.`,
    });
  };

  const cancelQueuedSms = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const updatedTrail: AuditEvent[] = [
            ...c.auditTrail,
            {
              id: `aud-${Date.now()}`,
              step: 2,
              title: 'SMS Cancelled by Operator',
              description: 'Customer was manually removed from the automated dispatch queue.',
              timestamp: 'Just now',
              iconType: 'ban',
            },
          ];
          return {
            ...c,
            status: 'OPTED_OUT',
            auditTrail: updatedTrail,
          };
        }
        return c;
      })
    );

    addToast({
      type: 'warning',
      title: 'Invite Cancelled',
      message: 'Customer removed from dispatch queue.',
    });
  };

  const resendInviteNow = (customerId: string) => {
    const nowIso = new Date().toISOString();
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const updatedTrail: AuditEvent[] = [
            ...c.auditTrail,
            {
              id: `aud-${Date.now()}`,
              step: 3,
              title: 'SMS Force-Dispatched',
              description: 'Operator triggered instant dispatch. Twilio carrier receipt verified.',
              timestamp: 'Just now',
              iconType: 'message-square',
              details: { carrier: 'AT&T / T-Mobile', sid: `SM${Math.random().toString(36).substring(2, 10)}` },
            },
          ];
          return {
            ...c,
            status: 'DISPATCHED',
            sentAt: nowIso,
            carrierDeliveryStatus: 'delivered',
            twilioSid: `SM${Math.random().toString(36).substring(2, 12)}`,
            auditTrail: updatedTrail,
          };
        }
        return c;
      })
    );

    addToast({
      type: 'success',
      title: 'Invite Sent Now',
      message: 'Review SMS pushed through Twilio carrier gateway.',
    });
  };

  const recordFunnelRating = (
    customerId: string,
    rating: number,
    feedbackText?: string,
    contactPref: 'Phone' | 'Email' = 'Phone'
  ) => {
    const nowIso = new Date().toISOString();
    const isPositive = rating >= 4;

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newTrail: AuditEvent[] = [...c.auditTrail];

          // Ensure clicked step exists
          if (!c.clickedAt) {
            newTrail.push({
              id: `aud-clk-${Date.now()}`,
              step: 4,
              title: 'Shortlink Clicked',
              description: 'Customer opened review funnel via mobile shortlink (/r/' + c.id + ').',
              timestamp: 'Just now',
              iconType: 'mouse-pointer',
              details: { userAgent: 'Mobile Web Browser' },
            });
          }

          if (isPositive) {
            newTrail.push({
              id: `aud-rate-${Date.now()}`,
              step: 5,
              title: `${rating}-Star Converted to Google Maps`,
              description: `Customer gave ${rating} stars. Instant direct redirect to raw Google Place Review URL executed.`,
              timestamp: 'Just now',
              iconType: 'star',
              details: {
                rating: `${rating} Stars ★★★★★`,
                redirectTarget: activeTenant.googleMapsReviewUrl,
              },
            });
          } else {
            newTrail.push({
              id: `aud-rate-${Date.now()}`,
              step: 5,
              title: `Shield Activated: ${rating}-Star Negative Intercepted`,
              description: `Private sentiment firewall intercepted ${rating}-star feedback. Customer was NEVER sent to Google. Internal alert logged.`,
              timestamp: 'Just now',
              iconType: 'shield-alert',
              details: {
                rating: `${rating} Stars`,
                firewallStatus: 'Protected 5.0 Google Average',
                contactPref,
              },
            });
          }

          return {
            ...c,
            status: isPositive ? 'CONVERTED' : 'INTERCEPTED',
            clickedAt: c.clickedAt || nowIso,
            convertedAt: isPositive ? nowIso : c.convertedAt,
            interceptedAt: !isPositive ? nowIso : c.interceptedAt,
            rating,
            ratingSentiment: isPositive ? 'positive' : 'negative',
            googleReviewUrl: isPositive ? activeTenant.googleMapsReviewUrl : undefined,
            auditTrail: newTrail,
            privateFeedback: !isPositive
              ? {
                  id: `fb-${Date.now()}`,
                  rating,
                  comment:
                    feedbackText ||
                    'Customer experienced dissatisfaction with appointment scheduling and front desk communication.',
                  contactPreference: contactPref,
                  resolved: false,
                  managerNotes: '',
                  createdAt: nowIso,
                }
              : c.privateFeedback,
          };
        }
        return c;
      })
    );

    if (isPositive) {
      addToast({
        type: 'success',
        title: '5-Star Google Review Converted!',
        message: 'Customer was safely handed off to Google Maps Review page.',
      });
    } else {
      addToast({
        type: 'error',
        title: 'Reputation Shield Triggered!',
        message: `${rating}-star complaint intercepted and routed to Private Resolution Inbox. Kept off Google Maps.`,
      });
    }
  };

  const resolveFeedbackTicket = (customerId: string, managerNotes: string) => {
    const nowIso = new Date().toISOString();
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId && c.privateFeedback) {
          return {
            ...c,
            privateFeedback: {
              ...c.privateFeedback,
              resolved: true,
              managerNotes,
              resolvedAt: nowIso,
            },
          };
        }
        return c;
      })
    );

    addToast({
      type: 'success',
      title: 'Feedback Ticket Resolved',
      message: 'Private customer issue resolved and archived in resolution records.',
    });
  };

  const updateSmsTemplate = (template: string, delayHours: number) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === activeTenantId) {
          return {
            ...t,
            smsTemplate: template,
            defaultDelayHours: delayHours,
          };
        }
        return t;
      })
    );

    addToast({
      type: 'success',
      title: 'Delivery Rules Saved',
      message: `Updated SMS template and cooling interval (${delayHours}h).`,
    });
  };

  return (
    <AppContext.Provider
      value={{
        tenants,
        activeTenant,
        setActiveTenantId,
        customers,
        filteredCustomers,
        dateRange,
        setDateRange,
        activeNavTab,
        setActiveNavTab,
        selectedCustomerId,
        setSelectedCustomerId,
        drawerOpen,
        setDrawerOpen,
        quickSendOpen,
        setQuickSendOpen,
        funnelCustomerId,
        setFunnelCustomerId,
        metrics,
        toasts,
        addToast,
        removeToast,
        quickSendInvite,
        simulateIncomingWebhook,
        cancelQueuedSms,
        resendInviteNow,
        recordFunnelRating,
        resolveFeedbackTicket,
        updateSmsTemplate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
