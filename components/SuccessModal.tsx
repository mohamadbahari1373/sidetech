'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { CheckCircle2, X, Calendar, Clock, MapPin, Wrench, Copy, Check } from 'lucide-react';

export default function SuccessModal() {
  const { lastSuccessRequest, dismissSuccessModal, lang, t } = useApp();
  const [copied, setCopied] = useState(false);

  if (!lastSuccessRequest) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lastSuccessRequest.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = lastSuccessRequest.trackingCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const applianceName = 
    lastSuccessRequest.applianceType === 'refrigerator' 
      ? (lang === 'fa' ? 'یخچال و فریزر' : 'Refrigerator')
      : lastSuccessRequest.applianceType === 'washing_machine'
      ? (lang === 'fa' ? 'ماشین لباسشویی' : 'Washing Machine')
      : (lang === 'fa' ? 'ماشین ظرفشویی' : 'Dishwasher');

  const slotLabel = 
    lastSuccessRequest.timeSlot === 'morning'
      ? t.timeSlot1
      : lastSuccessRequest.timeSlot === 'noon'
      ? t.timeSlot2
      : t.timeSlot3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl p-6 sm:p-8 text-center"
        dir={lang === 'fa' ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={dismissSuccessModal}
          className="absolute top-5 left-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Message (Exact wording from prompt) */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
          {t.successTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed max-w-sm mx-auto">
          {t.successMsg}
        </p>

        {/* Tracking Code Badge with Copy Capability */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 mb-6 relative group">
          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1 flex items-center justify-center gap-1.5">
            <span>{t.trackingCodeLabel}</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-blue-700 dark:text-blue-300 select-all">
              {lastSuccessRequest.trackingCode}
            </span>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              title={lang === 'fa' ? 'کپی کد پیگیری' : 'Copy tracking code'}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold border ${
                copied
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/30'
                  : 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700/60 hover:bg-blue-50 dark:hover:bg-slate-700 shadow-sm'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 shrink-0 text-white" />
                  <span>{lang === 'fa' ? 'کپی شد' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 shrink-0" />
                  <span>{lang === 'fa' ? 'کپی کد' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200/50 dark:border-slate-700/50 text-right rtl:text-right ltr:text-left space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-6">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="font-semibold">{lang === 'fa' ? 'دستگاه:' : 'Appliance:'}</span>
            <span className="font-bold text-slate-900 dark:text-white">{applianceName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="font-semibold">{lang === 'fa' ? 'تاریخ مراجعه:' : 'Date:'}</span>
            <span>{lastSuccessRequest.jalaliFormatted}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="font-semibold">{lang === 'fa' ? 'بازه زمانی:' : 'Time Window:'}</span>
            <span>{slotLabel}</span>
          </div>

          <div className="flex items-start gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">{lang === 'fa' ? 'نشانی:' : 'Address:'} </span>
              <span>{lastSuccessRequest.address} - {lang === 'fa' ? `پلاک ${lastSuccessRequest.pelak}، واحد ${lastSuccessRequest.unit}` : `No. ${lastSuccessRequest.pelak}, Unit ${lastSuccessRequest.unit}`}</span>
            </div>
          </div>
        </div>

        {/* Close CTA */}
        <button
          onClick={dismissSuccessModal}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
        >
          {t.close}
        </button>

      </div>
    </div>
  );
}
