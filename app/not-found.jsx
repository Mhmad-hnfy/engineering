"use client";
import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="max-w-xl w-full text-center relative z-10">
        <div className="mb-8 relative inline-block">
          <h1 className="text-[150px] md:text-[200px] font-black text-gray-900 leading-none tracking-tighter select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <div className="text-2xl md:text-3xl font-black text-indigo-600 bg-white px-4 py-1 rotate-[-2deg] shadow-xl border-2 border-indigo-600 rounded-xl inline-block">
              PAGE NOT FOUND
            </div>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
          Lost in Engineering<span className="text-indigo-600">.</span>
        </h2>

        <p className="text-gray-500 text-lg mb-10 leading-relaxed max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-95"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-3 bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 hover:border-gray-900 active:scale-95"
          >
            Go Back
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 font-medium">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Error ID: ERR_PAGE_NOT_FOUND</span>
        </div>
      </div>
    </div>
  );
}
