import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Sliders,
  Webhook,
  Code2,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Building2,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { ActiveNavTab } from '../types';

export const Sidebar: React.FC = () => {
  const {
    activeNavTab,
    setActiveNavTab,
    activeTenant,
    tenants,
    setActiveTenantId,
    customers,
    addToast,
  } = useApp();

  const [copiedKey, setCopiedKey] = useState(false);
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);

  // Unresolved complaints badge count
  const unresolvedFeedbackCount = customers.filter(
    (c) => c.tenantId === activeTenant.id && c.privateFeedback && !c.privateFeedback.resolved
  ).length;

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(activeTenant.apiKey);
    setCopiedKey(true);
    addToast({
      type: 'info',
      title: 'API Key Copied',
      message: `${activeTenant.apiKey.slice(0, 16)}... copied to clipboard.`,
    });
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const navItems: { id: ActiveNavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: Layers },
    {
      id: 'feedback',
      label: 'Resolution Inbox',
      icon: ShieldAlert,
      badge: unresolvedFeedbackCount > 0 ? unresolvedFeedbackCount : undefined,
    },
    { id: 'delivery', label: 'SMS & Delivery Rules', icon: Sliders },
    { id: 'integrations', label: 'Webhooks & POS Sync', icon: Webhook },
    { id: 'export', label: 'SQL Schema & API Code', icon: Code2 },
  ];

  return (
    <aside className="w-64 shrink-0 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <span className="text-base tracking-tighter">G</span>
            <span className="text-xs text-emerald-300">W</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-zinc-100">GoodWord</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 truncate">Reputation Firewall</p>
          </div>
        </div>

        {/* Tenant Workspace Selector */}
        <div className="mt-3.5 relative">
          <button
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 transition-colors text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-zinc-200 truncate">{activeTenant.name}</p>
                <p className="text-[10px] text-zinc-500">{activeTenant.industry} Tenant</p>
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${tenantDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {tenantDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden py-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Switch Business Tenant
              </div>
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => {
                    setActiveTenantId(tenant.id);
                    setTenantDropdownOpen(false);
                    addToast({
                      type: 'info',
                      title: 'Tenant Switched',
                      message: `Active workspace changed to ${tenant.name}.`,
                    });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left ${
                    tenant.id === activeTenant.id
                      ? 'bg-emerald-500/10 text-emerald-300 font-medium'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                    <span className="truncate">{tenant.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0 font-mono">{tenant.industry}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Platform Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNavTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-zinc-900 text-zinc-100 border border-zinc-800/80 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-zinc-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Simulator / Funnel Switcher Section */}
        <div className="pt-4 mt-2 border-t border-zinc-900">
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
            <span>Customer Touchpoint</span>
            <span className="text-[9px] text-emerald-400 font-mono font-normal">Interactive</span>
          </div>

          <button
            onClick={() => setActiveNavTab('funnel-preview')}
            className={`w-full mt-1.5 flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
              activeNavTab === 'funnel-preview'
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900/50 border-zinc-800/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold">Test Review Funnel</div>
                <div className="text-[10px] text-zinc-500">Route: /r/:id (Live)</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Footer Details & API Key */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/50 space-y-2">
        <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
            <span className="font-mono text-[10px] text-zinc-500 uppercase">Tenant API Key</span>
            <button
              onClick={handleCopyApiKey}
              className="text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1 text-[10px]"
            >
              {copiedKey ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-[11px] text-zinc-300 truncate">
            {activeTenant.apiKey.slice(0, 16)}••••••••
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Twilio Gateway Active
          </span>
          <span className="font-mono text-zinc-400">98.4% uptime</span>
        </div>
      </div>
    </aside>
  );
};
