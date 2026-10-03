'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/AppContext';
import { BrandItem } from '@/lib/types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  Tag, 
  X, 
  Layers, 
  Palette, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  UploadCloud,
  FolderOpen,
  Link2,
  Camera
} from 'lucide-react';

interface ColorPreset {
  id: string;
  nameFa: string;
  nameEn: string;
  accentColor: string;
  bgGlow: string;
  borderHover: string;
  previewBg: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'blue',
    nameFa: 'آبی اقیانوسی',
    nameEn: 'Ocean Blue',
    accentColor: 'text-blue-500 dark:text-blue-400',
    bgGlow: 'group-hover:bg-blue-500/10',
    borderHover: 'hover:border-blue-500/40',
    previewBg: 'bg-blue-500',
  },
  {
    id: 'rose',
    nameFa: 'رز و یاقوتی',
    nameEn: 'Rose Ruby',
    accentColor: 'text-rose-500 dark:text-rose-400',
    bgGlow: 'group-hover:bg-rose-500/10',
    borderHover: 'hover:border-rose-500/40',
    previewBg: 'bg-rose-500',
  },
  {
    id: 'red',
    nameFa: 'قرمز پررنگ',
    nameEn: 'Vibrant Red',
    accentColor: 'text-red-500 dark:text-red-400',
    bgGlow: 'group-hover:bg-red-500/10',
    borderHover: 'hover:border-red-500/40',
    previewBg: 'bg-red-500',
  },
  {
    id: 'amber',
    nameFa: 'کهربایی / طلایی',
    nameEn: 'Amber Gold',
    accentColor: 'text-amber-500 dark:text-amber-400',
    bgGlow: 'group-hover:bg-amber-500/10',
    borderHover: 'hover:border-amber-500/40',
    previewBg: 'bg-amber-500',
  },
  {
    id: 'emerald',
    nameFa: 'سبز زمردی',
    nameEn: 'Emerald Green',
    accentColor: 'text-emerald-500 dark:text-emerald-400',
    bgGlow: 'group-hover:bg-emerald-500/10',
    borderHover: 'hover:border-emerald-500/40',
    previewBg: 'bg-emerald-500',
  },
  {
    id: 'teal',
    nameFa: 'فیروزه‌ای',
    nameEn: 'Teal Cyan',
    accentColor: 'text-teal-500 dark:text-teal-400',
    bgGlow: 'group-hover:bg-teal-500/10',
    borderHover: 'hover:border-teal-500/40',
    previewBg: 'bg-teal-500',
  },
  {
    id: 'cyan',
    nameFa: 'آبی فیروزه‌ای روشن',
    nameEn: 'Bright Cyan',
    accentColor: 'text-cyan-500 dark:text-cyan-400',
    bgGlow: 'group-hover:bg-cyan-500/10',
    borderHover: 'hover:border-cyan-500/40',
    previewBg: 'bg-cyan-500',
  },
  {
    id: 'indigo',
    nameFa: 'نیلی / بنفش',
    nameEn: 'Indigo Violet',
    accentColor: 'text-indigo-500 dark:text-indigo-400',
    bgGlow: 'group-hover:bg-indigo-500/10',
    borderHover: 'hover:border-indigo-500/40',
    previewBg: 'bg-indigo-500',
  },
];

