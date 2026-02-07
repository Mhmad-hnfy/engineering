"use client";
import { useData } from "@/app/context/DataContext";
import React from "react";
import useReveal from "./useReveal";

export default function Team() {
  const { doctors } = useData();
  useReveal();

  return (
    <section className="py-20 bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-reveal">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Meet Our Team
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            The experts and industry leaders driving our educational excellence
            and innovation.
          </p>
          <div className="w-24 h-1.5 bg-indigo-600 mx-auto mt-6 rounded-full" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          {doctors && doctors.length > 0 ? (
            doctors.map((doc, index) => (
              <div
                key={doc.id || index}
                className={`group w-85 bg-black text-white rounded-[32px] flex flex-col overflow-hidden shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 animate-reveal delay-${(index % 5) * 100}`}
              >
                <div className="relative h-[340px] overflow-hidden">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="h-full w-full group-hover:scale-110 transition-transform duration-700 object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />

                  {/* Floating micro-glow */}
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="size-2 bg-indigo-400 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="px-8 pb-8 text-center flex-1 bg-black relative">
                  {/* Decorative line */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-full -translate-y-1/2 group-hover:w-24 transition-all duration-500" />

                  <p className="mt-6 text-2xl font-black tracking-tight group-hover:text-indigo-400 transition-colors uppercase">
                    {doc.name}
                  </p>
                  <p className="mt-2 text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text h-fit min-h-[40px] flex items-center justify-center italic opacity-80 group-hover:opacity-100 transition-all">
                    {doc.bio}
                  </p>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 animate-reveal">
              <p className="text-gray-400 text-lg">
                No team members added yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
