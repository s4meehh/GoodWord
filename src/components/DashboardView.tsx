import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Star,
  Send,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { stats, chartData, reviews, setActiveTab } = useApp();

  // 3 latest reviews
  const recentReviews = reviews.slice(0, 3);

  // Maximum value for bar chart height scaling
  const maxCount = Math.max(...chartData.map((d) => d.count), 12);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of your Google Reviews and customer response metrics.
          </p>
        </div>
      </div>

      {/* TOP 4 METRIC CARDS (White cards on gray) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Customers */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Customers
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">
              {stats.totalCustomers}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Imported from POS & checkout
          </p>
        </div>

        {/* Total Reviews */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Reviews
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">
              {stats.totalReviews}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Verified on Google Maps
          </p>
        </div>

        {/* Reviews Sent */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Reviews Sent
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">
              {stats.reviewsSent}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            SMS invitations dispatched
          </p>
        </div>

        {/* Response Rate */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Response Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">
              {stats.responseRate}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Industry average is ~35%
          </p>
        </div>
      </div>

      {/* MIDDLE SECTION (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Performance Overview Bar Chart (col-span-2) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Performance Overview
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Weekly customer reviews generated via SMS campaigns
              </p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
              This Week
            </span>
          </div>

          {/* Vertical Bar Chart */}
          <div className="pt-4 pb-2">
            <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {chartData.map((item) => {
                const heightPercent = Math.max(
                  Math.round((item.count / maxCount) * 100),
                  14
                );
                return (
                  <div
                    key={item.day}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded shadow-xs mb-1">
                      {item.count}
                    </div>
                    {/* Bar */}
                    <div className="w-full bg-slate-100 rounded-t-lg relative flex items-end h-36 overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-blue-600 rounded-t-lg transition-all duration-500 ease-out group-hover:bg-blue-700"
                      />
                    </div>
                    {/* Day label */}
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Aggregated across all SMS invites</span>
            <span className="font-medium text-blue-600">48 total reviews recorded</span>
          </div>
        </div>

        {/* Right: Average Rating Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Average Rating
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live Google Maps public score
            </p>
          </div>

          <div className="my-6 text-center space-y-3">
            <div className="text-5xl font-extrabold text-slate-900 tracking-tight">
              {stats.averageRating}
            </div>

            {/* 5 Yellow Stars */}
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-6 h-6 text-amber-400 fill-amber-400"
                />
              ))}
            </div>

            <p className="text-sm font-medium text-slate-600">
              Based on {stats.totalReviews} reviews
            </p>
          </div>

          {/* Breakdown bar */}
          <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                5 Stars
              </span>
              <span className="font-semibold text-slate-900">{stats.fiveStarCount} reviews</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{
                  width: `${(stats.fiveStarCount / stats.totalReviews) * 100}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-slate-600 pt-1">
              <span className="flex items-center gap-1 font-medium">
                4 Stars
              </span>
              <span className="font-semibold text-slate-900">
                {stats.totalReviews - stats.fiveStarCount} reviews
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-300 rounded-full"
                style={{
                  width: `${
                    ((stats.totalReviews - stats.fiveStarCount) / stats.totalReviews) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: RECENT REVIEWS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recent Reviews
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest public Google reviews received from customers
            </p>
          </div>

          <button
            onClick={() => setActiveTab('reviews')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View all reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Latest Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        review.avatarColor || 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                        {review.customerName}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  "{review.text}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  Google Verified
                </span>
                <span>Public review</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