// Helper to optimize and compress gallery uploads so they save reliably in localStorage
const compressLogoImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/webp', 0.9));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function BrandsManagerTab() {
  const { lang, brands, updateBrand, addBrand, deleteBrand, resetBrands } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gallery upload & input state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [logoInputTab, setLogoInputTab] = useState<'upload' | 'url'>('upload');
  const [dragActive, setDragActive] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Omit<BrandItem, 'id' | 'order'>>({
    nameFa: '',
    nameEn: '',
    taglineFa: '',
    taglineEn: '',
    symbolText: '',
    logoUrl: '',
    accentColor: COLOR_PRESETS[0].accentColor,
    bgGlow: COLOR_PRESETS[0].bgGlow,
    borderHover: COLOR_PRESETS[0].borderHover,
    category: 'یخچال • لباسشویی • ظرفشویی',
    enabled: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEdit = (brand: BrandItem) => {
    setEditingBrand(brand);
    setFormData({
      nameFa: brand.nameFa,
      nameEn: brand.nameEn,
      taglineFa: brand.taglineFa,
      taglineEn: brand.taglineEn,
      symbolText: brand.symbolText || '',
      logoUrl: brand.logoUrl || '',
      accentColor: brand.accentColor || COLOR_PRESETS[0].accentColor,
      bgGlow: brand.bgGlow || COLOR_PRESETS[0].bgGlow,
      borderHover: brand.borderHover || COLOR_PRESETS[0].borderHover,
      category: brand.category || 'یخچال • لباسشویی • ظرفشویی',
      enabled: brand.enabled !== false,
    });
    setLogoInputTab(brand.logoUrl && !brand.logoUrl.startsWith('data:') ? 'url' : 'upload');
    setIsAddingBrand(false);
  };

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setFormData({
      nameFa: '',
      nameEn: '',
      taglineFa: '',
      taglineEn: '',
      symbolText: '',
      logoUrl: '',
      accentColor: COLOR_PRESETS[0].accentColor,
      bgGlow: COLOR_PRESETS[0].bgGlow,
      borderHover: COLOR_PRESETS[0].borderHover,
      category: 'یخچال • لباسشویی • ظرفشویی',
      enabled: true,
    });
    setLogoInputTab('upload');
    setIsAddingBrand(true);
  };

  const handleCloseModal = () => {
    setEditingBrand(null);
    setIsAddingBrand(false);
  };

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(lang === 'fa' ? 'لطفاً یک فایل تصویری معتبر انتخاب نمایید.' : 'Please select a valid image file.');
      return;
    }

    try {
      setIsProcessingFile(true);
      const optimizedDataUrl = await compressLogoImage(file);
      setFormData(prev => ({ ...prev, logoUrl: optimizedDataUrl }));
      showToast(lang === 'fa' ? 'تصویر لوگو از گالری بارگذاری و بهینه‌سازی شد.' : 'Image uploaded from gallery.');
    } catch (err) {
      console.error('Failed to process image:', err);
      alert(lang === 'fa' ? 'خطا در بارگذاری تصویر.' : 'Error uploading image.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameFa.trim() || !formData.nameEn.trim()) {
      alert(lang === 'fa' ? 'لطفاً نام فارسی و انگلیسی برند را وارد کنید.' : 'Please enter Persian and English brand names.');
      return;
    }

    if (editingBrand) {
      updateBrand({
        ...editingBrand,
        ...formData,
      });
      showToast(lang === 'fa' ? `تغییرات برند «${formData.nameFa}» با موفقیت ذخیره شد.` : `Brand "${formData.nameEn}" updated.`);
    } else {
      addBrand(formData);
      showToast(lang === 'fa' ? `برند جدید «${formData.nameFa}» با موفقیت افزوده شد.` : `Brand "${formData.nameEn}" added.`);
    }

    handleCloseModal();
  };

  const handleToggleEnabled = (brand: BrandItem) => {
    const nextState = !brand.enabled;
    updateBrand({ ...brand, enabled: nextState });
    showToast(
      lang === 'fa' 
        ? nextState 
          ? `برند «${brand.nameFa}» فعال و در اسلایدر نمایش داده شد.` 
          : `برند «${brand.nameFa}» غیرفعال شد.`
        : `Brand ${brand.nameEn} ${nextState ? 'enabled' : 'disabled'}.`
    );
  };

  const handleDelete = (id: string) => {
    deleteBrand(id);
    setDeleteConfirmId(null);
    showToast(lang === 'fa' ? 'برند مورد نظر با موفقیت حذف گردید.' : 'Brand removed successfully.');
  };

  const handleResetDefaults = () => {
    resetBrands();
    setResetConfirmOpen(false);
    showToast(lang === 'fa' ? 'لیست برندها به تنظیمات اولیه کارخانه بازنشانی شد.' : 'Brands restored to default.');
  };

  const filteredBrands = (brands || []).filter(b => 
    b.nameFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.taglineFa && b.taglineFa.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 start-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with quick actions */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'مدیریت اسلایدر برندها' : 'Brand Marquee Manager'}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            {lang === 'fa' ? 'مدیریت و ویرایش برندهای تحت پوشش' : 'Manage & Edit Supported Brands'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'fa' 
              ? 'تغییرات شما به صورت آنی در نوار متحرک صفحه اصلی برای تمامی کاربران و مشتریان ذخیره و اعمال می‌شود.' 
              : 'Your changes update in real-time on the homepage marquee for all visitors.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            title={lang === 'fa' ? 'بازنشانی لیست برندها به حالت پیش‌فرض' : 'Reset brands to default'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'بازنشانی به پیش‌فرض' : 'Reset Defaults'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'fa' ? 'افزودن برند جدید' : 'Add New Brand'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'fa' ? 'جستجوی نام یا مدل برند...' : 'Search brand name or model...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 rtl:left-auto rtl:right-3" />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {lang === 'fa' 
            ? `تعداد کل: ${brands.length} برند (${brands.filter(b => b.enabled !== false).length} برند فعال در اسلایدر)` 
            : `Total: ${brands.length} brands (${brands.filter(b => b.enabled !== false).length} active)`}
        </div>
      </div>

      {/* Brands Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => (
          <div 
            key={brand.id}
            className={`p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
              brand.enabled !== false 
                ? 'border-slate-200/80 dark:border-slate-700/80 shadow-sm' 
                : 'border-slate-200/40 dark:border-slate-800/40 opacity-60 bg-slate-50/50 dark:bg-slate-900/40'
            }`}
          >
            {/* Top Row: Logo/Badge, Title, and Enabled Toggle */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                
                {/* Logo or Monogram Preview */}
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.nameEn}
                      width={36}
                      height={36}
                      className="w-8 h-8 object-contain"
                      unoptimized={Boolean(brand.logoUrl.startsWith('data:'))}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className={`font-black text-sm ${brand.accentColor || 'text-blue-500 dark:text-blue-400'}`}>
                      {brand.symbolText || brand.nameEn.substring(0, 3).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Names */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-['Vazirmatn',sans-serif] font-bold text-sm text-slate-900 dark:text-white truncate">
                      {brand.nameFa}
                    </h4>
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {brand.nameEn}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-['Vazirmatn',sans-serif]">
                    {brand.taglineFa || brand.taglineEn}
                  </p>
                </div>
              </div>

              {/* Status Toggle Button */}
              <button
                type="button"
                onClick={() => handleToggleEnabled(brand)}
                title={brand.enabled !== false ? 'غیرفعال کردن برند' : 'فعال کردن برند'}
                className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  brand.enabled !== false
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 hover:bg-slate-300'
                }`}
              >
                {brand.enabled !== false ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Bottom Row: Category & Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
              <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                {brand.category || 'لوازم خانگی'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(brand)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{lang === 'fa' ? 'ویرایش' : 'Edit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(brand.id)}
                  className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 text-[11px] transition-colors"
                  title={lang === 'fa' ? 'حذف برند' : 'Delete Brand'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Brand Modal */}
      {(isAddingBrand || editingBrand) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 my-8 text-slate-900 dark:text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white font-['Vazirmatn',sans-serif]">
                    {editingBrand 
                      ? (lang === 'fa' ? `ویرایش برند «${editingBrand.nameFa}»` : `Edit Brand "${editingBrand.nameEn}"`)
                      : (lang === 'fa' ? 'افزودن برند جدید به اسلایدر' : 'Add New Brand')}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-['Vazirmatn',sans-serif]">
                    {lang === 'fa' ? 'مشخصات و تصویر برند را تکمیل و تغییرات را ذخیره نمایید.' : 'Fill brand details and save.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBrand} className="space-y-4">
              
              {/* Persian & English Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 font-['Vazirmatn',sans-serif]">
                    {lang === 'fa' ? 'نام فارسی برند * (فونت وزیرمتن)' : 'Persian Name * (Vazirmatn Font)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameFa}
                    onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                    placeholder="مثال: سامسونگ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-['Vazirmatn',sans-serif] font-bold text-slate-900 dark:text-white tracking-tight focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'fa' ? 'نام انگلیسی برند * (حروف بولد)' : 'English Name * (Bold Uppercase)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value.toUpperCase() })}
                    placeholder="e.g. SAMSUNG"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-black uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                  />
                </div>
              </div>

              {/* Taglines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 font-['Vazirmatn',sans-serif]">
                    {lang === 'fa' ? 'توضیح / شعار فارسی' : 'Persian Tagline'}
                  </label>
                  <input
                    type="text"
                    value={formData.taglineFa}
                    onChange={(e) => setFormData({ ...formData, taglineFa: e.target.value })}
                    placeholder="مثال: ساید بای ساید و لباسشویی دیجیتال"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-['Vazirmatn',sans-serif] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'fa' ? 'توضیح / شعار انگلیسی' : 'English Tagline'}
                  </label>
                  <input
                    type="text"
                    value={formData.taglineEn}
                    onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                    placeholder="e.g. Side-by-Side & EcoBubble"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Symbol Badge & Custom Logo Upload from Gallery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'fa' ? 'نماد / مخفف لوگو (متن نشان)' : 'Badge Monogram'}
                  </label>
                  <input
                    type="text"
                    value={formData.symbolText}
                    onChange={(e) => setFormData({ ...formData, symbolText: e.target.value.toUpperCase() })}
                    placeholder="مثال: S یا LG یا BOSCH"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="block text-[10px] text-slate-400 mt-1 font-['Vazirmatn',sans-serif]">
                    {lang === 'fa' ? 'در صورت نبود تصویر، به صورت مونوگرام نشان داده می‌شود.' : 'Used if no image is uploaded.'}
                  </span>
                </div>

                {/* Logo Image Upload / URL Selector (Targeted by Focus Mode) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-['Vazirmatn',sans-serif]">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                      <span>{lang === 'fa' ? 'تصویر لوگو برند' : 'Brand Logo'}</span>
                    </label>

                    {/* Switcher: Gallery Upload vs Direct URL */}
                    <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setLogoInputTab('upload')}
                        className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                          logoInputTab === 'upload'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <UploadCloud className="w-2.5 h-2.5" />
                        <span>{lang === 'fa' ? 'گالری' : 'Upload'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogoInputTab('url')}
                        className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                          logoInputTab === 'url'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <Link2 className="w-2.5 h-2.5" />
                        <span>{lang === 'fa' ? 'لینک' : 'URL'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: Upload from Gallery / Device Files */}
                  {logoInputTab === 'upload' ? (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                      />

                      {formData.logoUrl ? (
                        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 transition-all">
                          <div className="relative w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                            <Image
                              src={formData.logoUrl}
                              alt="Brand Logo"
                              width={36}
                              height={36}
                              className="w-8 h-8 object-contain"
                              unoptimized={Boolean(formData.logoUrl.startsWith('data:'))}
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-['Vazirmatn',sans-serif]">
                              {lang === 'fa' ? 'تصویر لوگو انتخاب شد' : 'Logo selected'}
                            </span>
                            <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-['Vazirmatn',sans-serif]">
                              {lang === 'fa' ? '✓ بهینه‌شده برای ذخیره‌سازی' : '✓ Ready to save'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 font-['Vazirmatn',sans-serif]"
                              title={lang === 'fa' ? 'تغییر عکس از گالری' : 'Change image'}
                            >
                              <FolderOpen className="w-3 h-3 text-blue-500" />
                              <span>{lang === 'fa' ? 'تغییر' : 'Change'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, logoUrl: '' })}
                              className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-500 transition-colors"
                              title={lang === 'fa' ? 'حذف تصویر' : 'Remove image'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`group cursor-pointer rounded-2xl border-2 border-dashed p-3 text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 ${
                            dragActive
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 scale-[1.01]'
                              : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 bg-slate-50/60 dark:bg-slate-800/40'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            {isProcessingFile ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <UploadCloud className="w-4 h-4" />
                            )}
                          </div>

                          <div>
                            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 font-['Vazirmatn',sans-serif]">
                              {lang === 'fa' ? 'انتخاب عکس از گالری دستگاه' : 'Choose photo from gallery'}
                            </span>
                            <span className="block text-[10px] text-slate-400 font-['Vazirmatn',sans-serif]">
                              {lang === 'fa' ? 'PNG, JPG, WebP یا SVG (کلیک یا Drag & Drop)' : 'PNG, JPG, WebP or SVG'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Mode 2: Direct URL */
                    <div>
                      <input
                        type="url"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        placeholder="https://... /logo.png"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="block text-[10px] text-slate-400 mt-1 font-['Vazirmatn',sans-serif]">
                        {lang === 'fa' ? 'آدرس مستقیم اینترنتی لوگو را وارد کنید.' : 'Enter direct image URL.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Color Preset Palette */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 font-['Vazirmatn',sans-serif]">
                  <Palette className="w-3.5 h-3.5 text-blue-500" />
                  <span>{lang === 'fa' ? 'تم رنگی و جلوه نور لوگو' : 'Color Accent Theme'}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((p) => {
                    const isSelected = formData.accentColor === p.accentColor;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          accentColor: p.accentColor,
                          bgGlow: p.bgGlow,
                          borderHover: p.borderHover,
                        })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${p.previewBg}`} />
                        <span>{lang === 'fa' ? p.nameFa : p.nameEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-slate-400 mb-2 font-['Vazirmatn',sans-serif]">
                  {lang === 'fa' ? 'پیش‌نمایش زنده در اسلایدر برندها:' : 'Live Marquee Preview:'}
                </span>

                <div className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md ${formData.borderHover}`}>
                  <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                    {formData.logoUrl ? (
                      <Image
                        src={formData.logoUrl}
                        alt="Logo"
                        width={32}
                        height={32}
                        className="w-7 h-7 object-contain"
                        unoptimized={Boolean(formData.logoUrl.startsWith('data:'))}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className={`font-black text-xs ${formData.accentColor}`}>
                        {formData.symbolText || formData.nameEn.substring(0, 3).toUpperCase() || 'LOGO'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-['Vazirmatn',sans-serif] font-black text-sm text-slate-900 dark:text-white truncate">
                        {formData.nameFa || (lang === 'fa' ? 'نام برند' : 'Brand Name')}
                      </span>
                      <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {formData.nameEn || 'BRAND'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate font-['Vazirmatn',sans-serif]">
                      {formData.taglineFa || 'توضیحات و مدل‌های تحت پوشش'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="brand-enabled-checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="brand-enabled-checkbox" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  {lang === 'fa' ? 'فعال باشد و در اسلایدر صفحه اول نمایش داده شود' : 'Active and visible in homepage marquee'}
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
                >
                  {lang === 'fa' ? 'انصراف' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === 'fa' ? 'ذخیره و انتشار' : 'Save & Publish'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-sm w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center text-slate-900 dark:text-white shadow-2xl">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold mb-1">
              {lang === 'fa' ? 'آیا از حذف این برند مطمئن هستید؟' : 'Are you sure to delete this brand?'}
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              {lang === 'fa' ? 'این برند از لیست و اسلایدر صفحه اصلی حذف خواهد شد.' : 'This brand will be removed from the marquee.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-600/20"
              >
                {lang === 'fa' ? 'بله، حذف کن' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-sm w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center text-slate-900 dark:text-white shadow-2xl">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold mb-1">
              {lang === 'fa' ? 'بازنشانی به تنظیمات پیش‌فرض؟' : 'Reset to default brands?'}
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              {lang === 'fa' 
                ? 'تمامی ۱۱ برند پیش‌فرض کارخانه مجدداً جایگزین خواهند شد.' 
                : 'All 11 default global brands will be restored.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-lg shadow-amber-600/20"
              >
                {lang === 'fa' ? 'بله، بازنشانی شود' : 'Yes, Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
