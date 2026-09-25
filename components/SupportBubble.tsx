'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { SUPPORT_PHONE } from '@/lib/storage';
import { PhoneCall, X, Copy, Check, Headphones, PhoneForwarded } from 'lucide-react';

export default function SupportBubble() {
  const { lang, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_PHONE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = SUPPORT_PHONE;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 rtl:left-6 rtl:right-auto ltr:right-6 ltr:left-auto z-40">
      
      {/* Expanded Support Card (Glassmorphism) */}
      {isOpen && (
        <div 
          className="mb-3 w-80 sm:w-88 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl p-5 animate-in slide-in-from-bottom-5 duration-200"
          dir={lang === 'fa' ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.supportTitle}
                </h4>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.supportWorkingHours}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Number Display Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700/80 mb-3 text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
              {lang === 'fa' ? 'شماره تماس کارشناس:' : 'Phone Support Hotline:'}
            </span>
            <span className="text-2xl font-black font-mono tracking-wider text-blue-600 dark:text-blue-400 select-all" dir="ltr">
              {SUPPORT_PHONE}
            </span>
          </div>

          {/* Action Buttons: Copy to Clipboard & Direct Call */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'bg-white/80 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t.copiedText}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.copyNumber}</span>
                </>
              )}
            </button>

            {/* Direct Call Link */}
            <a
              href={`tel:${SUPPORT_PHONE}`}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <PhoneForwarded className="w-3.5 h-3.5" />
              <span>{t.directCall}</span>
            </a>

          </div>
        </div>
      )}

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t.supportBubbleTooltip}
        title={t.supportBubbleTooltip}
        className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-blue-500/35 hover:shadow-blue-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none ring-4 ring-white/50 dark:ring-slate-800/50"
      >
        {/* Glowing pulse aura */}
        <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />
        
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
        ) : (
          <PhoneCall className="w-6 h-6 transition-transform group-hover:scale-110" />
        )}
      </button>

    </div>
  );
}
