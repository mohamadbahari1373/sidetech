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
  timeSlot: TimeSlotId;
  notes?: string;
  technicianName?: string;
  completedAt?: string;
  createdAt: string;
  status: RequestStatus;
}
