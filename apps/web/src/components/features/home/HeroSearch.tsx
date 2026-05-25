'use client';
// components/features/home/HeroSearch.tsx — Fully localized hero search

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { Search, ChevronDown, SlidersHorizontal, X, Car, Wrench, Bike, MapPin } from 'lucide-react';

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
const PRICE_RANGES_EN = [
  'Under $5,000','$5,000 – $15,000','$15,000 – $30,000',
  '$30,000 – $60,000','$60,000 – $100,000','Over $100,000',
];

function Dropdown({ label, value, options, onChange, placeholder, disabled }: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button type="button" disabled={disabled} onClick={() => !disabled && setOpen(v => !v)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-sm transition-all duration-200 border
          ${disabled ? 'opacity-40 cursor-not-allowed bg-white/[0.03] border-white/[0.06]'
            : open ? 'bg-[#c9a84c]/[0.10] border-[#c9a84c]/60 shadow-[0_0_0_3px_rgba(201,168,76,0.12)]'
            : 'bg-white/[0.05] border-white/[0.10] hover:bg-white/[0.08] hover:border-[#c9a84c]/30 cursor-pointer'}`}>
        <span className="truncate text-start text-white/70">{value || placeholder || label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/40 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open && (
        <div className="absolute top-full mt-1 inset-x-0 z-50 rounded-xl border border-white/10 bg-[#0d1a2d] shadow-2xl max-h-52 overflow-y-auto">
          <button type="button" onClick={() => { onChange(''); setOpen(false); }}
            className="w-full text-start px-4 py-2.5 text-sm text-white/40 hover:bg-white/5 transition-colors">
            {placeholder || label}
          </button>
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-start px-4 py-2.5 text-sm transition-colors
                ${opt === value ? 'bg-[#c9a84c]/15 text-[#e8cc7a]' : 'text-white/70 hover:bg-white/[0.07] hover:text-white'}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function HeroSearch() {
  const t  = useTranslations('hero');
  const tc = useTranslations('common');
  const params = useParams();
  const router = useRouter();
  const locale = Array.isArray(params.locale) ? params.locale[0] : (params.locale ?? 'ku');

  const [query,        setQuery]        = useState('');
  const [make,         setMake]         = useState('');
  const [model,        setModel]        = useState('');
  const [year,         setYear]         = useState('');
  const [city,         setCity]         = useState('');
  const [priceRange,   setPriceRange]   = useState('');
  const [activeTab,    setActiveTab]    = useState<'cars'|'parts'|'bikes'>('cars');
  const [showFilters,  setShowFilters]  = useState(false);

  const categories = [
    { id: 'cars'  as const, label: t('cars'),        icon: Car   },
    { id: 'parts' as const, label: t('parts'),       icon: Wrench},
    { id: 'bikes' as const, label: t('motorcycles'), icon: Bike  },
  ];

  const handleSearch = () => {
    const qs = new URLSearchParams();
    if (query)      qs.set('q', query);
    if (make)       qs.set('make', make);
    if (model)      qs.set('model', model);
    if (year)       qs.set('year', year);
    if (city)       qs.set('city', city);
    if (priceRange) qs.set('price', priceRange);
    const path = activeTab === 'parts' ? 'spare-parts' : activeTab === 'bikes' ? 'motorcycles' : 'cars';
    router.push(`/${locale}/${path}?${qs.toString()}`);
  };

  const availableModels = make ? (MODELS[make] ?? []) : [];

  return (
    <section
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-16 px-4"
      style={{ background: 'linear-gradient(180deg,#050b14 0%,#08101e 60%,#050b14 100%)' }}
      aria-label="Hero search"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 opacity-[0.022]"
          style={{ backgroundImage:'radial-gradient(circle,rgba(201,168,76,.9) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20"
          style={{ background:'radial-gradient(ellipse,rgba(201,168,76,.15) 0%,transparent 65%)', filter:'blur(60px)' }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-8">
        {/* Headline */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            {tc('siteName')}
          </h1>
          <p className="text-white/50 text-lg sm:text-xl max-w-xl mx-auto">
            {tc('tagline')}
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 justify-center">
          {categories.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${activeTab === id
                  ? 'bg-[#c9a84c] text-white shadow-[0_4px_16px_rgba(201,168,76,0.35)]'
                  : 'bg-white/[0.06] text-white/60 hover:bg-white/[0.10] hover:text-white border border-white/[0.08]'}`}>
              <Icon className="w-4 h-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>

        {/* Search box */}
        <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] backdrop-blur-md p-4 space-y-3 shadow-2xl">
          {/* Main input */}
          <div className="relative">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t('searchPlaceholder')}
              className="w-full ps-12 pe-12 py-4 rounded-xl bg-white/[0.06] border border-white/[0.10]
                         text-white placeholder-white/30 text-base outline-none
                         focus:border-[#c9a84c]/50 focus:bg-white/[0.08] transition-all"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search"
                className="absolute end-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                <X className="w-4 h-4" aria-hidden />
              </button>
            )}
          </div>

          {/* Filters row */}
          <div className="flex gap-2 flex-wrap">
            <Dropdown label={t('make')}       value={make}       options={MAKES}              onChange={(v) => { setMake(v); setModel(''); }} placeholder={t('allMakes')} />
            <Dropdown label={t('model')}      value={model}      options={availableModels}    onChange={setModel}      placeholder={t('allModels')} disabled={!make} />
            <Dropdown label={t('year')}       value={year}       options={YEARS}              onChange={setYear}       placeholder={t('allYears')} />
            <Dropdown label={t('city')}       value={city}       options={CITIES}             onChange={setCity}       placeholder={t('allCities')} />
          </div>

          {/* Advanced filters toggle */}
          {showFilters && (
            <div className="flex gap-2">
              <Dropdown label={t('priceRange')} value={priceRange} options={PRICE_RANGES_EN} onChange={setPriceRange} placeholder={t('anyPrice')} />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60
                         border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200">
              <SlidersHorizontal className="w-4 h-4" aria-hidden />
              {showFilters ? t('hideFilters') : t('advancedFilters')}
            </button>
            <button type="button" onClick={handleSearch}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white
                         shadow-[0_4px_20px_rgba(201,168,76,0.3)] hover:shadow-[0_6px_28px_rgba(201,168,76,0.45)]
                         transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#9e6e1e)' }}>
              <Search className="w-4 h-4" aria-hidden />
              {t('searchButton')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
