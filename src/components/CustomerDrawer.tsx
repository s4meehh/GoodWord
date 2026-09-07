import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  Ban,
  Copy,
  Check,
  ExternalLink,
  Receipt,
  Clock,
  MessageSquare,
  MousePointer,
  Star,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Phone,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

export const CustomerDrawer: React.FC = () => {
  const {
    customers,
    selectedCustomerId,
    drawerOpen,
    setDrawerOpen,
    cancelQueuedSms,
    resendInviteNow,
    setFunnelCustomerId,
    setActiveNavTab,
    addToast,
    activeTenant,
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);

  const customer = customers.find((c) => c.id === selectedCustomerId);

  if (!drawerOpen || !customer) return null;

  const trackingUrl = `${window.location.origin}/r/${customer.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopiedLink(true);
    addToast({
      type: 'info',
      title: 'Tracking Link Copied',
      message: `${trackingUrl} copied to clipboard.`,
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTestInFunnel = () => {
    setFunnelCustomerId(customer.id);
    setDrawerOpen(false);
    setActiveNavTab('funnel-preview');
  };

  const getStatusColor = () => {
    switch (customer.status) {
      case 'CONVERTED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'INTERCEPTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'QUEUED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DISPATCHED':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'CLICKED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end transition-opacity">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={() => setDrawerOpen(false)} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl bg-zinc-950 border-l border-zinc-800/80 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-start justify-between gap-4 bg-zinc-900/40">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">{customer.name}</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor()}`}
              >
                {customer.status}
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-1 flex items-center gap-2">
              <span>{customer.maskedPhone}</span>
              <span>•</span>
              <span className="text-zinc-500">{customer.posSource} POS</span>
              <span>•</span>
              <span className="text-zinc-500">{customer.referenceId || 'N/A'}</span>
            </p>
          </div>

          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* PROFILE METRICS BLOCK (Inspired by Image 3 design) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Transaction
              </span>
              <p className="text-base font-bold font-mono text-zinc-100 mt-1">
                ${customer.transactionAmount ? customer.transactionAmount.toFixed(2) : '350.00'}
              </p>
              <span className="text-[10px] text-zinc-500 mt-0.5 block">{customer.posSource}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Sentiment Rating
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-base font-bold font-mono ${
                    customer.rating && customer.rating >= 4
                      ? 'text-emerald-400'
                      : customer.rating
                      ? 'text-rose-400'
                      : 'text-zinc-400'
                  }`}
                >
                  {customer.rating ? `${customer.rating}.0` : 'Pending'}
                </span>
                {customer.rating && (
                  <div className="flex text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (customer.rating || 0)
                            ? customer.rating! >= 4
                              ? 'text-emerald-400 fill-emerald-400'
                              : 'text-rose-400 fill-rose-400'
                            : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                {customer.ratingSentiment === 'positive'
                  ? 'Routed to Google'
                  : customer.ratingSentiment === 'negative'
                  ? 'Firewall Shielded'
                  : 'Awaiting Star Tap'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Cooling Window
              </span>
              <p className="text-base font-bold font-mono text-zinc-100 mt-1">
                {customer.coolingDelayHours}h Delay
              </p>
              <span className="text-[10px] text-emerald-400 mt-0.5 block font-mono">
                {customer.carrierDeliveryStatus === 'delivered' ? '✓ Delivered' : 'Auto Queue'}
              </span>
            </div>
          </div>

          {/* PRIVATE RESOLUTION CARD (if intercepted) */}
          {customer.privateFeedback && (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  Intercepted Customer Grievance
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    customer.privateFeedback.resolved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {customer.privateFeedback.resolved ? 'Resolved' : 'Needs Action'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950/80 border border-rose-900/30 text-xs text-zinc-300 leading-relaxed italic">
                "{customer.privateFeedback.comment}"
              </div>

              <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Preference: {customer.privateFeedback.contactPreference}</span>
                <span className="text-zinc-500">
                  {new Date(customer.privateFeedback.createdAt).toLocaleDateString()}
                </span>
              </div>

              {customer.privateFeedback.managerNotes && (
                <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400">
                  <span className="font-semibold text-zinc-300 block mb-0.5">Manager Notes:</span>
                  {customer.privateFeedback.managerNotes}
                </div>
              )}
            </div>
          )}

          {/* VISUAL AUDIT TIMELINE */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Deterministic Audit Timeline
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                {customer.auditTrail.length} Recorded Steps
              </span>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
              {customer.auditTrail.map((event, idx) => {
                let dotColor = 'bg-zinc-700 border-zinc-600';
                let iconColor = 'text-zinc-400';

                if (event.iconType === 'receipt') {
                  dotColor = 'bg-blue-500/20 border-blue-500 text-blue-400';
                } else if (event.iconType === 'clock') {
                  dotColor = 'bg-amber-500/20 border-amber-500 text-amber-400';
                } else if (event.iconType === 'message-square') {
                  dotColor = 'bg-sky-500/20 border-sky-500 text-sky-400';
                } else if (event.iconType === 'mouse-pointer') {
                  dotColor = 'bg-purple-500/20 border-purple-500 text-purple-400';
                } else if (event.iconType === 'star') {
                  dotColor = 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
                } else if (event.iconType === 'shield-alert') {
                  dotColor = 'bg-rose-500/20 border-rose-500 text-rose-400';
                } else if (event.iconType === 'ban') {
                  dotColor = 'bg-zinc-700 border-zinc-500 text-zinc-400';
                }

                return (
                  <div key={event.id} className="relative group">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${dotColor}`}
                    >
                      {event.step}
                    </div>

                    <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80 group-hover:border-zinc-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-zinc-200">{event.title}</h4>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {event.description}
                      </p>

                      {event.details && (
                        <div className="mt-2 pt-2 border-t border-zinc-800/60 grid grid-cols-2 gap-2 text-[11px] font-mono">
                          {Object.entries(event.details).map(([k, v]) => (
                            <div key={k}>
                              <span className="text-zinc-500 uppercase text-[9px] block">{k}:</span>
                              <span className="text-zinc-300 truncate block">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/50 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Resend Invite Now */}
            <button
              onClick={() => resendInviteNow(customer.id)}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-zinc-400" />
              <span>Resend Invite Now</span>
            </button>

            {/* Cancel Queued SMS */}
            {customer.status === 'QUEUED' && (
              <button
                onClick={() => cancelQueuedSms(customer.id)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Queued SMS</span>
              </button>
            )}

            {/* Copy Tracking Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Funnel Link</span>
                </>
              )}
            </button>

            {/* Open in Funnel Preview */}
            <button
              onClick={handleTestInFunnel}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-all shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Test Customer Funnel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
