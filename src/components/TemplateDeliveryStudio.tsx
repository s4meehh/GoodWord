import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  MessageSquare,
  Clock,
  Sparkles,
  Save,
  Tag,
  Smartphone,
  CheckCircle2,
  Info,
  Shield,
} from 'lucide-react';

export const TemplateDeliveryStudio: React.FC = () => {
  const { activeTenant, updateSmsTemplate } = useApp();

  const [templateText, setTemplateText] = useState(activeTenant.smsTemplate);
  const [delayHours, setDelayHours] = useState(activeTenant.defaultDelayHours);

  // Variable Chips
  const insertVariable = (variableTag: string) => {
    setTemplateText((prev) => `${prev} ${variableTag}`);
  };

  // Live preview rendering with sample data
  const sampleCustomerName = 'Alexander';
  const renderedPreview = templateText
    .replace('{customer_name}', sampleCustomerName)
    .replace('{business_name}', activeTenant.name)
    .replace('{review_link}', 'https://gw.link/r/9041');

  // GSM-7 SMS Segment Math
  const charCount = templateText.length;
  const segments = charCount <= 160 ? 1 : Math.ceil(charCount / 153);

  const handleSave = () => {
    updateSmsTemplate(templateText, delayHours);
  };

  const delayOptions = [
    { hours: 0, label: 'Immediate', desc: 'Dispatches instantly at POS swipe' },
    { hours: 1, label: '1 Hour', desc: 'Good for fast quick-service appointments' },
    { hours: 2, label: '2 Hours (Recommended)', desc: 'Optimal cooling delay for local services' },
    { hours: 4, label: '4 Hours', desc: 'Gives client time to travel home' },
    { hours: 24, label: '24 Hours', desc: 'Next-day morning dispatch' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            Template & Delivery Rules Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure carrier SMS copy, merge variables, and optimal post-transaction cooling delay.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Delivery Rules</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Builder & Delay Rules (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SMS Copy Box */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                SMS Review Invite Copy
              </label>
              <div className="text-xs font-mono text-zinc-400">
                <span className={charCount > 160 ? 'text-amber-400 font-bold' : 'text-zinc-300'}>
                  {charCount}
                </span>{' '}
                / 160 characters •{' '}
                <span className="text-emerald-400 font-semibold">{segments} SMS segment</span>
              </div>
            </div>

            <textarea
              rows={5}
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              className="w-full p-3.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors resize-none font-sans leading-relaxed"
            />

            {/* Merge Tag Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-zinc-500 block">Click variable tag to insert:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { tag: '{customer_name}', label: 'Customer Name' },
                  { tag: '{business_name}', label: 'Business Name' },
                  { tag: '{review_link}', label: 'Tracking Shortlink' },
                ].map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => insertVariable(item.tag)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 transition-colors"
                  >
                    <Tag className="w-3 h-3 text-zinc-500" />
                    <span>{item.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/60 flex items-start gap-2.5 text-xs text-zinc-400">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                Carrier compliance: All outbound links automatically expand to the authenticated tenant domain with 10DLC registration to prevent carrier spam filtering.
              </span>
            </div>
          </div>

          {/* Cooling Delay Selector */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Post-Transaction Cooling Interval
              </label>
              <p className="text-xs text-zinc-400 mt-1">
                Optimal time gap between customer POS swipe/checkout and the SMS review request.
              </p>
            </div>

            <div className="space-y-2">
              {delayOptions.map((opt) => (
                <label
                  key={opt.hours}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    delayHours === opt.hours
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="coolingDelay"
                      checked={delayHours === opt.hours}
                      onChange={() => setDelayHours(opt.hours)}
                      className="text-emerald-500 focus:ring-0"
                    />
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">{opt.label}</div>
                      <div className="text-[10px] text-zinc-500">{opt.desc}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{opt.hours}h</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Smartphone Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            Live Carrier Device Rendering
          </div>

          {/* Phone Shell */}
          <div className="bg-zinc-950 border-4 border-zinc-800 rounded-[2.5rem] shadow-2xl p-5 relative overflow-hidden flex flex-col h-[520px]">
            {/* Top Speaker Ear-piece */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-3.5 bg-zinc-900 rounded-full border border-zinc-800"></div>
            </div>

            {/* Conversation Header */}
            <div className="text-center pb-3 border-b border-zinc-800/80">
              <div className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs mx-auto mb-1 border border-zinc-700">
                GW
              </div>
              <div className="text-xs font-semibold text-zinc-200">{activeTenant.name}</div>
              <div className="text-[10px] text-zinc-500 font-mono">+1 (415) 890-4122</div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 py-4 space-y-3 overflow-y-auto">
              <div className="text-center text-[10px] text-zinc-600">
                Today 10:15 AM
              </div>

              {/* Inbound SMS Bubble */}
              <div className="flex flex-col items-start max-w-[88%] space-y-1">
                <div className="p-3 rounded-2xl rounded-tl-xs bg-zinc-800 text-zinc-100 text-xs leading-relaxed shadow-sm font-sans">
                  {renderedPreview}
                </div>
                <span className="text-[9px] text-zinc-500 px-1">Delivered</span>
              </div>

              {/* URL Link Preview Card inside Bubble */}
              <div className="ml-1 max-w-[85%] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 p-2.5 space-y-1.5">
                <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold">
                  {activeTenant.name}
                </div>
                <div className="text-xs font-medium text-zinc-200">
                  Rate your service with 1-tap
                </div>
                <div className="text-[10px] text-zinc-500">gw.link/r/9041</div>
              </div>
            </div>

            {/* Phone Home Bar */}
            <div className="flex justify-center pt-2">
              <div className="w-28 h-1 bg-zinc-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
