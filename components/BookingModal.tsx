'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/AppContext';
import { ApplianceType, TimeSlotId } from '@/lib/types';
import { 
  getUpcomingBookingDays, 
  DayOption, 
  toPersianDigits 
} from '@/lib/jalali';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Lock, 
  User as UserIcon, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function BookingModal() {
  const { 
    isBookingModalOpen, 
    closeBookingModal, 
    user, 
    selectedApplianceForBooking, 
    createBooking, 
    lang, 
    t 
  } = useApp();

  const availableDays = useMemo(() => getUpcomingBookingDays(14, lang), [lang]);

  const [appliance, setAppliance] = useState<ApplianceType>('refrigerator');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [pelak, setPelak] = useState('');
  const [unit, setUnit] = useState('');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [timeSlot, setTimeSlot] = useState<TimeSlotId>('morning');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync state when modal becomes open
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  if (isBookingModalOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    if (selectedApplianceForBooking) {
      setAppliance(selectedApplianceForBooking);
    }
    if (user?.fullName) {
      setFullName(user.fullName);
    }
    setError(null);
  } else if (!isBookingModalOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  // Guard: If modal is not open or user is not logged in, do not render booking form
  if (!isBookingModalOpen || !user) return null;

  const currentDay = availableDays[selectedDayIndex] || availableDays[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError(lang === 'fa' ? 'لطفاً ابتدا وارد حساب کاربری شوید' : 'Please log in first');
      return;
    }

    if (!fullName.trim()) {
      setError(lang === 'fa' ? 'لطفاً نام و نام خانوادگی را وارد نمایید' : 'Please enter your full name');
      return;
    }

    if (!address.trim()) {
      setError(lang === 'fa' ? 'لطفاً آدرس منزل خود را وارد نمایید' : 'Please enter your address');
      return;
    }

    if (!pelak.trim()) {
      setError(lang === 'fa' ? 'لطفاً شماره پلاک را درج نمایید' : 'Please enter the building (Pelak) number');
      return;
    }

    if (!unit.trim()) {
      setError(lang === 'fa' ? 'لطفاً شماره واحد را درج نمایید' : 'Please enter unit number');
      return;
    }

    if (!currentDay) {
      setError(lang === 'fa' ? 'لطفاً تاریخ مراجعه را از تقویم انتخاب نمایید' : 'Please select a service date');
      return;
    }

    // Submit booking request
    createBooking({
      fullName: fullName.trim(),
      phone: user.phone, // Auto-filled from user login as required
      applianceType: appliance,
      address: address.trim(),
      pelak: pelak.trim(),
      unit: unit.trim(),
      jalaliDate: currentDay.dateStr,
      jalaliFormatted: currentDay.formatted,
      timeSlot,
      notes: notes.trim(),
    });
  };

  const timeSlots = [
    {
      id: 'morning' as TimeSlotId,
      label: t.timeSlot1,
      hours: '10:00 - 13:00',
    },
    {
      id: 'noon' as TimeSlotId,
      label: t.timeSlot2,
      hours: '13:00 - 16:00',
    },
    {
      id: 'evening' as TimeSlotId,
      label: t.timeSlot3,
      hours: '16:00 - 19:00',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden p-5 sm:p-8 my-auto"
        dir={lang === 'fa' ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={closeBookingModal}
          className="absolute top-5 left-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{t.bookingModalTitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t.bookingSubtitle}
          </h2>
        </div>

        {/* Error notice */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Appliance Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t.selectAppliance} <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              
              {/* Refrigerator */}
              <button
                type="button"
                onClick={() => setAppliance('refrigerator')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  appliance === 'refrigerator'
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                }`}
              >
                <div className="text-xl mb-1">❄️</div>
                <div className="text-xs font-bold">{t.refrigerator}</div>
              </button>

              {/* Washing Machine */}
              <button
                type="button"
                onClick={() => setAppliance('washing_machine')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  appliance === 'washing_machine'
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                }`}
              >
                <div className="text-xl mb-1">🧺</div>
                <div className="text-xs font-bold">{t.washingMachine}</div>
              </button>

              {/* Dishwasher */}
              <button
                type="button"
                onClick={() => setAppliance('dishwasher')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  appliance === 'dishwasher'
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                }`}
              >
                <div className="text-xl mb-1">🍽️</div>
                <div className="text-xs font-bold">{t.dishwasher}</div>
              </button>

            </div>
          </div>

          {/* User Full Name & Phone (Phone is auto-filled from login as requested) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.fullName} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto flex items-center pr-3 rtl:pr-3 ltr:pl-3 pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full h-11 px-9 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Mobile (Readonly / Auto-filled from login) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.phone} <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3" />
                  {lang === 'fa' ? 'تکمیل خودکار از پروفایل' : 'Auto-filled'}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto flex items-center pr-3 rtl:pr-3 ltr:pl-3 pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-emerald-500" />
                </div>
                <input
                  type="text"
                  readOnly
                  dir="ltr"
                  value={user?.phone || ''}
                  className="w-full h-11 px-9 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 cursor-not-allowed select-none"
                />
              </div>
            </div>

          </div>

          {/* Home Address Section: Street + Pelak + Unit (Explicit requirement) */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.addressSection} <span className="text-rose-500">*</span>
            </label>
            
            {/* Street / Alley */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto flex items-center pr-3 rtl:pr-3 ltr:pl-3 pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.addressPlaceholder}
                className="w-full h-11 px-9 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            {/* Pelak & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  required
                  value={pelak}
                  onChange={(e) => setPelak(e.target.value)}
                  placeholder={`${t.pelak} (مثال: ۱۲)`}
                  className="w-full h-11 px-4 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder={`${t.unit} (مثال: ۴)`}
                  className="w-full h-11 px-4 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Jalali Calendar Date Selection (تقویم شمسی) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-blue-500" />
                <span>{t.selectDate}</span>
              </label>
              {currentDay && (
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-900">
                  {currentDay.formatted}
                </span>
              )}
            </div>

            {/* Interactive Jalali Days Carousel / Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 max-h-48 overflow-y-auto p-1 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              {availableDays.slice(0, 14).map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`p-2 rounded-xl text-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-102 font-bold'
                        : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  >
                    <div className="text-[10px] opacity-80 mb-0.5">
                      {day.isToday 
                        ? (lang === 'fa' ? 'امروز' : 'Today')
                        : day.isTomorrow
                        ? (lang === 'fa' ? 'فردا' : 'Tomorrow')
                        : day.dayOfWeek}
                    </div>
                    <div className="text-sm font-extrabold">
                      {lang === 'fa' ? toPersianDigits(day.dayNumber) : day.dayNumber}
                    </div>
                    <div className="text-[10px] opacity-80 truncate">
                      {day.monthName}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Selection (Strictly 3 intervals requested) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{t.selectTimeSlot}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {timeSlots.map((slot) => {
                const isSelected = timeSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setTimeSlot(slot.id)}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20'
                        : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-xs font-extrabold mb-0.5">
                      {slot.label}
                    </div>
                    <div className={`text-[11px] ${isSelected ? 'text-indigo-100' : 'text-slate-400 font-mono'}`}>
                      {slot.hours}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>{t.notes}</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full p-3 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 dark:text-white resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{t.submitBookingBtn}</span>
          </button>

        </form>
      </div>
    </div>
  );
}
