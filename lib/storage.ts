import { BookingRequest, User } from './types';

export const ADMIN_PHONE = '09210701381';
export const ADMIN_NAME = 'محمد بهاری';

export const ADMIN_2_PHONE = '09227145583';
export const ADMIN_2_NAME = 'رضا بهاری';

export const ADMIN_PHONES = [ADMIN_PHONE, ADMIN_2_PHONE];

export const ADMIN_USERS: Record<string, { name: string; defaultPass: string }> = {
  [ADMIN_PHONE]: { name: ADMIN_NAME, defaultPass: '1381' },
  [ADMIN_2_PHONE]: { name: ADMIN_2_NAME, defaultPass: '1381' },
};

export const SUPPORT_PHONE = '09227145583';

export function isUserAdmin(phone?: string | null): boolean {
  if (!phone) return false;
  const clean = phone.trim().replace(/^(\+98)/, '0');
  return ADMIN_PHONES.includes(clean);
}

const USERS_KEY = 'appliance_repair_users_v1';
const CURRENT_USER_KEY = 'appliance_repair_curr_user_v1';
const REQUESTS_KEY = 'appliance_repair_requests_v1';
const THEME_KEY = 'appliance_repair_theme_v1';
const LANG_KEY = 'appliance_repair_lang_v1';

// Seed initial admin and demo requests so the system is immediately fully operational
const INITIAL_USERS: User[] = [
  {
    fullName: ADMIN_NAME,
    phone: ADMIN_PHONE,
    password: '1381',
    isAdmin: true,
  },
  {
    fullName: ADMIN_2_NAME,
    phone: ADMIN_2_PHONE,
    password: '1381',
    isAdmin: true,
  },
  {
    fullName: 'رضا کریمی',
    phone: '09121112233',
    password: '1234',
    isAdmin: false,
  },
  {
    fullName: 'فاطمه نوری',
    phone: '09355554433',
    password: '4321',
    isAdmin: false,
  }
];

const INITIAL_REQUESTS: BookingRequest[] = [
  {
    id: 'req-101',
    trackingCode: 'TRK-8491',
    fullName: 'رضا کریمی',
    phone: '09121112233',
    applianceType: 'refrigerator',
    address: 'تهران، سعادت‌آباد، خیابان علامه طباطبایی شمالی',
    pelak: '۱۴',
    unit: '۳',
    jalaliDate: '1403/07/06',
    jalaliFormatted: '۶ مهر ۱۴۰۳',
    timeSlot: 'morning',
    notes: 'یخچال ساید سرما تولید نمی‌کند و صدای وزوز می‌دهد.',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    status: 'technician_assigned',
  },
  {
    id: 'req-102',
    trackingCode: 'TRK-9312',
    fullName: 'فاطمه نوری',
    phone: '09355554433',
    applianceType: 'washing_machine',
    address: 'تهران، خیابان شریعتی، بالاتر از پل رومی',
    pelak: '۲۲',
    unit: '۵',
    jalaliDate: '1403/07/07',
    jalaliFormatted: '۷ مهر ۱۴۰۳',
    timeSlot: 'noon',
    notes: 'لباسشویی آب را تخلیه نمی‌کند و کد ارور E03 می‌دهد.',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'pending',
  }
];

export function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUser(user: User): void {
  if (typeof window === 'undefined') return;
  try {
    const users = getStoredUsers();
    const existingIndex = users.findIndex(u => u.phone === user.phone);
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving user', e);
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Error setting current user', e);
  }
}

export function getStoredRequests(): BookingRequest[] {
  if (typeof window === 'undefined') return INITIAL_REQUESTS;
  try {
    const data = localStorage.getItem(REQUESTS_KEY);
    if (!data) {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function addBookingRequest(request: BookingRequest): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredRequests();
    const updated = [request, ...list];
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving booking request', e);
  }
}

export function updateRequestStatus(id: string, status: BookingRequest['status']): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredRequests();
    const updated = list.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status,
          completedAt: status === 'completed' ? (req.completedAt || new Date().toISOString()) : req.completedAt,
        };
      }
      return req;
    });
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating status', e);
  }
}

export function updateRequestDetails(id: string, updates: Partial<BookingRequest>): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredRequests();
    const updated = list.map(req => (req.id === id ? { ...req, ...updates } : req));
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating request details', e);
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error(e);
  }
}

export function getStoredLang(): 'fa' | 'en' {
  if (typeof window === 'undefined') return 'fa';
  try {
    const l = localStorage.getItem(LANG_KEY);
    return l === 'en' ? 'en' : 'fa';
  } catch {
    return 'fa';
  }
}

export function setStoredLang(lang: 'fa' | 'en'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    console.error(e);
  }
}
