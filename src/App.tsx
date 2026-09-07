import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { CustomerDrawer } from './components/CustomerDrawer';
import { QuickSendModal } from './components/QuickSendModal';
import { CustomerSentimentFunnel } from './components/CustomerSentimentFunnel';
import { FeedbackInbox } from './components/FeedbackInbox';
import { TemplateDeliveryStudio } from './components/TemplateDeliveryStudio';
import { IntegrationsHub } from './components/IntegrationsHub';
import { DeveloperExport } from './components/DeveloperExport';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const { activeNavTab } = useApp();

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-zinc-950">
        {/* Top Bar with Breadcrumbs, Date Range & Quick Send CTA */}
        <TopBar />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950">
          {activeNavTab === 'dashboard' && <ExecutiveDashboard />}
          {activeNavTab === 'feedback' && <FeedbackInbox />}
          {activeNavTab === 'delivery' && <TemplateDeliveryStudio />}
          {activeNavTab === 'integrations' && <IntegrationsHub />}
          {activeNavTab === 'export' && <DeveloperExport />}
          {activeNavTab === 'funnel-preview' && <CustomerSentimentFunnel />}
        </main>
      </div>

      {/* Slide-over Customer Detail Drawer */}
      <CustomerDrawer />

      {/* Quick Send Review Invite Modal */}
      <QuickSendModal />

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
