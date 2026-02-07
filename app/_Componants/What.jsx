"use client";
import React, { useRef, useEffect, useState } from "react";
import { useData } from "@/app/context/DataContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import useReveal from "./useReveal";
import { PlayCircle, CheckCircle2, ArrowRight } from "lucide-react";

export default function What({ isDetailsPage = false }) {
  const { selectedCourse, setSelectedCourse, redeemCode } = useData();
  const { currentUser, unlockCourse, setCourseVideoLimit } = useAuth();
  const router = useRouter();

  const isAlreadyEnrolled =
    currentUser?.role === "admin" ||
    selectedCourse?.is_free ||
    currentUser?.unlocked_courses?.includes(selectedCourse?.id) ||
    (currentUser?.course_video_limits?.[selectedCourse?.id] || 0) > 0;
  const sectionRef = useRef(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [message, setMessage] = useState(null);

  useReveal();

  useEffect(() => {
    if (isDetailsPage) {
      if (!selectedCourse) {
        router.push("/");
      } else if (sectionRef.current) {
        sectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [selectedCourse, isDetailsPage, router]);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!selectedCourse?.id) return;

    const result = await redeemCode(inputCode, null, selectedCourse?.id);
    if (result.success) {
      // Persist to User Profile
      let unlockResult;
      if (result.unlockType === "full") {
        unlockResult = await unlockCourse(selectedCourse?.id);
      } else if (result.unlockType === "limit") {
        unlockResult = await setCourseVideoLimit(
          selectedCourse?.id,
          result.videoLimit,
        );
      }

      if (unlockResult?.success === false) {
        setMessage({
          type: "error",
          text: "Profile update failed: " + unlockResult.message,
        });
        return;
      }

      setMessage({ type: "success", text: result.message });
      setTimeout(() => {
        setShowCodeModal(false);
        setMessage(null);
        setInputCode("");
        router.push(`/videos?courseId=${selectedCourse?.id}`);
      }, 1500);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  // Safe Guard: If it's a details page but course isn't loaded yet, show nothing (or loading)
  // while the useEffect handles the redirect.
  if (isDetailsPage && !selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 font-bold">
          Loading Course...
        </div>
      </div>
    );
  }

  if (isDetailsPage && selectedCourse) {
    return (
      <section
        ref={sectionRef}
        className="py-20 px-4 bg-gray-50 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Image Section */}
            <div className="flex-1 relative animate-reveal">
              <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-full" />
              <img
                src={selectedCourse?.image}
                className="relative z-10 w-full rounded-[40px] shadow-2xl border-4 border-white object-cover"
                alt={selectedCourse?.title}
              />
              <div className="absolute top-8 left-8 z-20 flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full font-black text-indigo-600 shadow-xl border border-indigo-50">
                  ${selectedCourse?.price}
                </div>
                {selectedCourse?.is_free && (
                  <div className="bg-green-500 text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg animate-bounce">
                    Free Course
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 space-y-8 animate-reveal delay-200">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  Course Overview
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1]">
                  {selectedCourse.title}
                </h1>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm border border-gray-100">
                <img
                  src={
                    selectedCourse.instructor_image ||
                    "https://github.com/shadcn.png"
                  }
                  className="w-14 h-14 rounded-full object-cover shadow-md"
                />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Expert Instructor
                  </p>
                  <p className="text-xl font-black text-gray-900">
                    {selectedCourse.instructor_name}
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                {selectedCourse.details}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => {
                    if (isAlreadyEnrolled) {
                      router.push(`/videos?courseId=${selectedCourse?.id}`);
                    } else if (!currentUser) {
                      router.push("/login");
                    } else {
                      setShowCodeModal(true);
                    }
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-8 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  {isAlreadyEnrolled ? "Watch Now" : "Enroll Now"}
                  <ArrowRight className="w-5 h-5" />
                </button>
                {!isAlreadyEnrolled && (
                  <button
                    onClick={() => {
                      if (!currentUser) router.push("/login");
                      else setShowCodeModal(true);
                    }}
                    className="flex-1 bg-white text-gray-900 border border-gray-200 font-bold py-5 px-8 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    Unlock with Code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Overlay */}
        {showCodeModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowCodeModal(false)}
          >
            <div
              className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Redeem Access
              </h3>
              <p className="text-gray-500 mb-8">
                Enter your unique 8-digit code below.
              </p>

              <form onSubmit={handleRedeem} className="space-y-6">
                <input
                  type="text"
                  placeholder="CODE-HERE"
                  className="w-full text-center text-3xl font-black tracking-[0.4em] py-5 border-2 border-gray-100 rounded-3xl focus:border-indigo-600 focus:outline-none transition uppercase"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  maxLength={10}
                />
                {message && (
                  <div
                    className={`text-center font-bold ${message.type === "success" ? "text-green-600" : "text-red-500"}`}
                  >
                    {message.text}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full py-5 bg-black text-white rounded-3xl font-black text-lg hover:bg-gray-900 transition shadow-xl shadow-black/20"
                >
                  Verify Code
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
        <div className="relative animate-reveal">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full" />
          <div className="relative z-10 bg-gray-900 p-4 rounded-[40px] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=800&auto=format&fit=crop"
              className="max-w-xl w-full rounded-[30px] opacity-90"
              alt="what we do"
            />
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-100 animate-float">
              <div className="flex -space-x-4 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 44}`}
                    className="w-10 h-10 rounded-full border-4 border-white shadow-sm"
                  />
                ))}
              </div>
              <p className="text-sm font-black text-gray-900 leading-tight">
                Elite Community
              </p>
              <p className="text-[10px] font-bold text-gray-400">
                JOIN 5000+ ENGINEERS
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8 animate-reveal delay-300">
          <div className="space-y-4">
            <div className="inline-block h-1 w-20 bg-indigo-600 rounded-full" />
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1]">
              Redefining Educational Standards.
            </h2>
          </div>

          <div className="space-y-6">
            {[
              "AI-Powered Learning Assistant",
              "Industry-Standard Certification",
              "Direct Mentorship from Experts",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 animate-reveal"
                style={{ transitionDelay: `${(i + 5) * 100}ms` }}
              >
                <div className="bg-indigo-50 p-2 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-xl font-bold text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
            Our mission is to bridge the gap between academic knowledge and
            industrial excellence through a revolutionary digital ecosystem.
          </p>

          <div className="pt-4">
            <button className="px-10 py-5 bg-black text-white font-black rounded-2xl hover:bg-gray-900 transition-all flex items-center gap-3 group active:scale-95 shadow-2xl shadow-black/10">
              Learn More
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
