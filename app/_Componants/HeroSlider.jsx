"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const slides = [
  {
    image: "/FB_IMG_1769035112139.jpg.jpeg",
    title: "Master the Art of Engineering",
    description:
      "Explore advanced courses designed by industry experts to elevate your professional skills.",
  },
  {
    image: "/FB_IMG_1769035127055.jpg.jpeg",
    title: "Build the Future with AI",
    description:
      "Connect with the latest technologies and learn how to build intelligent agents from scratch.",
  },
  {
    image: "/FB_IMG_1769035138346.jpg.jpeg",
    title: "Empower Your Learning Journey",
    description:
      "Anytime, anywhere. Our platform provides the flexibility you need to succeed in your career.",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () =>
    setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="relative w-full h-[600px] md:h-[750px] overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[5000ms] ease-linear scale-110"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: index === current ? "scale(1)" : "scale(1.1)",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 max-w-5xl mx-auto">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-md text-white rounded-full px-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="size-2.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Learn from the best
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              {slide.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              {slide.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
              <Link
                href={
                  currentUser
                    ? currentUser.role === "admin"
                      ? "/Admin"
                      : "/dashboard"
                    : "/signup"
                }
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
              >
                Get Started Now
                <PlayCircle className="w-5 h-5" />
              </Link>
              <Link
                href="/courses"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition duration-300"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition duration-300"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current ? "bg-indigo-500 w-10" : "bg-white/40 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
}
