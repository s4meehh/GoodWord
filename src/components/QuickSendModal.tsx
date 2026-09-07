import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Clock, Sparkles, MessageSquare, Phone, User, Hash } from 'lucide-react';

export const QuickSendModal: React.FC = () => {
  const {
    quickSendOpen,
    setQuickSendOpen,
    quickSendInvite,
    activeTenant,
  } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [sendTiming, setSendTiming] = useState<'immediate' | 'delayed'>('delayed');

  if (!quickSendOpen) return null;

  // Format phone number as user types: (XXX) XXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;

    if (raw.length > 0 && raw.length <= 3) {
      formatted = `(${raw}`;
    } else if (raw.length > 3 && raw.length <= 6) {
      formatted = `(${raw.slice(0, 3)}) ${raw.slice(3)}`;
    } else if (raw.length > 6) {
      formatted = `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6, 10)}`;
    }
    setPhone(formatted);
  };

  const dynamicSmsPreview = activeTenant.smsTemplate
    .replace('{customer_name}', name.trim() ? name.trim() : '[Customer Name]')
    .replace('{business_name}', activeTenant.name)
    .replace('{review_link}', 'https://gw.link/r/9041');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    quickSendInvite({
      name: name.trim(),
      phone: phone.trim(),
      referenceId: referenceId.trim() || undefined,
      sendImmediately: sendTiming === 'immediate',
    });

    // Reset and close
    setName('');
    setPhone('');
    setReferenceId('');
    setSendTiming('delayed');
    setQuickSendOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Quick Send Review Invite</h3>
              <p className="text-xs text-zinc-400">
                Dispatches a verified SMS invite to {activeTenant.name} customer
              </p>
            </div>
          </div>
          <button
            onClick={() => setQuickSendOpen(false)}
            className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              Customer Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Arthur Pendelton"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                Mobile Phone <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="(415) 555-0199"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-zinc-500" />
                Invoice / Ref ID (Optional)
              </label>
              <input
                type="text"
                placeholder="INV-2026-9912"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Send Timing Radio Options */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Dispatch Schedule
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <label
                className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                  sendTiming === 'delayed'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="timing"
                  checked={sendTiming === 'delayed'}
                  onChange={() => setSendTiming('delayed')}
                  className="mt-0.5 text-emerald-500 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-semibold text-zinc-200">
                    Standard Delay ({activeTenant.defaultDelayHours}h)
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    Recommended cooling window
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                  sendTiming === 'immediate'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="timing"
                  checked={sendTiming === 'immediate'}
                  onChange={() => setSendTiming('immediate')}
                  className="mt-0.5 text-emerald-500 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-semibold text-zinc-200">Send Immediately</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    Dispatches Twilio SMS right now
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Dynamic Live SMS Preview Box */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                Live SMS Preview
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {dynamicSmsPreview.length} / 160 chars
              </span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed font-sans">
              {dynamicSmsPreview}
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => setQuickSendOpen(false)}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !phone.trim()}
              className="px-5 py-2 text-xs font-semibold text-zinc-950 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            >
              Dispatch Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
