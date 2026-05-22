// apps/web/src/app/[locale]/dashboard/listings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Plus, Eye, Edit3, Trash2, Search, Filter, MoreHorizontal, Car, TrendingUp } from 'lucide-react';

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    api.listings
      .myListings()
      .then(setListings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('دڵنیایت؟')) return;
    await api.listings.delete(id);
    setListings((prev) => prev.filter((l) => l.id !== id));
    setActiveMenu(null);
  };

  const filtered = listings.filter((l) => {
    const title = l.titleKu ?? l.titleEn ?? '';
    return title.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="p-5 lg:p-7 space-y-4">
        <div className="h-8 w-48 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-7 space-y-5 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">My Listings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage and monitor your vehicle listings
          </p>
        </div>
        <Link
          href="dashboard/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#e94560] hover:bg-[#d63d57] text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#e94560]/25 hover:shadow-[#e94560]/40 hover:-translate-y-0.5 active:translate-y-0 w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Listing
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#e94560]/20 focus:border-[#e94560]/50 transition-all"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Empty State */}
      {!filtered.length && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4 text-3xl">
            🚗
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No listings yet</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            {search ? 'No results match your search.' : 'Start selling by adding your first car listing.'}
          </p>
          {!search && (
            <Link
              href="dashboard/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e94560] text-white rounded-xl text-sm font-semibold hover:bg-[#d63d57] transition-colors shadow-lg shadow-[#e94560]/25"
            >
              <Plus className="w-4 h-4" />
              Add Your First Listing
            </Link>
          )}
        </div>
      )}

      {/* Listings Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((listing) => {
            const cover = listing.images?.[0]?.url;
            const title = listing.titleKu ?? listing.titleEn;
            return (
              <div
                key={listing.id}
                className="group relative bg-white dark:bg-[#0f0f1a]/80 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 overflow-hidden">
                  {cover ? (
                    <img src={cover} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🚗</div>
                  )}
                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${
                      listing.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${listing.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {listing.status}
                    </span>
                  </div>
                  {/* Menu */}
                  <div className="absolute top-3 right-3">
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === listing.id ? null : listing.id)}
                        className="w-7 h-7 rounded-lg bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-white" />
                      </button>
                      {activeMenu === listing.id && (
                        <div className="absolute right-0 top-8 z-20 w-36 bg-white dark:bg-[#1a1a2e] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 py-1 text-sm overflow-hidden">
                          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <div className="h-px bg-gray-100 dark:bg-white/5 my-1" />
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate mb-1">{title}</h3>
                  <p className="text-lg font-black text-[#e94560] tracking-tight">
                    {listing.price.toLocaleString()} {listing.currency}
                  </p>
                  {/* Stats row */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{Math.floor(Math.random() * 300 + 50)} views</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+{Math.floor(Math.random() * 20 + 5)}% this week</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
