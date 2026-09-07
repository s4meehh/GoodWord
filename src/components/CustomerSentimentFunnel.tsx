import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  ShieldAlert,
  Send,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomerSentimentFunnel: React.FC = () => {
  const {
    customers,
    funnelCustomerId,
    setFunnelCustomerId,
    activeTenant,
    recordFunnelRating,
    setActiveNavTab,
  } = useApp();

  // Find customer or default to first
  const customer =
    customers.find((c) => c.id === funnelCustomerId) || customers[0] || {
      id: 'cust-demo',
      name: 'Alexander Wright',
      phone: '+14155554821',
      rating: undefined,
      status: 'DISPATCHED',
    };

  const [hoverStar, setHoverStar] = useState<number | null>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(customer.rating || null);
  const [feedbackText, setFeedbackText] = useState('');
  const [contactPref, setContactPref] = useState<'Phone' | 'Email'>('Phone');
  const [submittedNegative, setSubmittedNegative] = useState(false);
  const [redirectingToGoogle, setRedirectingToGoogle] = useState(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  // Sync if customer changes
  useEffect(() => {
    setSelectedStar(customer.rating || null);
    setSubmittedNegative(customer.status === 'INTERCEPTED');
    setRedirectingToGoogle(customer.status === 'CONVERTED');
    if (customer.privateFeedback) {
      setFeedbackText(customer.privateFeedback.comment);
      setContactPref(customer.privateFeedback.contactPreference);
    } else {
      setFeedbackText('');
    }
  }, [customer]);

  const handleStarClick = (rating: number) => {
    setSelectedStar(rating);

    if (rating >= 4) {
      // 4 or 5 stars -> Converted!
      setSubmittedNegative(false);
      setRedirectingToGoogle(true);

      // Trigger Confetti Burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b'],
        });
      } catch (e) {
        // Fallback gracefully
      }

      // Record state
      recordFunnelRating(customer.id, rating);
    } else {
      // 1, 2, or 3 stars -> Intercepted!
      setRedirectingToGoogle(false);
      setSubmittedNegative(false);
    }
  };

  const handleNegativeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStar) return;

    recordFunnelRating(customer.id, selectedStar, feedbackText, contactPref);
    setSubmittedNegative(true);
  };

  const handleResetTest = () => {
    setSelectedStar(null);
    setSubmittedNegative(false);
    setRedirectingToGoogle(false);
    setFeedbackText('');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Banner with customer selector & explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-sm font-bold text-zinc-100">
              Live Customer Sentiment Funnel Preview (/r/{customer.id})
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Test the exact screen customers see when they tap the SMS shortlink.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Customer Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Testing as:</span>
            <select
              value={customer.id}
              onChange={(e) => setFunnelCustomerId(e.target.value)}
              className="px-2.5 py-1 text-xs bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleResetTest}
            title="Reset rating"
            className="p-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="px-2.5 py-1 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{deviceFrameMode ? 'Full View' : 'Device Frame'}</span>
          </button>
        </div>
      </div>

      {/* Simulator Container */}
      <div className="flex justify-center">
        <div
          className={`w-full transition-all duration-300 ${
            deviceFrameMode
              ? 'max-w-md bg-zinc-950 border-4 border-zinc-800 rounded-[2.5rem] shadow-2xl p-6 relative overflow-hidden'
              : 'max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl p-8'
          }`}
        >
          {/* Mock Smartphone Speaker notch in device mode */}
          {deviceFrameMode && (
            <div className="flex justify-center mb-6">
              <div className="w-24 h-4 bg-zinc-900 rounded-full border border-zinc-800"></div>
            </div>
          )}

          {/* Business Branding Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 items-center justify-center text-emerald-400 shadow-sm mb-1">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-zinc-100 tracking-tight">
              {activeTenant.name}
            </h1>
            <p className="text-xs text-zinc-400">
              Hi <span className="font-semibold text-zinc-200">{customer.name}</span>, how was your
              recent visit with our team?
            </p>
          </div>

          {/* Star Rating Section */}
          <div className="mt-8 text-center">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-3">
              Tap a star to rate your service
            </div>

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isHovered = hoverStar !== null && hoverStar >= star;
                const isFilled = selectedStar !== null && selectedStar >= star;
                const isGoodRating = (hoverStar || selectedStar || 0) >= 4;

                let starFill = 'text-zinc-700 hover:text-zinc-500';
                if (isHovered || isFilled) {
                  starFill = isGoodRating
                    ? 'text-emerald-400 fill-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : 'text-rose-400 fill-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]';
                }

                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverStar(star)}
                    onMouseLeave={() => setHoverStar(null)}
                    onClick={() => handleStarClick(star)}
                    className="p-1.5 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                  >
                    <Star className={`w-8 h-8 ${starFill} transition-colors duration-150`} />
                  </button>
                );
              })}
            </div>

            <div className="h-6 mt-2 text-xs font-semibold">
              {selectedStar === 5 && (
                <span className="text-emerald-400">Exceptional • 5 Stars</span>
              )}
              {selectedStar === 4 && <span className="text-emerald-400">Very Good • 4 Stars</span>}
              {selectedStar === 3 && <span className="text-rose-400">Average • 3 Stars</span>}
              {selectedStar === 2 && (
                <span className="text-rose-400">Below Expectations • 2 Stars</span>
              )}
              {selectedStar === 1 && (
                <span className="text-rose-400">Unacceptable • 1 Star</span>
              )}
            </div>
          </div>

          {/* PATH A: 4 OR 5 STARS -> CONVERTED TO GOOGLE REVIEWS */}
          {selectedStar !== null && selectedStar >= 4 && (
            <div className="mt-6 p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-emerald-300">
                Thank you for your 5-Star feedback!
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                As a local business, your review helps families and clients find Dr. Martinez and
                our team. Would you share this on our Google Maps profile?
              </p>

              <div className="pt-2">
                <a
                  href={activeTenant.googleMapsReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  <span>Post on Google Reviews</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-1.5 pt-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Verified Google Maps API Destination</span>
              </div>
            </div>
          )}

          {/* PATH B: 1, 2, OR 3 STARS -> INTERCEPTED BY PRIVATE SENTIMENT FIREWALL */}
          {selectedStar !== null && selectedStar <= 3 && (
            <div className="mt-6 p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2.5 text-rose-400">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Our Dedicated Management Resolution
                </h3>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                We strive for 5-star service and regret that we fell short today. Please tell our
                management directly what went wrong so we can immediately make this right.
              </p>

              {submittedNegative ? (
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-xs font-bold text-zinc-100">Feedback Delivered Privately</h4>
                  <p className="text-xs text-zinc-400">
                    Your message has been directly dispatched to the general manager's resolution
                    inbox. We will follow up via your preferred contact method shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveNavTab('feedback')}
                      className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      View in Management Resolution Inbox <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNegativeSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      What could we have done better?
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Please share specific details about your visit, wait times, or service..."
                      className="w-full p-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1.5">
                      How would you prefer management to follow up?
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="radio"
                          name="contactPref"
                          checked={contactPref === 'Phone'}
                          onChange={() => setContactPref('Phone')}
                          className="text-rose-500 focus:ring-0"
                        />
                        <Phone className="w-3 h-3 text-zinc-400" />
                        <span>Phone Call</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="radio"
                          name="contactPref"
                          checked={contactPref === 'Email'}
                          onChange={() => setContactPref('Email')}
                          className="text-rose-500 focus:ring-0"
                        />
                        <Mail className="w-3 h-3 text-zinc-400" />
                        <span>Email Message</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-zinc-950 font-bold text-xs transition-all shadow-sm"
                  >
                    Submit Private Feedback to Management
                  </button>
                </form>
              )}

              {/* Technical Firewall Explainer */}
              <div className="pt-2 border-t border-rose-900/30 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1 text-rose-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Shield Engaged
                </span>
                <span>Customer is NEVER redirected to Google</span>
              </div>
            </div>
          )}

          {/* Footer TCPA Compliance microcopy */}
          <div className="mt-8 text-center text-[10px] text-zinc-600 leading-relaxed">
            GoodWord Reputation Shield • Protected for {activeTenant.name}
            <br />
            Reply STOP to opt out. Message and data rates may apply.
          </div>
        </div>
      </div>
    </div>
  );
};
