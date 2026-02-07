"use client";
import React from "react";
import Team from "../_Componants/Team";
import Navbar from "../_Componants/Navbar";
import Footer from "../_Componants/Footer";

export default function DoctorsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <div className="relative h-24 bg-gray-900">
        <Navbar />
      </div>

      {/* Page Header */}
      <div className="bg-gray-900 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">
            Our Elite <span className="text-indigo-500">Instructors.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium">
            Learn from the masters. Our team of industry experts is dedicated to
            your growth and success.
          </p>
        </div>
      </div>

      <main>
        <Team />
      </main>

      <Footer />
    </div>
  );
}
