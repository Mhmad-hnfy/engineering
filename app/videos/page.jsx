"use client";
import React, { Suspense } from "react";
import VideoCard from "@/app/_Componants/VideoCard";
import { useData } from "@/app/context/DataContext";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import useReveal from "@/app/_Componants/useReveal";

function VideosContent() {
  const { videos, courses, fetchVideos, isVideosLoaded } = useData();
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");

  React.useEffect(() => {
    fetchVideos({ courseId });
  }, [courseId, fetchVideos]);

  useReveal();

  const filteredVideos = courseId
    ? videos.filter((v) => v.course_id === courseId)
    : videos;

  const currentCourse = courses.find((c) => c.id === courseId);

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 animate-reveal">
          <button
            onClick={() => router.push("/courses")}
            className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold transition mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                <BookOpen className="w-3.5 h-3.5" />
                {currentCourse ? "Course Content" : "Full Library"}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                {currentCourse ? currentCourse.title : "Library Overview"}
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl">
                {currentCourse
                  ? `Explore the curriculum for ${currentCourse.title}.`
                  : "Browse all available lectures and workshops."}
              </p>
            </div>

            <div className="bg-gray-100 px-6 py-3 rounded-2xl">
              <span className="text-sm font-black text-gray-900">
                {filteredVideos.length}
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase ml-2 tracking-widest">
                Lessons
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 mt-10" />
        </div>

        {!isVideosLoaded ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-500 font-medium">Loading Videos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredVideos && filteredVideos.length > 0 ? (
              filteredVideos
                .slice()
                .reverse()
                .map((video, index) => (
                  <div
                    key={video.id}
                    className={`animate-reveal delay-${(index % 4) * 100}`}
                  >
                    <VideoCard video={video} />
                  </div>
                ))
            ) : (
              <div className="col-span-full text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 animate-reveal">
                <div className="size-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-2xl font-black text-gray-900 mb-2">
                  No videos found
                </p>
                <p className="text-gray-400">
                  Content for this course will be available soon.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">
          Loading Library...
        </div>
      }
    >
      <VideosContent />
    </Suspense>
  );
}
