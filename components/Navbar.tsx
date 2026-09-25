'use client';

import React from 'react';
import { useApp } from '@/lib/AppContext';
import { SideTechLogoMark } from '@/components/SideTechLogo';
import { 
  Sun, 
  Moon, 
  Globe, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  LayoutDashboard,
  CalendarCheck
} from 'lucide-react';

interface NavbarProps {
  onOpenAdminView?: () => void;
  showingAdminView?: boolean;
}

export default function Navbar({ onOpenAdminView, showingAdminView }: NavbarProps) {
  const { 
    user, 
    isAdmin, 
    theme, 
    lang, 
    t, 
    toggleTheme, 
    setLanguage, 
    openAuthModal, 
    openBookingModal, 
    logout,
    requests 
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Right side in RTL (Brand / Logo) */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a1226] rounded-[14px] flex items-center justify-center p-1.5 overflow-hidden">
              <SideTechLogoMark className="w-full h-full drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" showCircuits={true} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-cyan-300 dark:to-sky-200 bg-clip-text text-transparent">
                {lang === 'fa' ? 'سایدتک' : 'SideTech'}
              </span>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider hidden sm:inline select-none">
                SideTech
              </span>
            </div>
          </div>
        </div>

        {/* Left side (Actions & Auth) - Explicit requirement: "گزینه ورود و ثبت نام بالای صفحه سمت چپ باشد" */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            suppressHydrationWarning
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-200"
            title={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(lang === 'fa' ? 'en' : 'fa')}
            aria-label="Toggle language"
            className="h-10 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-200"
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.langName}</span>
          </button>

          {/* If Logged In as Admin, Show Admin Panel Toggle */}
          {isAdmin && (
            <button
              onClick={onOpenAdminView}
              className={`h-10 px-3.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all shadow-sm ${
                showingAdminView
                  ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-500/30'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:inline">{t.adminPanelTitle}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px]">
                {requests.length}
              </span>
            </button>
          )}

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                {isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                ) : (
                  <UserIcon className="w-4 h-4 text-blue-500" />
                )}
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                    <span>{user.fullName}</span>
                    {isAdmin && (
                      <span className="text-[10px] font-normal px-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        {t.adminBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {user.phone}
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => openBookingModal()}
                className="hidden lg:flex items-center gap-1.5 h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>{t.bookNowBtn}</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                title={t.logout}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Login / Register Button (Top Left) */
            <button
              onClick={openAuthModal}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserIcon className="w-4 h-4" />
              <span>{t.loginOrRegister}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
