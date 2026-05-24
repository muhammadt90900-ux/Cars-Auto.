'use client';
// components/features/home/HeroSearch.tsx
// Redesigned — Full-bleed premium hero that visually connects with the navbar above it

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, SlidersHorizontal, X, Car, Wrench, Bike, MapPin, Zap } from 'lucide-react';

const MAKES = [
  'تۆیۆتا / Toyota','کیا / KIA','هیوندای / Hyundai',
  'BMW','Mercedes-Benz','Lexus','Honda','Nissan',
  'Mitsubishi','Ford','BYD','Geely','Chery','Haval',
];
const MODELS: Record<string, string[]> = {
  'تۆیۆتا / Toyota': ['Camry','Corolla','Land Cruiser','Prado','Hilux','RAV4','Fortuner'],
  'کیا / KIA':        ['Sportage','Sorento','Cerato','Optima','Carnival'],
  'هیوندای / Hyundai':['Tucson','Santa Fe','Elantra','Sonata','Creta'],
  'BMW':              ['3 Series','5 Series','7 Series','X5','X7','M3','M5'],
  'Mercedes-Benz':    ['C-Class','E-Class','S-Class','GLE','GLS','G-Class'],
};
const YEARS  = Array.from({ length: 26 }, (_, i) => String(2025 - i));
const CITIES = [
  'سلێمانی / Sulaymaniyah','هەولێر / Erbil','دهۆک / Duhok',
  'کەرکوک / Kirkuk','بەغدا / Baghdad','بەسرە / Basra',
  'دبی / Dubai','شارجە / Sharjah',
];
const PRICE_RANGES = [
  'زیر 5,000$','5,000 – 15,000$','15,000 – 30,000$',
  '30,000 – 60,000$','60,000 – 100,000$','زیاتر لە 100,000$',
];
const CATEGORIES = [
  { id: 'cars',  label: 'ئۆتۆمبێل', labelEn: 'Cars',        icon: Car   },
  { id: 'parts', label: 'پارچەکان', labelEn: 'Parts',        icon: Wrench},
  { id: 'bikes', label: 'مۆتۆسیکل', labelEn: 'Motorcycles', icon: Bike  },
];
const QUICK_SEARCHES = [
  'Land Cruiser 2023','BMW 5 Series','Toyota Camry هەولێر','Kia Sportage',
];
const STATS = [
  { value: '24,000+', label: 'ئۆتۆمبێل',    labelEn: 'Listings'  },
  { value: '1,200+',  label: 'فرۆشەر',       labelEn: 'Dealers'   },
  { value: '8',       label: 'شار',           labelEn: 'Cities'    },
  { value: '4.9★',    label: 'هەڵسەنگاندن', labelEn: 'Rating'    },
];

