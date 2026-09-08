import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Clock,
  Smartphone,
  Save,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';

export const CampaignsView: React.FC = () => {
  const { campaign, updateCampaign, settings } = useApp();
  const [template, setTemplate] = useState(campaign.messageTemplate);
  const [delay, setDelay] = useState(campaign.delayOption);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTemplate(campaign.messageTemplate);
    setDelay(campaign.delayOption);
  }, [campaign]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCampaign({
      messageTemplate: template.trim(),
      delayOption: delay,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const insertTag = (tag: string) => {
    setTemplate((prev) => prev + ` ${tag}`);
  };

  // Preview message with real mock values
  const previewText = template
    .replace('{Customer_Name}', 'Mike')
    .replace(
      '{Review_Link}',
      settings.googleReviewUrl || 'https://g.page/r/blue-oak-bistro/review'
    );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          SMS Campaigns
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize the automated text message sent to customers after their visit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Campaign Editor Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-7 border border-slate-200/80 shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Custom Review Request Message */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                Custom Review Request Message
              </label>
              <p className="text-xs text-slate-500">
                Craft a warm, personal note inviting your customer to leave a review.
              </p>

              <textarea
                rows={5}
                required
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all resize-none leading-relaxed"
              />

              {/* Merge Tags Helper */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-medium">Available tags:</span>
                <button
                  type="button"
                  onClick={() => insertTag('{Customer_Name}')}
                  className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono text-xs font-semibold transition-colors cursor-pointer"
                  title="Click to insert tag"
                >
                  +{'{Customer_Name}'}
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('{Review_Link}')}
                  className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono text-xs font-semibold transition-colors cursor-pointer"
                  title="Click to insert tag"
                >
                  +{'{Review_Link}'}
                </button>
              </div>
            </div>

            {/* Delay Setting */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-900">
                Send Delay Setting
              </label>
              <p className="text-xs text-slate-500">
                Timing for when the text message should automatically trigger after checkout.
              </p>

              <div className="relative">
                <select
                  value={delay}
                  onChange={(e) =>
                    setDelay(e.target.value as 'Immediate' | '1 hour' | '2 hours')
                  }
                  className="w-full appearance-none px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Immediate">Immediate (right at checkout)</option>
                  <option value="1 hour">1 hour after visit (Recommended)</option>
                  <option value="2 hours">2 hours after visit</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Save Campaign Royal Blue Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm shadow-blue-600/25 transition-all cursor-pointer"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Campaign Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Campaign</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: iPhone SMS Preview Bubble (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-7 border border-slate-200/80 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-600" />
              Customer iPhone Preview
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Live Preview
            </span>
          </div>

          {/* iPhone Mockup Frame */}
          <div className="w-full max-w-[290px] rounded-[38px] border-[6px] border-slate-800 bg-slate-100 p-3 shadow-xl shadow-slate-300/40 relative">
            {/* Top Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

            {/* Screen Content */}
            <div className="bg-white rounded-[24px] p-3.5 min-h-[380px] flex flex-col justify-between border border-slate-200/50">
              {/* iOS Chat Header */}
              <div className="text-center pb-2 border-b border-slate-100 space-y-0.5">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center mx-auto mb-1">
                  BO
                </div>
                <p className="text-xs font-semibold text-slate-900">
                  {settings.businessName || 'Blue Oak Bistro'}
                </p>
                <p className="text-[10px] text-slate-400">SMS / Text Message</p>
              </div>

              {/* Timestamp */}
              <div className="my-auto py-4 space-y-2">
                <p className="text-[10px] text-center text-slate-400">
                  Today 2:15 PM
                </p>

                {/* iMessage Bubble */}
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-xs p-3.5 text-xs leading-relaxed shadow-sm font-normal">
                  {previewText}
                </div>

                <p className="text-[9px] text-right text-slate-400 pr-1">
                  Delivered
                </p>
              </div>

              {/* Input simulator */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[10px]">
                <div className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 w-full text-slate-400">
                  iMessage
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mt-5 leading-relaxed max-w-xs">
            Text messages are dispatched via high-deliverability local 10DLC phone carriers.
          </p>
        </div>
      </div>
    </div>
  );
};
