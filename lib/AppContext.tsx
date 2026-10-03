'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingRequest, User, AdminNotification, BrandItem } from './types';
import { 
  getCurrentUser, 
  setCurrentUser as persistCurrentUser, 
  getStoredRequests, 
  addBookingRequest as persistBookingRequest,
  updateRequestStatus as persistUpdateStatus,
  updateRequestDetails as persistUpdateDetails,
  getStoredUsers,
  saveUser as persistUser,
  resetUserPassword as persistResetPassword,
  getStoredNotifications,
  addAdminNotification as persistAdminNotification,
  markNotificationsAsRead as persistMarkNotificationsRead,
  getStoredBrands,
  saveStoredBrands,
  resetBrandsToDefault,
  getStoredTheme,
  setStoredTheme,
  getStoredLang,
  setStoredLang,
  ADMIN_PHONE,
  ADMIN_2_PHONE,
  ADMIN_NAME,
  ADMIN_USERS,
  isUserAdmin
} from './storage';
import { translations, Language } from './translations';

interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  theme: 'light' | 'dark';
  lang: Language;
  t: typeof translations.fa;
  requests: BookingRequest[];
  registeredUsers: User[];
  notifications: AdminNotification[];
  brands: BrandItem[];
  isAuthModalOpen: boolean;
  isBookingModalOpen: boolean;
  pendingBookingAfterAuth: boolean;
  selectedApplianceForBooking: 'refrigerator' | 'washing_machine' | 'dishwasher' | null;
  lastSuccessRequest: BookingRequest | null;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openBookingModal: (appliance?: 'refrigerator' | 'washing_machine' | 'dishwasher') => void;
  closeBookingModal: () => void;
  login: (phone: string, password?: string) => { success: boolean; message?: string; isWrongPassword?: boolean };
  resetPasswordAndLogin: (phone: string, newPassword: string) => { success: boolean; message?: string };
  register: (fullName: string, phone: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  createBooking: (bookingData: Omit<BookingRequest, 'id' | 'trackingCode' | 'createdAt' | 'status'>) => BookingRequest;
  changeRequestStatus: (id: string, status: BookingRequest['status']) => void;
  updateRequest: (id: string, updates: Partial<BookingRequest>) => void;
  updateBrand: (brand: BrandItem) => void;
  addBrand: (brandData: Omit<BrandItem, 'id' | 'order'>) => void;
  deleteBrand: (id: string) => void;
  resetBrands: () => void;
  dismissSuccessModal: () => void;
  markNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme());
  const [lang, setLangState] = useState<Language>(() => getStoredLang());
  const [requests, setRequests] = useState<BookingRequest[]>(() => getStoredRequests());
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => getStoredUsers());
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => getStoredNotifications());
  const [brands, setBrands] = useState<BrandItem[]>(() => getStoredBrands());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [pendingBookingAfterAuth, setPendingBookingAfterAuth] = useState(false);
  const [selectedApplianceForBooking, setSelectedApplianceForBooking] = useState<'refrigerator' | 'washing_machine' | 'dishwasher' | null>(null);
  const [lastSuccessRequest, setLastSuccessRequest] = useState<BookingRequest | null>(null);

  // Synchronize document DOM attributes for theme and direction/language
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    setStoredTheme(nextTheme);
  };

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    setStoredLang(newLang);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingBookingAfterAuth(false);
  };

  const openBookingModal = (appliance?: 'refrigerator' | 'washing_machine' | 'dishwasher') => {
    if (appliance) {
      setSelectedApplianceForBooking(appliance);
    }
    // Gating check: if user is not logged in / registered, direct them to auth modal
    if (!user) {
      setPendingBookingAfterAuth(true);
      setIsAuthModalOpen(true);
      return;
    }
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const onAuthSuccess = () => {
    closeAuthModal();
    if (pendingBookingAfterAuth) {
      setPendingBookingAfterAuth(false);
      setIsBookingModalOpen(true);
    }
  };

  const login = (phone: string, password?: string) => {
    const normalizedPhone = phone.trim().replace(/^(\+98)/, '0');
    const users = getStoredUsers();

    // Check if logging in as Admin
    if (isUserAdmin(normalizedPhone)) {
      const adminInfo = ADMIN_USERS[normalizedPhone] || { name: ADMIN_NAME, defaultPass: '1381' };
      // Check stored custom password if admin updated it
      const adminStored = users.find(u => u.phone === normalizedPhone);
      const validPasswords = [adminStored?.password, adminInfo.defaultPass, '1381', '1234'].filter(Boolean);
      
      if (password && !validPasswords.includes(password)) {
        return {
          success: false,
          isWrongPassword: true,
          message: lang === 'fa' ? 'رمز عبور مدیر صحیح نیست' : 'Incorrect admin password'
        };
      }
      const adminUser: User = {
        fullName: adminInfo.name,
        phone: normalizedPhone,
        isAdmin: true,
      };
      persistCurrentUser(adminUser);
      setUser(adminUser);
      onAuthSuccess();
      return { success: true };
    }

    const found = users.find(u => u.phone === normalizedPhone);
    if (found) {
      if (password && found.password && found.password !== password) {
        return { 
          success: false, 
          isWrongPassword: true,
          message: lang === 'fa' ? 'رمز عبور وارد شده اشتباه است' : 'Incorrect password' 
        };
      }
      persistCurrentUser(found);
      setUser(found);
      onAuthSuccess();
      return { success: true };
    }

    return { 
      success: false, 
      isWrongPassword: false,
      message: lang === 'fa' ? 'کاربری با این شماره همراه یافت نشد. لطفا ثبت‌نام کنید.' : 'User not found. Please register.' 
    };
  };

  const resetPasswordAndLogin = (phone: string, newPassword: string) => {
    const normalizedPhone = phone.trim().replace(/^(\+98)/, '0');
    if (!normalizedPhone || normalizedPhone.length < 10) {
      return {
        success: false,
        message: lang === 'fa' ? 'شماره همراه معتبر نیست' : 'Invalid phone number'
      };
    }
    if (!newPassword || !/^\d+$/.test(newPassword)) {
      return {
        success: false,
        message: lang === 'fa' ? 'رمز عبور جدید باید فقط شامل اعداد باشد' : 'New password must be numeric digits only'
      };
    }

    const updatedUser = persistResetPassword(normalizedPhone, newPassword);
    if (updatedUser) {
      persistCurrentUser(updatedUser);
      setUser(updatedUser);
      setRegisteredUsers(getStoredUsers());
      onAuthSuccess();
      return { success: true };
    }

    return {
      success: false,
      message: lang === 'fa' ? 'خطا در ثبت رمز عبور جدید' : 'Error updating password'
    };
  };

  const register = (fullName: string, phone: string, password?: string) => {
    const cleanPhone = phone.trim().replace(/^(\+98)/, '0');
    const isAdminRole = isUserAdmin(cleanPhone);
    const adminInfo = ADMIN_USERS[cleanPhone];
    
    const newUser: User = {
      fullName: fullName.trim() || (adminInfo ? adminInfo.name : 'کاربر گرامی'),
      phone: cleanPhone,
      password: password || '1234',
      isAdmin: isAdminRole,
    };

    persistUser(newUser);
    persistCurrentUser(newUser);
    setUser(newUser);
    setRegisteredUsers(getStoredUsers());
    onAuthSuccess();

    return { success: true };
  };

  const logout = () => {
    persistCurrentUser(null);
    setUser(null);
  };

  const createBooking = (bookingData: Omit<BookingRequest, 'id' | 'trackingCode' | 'createdAt' | 'status'>): BookingRequest => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRequest: BookingRequest = {
      ...bookingData,
      id: `req-${Date.now()}`,
      trackingCode: `TRK-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    persistBookingRequest(newRequest);
    setRequests(getStoredRequests());
    setLastSuccessRequest(newRequest);
    setIsBookingModalOpen(false);

    // Create and trigger instant notification for admin 09227145583
    const applianceLabel = 
      newRequest.applianceType === 'refrigerator' 
        ? 'یخچال و فریزر' 
        : newRequest.applianceType === 'washing_machine' 
        ? 'ماشین لباسشویی' 
        : 'ماشین ظرفشویی';

    const newNotification: AdminNotification = {
      id: `notif-${Date.now()}`,
      recipientPhone: ADMIN_2_PHONE, // 09227145583
      title: 'درخواست جدید تعمیرات لوازم خانگی ثبت شد',
      message: `مشتری ${newRequest.fullName} با شماره همراه ${newRequest.phone} درخواستی برای سرویس ${applianceLabel} در تاریخ ${newRequest.jalaliFormatted} ثبت نمودند. لطفاً جهت هماهنگی اعزام تکنسین با ایشان تماس حاصل فرمایید.`,
      requestTrackingCode: newRequest.trackingCode,
      customerName: newRequest.fullName,
      customerPhone: newRequest.phone,
      applianceType: newRequest.applianceType,
      createdAt: new Date().toISOString(),
      read: false,
    };

    persistAdminNotification(newNotification);
    setNotifications(getStoredNotifications());

    return newRequest;
  };

  const markNotificationsRead = () => {
    persistMarkNotificationsRead();
    setNotifications(getStoredNotifications());
  };

  const changeRequestStatus = (id: string, status: BookingRequest['status']) => {
    persistUpdateStatus(id, status);
    setRequests(getStoredRequests());
  };

  const updateRequest = (id: string, updates: Partial<BookingRequest>) => {
    persistUpdateDetails(id, updates);
    setRequests(getStoredRequests());
  };

  const updateBrand = (updatedBrand: BrandItem) => {
    const updated = brands.map(b => (b.id === updatedBrand.id ? updatedBrand : b));
    saveStoredBrands(updated);
    setBrands(updated);
  };

  const addBrand = (brandData: Omit<BrandItem, 'id' | 'order'>) => {
    const newId = `brand-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newBrand: BrandItem = {
      ...brandData,
      id: newId,
      order: brands.length + 1,
    };
    const updated = [...brands, newBrand];
    saveStoredBrands(updated);
    setBrands(updated);
  };

  const deleteBrand = (id: string) => {
    const updated = brands.filter(b => b.id !== id);
    saveStoredBrands(updated);
    setBrands(updated);
  };

  const resetBrands = () => {
    const defaults = resetBrandsToDefault();
    setBrands(defaults);
  };

  const dismissSuccessModal = () => {
    setLastSuccessRequest(null);
  };

  const isAdmin = isUserAdmin(user?.phone);
  const t = translations[lang];

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin,
        theme,
        lang,
        t,
        requests,
        registeredUsers,
        notifications,
        brands,
        isAuthModalOpen,
        isBookingModalOpen,
        pendingBookingAfterAuth,
        selectedApplianceForBooking,
        lastSuccessRequest,
        toggleTheme,
        setLanguage,
        openAuthModal,
        closeAuthModal,
        openBookingModal,
        closeBookingModal,
        login,
        resetPasswordAndLogin,
        register,
        logout,
        createBooking,
        changeRequestStatus,
        updateRequest,
        updateBrand,
        addBrand,
        deleteBrand,
        resetBrands,
        dismissSuccessModal,
        markNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
