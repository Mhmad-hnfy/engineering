"use client";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import VideoCard from "../_Componants/VideoCard";
import Link from "next/link";
import {
  LogOut,
  Home,
  PlayCircle,
  BookOpen,
  User,
  Settings,
  Camera,
  Check,
  Heart,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const { videos, courses, fetchVideos, isVideosLoaded } = useData();
  const [activeTab, setActiveTab] = useState("videos"); // 'videos' | 'courses' | 'settings'

  React.useEffect(() => {
    fetchVideos({ ids: currentUser?.favorite_videos || [] });
  }, [currentUser?.favorite_videos, fetchVideos]);

  const [profileForm, setProfileForm] = useState({
    username: currentUser?.username || currentUser?.name || "",
    email: currentUser?.email || "",
    password: "",
    profileImage: currentUser?.profileImage || "https://github.com/shadcn.png",
  });
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) return null;

  const unlockedVideos = videos.filter((v) => {
    return currentUser.favorite_videos?.includes(v.id);
  });

  const unlockedCourses = courses.filter((c) => {
    return (
      currentUser.unlocked_courses?.includes(c.id) ||
      videos.some(
        (v) =>
          v.course_id === c.id && currentUser.unlocked_videos?.includes(v.id),
      )
    );
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");
    setErrorMessage("");

    console.log("Starting profile update...");
    const res = await updateUserProfile(profileForm);
    console.log("Update result:", res);

    if (res?.success) {
      setSaveMessage("Profile updated successfully!");
      setProfileForm((prev) => ({ ...prev, password: "" }));
    } else {
      setErrorMessage(res?.message || "Failed to update profile");
    }

    setIsSaving(false);
    setTimeout(() => {
      setSaveMessage("");
      setErrorMessage("");
    }, 5000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <PlayCircle className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-slate-800">My Learning</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <Link
            href="/"
            className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>
          <Link
            href="/courses"
            className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Library</span>
          </Link>

          <div className="h-px bg-slate-100 my-2"></div>

          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "videos" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <PlayCircle className="w-5 h-5" />
            <span className="font-medium">My Videos</span>
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "courses" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">My Courses</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "settings" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <button
          onClick={async () => {
            await logout();
            window.location.href = "/";
          }}
          className="flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === "settings" ? (
          <div className="max-w-2xl">
            <header className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900">
                Profile Settings
              </h1>
              <p className="text-slate-500 mt-2">
                Manage your account information and profile picture.
              </p>
            </header>

            <form
              onSubmit={handleProfileUpdate}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8"
            >
              <div className="flex flex-col items-center sm:flex-row gap-8">
                <div className="relative">
                  <img
                    src={profileForm.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white cursor-pointer hover:bg-indigo-700 shadow-lg border-2 border-white transition">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-800">
                    {currentUser.name || currentUser.username}
                  </h3>
                  <p className="text-slate-500">{currentUser.email}</p>
                  <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-bold">
                    {currentUser.role} Account
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="example@mail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={profileForm.password}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-2">
                  {saveMessage && (
                    <div className="flex items-center gap-2 text-green-600 font-medium p-3 bg-green-50 rounded-lg animate-in fade-in slide-in-from-left-4 border border-green-100">
                      <Check className="w-4 h-4" />
                      <span>{saveMessage}</span>
                    </div>
                  )}
                  {errorMessage && (
                    <div className="flex items-center gap-2 text-red-600 font-medium p-3 bg-red-50 rounded-lg animate-in fade-in slide-in-from-left-4 border border-red-100">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className={`bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 ml-auto flex items-center gap-2 ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : activeTab === "courses" ? (
          <div>
            <header className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
              <p className="text-slate-500 mt-2">
                Courses you have purchased or unlocked videos from.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {unlockedCourses.length > 0 ? (
                unlockedCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/course-details?id=${course.id}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-slate-800 line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {course.instructor_name}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 uppercase">
                            View Details
                          </span>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                            <PlayCircle className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                  <BookOpen className="text-slate-300 w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-800">
                    No courses unlocked
                  </h3>
                  <p className="text-slate-500 mt-2 mb-6">
                    Unlock videos to see their parent courses here.
                  </p>
                  <Link
                    href="/videos"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Browse Library
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <header className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {currentUser.username || currentUser.name}!
              </h1>
              <p className="text-slate-500 mt-2">
                You have {unlockedVideos.length} unlocked videos in your
                library.
              </p>
            </header>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6 font-mono tracking-tight uppercase">
                My Bookmarked Videos
              </h2>
              {!isVideosLoaded ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="text-slate-400 text-sm font-medium">
                    Gathering your videos...
                  </p>
                </div>
              ) : unlockedVideos.length > 0 ? (
                <div className="space-y-12">
                  {Object.values(
                    unlockedVideos.reduce((acc, video) => {
                      const courseId = video.course_id;
                      if (!acc[courseId]) {
                        acc[courseId] = {
                          title: video.course_name || "General",
                          instructor: video.instructor_name,
                          videos: [],
                        };
                      }
                      acc[courseId].videos.push(video);
                      return acc;
                    }, {}),
                  ).map((group, idx) => (
                    <div key={idx} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-200" />
                        <div className="flex flex-col items-center gap-1 px-4">
                          <h3 className="text-lg font-black text-slate-900 leading-none">
                            {group.title}
                          </h3>
                          {group.instructor && (
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                              Instructor: {group.instructor}
                            </span>
                          )}
                        </div>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {group.videos.map((video) => (
                          <VideoCard key={video.id} video={video} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-xl shadow-slate-200/50">
                  <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="fill-red-500 text-red-500 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Your library is currently empty
                  </h3>
                  <p className="text-slate-500 mt-2 mb-8 max-w-sm mx-auto font-medium">
                    Use the "Heart" icon on any available video to add it to
                    your "My Videos" list here in the dashboard.
                  </p>
                  <Link
                    href="/videos"
                    className="inline-flex items-center bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/30 active:scale-95"
                  >
                    Browse Library
                  </Link>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
