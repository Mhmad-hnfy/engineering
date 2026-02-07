"use client";
import React from "react";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

const TikTokIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center md:gap-32 gap-6 relative z-10">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-sm italic uppercase">
              ENG
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            © {currentYear} <span className="text-slate-400">Code By Mhamed Hanafy</span>
          </p>
        </div>

        {/* Social Links & WhatsApp */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.facebook.com/share/1AS6gz9SDm/ " target="_blank"
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all duration-300"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/hamo__hnafy?igsh=MXQzZDcxZXR2dXFvcg==" target="_blank"
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all duration-300"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com/@hmo_hnafy?si=3tr-LrYbz3V9KyfE" target="_blank"
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="https://www.tiktok.com/@hmo.hnfy?_r=1&_t=ZS-93gHxnAyNWO" target="_blank"
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-300"
          >
            <TikTokIcon className="w-4 h-4" />
          </a>

          <div className="h-6 w-px bg-slate-800 mx-2" />

          <a
            href="https://wa.me/201280062903"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600/10 text-green-500 border border-green-600/20 px-4 py-2 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 text-xs font-bold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
