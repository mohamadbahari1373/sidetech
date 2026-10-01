'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" dir="rtl">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl font-bold">
          ⚠️
        </div>
        <h2 className="text-xl font-bold mb-2">خطایی رخ داده است</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          متأسفانه در بارگذاری صفحه مشکلی پیش آمده است. لطفاً مجدداً تلاش کنید.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
