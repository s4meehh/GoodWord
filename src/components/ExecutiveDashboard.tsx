import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Star,
  ShieldCheck,
  Clock,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Eye,
  CheckCircle2,
  Receipt,
  RotateCw,
} from 'lucide-react';
import { CustomerRecord, CustomerStatus } from '../types';

export const ExecutiveDashboard: React.FC = () => {
  const {
    filteredCustomers,
    metrics,
    setSelectedCustomerId,
    setDrawerOpen,
    setFunnelCustomerId,
    setActiveNavTab,
    setQuickSendOpen,
    activeTenant,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Filtered rows for the table
  const tableCustomers = useMemo(() => {
    return filteredCustomers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        (customer.referenceId && customer.referenceId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatusFilter === 'ALL' ? true : customer.status === selectedStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [filteredCustomers, searchQuery, selectedStatusFilter]);

  const handleRowClick = (customer: CustomerRecord) => {
    setSelectedCustomerId(customer.id);
    setDrawerOpen(true);
  };

  const handleOpenInFunnel = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation();
    setFunnelCustomerId(customerId);
    setActiveNavTab('funnel-preview');
  };

  // Status Badge Component
  const renderStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case 'CONVERTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Converted (5★)
          </span>
        );
      case 'INTERCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Shield Intercepted
          </span>
        );
      case 'QUEUED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Cooling in Queue
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            SMS Dispatched
          </span>
        );
      case 'CLICKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Funnel Opened
          </span>
        );
      case 'OPTED_OUT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
            Opted Out (STOP)
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Welcome & Health Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            Reputation Performance Engine
            <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Firewall Active
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Automating review velocity for {activeTenant.name} while intercepting negative sentiment before Google.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-zinc-400">POS Webhook Ingestion:</span>
            <span className="font-semibold text-zinc-200">Listening</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
            <span className="text-zinc-400">In Cooling Queue:</span>
            <span className="font-semibold text-amber-400">{metrics.activeInQueue}</span>
          </div>
        </div>
      </div>

      {/* 4 HIGH-DENSITY METRIC CARDS WITH SPARKLINES (Linear / Mercury Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Dispatched Invites */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 relative overflow-hidden group hover:border-zinc-700/80 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Dispatched Invites
            </span>
            <div className="w-7 h-7 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-300">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
              {metrics.dispatchedInvites}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +{metrics.dispatchedChangePercent}%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
            <span>Carrier Delivery Rate</span>
            <span className="font-mono text-zinc-200 font-semibold">{metrics.deliverySuccessRate}%</span>
          </div>
          {/* Micro Sparkline SVG */}
          <div className="mt-2 h-6 w-full opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,20 L15,18 L30,12 L45,15 L60,8 L75,10 L90,3 L100,5"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Metric 2: Star Conversion Rate */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 relative overflow-hidden group hover:border-zinc-700/80 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Star Conversion Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Star className="w-3.5 h-3.5 fill-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
              {metrics.starConversionRate}%
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +{metrics.conversionChangePercent}%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
            <span>Google Reviews Pushed</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {filteredCustomers.filter((c) => c.status === 'CONVERTED').length} verified
            </span>
          </div>
          {/* Micro Sparkline SVG */}
          <div className="mt-2 h-6 w-full opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,22 L15,19 L30,17 L45,14 L60,11 L75,7 L90,4 L100,2"
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Metric 3: Intercepted Negatives (Shield Metric) */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 relative overflow-hidden group hover:border-zinc-700/80 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Shield Interceptions
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
              {metrics.interceptedNegatives}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
              Protected
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
            <span>Kept off Google Maps</span>
            <span className="font-mono text-rose-400 font-semibold">100% Contained</span>
          </div>
          {/* Micro Sparkline SVG */}
          <div className="mt-2 h-6 w-full opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,15 L20,18 L40,12 L60,16 L80,10 L100,8"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Metric 4: Average Review Velocity */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 relative overflow-hidden group hover:border-zinc-700/80 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Review Velocity
            </span>
            <div className="w-7 h-7 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-300">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
              {metrics.reviewVelocityHours}h
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
              {metrics.velocityChangePercent}% faster
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
            <span>Checkout to 5-Star</span>
            <span className="font-mono text-zinc-200 font-semibold">Optimal Cooling</span>
          </div>
          {/* Micro Sparkline SVG */}
          <div className="mt-2 h-6 w-full opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,5 L20,8 L40,14 L60,12 L80,18 L100,20"
                fill="none"
                stroke="#a1a1aa"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* LIVE ACTIVITY STREAM TABLE SECTION (Image 2 Mercury UI Aesthetic) */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden shadow-sm">
        {/* Table Header Bar with Search and Filters */}
        <div className="p-4 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
              Live Customer Activity Stream
            </h3>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded-full">
              {tableCustomers.length} records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search name, phone, or invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 w-56 sm:w-64"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 overflow-x-auto">
              {['ALL', 'QUEUED', 'DISPATCHED', 'CONVERTED', 'INTERCEPTED'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedStatusFilter(filter)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedStatusFilter === filter
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  {filter === 'ALL'
                    ? 'All'
                    : filter === 'CONVERTED'
                    ? 'Converted (5★)'
                    : filter === 'INTERCEPTED'
                    ? 'Shielded'
                    : filter.charAt(0) + filter.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-950/40 text-zinc-400 font-medium select-none">
                <th className="py-3 px-4">Customer Name & Ref</th>
                <th className="py-3 px-4">Masked Phone</th>
                <th className="py-3 px-4">POS Source</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Timeline / Release</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {tableCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No customer records found matching your filters.
                  </td>
                </tr>
              ) : (
                tableCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => handleRowClick(customer)}
                    className="hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Name & Reference */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                        {customer.name}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-500">
                        {customer.referenceId || 'Manual Trigger'}
                      </div>
                    </td>

                    {/* Masked Phone */}
                    <td className="py-3 px-4 font-mono text-zinc-400">
                      {customer.maskedPhone}
                    </td>

                    {/* POS Source */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                        <Receipt className="w-3 h-3 text-zinc-400" />
                        {customer.posSource}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 font-mono font-medium text-zinc-300">
                      ${customer.transactionAmount ? customer.transactionAmount.toFixed(2) : '350.00'}
                    </td>

                    {/* Timeline Date */}
                    <td className="py-3 px-4 text-zinc-400">
                      <div>
                        {new Date(customer.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {customer.status === 'QUEUED'
                          ? `Send in ${customer.coolingDelayHours}h`
                          : new Date(customer.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {renderStatusBadge(customer.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleOpenInFunnel(e, customer.id)}
                          title="Simulate Customer View (/r/:id)"
                          className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-emerald-500/20 hover:text-emerald-400 text-zinc-400 transition-colors"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRowClick(customer)}
                          title="View Full Audit Log"
                          className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
