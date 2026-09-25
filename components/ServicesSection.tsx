'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/AppContext';
import { ApplianceType } from '@/lib/types';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ApplianceCardData {
  type: ApplianceType;
  titleFa: string;
  titleEn: string;
  descFa: string;
  descEn: string;
  imgUrl: string;
  highlightsFa: string[];
  highlightsEn: string[];
}

const APPLIANCES: ApplianceCardData[] = [
  {
    type: 'refrigerator',
    titleFa: 'تعمیرات تخصصی یخچال و فریزر',
    titleEn: 'Refrigerator & Freezer Repair',
    descFa: 'عیب‌یابی تخصصی انواع یخچال ساید بای ساید، دوقلو، اینورتر و نوفراست در محل',
    descEn: 'Expert on-site repair for side-by-side, French door, inverter and standard refrigerators',
    imgUrl: '/images/refrigerator-user.jpg',
    highlightsFa: ['شارژ گاز و تعویض موتور', 'رفع بوی نامطبوع و صدا', 'تعمیر برد الکترونیکی'],
    highlightsEn: ['Freon gas refill & compressor', 'Cooling troubleshooting', 'Control board repair'],
  },
  {
    type: 'washing_machine',
    titleFa: 'تعمیرات تخصصی ماشین لباسشویی',
    titleEn: 'Washing Machine Repair',
    descFa: 'سرویس و تعمیر انواع لباسشویی اتوماتیک ایرانی و خارجی با قطعات اصلی',
    descEn: 'Service and precision repair for all modern front-load and top-load washers',
    imgUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1000&q=80',
    highlightsFa: ['رفع لرزش و صدای شدید', 'تعمیر پمپ تخلیه و هیدروستات', 'تعویض بلبرینگ و کاسه نمد'],
    highlightsEn: ['Vibration & noise fix', 'Drain pump & motor servicing', 'Bearing & seal replacement'],
  },
  {
    type: 'dishwasher',
    titleFa: 'تعمیرات تخصصی ماشین ظرفشویی',
    titleEn: 'Dishwasher Repair',
    descFa: 'تعمیر انواع ظرفشویی‌های رومیزی، توکار و ایستاده با عیب‌یابی سریع و تضمینی',
    descEn: 'Full maintenance for built-in, countertop, and freestanding dishwashers',
    imgUrl: '/images/dishwasher-user.jpg',
    highlightsFa: ['رفع عدم تمیز شستن ظروف', 'تعمیر شیر برقی و جت پمپ', 'رفع نشتی آب و ارورها'],
    highlightsEn: ['Wash cycle optimization', 'Jet pump & solenoid valve', 'Leak detection & error codes'],
  },
];

export default function ServicesSection() {
  const { lang, openBookingModal } = useApp();
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  return (
    <section id="services-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          {lang === 'fa' ? 'دستگاه‌های تحت پوشش سایدتک' : 'Supported Appliances by SideTech'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {lang === 'fa' 
            ? 'اعزام سریع تکنسین با تجهیزات کامل به تمامی نقاط تهران'
            : 'Fast technician dispatch with full equipment to all areas of Tehran'}
        </p>
      </div>

      {/* 3 Glassmorphism Cards with High-Quality Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {APPLIANCES.map((item) => (
          <div
            key={item.type}
            className="group relative rounded-3xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-blue-500/40 dark:hover:border-blue-400/30 transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* High Quality Image Container with subtle glass overlay */}
            <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-slate-100 dark:bg-slate-900">
              <Image
                src={item.imgUrl}
                alt={lang === 'fa' ? item.titleFa : item.titleEn}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              
              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-slate-100 shadow-sm border border-white/40 dark:border-white/10">
                  {item.type === 'refrigerator' 
                    ? (lang === 'fa' ? 'یخچال و فریزر' : 'Fridge')
                    : item.type === 'washing_machine'
                    ? (lang === 'fa' ? 'ماشین لباسشویی' : 'Washer')
                    : (lang === 'fa' ? 'ماشین ظرفشویی' : 'Dishwasher')}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {lang === 'fa' ? item.titleFa : item.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {lang === 'fa' ? item.descFa : item.descEn}
                </p>

                {/* Bullets */}
                <div className="space-y-2 mb-6">
                  {(lang === 'fa' ? item.highlightsFa : item.highlightsEn).map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openBookingModal(item.type)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all group-hover:scale-[1.01]"
              >
                <span>{lang === 'fa' ? `رزرو تعمیر ${item.type === 'refrigerator' ? 'یخچال' : item.type === 'washing_machine' ? 'لباسشویی' : 'ظرفشویی'}` : 'Book This Service'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
