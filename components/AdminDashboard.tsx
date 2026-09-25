'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { ApplianceType, BookingRequest, RequestStatus } from '@/lib/types';
import { isUserAdmin } from '@/lib/storage';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Wrench,
  ShieldCheck,
  RefreshCw,
  Home,
  Copy,
  Check,
  UserCheck,
  CheckCircle2,
  XCircle,
  Archive,
  RotateCcw
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

export default function AdminDashboard({ onBackToHome }: AdminDashboardProps) {
  const { 
    user, 
    requests, 
    registeredUsers, 
    changeRequestStatus, 
    updateRequest,
    lang, 
    t 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ApplianceType | 'all'>('all');
  const [statusView, setStatusView] = useState<'active' | 'pending' | 'completed' | 'all'>('active');
  const [activeTab, setActiveTab] = useState<'requests' | 'users'>('requests');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Local state for technician input edits per request
  const [editingTech, setEditingTech] = useState<Record<string, string>>({});
  const [savedTechMsg, setSavedTechMsg] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleAssignTechnician = (reqId: string) => {
    const techName = editingTech[reqId]?.trim();
    if (techName) {
      updateRequest(reqId, { 
        technicianName: techName,
        status: 'technician_assigned'
      });
      setSavedTechMsg(reqId);
      setTimeout(() => setSavedTechMsg(null), 2500);
    }
  };

  const handleMarkAsCompleted = (reqId: string) => {
    updateRequest(reqId, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const handleReopenRequest = (reqId: string) => {
    updateRequest(reqId, { 
      status: 'pending'
    });
  };

  // Strict check: Only accessible by admin phone
  if (!isUserAdmin(user?.phone)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
        <div className="max-w-md p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-rose-500/20 shadow-xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {lang === 'fa' ? 'دسترسی غیرمجاز' : 'Unauthorized Access'}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {lang === 'fa' 
              ? 'این بخش فقط برای مدیران مجاز سامانه سایدتک در دسترس است.' 
              : 'This panel is strictly restricted to authorized administrators.'}
          </p>
          <button
            onClick={onBackToHome}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    );
  }

  // Count requests by status
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const assignedCount = requests.filter(r => r.status === 'technician_assigned').length;
  const activeCount = pendingCount + assignedCount;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  // Filter requests according to user selection
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.phone.includes(searchQuery) ||
      req.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.technicianName && req.technicianName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAppliance = filterType === 'all' || req.applianceType === filterType;

    let matchesStatus = true;
    if (statusView === 'active') {
      // In active view, only show pending and technician_assigned (exclude completed and cancelled)
      matchesStatus = req.status === 'pending' || req.status === 'technician_assigned';
    } else if (statusView === 'pending') {
      matchesStatus = req.status === 'pending';
    } else if (statusView === 'completed') {
      matchesStatus = req.status === 'completed';
    } else if (statusView === 'all') {
      matchesStatus = true;
    }

    return matchesSearch && matchesAppliance && matchesStatus;
  });

  const BackIcon = lang === 'fa' ? ArrowRight : ArrowLeft;

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {lang === 'fa' ? 'در انتظار اعزام' : 'Pending'}
          </span>
        );
      case 'technician_assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {lang === 'fa' ? 'تکنسین اعزام شد' : 'Dispatched'}
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            {lang === 'fa' ? 'انجام و تسویه شد' : 'Completed'}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            {lang === 'fa' ? 'لغو شده' : 'Cancelled'}
          </span>
        );
    }
  };

  const getSlotLabel = (slot: BookingRequest['timeSlot']) => {
    if (slot === 'morning') return t.timeSlot1;
    if (slot === 'noon') return t.timeSlot2;
    return t.timeSlot3;
  };

  const getApplianceLabel = (type: ApplianceType) => {
    if (type === 'refrigerator') return lang === 'fa' ? 'یخچال و فریزر' : 'Refrigerator';
    if (type === 'washing_machine') return lang === 'fa' ? 'ماشین لباسشویی' : 'Washing Machine';
    return lang === 'fa' ? 'ماشین ظرفشویی' : 'Dishwasher';
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      
      {/* Top Banner & Welcome for Mohammad Bahari */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-slate-900/90 backdrop-blur-2xl text-white p-6 sm:p-8 mb-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {lang === 'fa' ? 'پنل اختصاصی مدیریت' : 'Administrator Management'}
              </div>
              <h1 className="text-xl sm:text-2xl font-black">
                {lang === 'fa' ? `خوش آمدید، جناب آقای ${user?.fullName || 'مدیر گرامی'}` : `Welcome, Mr. ${user?.fullName || 'Admin'}`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {lang === 'fa' 
                  ? `شماره همراه ادمین: ${user?.phone} | نظارت بر درخواست‌های ثبت شده تکنسین و اشخاص متقاضی` 
                  : `Admin ID: ${user?.phone} | Real-time monitoring of service booking requests`}
              </p>
            </div>
          </div>

          {/* Action to return to landing view */}
          <button
            onClick={onBackToHome}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards (Clickable Filters) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Total Active Requests (Pending + Assigned) */}
        <button
          type="button"
          onClick={() => setStatusView('active')}
          className={`text-right rtl:text-right ltr:text-left p-5 rounded-2xl backdrop-blur-xl border transition-all cursor-pointer ${
            statusView === 'active'
              ? 'bg-blue-600/10 dark:bg-blue-500/15 border-blue-500 ring-2 ring-blue-500/30'
              : 'bg-white/70 dark:bg-slate-800/60 border-white/60 dark:border-white/10 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {lang === 'fa' ? 'درخواست‌های فعال و جاری' : 'Active Requests'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
            {activeCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {lang === 'fa' ? 'در انتظار + مامور اعزام‌شده' : 'Pending & Dispatched'}
          </p>
        </button>

        {/* Pending Requests */}
        <button
          type="button"
          onClick={() => setStatusView('pending')}
          className={`text-right rtl:text-right ltr:text-left p-5 rounded-2xl backdrop-blur-xl border transition-all cursor-pointer ${
            statusView === 'pending'
              ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30'
              : 'bg-white/70 dark:bg-slate-800/60 border-white/60 dark:border-white/10 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {t.pendingRequests}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {pendingCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {lang === 'fa' ? 'نیازمند تعیین مامور اعزام' : 'Needs technician'}
          </p>
        </button>

        {/* Completed Requests */}
        <button
          type="button"
          onClick={() => setStatusView('completed')}
          className={`text-right rtl:text-right ltr:text-left p-5 rounded-2xl backdrop-blur-xl border transition-all cursor-pointer ${
            statusView === 'completed'
              ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/30'
              : 'bg-white/70 dark:bg-slate-800/60 border-white/60 dark:border-white/10 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {lang === 'fa' ? 'انجام شده‌ها (آرشیو)' : 'Completed Tasks'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {completedCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {lang === 'fa' ? 'انجام و پایان یافته' : 'Fully resolved'}
          </p>
        </button>

        {/* Total All Requests */}
        <button
          type="button"
          onClick={() => setStatusView('all')}
          className={`text-right rtl:text-right ltr:text-left p-5 rounded-2xl backdrop-blur-xl border transition-all cursor-pointer ${
            statusView === 'all'
              ? 'bg-slate-800 text-white border-slate-700 ring-2 ring-slate-500/30'
              : 'bg-white/70 dark:bg-slate-800/60 border-white/60 dark:border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.totalRequests}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Archive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {requests.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {lang === 'fa' ? 'کل پرونده‌ها' : 'All total records'}
          </p>
        </button>

      </div>

      {/* Admin Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.adminRequestsOverview} ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.registeredUsersList} ({registeredUsers.length})
          </button>
        </div>
      </div>

      {activeTab === 'requests' ? (
        <>
          {/* Status View Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setStatusView('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusView === 'active'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'درخواست‌های فعال (جاری)' : 'Active (Pending & Dispatched)'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                  {activeCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusView('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusView === 'pending'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'در انتظار اعزام' : 'Pending Only'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/20">
                  {pendingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusView('completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusView === 'completed'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'انجام شده‌ها (آرشیو)' : 'Completed'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                  {completedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusView('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusView === 'all'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{lang === 'fa' ? 'همه وضعیت‌ها' : 'All Requests'}</span>
              </button>
            </div>

            {/* Helper status text */}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {statusView === 'active' && (
                <span>{lang === 'fa' ? '💡 در این بخش کارهای انجام شده پنهان و فقط درخواست‌های جاری نمایش داده می‌شوند.' : 'Showing active tasks only.'}</span>
              )}
              {statusView === 'completed' && (
                <span>{lang === 'fa' ? '✓ آرشیو درخواست‌هایی که با موفقیت انجام شده‌اند.' : 'Archive of resolved tasks.'}</span>
              )}
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto flex items-center pr-3 rtl:pr-3 ltr:pl-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full h-11 px-9 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            {/* Filter by Appliance */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.filterAll}
              </button>
              <button
                onClick={() => setFilterType('refrigerator')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === 'refrigerator'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                ❄️ {lang === 'fa' ? 'یخچال' : 'Fridge'}
              </button>
              <button
                onClick={() => setFilterType('washing_machine')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === 'washing_machine'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                🧺 {lang === 'fa' ? 'لباسشویی' : 'Washer'}
              </button>
              <button
                onClick={() => setFilterType('dishwasher')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === 'dishwasher'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                🍽️ {lang === 'fa' ? 'ظرفشویی' : 'Dishwasher'}
              </button>
            </div>

          </div>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800">
              <Wrench className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {t.noRequestsYet}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-3xl bg-white/80 dark:bg-slate-800/70 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all p-5 sm:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                    
                    {/* Applicant & Appliance */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl shrink-0">
                        {req.applianceType === 'refrigerator' ? '❄️' : req.applianceType === 'washing_machine' ? '🧺' : '🍽️'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {req.fullName}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(req.trackingCode)}
                            title={lang === 'fa' ? 'کپی کد پیگیری' : 'Copy tracking code'}
                            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                              copiedCode === req.trackingCode
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                            }`}
                          >
                            {copiedCode === req.trackingCode ? (
                              <>
                                <Check className="w-3 h-3 text-white" />
                                <span>{lang === 'fa' ? 'کپی شد' : 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <span>{req.trackingCode}</span>
                                <Copy className="w-3 h-3 text-slate-400 opacity-70 hover:opacity-100" />
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                          {getApplianceLabel(req.applianceType)}
                        </div>
                      </div>
                    </div>

                    {/* Contact, Quick Actions & Status Controls */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Direct phone call button */}
                      <a
                        href={`tel:${req.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
                        title={lang === 'fa' ? 'تماس با متقاضی' : 'Call client'}
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span dir="ltr" className="font-mono">{req.phone}</span>
                      </a>

                      {/* Current Status Badge */}
                      {getStatusBadge(req.status)}

                      {/* QUICK COMPLETED ACTION: Mark done and move to completed archive */}
                      {req.status !== 'completed' ? (
                        <button
                          type="button"
                          onClick={() => handleMarkAsCompleted(req.id)}
                          title={lang === 'fa' ? 'ثبت به عنوان انجام شده (انتقال به بخش انجام‌شده‌ها)' : 'Mark as completed'}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{lang === 'fa' ? 'انجام شد' : 'Done'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleReopenRequest(req.id)}
                          title={lang === 'fa' ? 'بازگردانی به لیست درخواست‌های جاری' : 'Reopen to active list'}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{lang === 'fa' ? 'بازگردانی به جاری' : 'Reopen'}</span>
                        </button>
                      )}

                      {/* Status Change Selector */}
                      <select
                        value={req.status}
                        onChange={(e) => changeRequestStatus(req.id, e.target.value as RequestStatus)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">{lang === 'fa' ? 'در انتظار اعزام' : 'Pending'}</option>
                        <option value="technician_assigned">{lang === 'fa' ? 'مامور اعزام شد' : 'Dispatched'}</option>
                        <option value="completed">{lang === 'fa' ? 'انجام شده' : 'Completed'}</option>
                        <option value="cancelled">{lang === 'fa' ? 'لغو شده' : 'Cancelled'}</option>
                      </select>
                    </div>

                  </div>

                  {/* Technician Assignment Box (Directly inside request box) */}
                  <div className="my-3 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {lang === 'fa' ? 'مامور اعزام‌کننده / تکنسین مسئول:' : 'Assigned Technician:'}
                        </div>
                        {req.technicianName ? (
                          <div className="text-xs font-extrabold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 mt-0.5">
                            <span>{req.technicianName}</span>
                            {req.status === 'technician_assigned' && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10">
                                {lang === 'fa' ? 'در حال مراجعه' : 'Dispatched'}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                            {lang === 'fa' ? 'هنوز ماموری اختصاص نیافته است' : 'No technician assigned yet'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Technician Name Input & Submit Button */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={req.technicianName || ''}
                        onChange={(e) => setEditingTech({ ...editingTech, [req.id]: e.target.value })}
                        placeholder={lang === 'fa' ? 'نام مامور (مثال: مهندس حسینی)' : 'Technician name...'}
                        className="h-9 px-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white min-w-[170px]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAssignTechnician(req.id)}
                        className="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{lang === 'fa' ? 'ثبت مامور' : 'Assign'}</span>
                      </button>

                      {savedTechMsg === req.id && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                          ✓ {lang === 'fa' ? 'ثبت شد' : 'Saved'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-slate-600 dark:text-slate-300">
                    
                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-500 block text-[10px]">{t.dateCol}</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{req.jalaliFormatted}</span>
                      </div>
                    </div>

                    {/* Time Slot */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-500 block text-[10px]">{t.slotCol}</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{getSlotLabel(req.timeSlot)}</span>
                      </div>
                    </div>

                    {/* Full Address, Pelak, Unit */}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-500 block text-[10px]">{t.addressCol}</span>
                        <span className="text-slate-900 dark:text-slate-100">
                          {req.address}
                          <span className="font-bold text-blue-600 dark:text-blue-400 mx-1">
                            {lang === 'fa' ? `(پلاک: ${req.pelak} | واحد: ${req.unit})` : `(No: ${req.pelak} | Unit: ${req.unit})`}
                          </span>
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Notes if any */}
                  {req.notes && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{lang === 'fa' ? 'شرح مشکل: ' : 'Problem Notes: '}</span>
                      {req.notes}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Users List Tab */
        <div className="rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-sm overflow-hidden p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            {t.registeredUsersList} ({registeredUsers.length} نفر)
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {registeredUsers.map((u, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                    {u.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{u.fullName}</span>
                      {(u.isAdmin || isUserAdmin(u.phone)) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          {t.adminBadge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-mono" dir="ltr">
                      {u.phone}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  <a
                    href={`tel:${u.phone}`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
