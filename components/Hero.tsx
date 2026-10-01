'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/AppContext';
import { CalendarCheck, ShieldCheck, Award, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  const { t, lang, openBookingModal } = useApp();

  const scrollToServices = () => {
    const el = document.getElementById('services-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background glowing glass orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500/15 dark:bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-60 left-10 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center">
        
        {/* Glass Tag Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.25] tracking-tight mb-6">
          {t.heroTitle}
        </h1>

        {/* Hero Technician Image replacing logo */}
        <div className="max-w-2xl mx-auto mb-8 transition-transform duration-300 hover:scale-[1.01]">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-900 group">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/hero-technician.jpg"
                alt={lang === 'fa' ? 'تکنسین مجرب ساید تک در حال تعمیر ساید بای ساید' : 'Side Tech certified technician repairing refrigerator'}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10 pointer-events-none" />
              
              {/* Badge overlay on bottom */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none">
                <div className="px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {lang === 'fa' ? 'ساید تک • سرویس تخصصی در محل' : 'Side Tech • On-site Expert Service'}
                  </span>
                </div>
                <div className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-blue-600/90 text-white font-medium text-xs backdrop-blur-sm shadow-md">
                  {lang === 'fa' ? '۱۰۰٪ تضمین کیفیت' : '100% Quality Guaranteed'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          {t.heroDescription}
        </p>

        {/* CTA Buttons in Glass Card */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <button
            onClick={() => openBookingModal()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <CalendarCheck className="w-5 h-5" />
            <span>{t.bookNowBtn}</span>
          </button>

          <button
            onClick={scrollToServices}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{lang === 'fa' ? 'مشاهده دستگاه‌ها' : 'View Appliances'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Value Props (Glass Pills) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-center">
          
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-white/5 shadow-sm flex items-center justify-center gap-3">
            <Award className="w-5 h-5 text-indigo-500 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
              {lang === 'fa' ? 'تکنسین‌های مجرب و تایید شده' : 'Certified Expert Technicians'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-white/5 shadow-sm flex items-center justify-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-500 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
              {lang === 'fa' ? 'گارانتی خدمات و قطعات اصلی' : 'Warranty & Original Parts'}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
