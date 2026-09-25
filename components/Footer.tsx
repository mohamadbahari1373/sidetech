'use client';

import React from 'react';
import { useApp } from '@/lib/AppContext';
import { SideTechLogoMark } from '@/components/SideTechLogo';
import { PhoneCall, ShieldCheck } from 'lucide-react';
import { SUPPORT_PHONE } from '@/lib/storage';

export default function Footer() {
  const { lang } = useApp();

  return (
    <footer className="mt-16 border-t border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0a1226] border border-blue-500/30 flex items-center justify-center shadow-md shadow-blue-500/20 p-1.5">
            <SideTechLogoMark className="w-full h-full drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" showCircuits={true} />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {lang === 'fa' ? 'سایدتک (SideTech) - تعمیرات تخصصی لوازم خانگی' : 'SideTech Appliance Services'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'fa' ? 'رزرو سریع تعمیرات یخچال، ماشین لباسشویی و ظرفشویی' : 'Rapid technician booking for fridge, washer & dishwasher'}
            </p>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono" dir="ltr">
              {SUPPORT_PHONE}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'fa' ? 'ضمانت اصالت قطعات' : 'Certified Parts'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
