'use client';
// apps/web/src/components/features/home/RecentParts.tsx

import { useEffect, useState } from 'react';
import { Card, Skeleton } from '@auto-bazaar-pro/ui/components';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Tag, ArrowLeft } from 'lucide-react';

// Part category icons (emoji as lightweight fallback)
const PART_CATEGORIES = [
  { id: 'engine', emoji: '⚙️', label: 'موتەر', labelEn: 'Engine' },
  { id: 'suspension', emoji: '🔧', label: 'سەسپێنشن', labelEn: 'Suspension' },
  { id: 'brakes', emoji: '🛑', label: 'فرێن', labelEn: 'Brakes' },
  { id: 'body', emoji: '🚗', label: 'جەستە', labelEn: 'Body' },
  { id: 'electrical', emoji: '⚡', label: 'کارەبا', labelEn: 'Electrical' },
  { id: 'tires', emoji: '🔘', label: 'تایەر', labelEn: 'Tires' },
];

function PartCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.03] animate-pulse">
      <div className="h-36 bg-white/[0.06]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-white/[0.06] rounded w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded w-1/2" />
        <div className="h-4 bg-white/[0.06] rounded w-2/5 mt-1" />
      </div>
    </div>
  );
}

function PartCard({ part }: { part: any }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/parts/${part.id}`} className="block group">
      <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a1525] hover:border-[#c8a84b]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#c8a84b]/10 hover:-translate-y-0.5">
        <div className="h-36 overflow-hidden bg-[#060f1a] relative">
          {!imgError ? (
            <img
              src={part.images?.[0] || '/placeholder.jpg'}
              alt={part.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
              🔧
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1525]/60 to-transparent" />
        </div>

        <div className="p-3" dir="rtl">
          <h4 className="text-xs font-semibold text-white/90 truncate mb-1 group-hover:text-[#c8a84b] transition-colors">
            {part.title}
          </h4>
          {part.make && (
            <p className="text-white/30 text-[10px] mb-2">{part.make} {part.model}</p>
          )}
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-black"
              style={{
                background: 'linear-gradient(135deg, #c8a84b, #f5d98b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ${part.price?.toLocaleString() || '---'}
            </span>
            <Tag className="w-3 h-3 text-white/20 group-hover:text-[#c8a84b]/60 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function RecentParts() {
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const params: any = { type: 'part', limit: '6' };
    if (activeCategory) params.category = activeCategory;
    setLoading(true);
    (api.listings?.getAll ? api.listings.getAll(params) : Promise.resolve([]))
      .then(res => setParts(res.data || res || []))
      .catch(() => setParts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div dir="rtl">
      {/* Category filter chips */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setActiveCategory('')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
            ${activeCategory === ''
              ? 'bg-[#c8a84b] text-[#050e18]'
              : 'bg-white/[0.05] border border-white/10 text-white/50 hover:border-[#c8a84b]/30 hover:text-white/80'
            }`}
        >
          هەموو / All
        </button>
        {PART_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? '' : cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
              ${activeCategory === cat.id
                ? 'bg-[#c8a84b] text-[#050e18]'
                : 'bg-white/[0.05] border border-white/10 text-white/50 hover:border-[#c8a84b]/30 hover:text-white/80'
              }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Parts Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <PartCardSkeleton key={i} />)}
        </div>
      ) : parts.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-3 opacity-20">🔧</div>
          <p className="text-white/30 text-sm">هیچ پارچەیەک نەدۆزرایەوە</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {parts.map((part: any) => <PartCard key={part.id} part={part} />)}
        </div>
      )}
    </div>
  );
}
