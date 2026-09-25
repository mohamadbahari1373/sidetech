import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'سایدتک | سامانه رزرو خدمات تعمیرات لوازم خانگی (یخچال، لباسشویی و ظرفشویی)',
  description: 'سامانه رزرو آنلاین تکنسین تعمیرات یخچال، ماشین لباسشویی و ماشین ظرفشویی سایدتک با امکان انتخاب تاریخ و ساعت مراجعه',
  openGraph: {
    title: 'سایدتک | سامانه رزرو تعمیرات لوازم خانگی',
    description: 'سامانه رزرو آنلاین تکنسین تعمیرات یخچال، ماشین لباسشویی و ماشین ظرفشویی سایدتک',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سایدتک | سامانه رزرو تعمیرات لوازم خانگی',
    description: 'سامانه رزرو آنلاین تکنسین تعمیرات یخچال، ماشین لباسشویی و ماشین ظرفشویی سایدتک',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
