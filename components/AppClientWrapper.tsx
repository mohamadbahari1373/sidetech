'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { AppProvider, useApp } from '@/lib/AppContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BrandMarquee from '@/components/BrandMarquee';
import ServicesSection from '@/components/ServicesSection';
import AuthModal from '@/components/AuthModal';
import BookingModal from '@/components/BookingModal';
import SuccessModal from '@/components/SuccessModal';
import SupportBubble from '@/components/SupportBubble';
import AdminDashboard from '@/components/AdminDashboard';
import Footer from '@/components/Footer';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function MainApp() {
  const { isAdmin, lang, theme } = useApp();
  const [hideAdminPanel, setHideAdminPanel] = useState(false);

  // If user is admin and hasn't toggled back to home landing, show AdminDashboard
  const isViewingAdmin = Boolean(isAdmin && !hideAdminPanel);

  return (
    <div 
      className={`${theme === 'dark' ? 'dark' : ''} min-h-screen text-slate-900 dark:text-slate-100 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300 relative selection:bg-blue-500 selection:text-white`}
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
    >
      {/* Decorative ambient glass light orbs */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/4 w-[600px] h-[600px] bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Navbar with top-left Login/Register and Theme/Language controls */}
      <Navbar 
        onOpenAdminView={() => setHideAdminPanel(prev => !prev)} 
        showingAdminView={isViewingAdmin} 
      />

      {/* Main Content Area */}
      <main>
        {isViewingAdmin ? (
          <AdminDashboard onBackToHome={() => setHideAdminPanel(true)} />
        ) : (
          <>
            <Hero />
            <BrandMarquee />
            <ServicesSection />
          </>
        )}
      </main>

      <Footer />

      {/* Interactive Modals & Floating Elements */}
      <AuthModal />
      <BookingModal />
      <SuccessModal />
      <SupportBubble />
    </div>
  );
}

export default function AppClientWrapper() {
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (!isClient) {
    return (
      <div 
        className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center select-none" 
        dir="rtl"
        suppressHydrationWarning
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-4">
          <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          در حال بارگذاری سامانه سایدتک...
        </span>
      </div>
    );
  }

  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
