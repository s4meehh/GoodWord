import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Star,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  MessageSquare,
  Search,
  Check,
  ShieldCheck,
  Building,
  Mail,
  FileEdit,
} from 'lucide-react';
import { CustomerRecord } from '../types';

export const FeedbackInbox: React.FC = () => {
  const {
    customers,
    activeTenant,
    resolveFeedbackTicket,
    setSelectedCustomerId,
    setDrawerOpen,
  } = useApp();

  const [triageTab, setTriageTab] = useState<'unresolved' | 'resolved'>('unresolved');
  const [managerNotesDrafts, setManagerNotesDrafts] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all customers with private feedback
  const feedbackTickets = customers
    .filter((c) => c.tenantId === activeTenant.id && c.privateFeedback)
    .sort(
      (a, b) =>
        new Date(b.privateFeedback!.createdAt).getTime() -
        new Date(a.privateFeedback!.createdAt).getTime()
    );

  const unresolvedTickets = feedbackTickets.filter((t) => !t.privateFeedback!.resolved);
  const resolvedTickets = feedbackTickets.filter((t) => t.privateFeedback!.resolved);

  const displayedTickets = (
    triageTab === 'unresolved' ? unresolvedTickets : resolvedTickets
  ).filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.phone.includes(q) ||
      t.privateFeedback!.comment.toLowerCase().includes(q)
    );
  });

  const handleNotesChange = (customerId: string, value: string) => {
    setManagerNotesDrafts((prev) => ({
      ...prev,
      [customerId]: value,
    }));
  };

  const handleResolve = (customer: CustomerRecord) => {
    const notes =
      managerNotesDrafts[customer.id] ||
      customer.privateFeedback?.managerNotes ||
      'Customer contacted directly by clinic management. Issue successfully resolved.';
    resolveFeedbackTicket(customer.id, notes);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header with Protection Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Private Resolution Inbox
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Firewall Triage
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Intercepted 1–3 star complaints kept completely off Google Reviews. Resolve them privately with your customers.
          </p>
        </div>

        {/* Protection KPI pill */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">
                {feedbackTickets.length} Complaints Shielded
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                100% Kept Off Google Maps
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Triage Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => setTriageTab('unresolved')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              triageTab === 'unresolved'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Needs Attention</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                unresolvedTickets.length > 0
                  ? 'bg-rose-500 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {unresolvedTickets.length}
            </span>
          </button>

          <button
            onClick={() => setTriageTab('resolved')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              triageTab === 'resolved'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Resolved Archive</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400">
              {resolvedTickets.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search complaint tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Ticket Cards Grid */}
      <div className="space-y-4">
        {displayedTickets.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
            <h3 className="text-sm font-semibold text-zinc-300">All caught up!</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {triageTab === 'unresolved'
                ? 'There are no pending customer complaints requiring attention for this tenant.'
                : 'No resolved tickets found.'}
            </p>
          </div>
        ) : (
          displayedTickets.map((ticket) => {
            const fb = ticket.privateFeedback!;
            const notesValue =
              managerNotesDrafts[ticket.id] !== undefined
                ? managerNotesDrafts[ticket.id]
                : fb.managerNotes || '';

            return (
              <div
                key={ticket.id}
                className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all shadow-sm space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                      {fb.rating}★
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-100">{ticket.name}</span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          {ticket.maskedPhone}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                          {ticket.posSource} (${ticket.transactionAmount?.toFixed(2) || '350.00'})
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(fb.createdAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span>Preferred Contact: {fb.contactPreference}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stars Visual */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < fb.rating ? 'text-rose-500 fill-rose-500' : 'text-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Grievance Body */}
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 leading-relaxed italic">
                  "{fb.comment}"
                </div>

                {/* Internal Manager Notes Box */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <FileEdit className="w-3 h-3 text-zinc-400" />
                      Internal Manager Resolution Notes
                    </label>
                    {fb.resolvedAt && (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Resolved on {new Date(fb.resolvedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={notesValue}
                    onChange={(e) => handleNotesChange(ticket.id, e.target.value)}
                    placeholder="Log phone call conversation, remedy offered, or action taken..."
                    className="w-full p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors resize-none font-sans"
                  />
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${ticket.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
                    >
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>Call {ticket.name.split(' ')[0]}</span>
                    </a>

                    <button
                      onClick={() => {
                        setSelectedCustomerId(ticket.id);
                        setDrawerOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      View Full Audit Trail
                    </button>
                  </div>

                  {!fb.resolved ? (
                    <button
                      onClick={() => handleResolve(ticket)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark as Resolved</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolved & Documented
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
