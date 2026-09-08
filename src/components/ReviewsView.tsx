import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Search, Filter, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { reviews, stats, settings } = useApp();
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase());

    const matchesRating = filterRating === 'all' || r.rating === filterRating;

    return matchesSearch && matchesRating;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reviews
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            All customer reviews at one glance.
          </p>
        </div>

        {settings.googleReviewUrl && (
          <a
            href={settings.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors self-start sm:self-auto"
          >
            <span>Open Google Maps Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        )}
      </div>

      {/* TOP 3 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Reviews */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Reviews
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {stats.totalReviews}
            </span>
            <span className="text-xs text-slate-400">Google verified</span>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Average Rating
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {stats.averageRating}
            </span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-xs text-slate-400 ml-1">Overall score</span>
          </div>
        </div>

        {/* 5 Star Reviews */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            5 Star Reviews
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-500">
              {stats.fiveStarCount}
            </span>
            <span className="text-xs text-slate-400">
              ({Math.round((stats.fiveStarCount / stats.totalReviews) * 100)}% of total)
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews by customer or text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-xs transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterRating === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilterRating(5)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
              filterRating === 5
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>5 Stars</span>
            <Star className="w-3 h-3 fill-current text-amber-400" />
          </button>
          <button
            onClick={() => setFilterRating(4)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
              filterRating === 4
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>4 Stars</span>
            <Star className="w-3 h-3 fill-current text-amber-400" />
          </button>
        </div>
      </div>

      {/* FEED OF REVIEW CARDS */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs">
            <p className="text-sm font-medium text-slate-500">
              No reviews found matching your search.
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all space-y-3"
            >
              {/* Header: Customer Name, Avatar, Date, and Source */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      review.avatarColor || 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {review.customerName}
                    </h3>
                    <span className="text-xs text-slate-400">
                      Posted {review.date}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 self-start sm:self-auto">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Google Reviews
                </span>
              </div>

              {/* 5 Yellow Stars */}
              <div className="flex items-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
                <span className="text-xs font-semibold text-slate-700 ml-1.5">
                  {review.rating}.0 / 5.0
                </span>
              </div>

              {/* Review Text */}
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                "{review.text}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
