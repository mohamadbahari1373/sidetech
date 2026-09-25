'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { X, UserCheck, Lock, Phone, User as UserIcon, AlertCircle, CalendarCheck } from 'lucide-react';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    login, 
    register, 
    lang, 
    t, 
    pendingBookingAfterAuth, 
    selectedApplianceForBooking 
  } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!phone || phone.trim().length < 10) {
      setError(lang === 'fa' ? 'لطفاً شماره همراه معتبر ۱۱ رقمی وارد نمایید' : 'Please enter a valid phone number');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setError(lang === 'fa' ? 'لطفاً نام و نام خانوادگی خود را وارد کنید' : 'Please enter your full name');
        return;
      }
      if (!password || !/^\d+$/.test(password)) {
        setError(lang === 'fa' ? 'رمز عبور باید فقط شامل ارقام عددی باشد' : 'Password must be numeric digits only');
        return;
      }
      const res = register(fullName, phone, password);
      if (!res.success) {
        setError(res.message || 'Error');
      }
    } else {
      // Login
      const res = login(phone, password);
      if (!res.success) {
        setError(res.message || (lang === 'fa' ? 'اطلاعات وارد شده صحیح نیست' : 'Invalid credentials'));
      }
    }
  };

  // Close modal cleanup on close
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8"
        dir={lang === 'fa' ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 left-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/30 flex items-center justify-center text-white">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {mode === 'login' ? t.loginTitle : t.registerTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'fa' 
              ? 'جهت ثبت یا پیگیری درخواست تکنسین، وارد سامانه شوید' 
              : 'Sign in to request or track home technician services'}
          </p>
        </div>

        {/* Notice when user was redirected here from a booking button */}
        {pendingBookingAfterAuth && (
          <div className="mb-5 p-3.5 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs flex items-start gap-2.5">
            <CalendarCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">
                {lang === 'fa' ? 'پیش‌نیاز تکمیل فرم رزرو:' : 'Requirement for Reservation:'}
              </span>
              <span>
                {lang === 'fa'
                  ? `برای رزرو تعمیر ${selectedApplianceForBooking === 'refrigerator' ? 'یخچال' : selectedApplianceForBooking === 'washing_machine' ? 'ماشین لباسشویی' : selectedApplianceForBooking === 'dishwasher' ? 'ماشین ظرفشویی' : 'دستگاه'}، ابتدا ثبت‌نام یا ورود کنید؛ بلافاصله فرم رزرو برای شما باز خواهد شد.`
                  : 'Please log in or register first. The booking form will automatically open right after.'}
              </span>
            </div>
          </div>
        )}

        {/* Tabs: Login / Register */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 mb-6 border border-slate-200/50 dark:border-slate-700/50">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.loginBtn}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.registerBtn}
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name (Only in Register mode) */}
          {mode === 'register' && (
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
          )}

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.phone} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto flex items-center pr-3 rtl:pr-3 ltr:pl-3 pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912xxxxxxx"
                className="w-full h-11 px-9 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 dark:text-white text-left font-mono"
              />
            </div>
          </div>

          {/* Numeric Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.password} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto flex items-center pr-3 rtl:pr-3 ltr:pl-3 pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full h-11 px-9 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {lang === 'fa' ? 'رمز عبور عددی (مانند ۱۲۳۴)' : 'Numeric digits only (e.g. 1234)'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.01]"
          >
            {mode === 'login' ? t.loginBtn : t.registerBtn}
          </button>
        </form>

      </div>
    </div>
  );
}
