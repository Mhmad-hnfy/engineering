"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { PlayCircle } from "lucide-react";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between py-6 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
        <Link
          href="/"
          className="hover:text-slate-200 transition text-3xl font-bold text-white tracking-tighter z-50 relative"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          ENGINEERING<span className="text-indigo-500">.</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10 transition duration-500 text-gray-300">
          <Link
            href="/courses"
            className="hover:text-white transition text-sm font-medium"
          >
            Courses
          </Link>
          <Link
            href="/doctors"
            className="hover:text-white transition text-sm font-medium"
          >
            Doctors
          </Link>
          <Link
            href="/about"
            className="hover:text-white transition text-sm font-medium"
          >
            About
          </Link>
          <a
            href="/#Footer"
            className="hover:text-white transition text-sm font-medium"
          >
            Contact us
          </a>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4 transition duration-500">
          {currentUser ? (
            <div className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-full px-5 py-2 backdrop-blur-xl">
              <Link
                href={currentUser.role === "admin" ? "/Admin" : "/dashboard"}
                className="flex items-center gap-3 hover:opacity-80 transition"
              >
                <img
                  src={
                    currentUser.profileImage || "https://github.com/shadcn.png"
                  }
                  className="w-9 h-9 rounded-full border border-white/30 object-cover shadow-lg"
                  alt="Profile"
                />
                <span className="font-bold text-white text-sm">
                  {currentUser.username || currentUser.name}
                </span>
              </Link>
              <div className="w-px h-5 bg-white/20" />
              <button
                onClick={async () => {
                  await logout();
                  window.location.reload();
                }}
                className="text-[10px] uppercase font-black tracking-widest text-white/70 hover:text-red-400 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-bold text-white hover:text-indigo-400 transition px-4"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-7 py-3 bg-white text-black hover:bg-indigo-50 transition rounded-full text-sm font-black shadow-xl shadow-white/5"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10 active:scale-90 transition z-50 relative"
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 18 18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/95 z-40 flex flex-col justify-center items-center gap-8 transition-all duration-300 lg:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col items-center gap-6 text-2xl font-bold text-gray-300">
          <Link
            href="/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-white transition"
          >
            Courses
          </Link>
          <Link
            href="/doctors"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-white transition"
          >
            Doctors
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-white transition"
          >
            About
          </Link>
          <a
            href="/#Footer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-white transition"
          >
            Contact us
          </a>
        </div>

        <div className="w-16 h-px bg-white/10 my-4" />

        {currentUser ? (
          <div className="flex flex-col items-center gap-6">
            <Link
              href={currentUser.role === "admin" ? "/Admin" : "/dashboard"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full border border-white/10"
            >
              <img
                src={
                  currentUser.profileImage || "https://github.com/shadcn.png"
                }
                className="w-8 h-8 rounded-full object-cover"
                alt="Profile"
              />
              <span className="text-white">
                {currentUser.username || currentUser.name}
              </span>
            </Link>
            <button
              onClick={async () => {
                await logout();
                setIsMobileMenuOpen(false);
                window.location.reload();
              }}
              className="text-red-400 font-bold uppercase tracking-widest text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-bold text-white hover:text-indigo-400 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-10 py-4 bg-white text-black hover:bg-indigo-50 transition rounded-full text-lg font-black shadow-xl"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
