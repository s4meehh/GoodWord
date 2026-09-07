import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Code2,
  Copy,
  Check,
  Database,
  FileCode,
  Server,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';

export const DeveloperExport: React.FC = () => {
  const { addToast } = useApp();
  const [activeCodeTab, setActiveCodeTab] = useState<'sql' | 'ingest' | 'cron' | 'twilio'>('sql');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    addToast({
      type: 'success',
      title: 'Code Snippet Copied',
      message: 'Production asset copied to your clipboard.',
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sqlSchema = `-- ==============================================================================
-- GOODWORD PRODUCTION POSTGRESQL / SUPABASE SCHEMA
-- Deterministic Multi-Tenant Reputation Engine & Firewall DDL
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TENANTS (Practices, Clinics, Studios)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    google_place_id VARCHAR(255) NOT NULL,
    google_maps_review_url TEXT NOT NULL,
    api_key VARCHAR(128) UNIQUE NOT NULL,
    webhook_secret VARCHAR(128) NOT NULL,
    default_delay_hours INTEGER DEFAULT 2,
    sms_template TEXT NOT NULL,
    business_phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMER RECORDS & STATE MACHINE
CREATE TYPE customer_lifecycle_status AS ENUM (
    'QUEUED',
    'DISPATCHED',
    'CLICKED',
    'CONVERTED',
    'INTERCEPTED',
    'OPTED_OUT'
);

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    masked_phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    pos_source VARCHAR(50) NOT NULL, -- Square, Stripe, Clover, Manual
    reference_id VARCHAR(255),
    transaction_amount NUMERIC(10, 2) DEFAULT 0.00,
    status customer_lifecycle_status NOT NULL DEFAULT 'QUEUED',
    cooling_delay_hours INTEGER NOT NULL DEFAULT 2,
    scheduled_at TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    intercepted_at TIMESTAMPTZ,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    rating_sentiment VARCHAR(20), -- 'positive' | 'negative'
    carrier_delivery_status VARCHAR(50),
    twilio_sid VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DETERMINISTIC AUDIT TRAILS (Append-Only Event Ledger)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    step INTEGER NOT NULL CHECK (step >= 1 AND step <= 5),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon_type VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRIVATE FEEDBACK RESOLUTION TICKETS (Firewalled Complaints)
CREATE TABLE IF NOT EXISTS feedback_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 3),
    complaint_text TEXT NOT NULL,
    contact_preference VARCHAR(20) DEFAULT 'Phone',
    resolved BOOLEAN DEFAULT FALSE,
    manager_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_customers_tenant_status ON customers(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_customers_scheduled_at ON customers(scheduled_at) WHERE status = 'QUEUED';
CREATE INDEX IF NOT EXISTS idx_audit_customer_step ON audit_logs(customer_id, step);
CREATE INDEX IF NOT EXISTS idx_feedback_tenant_resolved ON feedback_tickets(tenant_id, resolved);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants isolate own records" ON customers
    FOR ALL
    USING (tenant_id = auth.uid());
`;

  const ingestRoute = `// ==============================================================================
// /api/v1/ingest.ts (Next.js / Express Route Handler)
// Ingests POS events from Square, Stripe, Clover, or Zapier
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Supabase / Drizzle instance

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer gw_live_')) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Tenant API Key' }, { status: 401 });
    }

    const apiKey = authHeader.replace('Bearer ', '');
    const tenant = await db.query.tenants.findFirst({
      where: (t, { eq }) => eq(t.apiKey, apiKey),
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant workspace not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      customer_name,
      customer_phone,
      transaction_amount,
      reference_id,
      pos_source = 'Webhook',
    } = body;

    if (!customer_name || !customer_phone) {
      return NextResponse.json(
        { error: 'Missing customer_name or customer_phone' },
        { status: 400 }
      );
    }

    // Calculate cooling release window
    const delayHours = tenant.defaultDelayHours || 2;
    const scheduledAt = new Date(Date.now() + delayHours * 60 * 60 * 1000);

    // Mask phone number for TCPA compliance and UI privacy
    const rawDigits = customer_phone.replace(/\\D/g, '');
    const last4 = rawDigits.slice(-4);
    const maskedPhone = \`+1 ••• ••• \${last4}\`;

    // 1. Insert customer in QUEUED lifecycle state
    const customer = await db.insert(customers).values({
      tenantId: tenant.id,
      name: customer_name,
      phone: customer_phone,
      maskedPhone,
      posSource: pos_source,
      referenceId: reference_id,
      transactionAmount: transaction_amount,
      status: 'QUEUED',
      coolingDelayHours: delayHours,
      scheduledAt,
    }).returning();

    // 2. Append Step 1 & Step 2 to immutable Audit Ledger
    await db.insert(auditLogs).values([
      {
        customerId: customer[0].id,
        step: 1,
        title: 'Transaction Ingested',
        description: \`Ingested \${pos_source} event (\$\${transaction_amount}).\`,
        iconType: 'receipt',
        metadata: { invoice: reference_id, source: pos_source },
      },
      {
        customerId: customer[0].id,
        step: 2,
        title: 'Scheduled in Queue',
        description: \`Cooling delay of \${delayHours} hours applied per practice policy.\`,
        iconType: 'clock',
        metadata: { scheduledAt },
      }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Record accepted into reputation cooling queue',
      customerId: customer[0].id,
      scheduledAt,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;

  const cronRoute = `// ==============================================================================
// /api/v1/cron-dispatcher.ts (Scheduled Background Dispatcher)
// Invoked every 60 seconds via Vercel Cron or Cloud Scheduler
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import twilio from 'twilio';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function GET(req: NextRequest) {
  // Verify Vercel Cron Secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return NextResponse.json({ error: 'Unauthorized Cron Trigger' }, { status: 401 });
  }

  const now = new Date();

  // Find all customers whose cooling delay has expired
  const dueCustomers = await db.query.customers.findMany({
    where: (c, { and, eq, lte }) =>
      and(
        eq(c.status, 'QUEUED'),
        lte(c.scheduledAt, now)
      ),
    with: { tenant: true },
    limit: 50,
  });

  const results = [];

  for (const customer of dueCustomers) {
    try {
      const trackingShortlink = \`\${process.env.APP_URL}/r/\${customer.id}\`;
      const smsBody = customer.tenant.smsTemplate
        .replace('{customer_name}', customer.name)
        .replace('{business_name}', customer.tenant.name)
        .replace('{review_link}', trackingShortlink);

      // Dispatch via Twilio Gateway
      const message = await twilioClient.messages.create({
        body: smsBody,
        to: customer.phone,
        from: customer.tenant.businessPhone || process.env.TWILIO_PHONE_NUMBER,
      });

      // Advance State to DISPATCHED
      await db.update(customers)
        .set({
          status: 'DISPATCHED',
          sentAt: new Date(),
          twilioSid: message.sid,
          carrierDeliveryStatus: 'sent',
        })
        .where(eq(customers.id, customer.id));

      // Append Audit Step 3
      await db.insert(auditLogs).values({
        customerId: customer.id,
        step: 3,
        title: 'SMS Dispatched',
        description: \`Twilio carrier SMS dispatched to customer. SID: \${message.sid}\`,
        iconType: 'message-square',
        metadata: { twilioSid: message.sid },
      });

      results.push({ customerId: customer.id, status: 'dispatched' });
    } catch (err: any) {
      console.error('Failed to dispatch for customer:', customer.id, err);
    }
  }

  return NextResponse.json({ dispatchedCount: results.length, results });
}
`;

  const twilioRoute = `// ==============================================================================
// /api/v1/twilio/inbound.ts
// Handles Twilio Status Callbacks & TCPA STOP/UNSUBSCRIBE Keywords
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const from = formData.get('From') as string;
  const body = (formData.get('Body') as string || '').trim().toUpperCase();
  const messageSid = formData.get('MessageSid') as string;
  const messageStatus = formData.get('MessageStatus') as string;

  // 1. Handle Inbound TCPA Opt-Out (STOP / UNSUBSCRIBE)
  if (['STOP', 'UNSUBSCRIBE', 'CANCEL', 'QUIT'].includes(body)) {
    await db.update(customers)
      .set({ status: 'OPTED_OUT' })
      .where(eq(customers.phone, from));

    return new NextResponse(
      '<Response><Message>You have been unsubscribed from review invites.</Message></Response>',
      { headers: { 'Content-Type': 'text/xml' } }
    );
  }

  // 2. Handle Carrier Delivery Status Webhook
  if (messageSid && messageStatus) {
    await db.update(customers)
      .set({ carrierDeliveryStatus: messageStatus })
      .where(eq(customers.twilioSid, messageSid));
  }

  return NextResponse.json({ received: true });
}
`;

  const codeSnippets = {
    sql: sqlSchema,
    ingest: ingestRoute,
    cron: cronRoute,
    twilio: twilioRoute,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            Developer Export & Production Backend Center
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Copy-pasteable production assets: PostgreSQL schema DDL, RLS policies, and Next.js / Express API route handlers.
          </p>
        </div>

        <button
          onClick={() => handleCopy(activeCodeTab, codeSnippets[activeCodeTab])}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
        >
          {copiedKey === activeCodeTab ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Active File</span>
            </>
          )}
        </button>
      </div>

      {/* Code File Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 overflow-x-auto">
        <button
          onClick={() => setActiveCodeTab('sql')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeCodeTab === 'sql'
              ? 'bg-zinc-800 text-emerald-400 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>schema.sql (PostgreSQL / Supabase)</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('ingest')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeCodeTab === 'ingest'
              ? 'bg-zinc-800 text-emerald-400 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-sky-400" />
          <span>/api/v1/ingest.ts (Webhook Handler)</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('cron')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeCodeTab === 'cron'
              ? 'bg-zinc-800 text-emerald-400 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-amber-400" />
          <span>/api/v1/cron-dispatcher.ts</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('twilio')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeCodeTab === 'twilio'
              ? 'bg-zinc-800 text-emerald-400 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>/api/v1/twilio/inbound.ts</span>
        </button>
      </div>

      {/* Code Display Area */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-3 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
            <span className="font-mono text-[11px] text-zinc-500 ml-2">
              {activeCodeTab === 'sql'
                ? 'schema.sql (PostgreSQL DDL)'
                : activeCodeTab === 'ingest'
                ? 'src/app/api/v1/ingest/route.ts'
                : activeCodeTab === 'cron'
                ? 'src/app/api/v1/cron-dispatcher/route.ts'
                : 'src/app/api/v1/twilio/inbound/route.ts'}
            </span>
          </div>

          <button
            onClick={() => handleCopy(activeCodeTab, codeSnippets[activeCodeTab])}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors text-[11px]"
          >
            {copiedKey === activeCodeTab ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>{copiedKey === activeCodeTab ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="p-4 overflow-x-auto max-h-[540px]">
          <pre className="font-mono text-xs text-zinc-300 leading-relaxed selection:bg-emerald-500/30">
            {codeSnippets[activeCodeTab]}
          </pre>
        </div>
      </div>
    </div>
  );
};
