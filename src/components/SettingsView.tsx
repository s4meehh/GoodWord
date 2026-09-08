import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Link2,
  Copy,
  Check,
  Save,
  Building,
  Phone,
  ExternalLink,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, addToast } = useApp();

  const [googleUrl, setGoogleUrl] = useState(settings.googleReviewUrl);
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [phone, setPhone] = useState(settings.phone);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [savedLink, setSavedLink] = useState(false);
  const [savedDetails, setSavedDetails] = useState(false);

  useEffect(() => {
    setGoogleUrl(settings.googleReviewUrl);
    setBusinessName(settings.businessName);
    setPhone(settings.phone);
  }, [settings]);

  const handleSaveGoogleLink = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ googleReviewUrl: googleUrl.trim() });
    setSavedLink(true);
    setTimeout(() => setSavedLink(false), 2000);
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      businessName: businessName.trim(),
      phone: phone.trim(),
    });
    setSavedDetails(true);
    setTimeout(() => setSavedDetails(false), 2000);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(settings.webhookUrl);
    setCopiedWebhook(true);
    addToast({
      type: 'success',
      title: 'Webhook URL Copied',
      message: 'Paste into Zapier, Square, or Calendly to sync customers automatically.',
    });
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure your Google Review URL, automation webhooks, and store profile.
        </p>
      </div>

      {/* BOX 1: Google Business Review Link */}
      <div className="bg-white rounded-xl p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Google Business Review Link
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste your Google Maps review URL where customers will be directed to leave a review.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveGoogleLink} className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              placeholder="https://g.page/r/your-business/review"
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white font-mono text-xs transition-all"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {savedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Link</span>
                  </>
                )}
              </button>

              {googleUrl && (
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400">
            How to find: Go to your Google Business Profile → Click "Ask for reviews" → Copy your short link.
          </p>
        </form>
      </div>

      {/* BOX 2: Zapier / POS Webhook URL */}
      <div className="bg-white rounded-xl p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Zapier / POS Webhook URL
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Copy this URL to connect Square, Stripe, Toast, Calendly, or Zapier to automatically import customers.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              readOnly
              value={settings.webhookUrl}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyWebhook}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedWebhook ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Webhook URL</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Accepts JSON payloads containing <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">customer_name</code> and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">phone</code>.</span>
          </div>
        </div>
      </div>

      {/* BOX 3: Business Details */}
      <div className="bg-white rounded-xl p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Business Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Your business identity displayed inside outgoing SMS messages.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveDetails} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Blue Oak Bistro"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Business Phone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. (415) 555-0142"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {savedDetails ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Business Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
