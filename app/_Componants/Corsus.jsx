"use client";
import React, { useState, useRef } from "react";
import { useData } from "@/app/context/DataContext";
import { useRouter } from "next/navigation";
import useReveal from "./useReveal";
import { Star, ArrowRight } from "lucide-react";

const CourseCard = ({ course, onClick, index }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const bounds = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`group flex flex-col items-center justify-between relative w-full md:w-[380px] min-h-[500px] rounded-[40px] p-px bg-gray-900 overflow-hidden shadow-2xl hover:shadow-indigo-500/20 transform transition-all duration-500 animate-reveal delay-${(index % 4) * 100}`}
    >
      {/* Dynamic Glow Effect */}
      <div
        className={`pointer-events-none blur-[100px] rounded-full bg-indigo-500/40 size-64 absolute z-0 transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: position.y - 128, left: position.x - 128 }}
      />

      <div className="relative z-10 bg-gray-950/90 p-8 h-full w-full rounded-[39px] flex flex-col">
        {/* Top Image Container */}
        <div className="relative h-56 w-full rounded-3xl overflow-hidden mb-6">
          <img
            src={
              course.image ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800"
            }
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
              Premium
            </span>
          </div>
        </div>

        {/* Instructor Badge */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={course.instructor_image || "https://github.com/shadcn.png"}
            className="w-8 h-8 rounded-full border border-white/20 object-cover"
            alt={course.instructor_name}
          />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
            {course.instructor_name}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white mb-3 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
          {course.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed">
          {course.details}
        </p>

        {/* Footer Info */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-white">
              {course.rating || "4.9"}
            </span>
          </div>
          <div className="text-xl font-black text-white">
            EGP {course.price}
          </div>
        </div>

        {/* Join Button */}
        <button
          onClick={() => onClick(course)}
          className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const Corsus = ({ limit = null }) => {
  const { courses, setSelectedCourse } = useData();
  const router = useRouter();
  useReveal([courses]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    router.push("/course-details");
  };

  const displayedCourses = limit ? courses.slice(0, limit) : courses;
  const hasMore = limit && courses.length > limit;

  return (
    <section id="products" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 animate-reveal">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-none">
              Featured Courses
            </h1>
            <p className="text-gray-500 text-lg mt-4 max-w-xl">
              Elevate your expertise with our most popular and comprehensive
              learning paths.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-1 bg-indigo-600 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayedCourses && displayedCourses.length > 0 ? (
            displayedCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                onClick={handleCourseClick}
              />
            ))
          ) : (
            <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-200 text-center animate-reveal">
              <p className="text-gray-400 font-bold mb-2">No courses found</p>
              <p className="text-sm text-gray-300 underline cursor-pointer">
                Explore upcoming releases
              </p>
            </div>
          )}
        </div>

        {hasMore && (
          <div className="mt-20 flex justify-center animate-reveal">
            <button
              onClick={() => router.push("/courses")}
              className="group relative px-12 py-5 bg-white text-gray-900 font-black rounded-3xl border-2 border-gray-100 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-xl shadow-gray-200/50 flex items-center gap-4 active:scale-95"
            >
              View All Courses
              <div className="bg-gray-50 group-hover:bg-white/20 p-2 rounded-xl transition-colors">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
export default Corsus;
