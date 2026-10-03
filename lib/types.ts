export type ApplianceType = 'refrigerator' | 'washing_machine' | 'dishwasher';

export type TimeSlotId = 'morning' | 'noon' | 'evening';

export interface TimeSlot {
  id: TimeSlotId;
  labelFa: string;
  labelEn: string;
  hours: string;
}

export interface User {
  fullName: string;
  phone: string;
  password?: string;
  isAdmin?: boolean;
}

export type RequestStatus = 'pending' | 'technician_assigned' | 'completed' | 'cancelled';

export interface AdminNotification {
  id: string;
  recipientPhone: string; // e.g. 09227145583
  title: string;
  message: string;
  requestTrackingCode: string;
  customerName: string;
  customerPhone: string;
  applianceType: ApplianceType;
  createdAt: string;
  read?: boolean;
}

export interface BookingRequest {
  id: string;
  trackingCode: string;
  fullName: string;
  phone: string;
  applianceType: ApplianceType;
  address: string;
  pelak: string;
  unit: string;
  jalaliDate: string; // e.g. 1403/07/05
  jalaliFormatted: string; // e.g. ۵ مهر ۱۴۰۳
  timeSlot?: TimeSlotId;
  notes?: string;
  technicianName?: string;
  completedAt?: string;
  createdAt: string;
  status: RequestStatus;
}

export interface BrandItem {
  id: string;
  nameFa: string;
  nameEn: string;
  taglineFa: string;
  taglineEn: string;
  accentColor: string; // e.g. 'text-blue-500' or hex/tailwind
  bgGlow: string; // e.g. 'group-hover:bg-blue-500/10'
  borderHover: string; // e.g. 'hover:border-blue-500/40'
  category?: string;
  symbolText: string;
  logoUrl?: string;
  enabled: boolean;
  order: number;
}

