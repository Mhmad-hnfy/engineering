"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Loader2 } from "lucide-react";

export default function GlobalLoader() {
  const { isAuthLoaded } = useAuth();
  const { isLoaded } = useData();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const isReady = isAuthLoaded && isLoaded;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isReady) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShouldRender(false), 500);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isReady, mounted]);

  // Prevent hydration mismatch by returning the same structure on server/client initial render
  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center animate-pulse">
          <span className="text-white font-black text-4xl italic uppercase">
            ENG
          </span>
        </div>
      </div>
    );
  }

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo Container */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 animate-bounce">
            <span className="text-white font-black text-4xl italic uppercase">
              ENG
            </span>
          </div>
          {/* Rotating Ring */}
          <div
            className="absolute -inset-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-[2.5rem] animate-spin"
            style={{ animationDuration: "3s" }}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-black text-white tracking-widest uppercase italic">
            Adu<span className="text-indigo-500">Platform</span>
          </h2>
          <div className="flex items-center gap-3 text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">
            <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
            <span>Initializing Core Systems</span>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse"
          style={{
            width: isReady ? "100%" : "60%",
            transition: "width 2s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}
