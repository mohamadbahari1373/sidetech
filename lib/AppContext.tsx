'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingRequest, User } from './types';
import { 
  getCurrentUser, 
  setCurrentUser as persistCurrentUser, 
  getStoredRequests, 
  addBookingRequest as persistBookingRequest,
  updateRequestStatus as persistUpdateStatus,
  updateRequestDetails as persistUpdateDetails,
  getStoredUsers,
  saveUser as persistUser,
  getStoredTheme,
  setStoredTheme,
  getStoredLang,
  setStoredLang,
  ADMIN_PHONE,
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
  login: (phone: string, password?: string) => { success: boolean; message?: string };
  register: (fullName: string, phone: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  createBooking: (bookingData: Omit<BookingRequest, 'id' | 'trackingCode' | 'createdAt' | 'status'>) => BookingRequest;
  changeRequestStatus: (id: string, status: BookingRequest['status']) => void;
  updateRequest: (id: string, updates: Partial<BookingRequest>) => void;
  dismissSuccessModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Use lazy initializers to read persisted state directly
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme());
  const [lang, setLangState] = useState<Language>(() => getStoredLang());
  const [requests, setRequests] = useState<BookingRequest[]>(() => getStoredRequests());
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => getStoredUsers());
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
      if (password && password !== adminInfo.defaultPass && password !== '1381' && password !== '1234') {
        return {
          success: false,
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
      message: lang === 'fa' ? 'کاربری با این شماره همراه یافت نشد. لطفا ثبت‌نام کنید.' : 'User not found. Please register.' 
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

    return newRequest;
  };

  const changeRequestStatus = (id: string, status: BookingRequest['status']) => {
    persistUpdateStatus(id, status);
    setRequests(getStoredRequests());
  };

  const updateRequest = (id: string, updates: Partial<BookingRequest>) => {
    persistUpdateDetails(id, updates);
    setRequests(getStoredRequests());
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
        register,
        logout,
        createBooking,
        changeRequestStatus,
        updateRequest,
        dismissSuccessModal,
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