/* ── Dropdown ─────────────────────────────────────────────────── */
interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}
function Dropdown({ label, value, options, onChange, placeholder, disabled }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
        className={`
          w-full flex items-center justify-between gap-2 px-4 py-3
          rounded-xl text-sm text-left transition-all duration-200
          border
          ${disabled
            ? 'opacity-40 cursor-not-allowed bg-white/[0.03] border-white/[0.06]'
            : open
              ? 'bg-[#c9a84c]/[0.10] border-[#c9a84c]/60 shadow-[0_0_0_3px_rgba(201,168,76,0.12)]'
              : 'bg-white/[0.05] border-white/[0.10] hover:bg-white/[0.08] hover:border-[#c9a84c]/30 cursor-pointer'
          }
        `}
      >
        <div className="flex flex-col min-w-0 gap-0.5">
          <span className="text-[9px] uppercase tracking-[0.12em] text-[#c9a84c]/70 font-bold">
            {label}
          </span>
          <span className={`truncate text-sm font-medium ${value ? 'text-white' : 'text-white/30'}`}>
            {value || placeholder || '---'}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-all duration-200
                      ${open ? 'rotate-180 text-[#c9a84c]' : 'text-white/30'}`}
        />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50
                        bg-[#0b1525]/98 backdrop-blur-2xl
                        border border-[#c9a84c]/20
                        rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.70)]
                        overflow-hidden">
          <div className="max-h-52 overflow-y-auto no-scrollbar">
            <div
              onClick={() => { onChange(''); setOpen(false); }}
              className="px-4 py-2.5 text-white/35 text-xs cursor-pointer
                         hover:bg-white/[0.05] hover:text-white/60
                         border-b border-white/[0.06] transition-colors"
            >
              {placeholder || 'هەموو / All'}
            </div>
            {options.map(opt => (
              <div
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150
                  ${value === opt
                    ? 'bg-[#c9a84c]/[0.15] text-[#c9a84c] font-semibold'
                    : 'text-white/75 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ HeroSearch ══════════════════════════════════════════════════ */
export function HeroSearch() {
  const [query,       setQuery]       = useState('');
  const [category,    setCategory]    = useState('cars');
  const [make,        setMake]        = useState('');
  const [model,       setModel]       = useState('');
  const [yearFrom,    setYearFrom]    = useState('');
  const [yearTo,      setYearTo]      = useState('');
  const [city,        setCity]        = useState('');
  const [price,       setPrice]       = useState('');
  const [showAdvanced,setShowAdvanced]= useState(false);
  const [focused,     setFocused]     = useState(false);

  const activeModels      = make && MODELS[make] ? MODELS[make] : [];
  const activeFiltersCount = [make,model,yearFrom,yearTo,city,price].filter(Boolean).length;

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden"
      style={{
        /* Full-bleed hero that shares the same midnight-navy palette as the navbar */
        background: 'linear-gradient(175deg, #050b14 0%, #080f1c 35%, #0b1525 65%, #050b14 100%)',
        minHeight: 'calc(100vh * 0.82)',
      }}
    >
      {/* ── Background atmosphere ──────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Primary radial glow — centered */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[1000px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Secondary glow — top right */}
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Tertiary glow — bottom left */}
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14,60,120,0.12) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Diagonal light sweep — decorative */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            background: 'linear-gradient(45deg, transparent 40%, rgba(201,168,76,1) 50%, transparent 60%)',
            backgroundSize: '200% 200%',
            animation: 'sweep 8s ease-in-out infinite',
          }}
        />

        {/* Top edge — smooth continuation from navbar */}
        <div className="absolute top-0 inset-x-0 h-[68px]
                        bg-gradient-to-b from-[#050b14] to-transparent" />
      </div>

      {/* ── Sweep keyframe injected via style tag ─────────────── */}
      <style>{`
        @keyframes sweep {
          0%,100% { background-position: -100% -100%; }
          50%      { background-position:  100%  100%; }
        }
        @keyframes countUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0);   }
        }
        .stat-item { animation: countUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {/* ── Content ────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-5xl mx-auto px-4"
        style={{ paddingTop: 'calc(68px + 4rem)', paddingBottom: '4rem' }}
      >

        {/* ── Badge ─────────────────────────────────────────────── */}
        <div className="flex justify-center mb-6 reveal stagger-1">
          <span className="badge-gold">
            <span className="pulse-dot" />
            Iraq · Kurdistan · Dubai · China
          </span>
        </div>

        {/* ── Headline ──────────────────────────────────────────── */}
        <div className="text-center mb-8 reveal stagger-2">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                         font-extrabold text-white leading-[1.08] tracking-tight mb-4">
            دۆزینەوەی{' '}
            <span className="text-gold">ئۆتۆمبێلی</span>
            {' '}تەواوت
          </h1>
          <p className="text-white/45 text-sm sm:text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed">
            Find Your Perfect Vehicle Across the Middle East &amp; Beyond
          </p>
        </div>

        {/* ── Category Tabs ─────────────────────────────────────── */}
        <div className="flex gap-2 justify-center mb-6 reveal stagger-3">
          {CATEGORIES.map(({ id, label, labelEn, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm
                          font-semibold transition-all duration-250
                          ${category === id
                            ? 'bg-gradient-to-r from-[#b8922e] to-[#dab445] text-[#050b14] shadow-[var(--shadow-gold)]'
                            : 'bg-white/[0.06] border border-white/[0.10] text-white/55 hover:bg-white/[0.09] hover:text-white hover:border-[#c9a84c]/25'
                          }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden xs:inline">{label}</span>
              <span className="inline xs:hidden">{labelEn}</span>
              <span className="hidden sm:inline text-[10px] opacity-60">/ {labelEn}</span>
            </button>
          ))}
        </div>

        {/* ── Main Search Card ──────────────────────────────────── */}
        <div
          className={`rounded-2xl border transition-all duration-350 overflow-hidden reveal stagger-4
                      ${focused
                        ? 'border-[#c9a84c]/50 shadow-[0_0_0_1px_rgba(201,168,76,0.12),0_24px_64px_rgba(0,0,0,0.50)]'
                        : 'border-white/[0.09] shadow-[0_12px_40px_rgba(0,0,0,0.40)]'
                      }`}
          style={{
            background: 'linear-gradient(135deg, rgba(11,21,37,0.85) 0%, rgba(8,15,28,0.90) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          {/* Search input row */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
            <Search
              className={`w-5 h-5 flex-shrink-0 transition-colors duration-200
                          ${focused ? 'text-[#c9a84c]' : 'text-white/25'}`}
            />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="گەڕان بکە... Toyota Land Cruiser، بەغدا، BMW 2023..."
              className="flex-1 bg-transparent text-white placeholder-white/25
                         outline-none text-sm md:text-base font-medium caret-[#c9a84c]"
              dir="rtl"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-white/25 hover:text-white/60 transition-colors flex-shrink-0"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter row */}
          <div className="p-3">
            <div className="flex flex-wrap md:flex-nowrap gap-2 items-stretch">
              <Dropdown
                label="براند"
                value={make}
                options={MAKES}
                onChange={v => { setMake(v); setModel(''); }}
                placeholder="هەموو براندەکان"
              />
              <Dropdown
                label="مۆدێل"
                value={model}
                options={activeModels}
                onChange={setModel}
                placeholder="مۆدێل هەڵبژێرە"
                disabled={!make}
              />
              <Dropdown
                label="شار"
                value={city}
                options={CITIES}
                onChange={setCity}
                placeholder="هەموو شارەکان"
              />
              <Dropdown
                label="نرخ"
                value={price}
                options={PRICE_RANGES}
                onChange={setPrice}
                placeholder="هەموو نرخەکان"
              />

              {/* Search CTA */}
              <button
                type="button"
                className="btn-gold flex items-center gap-2 px-6 py-3
                           rounded-xl font-bold text-sm whitespace-nowrap flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                گەڕان
              </button>
            </div>

            {/* Advanced toggle */}
            <div className="mt-2.5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAdvanced(v => !v)}
                className="flex items-center gap-1.5 text-xs text-white/35
                           hover:text-[#c9a84c] transition-colors duration-200"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>فلتەری پیشکەوتوو</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#c9a84c] text-[#050b14] text-[9px] font-black
                                   rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200
                              ${showAdvanced ? 'rotate-180' : ''}`}
                />
              </button>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={() => { setMake(''); setModel(''); setYearFrom(''); setYearTo(''); setCity(''); setPrice(''); }}
                  className="text-xs text-white/25 hover:text-red-400 transition-colors
                             flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  سڕینەوەی فلتەرەکان
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <div
            className="overflow-hidden transition-all duration-350"
            style={{ maxHeight: showAdvanced ? '220px' : '0' }}
          >
            <div className="px-3 pb-4 pt-3 border-t border-white/[0.06]">
              <div className="flex flex-wrap gap-3">
                {/* Year range */}
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <Dropdown label="ساڵی دەستپێک" value={yearFrom} options={YEARS} onChange={setYearFrom} placeholder="2000" />
                  <span className="text-white/20 text-sm flex-shrink-0 mt-3">—</span>
                  <Dropdown label="ساڵی کۆتایی"  value={yearTo}   options={YEARS} onChange={setYearTo}   placeholder="2025" />
                </div>

                {/* Condition chips */}
                <div className="flex flex-col min-w-[200px]">
                  <span className="text-[9px] uppercase tracking-[0.12em] text-[#c9a84c]/70
                                   font-bold mb-2">حاڵەت / Condition</span>
                  <div className="flex gap-2 flex-wrap">
                    {['نوێ / New','بەکارهاتوو / Used','گووشتی / Salvage'].map(c => (
                      <button
                        key={c}
                        type="button"
                        className="px-3 py-1.5 rounded-lg text-xs border border-white/[0.10]
                                   text-white/50 bg-white/[0.04]
                                   hover:border-[#c9a84c]/40 hover:text-[#c9a84c]
                                   hover:bg-[#c9a84c]/[0.07]
                                   transition-all duration-200"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick search tags ──────────────────────────────────── */}
        <div className="mt-5 flex items-center gap-2 flex-wrap justify-center reveal stagger-5">
          <span className="text-white/25 text-xs">گەڕانی خێرا:</span>
          {QUICK_SEARCHES.map(tag => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-full text-xs
                         bg-white/[0.04] border border-white/[0.08] text-white/45
                         hover:border-[#c9a84c]/35 hover:text-[#c9a84c]/90
                         hover:bg-[#c9a84c]/[0.06]
                         transition-all duration-200"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ── Stats strip ──────────────────────────────────────── */}
        <div className="mt-10 reveal stagger-6">
          {/* Separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent mb-8" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0">
            {STATS.map(({ value, label, labelEn }, i) => (
              <div
                key={label}
                className={`stat-item text-center py-2 relative
                            ${i < STATS.length - 1 ? 'sm:border-e sm:border-white/[0.08]' : ''}`}
                style={{ animationDelay: `${0.35 + i * 0.07}s` }}
              >
                <div
                  className="text-2xl sm:text-3xl font-display font-extrabold mb-0.5 text-gold tabular-nums"
                >
                  {value}
                </div>
                <div className="text-white/40 text-xs font-medium">
                  {label}
                  <span className="text-white/20 mx-1">/</span>
                  {labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Bottom wave transition ─────────────────────────────── */}
      <div className="relative z-10 h-12 overflow-hidden">
        <svg
          viewBox="0 0 1440 48"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
        >
          {/* The fill matches the page background below the hero */}
          <path
            d="M0,48 L0,24 Q180,0 360,24 Q540,48 720,24 Q900,0 1080,24 Q1260,48 1440,24 L1440,48 Z"
            fill="currentColor"
            className="text-slate-50 dark:text-[#050b14]"
          />
        </svg>
      </div>
    </section>
  );
}
