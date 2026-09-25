// Jalali (Solar Hijri) Date Utility
// Accurate conversion between Gregorian and Jalali calendar

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند'
];

export const ENGLISH_PERSIAN_MONTHS = [
  'Farvardin', 'Ordibehesht', 'Khordad',
  'Tir', 'Mordad', 'Shahrivar',
  'Mehr', 'Aban', 'Azar',
  'Dey', 'Bahman', 'Esfand'
];

export const PERSIAN_WEEKDAYS = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'
];

export const ENGLISH_WEEKDAYS = [
  'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

// Gregorian to Jalali converter algorithm
export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return { jy, jm, jd };
}

// Convert Jalali to Gregorian
export function jalaliToGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
  let jy2 = jy + 1595;
  let days = -355668 + (365 * jy2) + Math.floor(jy2 / 33) * 8 + Math.floor(((jy2 % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (gm = 0; gm < 13; gm++) {
    const v = sal_a[gm];
    if (gd <= v) break;
    gd -= v;
  }
  return { gy, gm, gd };
}

export function getCurrentJalaliDate(): JalaliDate {
  const now = new Date();
  return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function formatJalaliDate(jDate: JalaliDate, lang: 'fa' | 'en' = 'fa'): string {
  const monthName = lang === 'fa' 
    ? PERSIAN_MONTHS[jDate.jm - 1] 
    : ENGLISH_PERSIAN_MONTHS[jDate.jm - 1];
  
  if (lang === 'fa') {
    return `${toPersianDigits(jDate.jd)} ${monthName} ${toPersianDigits(jDate.jy)}`;
  }
  return `${jDate.jd} ${monthName} ${jDate.jy}`;
}

export function toPersianDigits(num: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num
    .toString()
    .replace(/[0-9]/g, (d) => farsiDigits[parseInt(d, 10)]);
}

export interface DayOption {
  dateStr: string; // YYYY/MM/DD
  formatted: string;
  dayOfWeek: string;
  dayNumber: number;
  monthName: string;
  year: number;
  isToday: boolean;
  isTomorrow: boolean;
}

// Generate the next N available booking days
export function getUpcomingBookingDays(daysCount: number = 21, lang: 'fa' | 'en' = 'fa'): DayOption[] {
  const days: DayOption[] = [];
  const base = new Date();

  for (let i = 0; i < daysCount; i++) {
    const target = new Date();
    target.setDate(base.getDate() + i);

    const jDate = gregorianToJalali(target.getFullYear(), target.getMonth() + 1, target.getDate());
    
    // JS getDay(): 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    // Persian week: Saturday is 0, Sunday is 1, ..., Friday is 6
    const jsDay = target.getDay();
    const persianDayIndex = (jsDay + 1) % 7;

    const dayOfWeek = lang === 'fa' 
      ? PERSIAN_WEEKDAYS[persianDayIndex] 
      : ENGLISH_WEEKDAYS[persianDayIndex];

    const monthName = lang === 'fa' 
      ? PERSIAN_MONTHS[jDate.jm - 1] 
      : ENGLISH_PERSIAN_MONTHS[jDate.jm - 1];

    const formatted = formatJalaliDate(jDate, lang);
    const dateStr = `${jDate.jy}/${String(jDate.jm).padStart(2, '0')}/${String(jDate.jd).padStart(2, '0')}`;

    days.push({
      dateStr,
      formatted,
      dayOfWeek,
      dayNumber: jDate.jd,
      monthName,
      year: jDate.jy,
      isToday: i === 0,
      isTomorrow: i === 1,
    });
  }

  return days;
}
