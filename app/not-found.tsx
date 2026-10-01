import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" dir="rtl">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="text-5xl font-black text-blue-600 mb-4">۴۰۴</div>
        <h2 className="text-xl font-bold mb-2">صفحه مورد نظر یافت نشد</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          صفحه‌ای که به دنبال آن هستید ممکن است حذف شده یا آدرس آن تغییر کرده باشد.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
