import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CustomersView } from './components/CustomersView';
import { CampaignsView } from './components/CampaignsView';
import { ReviewsView } from './components/ReviewsView';
import { SettingsView } from './components/SettingsView';
import { AddCustomerModal } from './components/AddCustomerModal';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans antialiased">
      {/* Sidebar with 5 clean tabs */}
      <Sidebar />

      {/* Main Workspace Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-slate-50">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'customers' && <CustomersView />}
        {activeTab === 'campaigns' && <CampaignsView />}
        {activeTab === 'reviews' && <ReviewsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Add Customer Modal */}
      <AddCustomerModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
