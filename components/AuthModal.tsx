'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { X, UserCheck, Lock, Phone, User as UserIcon, AlertCircle, CalendarCheck, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    login, 
    resetPasswordAndLogin,
    register, 
    lang, 
    t, 
    pendingBookingAfterAuth, 
    selectedApplianceForBooking 
  } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isWrongPasswordError, setIsWrongPasswordError] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsWrongPasswordError(false);

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
    } else if (mode === 'forgot') {
      // Forgot / Reset password
      if (!newPassword || !/^\d+$/.test(newPassword)) {
        setError(lang === 'fa' ? 'رمز عبور جدید باید فقط شامل اعداد باشد' : 'New password must be numeric digits only');
        return;
      }
      if (newPassword.length < 4) {
        setError(lang === 'fa' ? 'رمز عبور باید حداقل ۴ رقم باشد' : 'Password must be at least 4 digits');
        return;
      }
      if (newPassword !== newPasswordConfirm) {
        setError(lang === 'fa' ? 'تکرار رمز عبور جدید با رمز وارد شده مطابقت ندارد' : 'Password confirmation does not match');
        return;
      }

      const res = resetPasswordAndLogin(phone, newPassword);
      if (!res.success) {
        setError(res.message || (lang === 'fa' ? 'خطا در تغییر رمز عبور' : 'Failed to update password'));
      }
    } else {
      // Login
      const res = login(phone, password);
      if (!res.success) {
        setError(res.message || (lang === 'fa' ? 'اطلاعات وارد شده صحیح نیست' : 'Invalid credentials'));
        if (res.isWrongPassword) {
          setIsWrongPasswordError(true);
        }
      }
    }
  };

  const switchToForgot = () => {
    setMode('forgot');
    setError(null);
    setIsWrongPasswordError(false);
    setNewPassword('');
    setNewPasswordConfirm('');
  };

  // Close modal cleanup on close
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8"
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
            {mode === 'forgot' ? <KeyRound className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {mode === 'login' 
              ? t.loginTitle 
              : mode === 'register' 
              ? t.registerTitle 
              : (lang === 'fa' ? 'تعریف رمز عبور جدید' : 'Reset / New Password')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'forgot'
              ? (lang === 'fa' ? 'شماره همراه و رمز عبور جدید مورد نظر خود را وارد نمایید' : 'Enter your phone and new password')
              : (lang === 'fa' 
                  ? 'جهت ثبت یا پیگیری درخواست تکنسین، وارد سامانه شوید' 
                  : 'Sign in to request or track home technician services')}
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

        {/* Tabs: Login / Register (Hidden in forgot mode or shows back button) */}
        {mode === 'forgot' ? (
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setIsWrongPasswordError(false); }}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-5 group transition-colors"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-0.5 rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5 transition-transform" />
            <span>{lang === 'fa' ? 'بازگشت به فرم ورود' : 'Back to Login'}</span>
          </button>
        ) : (
          <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 mb-6 border border-slate-200/50 dark:border-slate-700/50">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); setIsWrongPasswordError(false); }}
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
              onClick={() => { setMode('register'); setError(null); setIsWrongPasswordError(false); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.registerBtn}
            </button>
          </div>
        )}

        {/* Success alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error alert with instant Forgot Password action button */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>

            {/* Quick button to reset password right here if password was wrong */}
            {isWrongPasswordError && (
              <div className="mt-2 pt-2 border-t border-rose-500/20 flex items-center justify-between">
                <span className="text-[11px] text-slate-600 dark:text-slate-300">
                  {lang === 'fa' ? 'رمز خود را به یاد ندارید؟' : 'Forgot your password?'}
                </span>
                <button
                  type="button"
                  onClick={switchToForgot}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>{lang === 'fa' ? 'تعریف رمز عبور جدید' : 'Reset Password Now'}</span>
                </button>
              </div>
            )}
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

          {/* Phone Number (For all modes) */}
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

          {/* Regular Login or Register Password */}
          {mode !== 'forgot' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.password} <span className="text-rose-500">*</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={switchToForgot}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {lang === 'fa' ? 'فراموشی رمز عبور؟' : 'Forgot password?'}
                  </button>
                )}
              </div>
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
          ) : (
            /* Forgot Password: New Password & Confirm */
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'fa' ? 'رمز عبور جدید عددی' : 'New Numeric Password'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto flex items-center pr-3 rtl:pr-3 ltr:pl-3 pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={lang === 'fa' ? 'مثال: ۵۶۷۸' : 'e.g. 5678'}
                    className="w-full h-11 px-9 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'fa' ? 'تکرار رمز عبور جدید' : 'Confirm New Password'} <span className="text-rose-500">*</span>
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
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    placeholder={lang === 'fa' ? 'تکرار رمز عبور جدید' : 'Repeat new password'}
                    className="w-full h-11 px-9 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {lang === 'fa' ? 'حداقل ۴ رقم عددی' : 'At least 4 digits'}
                </p>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            {mode === 'login' ? (
              <span>{t.loginBtn}</span>
            ) : mode === 'register' ? (
              <span>{t.registerBtn}</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>{lang === 'fa' ? 'ثبت رمز جدید و ورود مستقیم' : 'Save Password & Sign In'}</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

