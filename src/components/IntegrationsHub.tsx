import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Webhook,
  Copy,
  Check,
  Send,
  Sparkles,
  Zap,
  CreditCard,
  Layers,
  ArrowRight,
  Terminal,
  Code2,
  CheckCircle2,
  Receipt,
  ExternalLink,
} from 'lucide-react';

export const IntegrationsHub: React.FC = () => {
  const {
    activeTenant,
    simulateIncomingWebhook,
    addToast,
    setActiveNavTab,
  } = useApp();

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Webhook Simulator Form State
  const [simName, setSimName] = useState('Eleanor Vance');
  const [simPhone, setSimPhone] = useState('+14155557788');
  const [simAmount, setSimAmount] = useState('1850.00');
  const [simInvoice, setSimInvoice] = useState('INV-2026-9088');
  const [simSource, setSimSource] = useState<'Square' | 'Stripe' | 'Clover' | 'Manual'>('Square');
  const [simResult, setSimResult] = useState<string | null>(null);

  const webhookIngestUrl = `${window.location.origin}/api/v1/ingest`;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(activeTenant.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookIngestUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSimulateWebhook = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      customer_name: simName,
      customer_phone: simPhone,
      transaction_amount: parseFloat(simAmount) || 350.0,
      reference_id: simInvoice,
      pos_source: simSource,
    };

    simulateIncomingWebhook(payload);

    setSimResult(
      JSON.stringify(
        {
          status: 'success',
          code: 200,
          data: {
            message: 'Transaction ingested and assigned to cooling queue',
            tenant_id: activeTenant.id,
            scheduled_delay: `${activeTenant.defaultDelayHours} hours`,
            customer: {
              name: simName,
              phone: simPhone,
              reference: simInvoice,
            },
            firewall_mode: 'active',
          },
        },
        null,
        2
      )
    );
  };

  const integrationCards = [
    {
      title: 'Square POS Webhook',
      icon: Receipt,
      desc: 'Listens for payment.updated or payment.created events directly from Square Terminals.',
      badge: 'Certified Partner',
      setupText: 'Paste our Ingestion URL into Square Developer Dashboard -> Webhooks -> Payment Events.',
    },
    {
      title: 'Stripe Invoicing & Charges',
      icon: CreditCard,
      desc: 'Captures charge.succeeded and invoice.payment_succeeded events automatically.',
      badge: 'Native Webhook',
      setupText: 'Set webhook endpoint in Stripe Workbench for charge.succeeded with signing secret.',
    },
    {
      title: 'Zapier Webhook Catch',
      icon: Zap,
      desc: 'Connect to 5,000+ local practice management software suites (Dentrix, CareCloud, ServiceTitan).',
      badge: 'Zero-Code',
      setupText: 'Trigger -> Webhooks by Zapier (POST) -> Point to GoodWord Ingestion URL.',
    },
    {
      title: 'Make.com & Custom APIs',
      icon: Layers,
      desc: 'Seamless JSON payload routing from custom CRM, Dentrix Ascend, or Clover POS.',
      badge: 'REST JSON',
      setupText: 'Deliver HTTP POST payload with Bearer Authorization header using your Tenant API Key.',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Webhook className="w-5 h-5 text-emerald-400" />
          Integrations & Ingestion Hub
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Connect your POS (Square, Stripe, Clover) or practice software via real-time webhooks.
        </p>
      </div>

      {/* API Key & Webhook URL Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tenant API Key */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Active Tenant Secret API Key
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Production
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200">
            <span className="truncate mr-2">{activeTenant.apiKey}</span>
            <button
              onClick={handleCopyKey}
              className="text-zinc-400 hover:text-zinc-200 shrink-0 p-1 rounded hover:bg-zinc-800 transition-colors"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-zinc-500">
            Include as <code className="text-zinc-300">Authorization: Bearer gw_live_...</code> in your webhook headers.
          </p>
        </div>

        {/* Webhook Ingestion URL */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Webhook Ingestion Endpoint
            </span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
              POST JSON
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200">
            <span className="truncate mr-2">{webhookIngestUrl}</span>
            <button
              onClick={handleCopyUrl}
              className="text-zinc-400 hover:text-zinc-200 shrink-0 p-1 rounded hover:bg-zinc-800 transition-colors"
            >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-zinc-500">
            Accepts transaction events from Square, Stripe, Clover, Zapier, or custom POS webhook dispatchers.
          </p>
        </div>
      </div>

      {/* INTERACTIVE WEBHOOK SIMULATOR (Live in Preview) */}
      <div className="p-5 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-100">
              Interactive POS Webhook Simulator
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Fires into Live App State
          </span>
        </div>

        <p className="text-xs text-zinc-400">
          Simulate a real-time point-of-sale transaction. Submitting fires an incoming webhook event, queues the customer into GoodWord, updates the dashboard stream, and triggers the automated cooling timer.
        </p>

        <form onSubmit={handleSimulateWebhook} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              required
              value={simName}
              onChange={(e) => setSimName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Customer Mobile Phone
            </label>
            <input
              type="text"
              required
              value={simPhone}
              onChange={(e) => setSimPhone(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={simAmount}
              onChange={(e) => setSimAmount(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              POS Platform
            </label>
            <select
              value={simSource}
              onChange={(e) => setSimSource(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="Square">Square POS</option>
              <option value="Stripe">Stripe Checkout</option>
              <option value="Clover">Clover Terminal</option>
              <option value="Manual">Manual Trigger</option>
            </select>
          </div>

          <div className="md:col-span-4 flex items-center justify-between pt-2">
            <span className="text-[11px] text-zinc-500 font-mono">
              Payload: {simSource.toLowerCase()}_transaction_event.json
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Incoming POS Webhook</span>
            </button>
          </div>
        </form>

        {/* Live Simulator JSON Response */}
        {simResult && (
          <div className="mt-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-emerald-400 overflow-x-auto space-y-2">
            <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-900 pb-1.5">
              <span>HTTP 200 OK • Response from GoodWord Engine</span>
              <button
                onClick={() => setActiveNavTab('dashboard')}
                className="text-emerald-400 hover:underline flex items-center gap-1 text-xs"
              >
                View on Dashboard Table <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <pre className="text-zinc-300">{simResult}</pre>
          </div>
        )}
      </div>

      {/* Integration Guide Cards */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Supported Point-of-Sale & Workflow Integrations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {integrationCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-200 font-semibold text-xs">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{card.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {card.badge}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{card.desc}</p>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-500 font-mono">
                  {card.setupText}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
