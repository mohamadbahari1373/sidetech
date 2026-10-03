'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/AppContext';
import { BrandItem } from '@/lib/types';
import { ShieldCheck, Sparkles, Wrench } from 'lucide-react';

export default function BrandMarquee() {
  const { lang, brands, openBookingModal } = useApp();

  // Filter only active brands and sort by order
  const activeBrands = (brands || [])
    .filter(b => b.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (activeBrands.length === 0) {
    return null;
  }

  return (
    <section 
      className="relative py-8 sm:py-12 overflow-hidden select-none border-y border-slate-200/50 dark:border-slate-800/60 bg-slate-900/10 dark:bg-slate-950/40 backdrop-blur-md" 
      aria-label="Supported Appliance Brands"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/[0.04] dark:via-blue-500/[0.06] to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-64 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-start">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 dark:bg-blue-400" />
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{lang === 'fa' ? 'پوشش کامل تمامی برندهای معتبر جهانی' : 'Full Support for Top Global Brands'}</span>
            </h3>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 dark:border dark:border-blue-800/50">
              {lang === 'fa' ? 'قطعات اورجینال فابریک' : 'Genuine OEM Parts'}
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            {lang === 'fa' 
              ? 'تامین مستقیم قطعات یدکی اصلی و ضمانت کتبی برای تمامی مدل‌ها'
              : 'Direct original parts sourcing & official warranty on all models'}
          </p>
        </div>
      </div>

      {/* Marquee Track Container with Side Fade Gradient Masks */}
      <div className="relative w-full overflow-hidden group">
        
        {/* Right Fade Mask (in RTL: entry side / in LTR: right side) */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-l from-slate-50 via-slate-50/90 dark:from-slate-950 dark:via-slate-950/90 to-transparent z-20 pointer-events-none" />
        
        {/* Left Fade Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-r from-slate-50 via-slate-50/90 dark:from-slate-950 dark:via-slate-950/90 to-transparent z-20 pointer-events-none" />

        {/* Scrolling Inner Track (Duplicated twice for seamless infinite loop) */}
        <div className="marquee-track flex gap-4 sm:gap-6 w-max py-2 hover:[animation-play-state:paused]">
          
          {/* First Set of Brands */}
          {activeBrands.map((brand, idx) => (
            <BrandCard 
              key={`b1-${brand.id}-${idx}`} 
              brand={brand} 
              lang={lang} 
              onClick={() => openBookingModal()}
            />
          ))}

          {/* Second Set of Brands (seamless mirror) */}
          {activeBrands.map((brand, idx) => (
            <BrandCard 
              key={`b2-${brand.id}-${idx}`} 
              brand={brand} 
              lang={lang} 
              onClick={() => openBookingModal()}
            />
          ))}

        </div>
      </div>
    </section>
  );
}

function BrandCard({ 
  brand, 
  lang, 
  onClick 
}: { 
  brand: BrandItem; 
  lang: string; 
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={lang === 'fa' ? `رزرو تعمیرات تخصصی ${brand.nameFa}` : `Book repair for ${brand.nameEn}`}
      className={`group relative flex items-center gap-3.5 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer shrink-0 min-w-[210px] sm:min-w-[250px] ${brand.borderHover || 'hover:border-blue-500/40'}`}
    >
      {/* Subtle Inner Glow on Hover */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${brand.bgGlow || 'group-hover:bg-blue-500/10'}`} />

      {/* Brand Icon/Logo Badge */}
      <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300 overflow-hidden">
        {brand.logoUrl ? (
          <Image
            src={brand.logoUrl}
            alt={brand.nameEn}
            width={36}
            height={36}
            className="w-8 h-8 object-contain"
            unoptimized={Boolean(brand.logoUrl?.startsWith('data:'))}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className={`font-black text-xs sm:text-sm tracking-tight ${brand.accentColor || 'text-blue-500 dark:text-blue-400'} select-none`}>
            {brand.symbolText || brand.nameEn.substring(0, 3).toUpperCase()}
          </span>
        )}
      </div>

      {/* Brand Names & Subtitle */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-['Vazirmatn',sans-serif] font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
            {lang === 'fa' ? brand.nameFa : brand.nameEn}
          </span>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {brand.nameEn}
          </span>
        </div>

        <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-['Vazirmatn',sans-serif]">
          {lang === 'fa' ? brand.taglineFa : brand.taglineEn}
        </span>
      </div>
    </div>
  );
}
