import React from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Send, ChevronRight, LayoutDashboard, Smartphone, Calendar } from 'lucide-react';
import { DateRange } from '../types';

export const TopBar: React.FC = () => {
  const {
    activeTenant,
    activeNavTab,
    setActiveNavTab,
    dateRange,
    setDateRange,
    setQuickSendOpen,
    funnelCustomerId,
  } = useApp();

  const getBreadcrumbTitle = () => {
    switch (activeNavTab) {
      case 'dashboard':
        return 'Executive Dashboard';
      case 'feedback':
        return 'Private Resolution Inbox';
      case 'delivery':
        return 'SMS & Delivery Rules';
      case 'integrations':
        return 'Webhooks & POS Integrations';
      case 'export':
        return 'SQL Schema & API Code Center';
      case 'funnel-preview':
        return `Customer Sentiment Funnel (/r/${funnelCustomerId})`;
      default:
        return 'Dashboard';
    }
  };

  const dateRanges: { id: DateRange; label: string }[] = [
    { id: '7D', label: '7D' },
    { id: '30D', label: '30D' },
    { id: '90D', label: '90D' },
    { id: 'ALL', label: 'All-Time' },
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-6 flex items-center justify-between gap-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-zinc-500 font-medium">GoodWord</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-400 font-medium">{activeTenant.name}</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-100 font-semibold">{getBreadcrumbTitle()}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick View Mode Toggle */}
        <div className="hidden md:flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => setActiveNavTab('dashboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeNavTab !== 'funnel-preview'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveNavTab('funnel-preview')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeNavTab === 'funnel-preview'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Customer Funnel</span>
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          {dateRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                dateRange === range.id
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setQuickSendOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Quick Send Invite</span>
        </button>
      </div>
    </header>
  );
};
