import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ActiveTab,
  Customer,
  Review,
  ChartDayData,
  DashboardStats,
  CampaignConfig,
  BusinessSettings,
  Toast,
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
  INITIAL_CHART_DATA,
  INITIAL_CAMPAIGN,
  INITIAL_SETTINGS,
} from '../data/seedData';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  customers: Customer[];
  reviews: Review[];
  chartData: ChartDayData[];
  stats: DashboardStats;
  campaign: CampaignConfig;
  settings: BusinessSettings;
  toasts: Toast[];
  isAddCustomerModalOpen: boolean;
  setAddCustomerModalOpen: (open: boolean) => void;
  addCustomer: (data: { name: string; phone: string; sendInviteNow?: boolean }) => void;
  sendCustomerInvite: (customerId: string) => void;
  updateCampaign: (newCampaign: Partial<CampaignConfig>) => void;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [chartData] = useState<ChartDayData[]>(INITIAL_CHART_DATA);
  const [campaign, setCampaign] = useState<CampaignConfig>(INITIAL_CAMPAIGN);
  const [settings, setSettings] = useState<BusinessSettings>(INITIAL_SETTINGS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState(false);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Dynamically calculate metrics
  const stats = useMemo<DashboardStats>(() => {
    const totalCustomers = customers.length;
    const totalReviews = reviews.length;
    const sentCount = customers.filter(
      (c) => c.status === 'Sent' || c.status === 'Reviewed'
    ).length;
    const responseRate = sentCount > 0 ? Math.round((totalReviews / sentCount) * 100) : 80;

    const totalStars = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = totalReviews > 0 ? parseFloat((totalStars / totalReviews).toFixed(1)) : 4.8;
    const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

    return {
      totalCustomers,
      totalReviews,
      reviewsSent: sentCount,
      responseRate,
      averageRating: avgRating,
      fiveStarCount,
    };
  }, [customers, reviews]);

  const addCustomer = ({
    name,
    phone,
    sendInviteNow = true,
  }: {
    name: string;
    phone: string;
    sendInviteNow?: boolean;
  }) => {
    const newCustomer: Customer = {
      id: 'c-' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      dateVisited: 'Today',
      status: sendInviteNow ? 'Sent' : 'Pending',
    };

    setCustomers((prev) => [newCustomer, ...prev]);

    addToast({
      type: 'success',
      title: sendInviteNow ? 'Customer Added & SMS Sent' : 'Customer Added',
      message: sendInviteNow
        ? `Review invite sent to ${name} via SMS.`
        : `${name} added to customer list.`,
    });
  };

  const sendCustomerInvite = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            status: 'Sent',
          };
        }
        return c;
      })
    );

    const customer = customers.find((c) => c.id === customerId);
    addToast({
      type: 'success',
      title: 'Review Invite Dispatched',
      message: `SMS request sent to ${customer ? customer.name : 'customer'}.`,
    });
  };

  const updateCampaign = (newCampaign: Partial<CampaignConfig>) => {
    setCampaign((prev) => ({ ...prev, ...newCampaign }));
    addToast({
      type: 'success',
      title: 'Campaign Saved',
      message: 'Your custom SMS review template was updated.',
    });
  };

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your business details and links have been updated.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        customers,
        reviews,
        chartData,
        stats,
        campaign,
        settings,
        toasts,
        isAddCustomerModalOpen,
        setAddCustomerModalOpen,
        addCustomer,
        sendCustomerInvite,
        updateCampaign,
        updateSettings,
        addToast,
        removeToast,
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
