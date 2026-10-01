'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white shadow-xl border border-slate-200">
          <h2 className="text-xl font-bold mb-2">خطای سیستمی</h2>
          <p className="text-xs text-slate-500 mb-6">
            مشکلی در اجرای برنامه به وجود آمد.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  );
}
