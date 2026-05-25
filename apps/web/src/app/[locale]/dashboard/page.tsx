'use client';
// app/[locale]/dashboard/page.tsx — Fully localized dashboard overview

import { useTranslations } from 'next-intl';
import { TrendingUp, TrendingDown, Eye, Car, MessageSquare, DollarSign, Star, Heart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const h = 36, w = 80;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  const colorMap: Record<string, string> = { blue: '#3b82f6', emerald: '#10b981', violet: '#8b5cf6', amber: '#f59e0b' };
  const c = colorMap[color] ?? '#c9a84c';
  return (
    <svg width={w} height={h} aria-hidden className="opacity-70">
      <polyline points={pts} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  const stats = [
    { labelKey: 'totalViews',    value: '24,891', change: '+18.2%', trend: 'up',   icon: Eye,           color: 'blue',    iconBg: 'bg-blue-500/10 text-blue-500',     sparkline: [40,55,45,70,65,80,90,85,95] },
    { labelKey: 'activeListings',value: '12',     change: '+3',     trend: 'up',   icon: Car,           color: 'emerald', iconBg: 'bg-emerald-500/10 text-emerald-500',sparkline: [6,8,7,9,10,10,11,12,12]    },
    { labelKey: 'newMessages',   value: '38',     change: '-4.1%',  trend: 'down', icon: MessageSquare, color: 'violet',  iconBg: 'bg-violet-500/10 text-violet-500',  sparkline: [50,44,48,42,45,40,38,42,38] },
    { labelKey: 'revenue',       value: '$3,240', change: '+22.5%', trend: 'up',   icon: DollarSign,    color: 'amber',   iconBg: 'bg-amber-500/10 text-amber-500',    sparkline: [1200,1500,1350,1800,2100,2400,2800,3000,3240] },
  ];

  const recentListings = [
    { id: 1, name: 'Toyota Camry 2022',  price: '$18,500', views: 342, statusKey: 'active'  },
    { id: 2, name: 'BMW 3 Series 2021',  price: '$28,900', views: 198, statusKey: 'active'  },
    { id: 3, name: 'Honda CR-V 2023',    price: '$24,200', views: 87,  statusKey: 'pending' },
    { id: 4, name: 'Mercedes C200 2020', price: '$31,000', views: 521, statusKey: 'active'  },
  ];

  const statusStyles: Record<string, string> = {
    active:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  };

  return (
    <div className="p-5 lg:p-7 space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ labelKey, value, change, trend, icon: Icon, color, iconBg, sparkline }) => (
          <div key={labelKey} className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#0b1525] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon className="w-4 h-4" aria-hidden />
              </div>
              <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" aria-hidden /> : <ArrowDownRight className="w-3 h-3" aria-hidden />}
                {change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(labelKey as any)}</p>
            </div>
            <Sparkline values={sparkline} color={color} />
          </div>
        ))}
      </div>

      {/* Recent listings */}
      <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#0b1525] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.07]">
          <h2 className="font-semibold text-gray-900 dark:text-white">{t('recentListings')}</h2>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
          {recentListings.map((listing) => (
            <div key={listing.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <Car className="w-4 h-4 text-gray-400" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{listing.name}</p>
                  <p className="text-xs text-gray-400">{listing.views} {t('totalViews').toLowerCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-[#c9a84c]">{listing.price}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[listing.statusKey] ?? ''}`}>
                  {t(listing.statusKey === 'active' ? 'overview' : 'overview')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
