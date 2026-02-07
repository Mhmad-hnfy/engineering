"use client";
import React, { useState } from "react";
import { useData } from "@/app/context/DataContext";
import Modal from "@/app/_Componants/Modal";
import { compressImage } from "@/app/utils/imageCompressor";

export default function AddVideo() {
  const {
    videos,
    addVideo,
    deleteVideo,
    courses,
    fetchVideos,
    isVideosLoaded,
  } = useData();

  React.useEffect(() => {
    if (!isVideosLoaded) fetchVideos();
  }, [isVideosLoaded, fetchVideos]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [videoSourceType, setVideoSourceType] = useState("youtube"); // 'youtube' | 'upload'

  const [formData, setFormData] = useState({
    title: "",
    youtubeVideoId: "",
    localVideoUrl: "",
    bannerUrl: "",
    locked: false,
    courseId: "",
    pdfUrl: "",
    pdfName: "",
    bannerFile: null, // Track the file for compression
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a blob URL for local preview (Note: This is temporary for the session)
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, localVideoUrl: url }));
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        pdfUrl: url,
        pdfName: file.name,
      }));
    }
  };

  const extractVideoId = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.courseId) {
      alert("Please fill all fields");
      return;
    }

    if (videoSourceType === "youtube" && !formData.youtubeVideoId) {
      alert("Please enter a YouTube URL");
      return;
    }
    if (videoSourceType === "upload" && !formData.localVideoUrl) {
      alert("Please upload a video file");
      return;
    }

    setIsProcessing(true);
    setStatus({ type: "info", message: "Preparing video data..." });

    try {
      const selectedCourse = courses.find((c) => c.id === formData.courseId);

      // Compress banner if it's a blob/newly selected
      let finalBannerUrl = formData.bannerUrl;
      if (formData.bannerFile) {
        setStatus({ type: "info", message: "Compressing banner image..." });
        finalBannerUrl = await compressImage(formData.bannerFile);
      }

      let videoData = {
        title: formData.title,
        locked: formData.locked,
        course_id: formData.courseId,
        course_name: selectedCourse?.title || "Unknown Course",
        instructor_name: selectedCourse?.instructor_name || "",
        instructor_image: selectedCourse?.instructor_image || "",
        type: videoSourceType,
        banner_url: finalBannerUrl || "",
        pdf_url: formData.pdfUrl || "",
        pdf_name: formData.pdfName || "",
      };

      if (videoSourceType === "youtube") {
        videoData.youtube_video_id = extractVideoId(formData.youtubeVideoId);
      } else {
        videoData.video_url = formData.localVideoUrl;
      }

      setStatus({ type: "info", message: "Saving to database..." });
      const result = await addVideo(videoData);

      if (result.success) {
        setStatus({ type: "success", message: "Video added successfully!" });
        setTimeout(() => {
          setFormData({
            title: "",
            youtubeVideoId: "",
            localVideoUrl: "",
            bannerUrl: "",
            locked: false,
            courseId: "",
            pdfUrl: "",
            pdfName: "",
          });
          setIsModalOpen(false);
          setStatus({ type: "", message: "" });
        }, 500); // Reduced delay for better UX
      } else {
        setStatus({
          type: "error",
          message: "Error: " + (result.message || "Failed to add video."),
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.course_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </span>
            Video Library
          </h1>
          <p className="text-gray-500 mt-1">
            Manage videos and assign them to courses.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New Video
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          placeholder="Search videos..."
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Video List */}
      {!isVideosLoaded ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            Fetching video directory...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos
              .slice()
              .reverse()
              .map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group"
                >
                  <div className="relative aspect-video bg-gray-200">
                    {video.type === "upload" ? (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H9v4h4v-4zm1 0h1v2h-1v-2zM5 5v2h1V5H5zm0 4h1v2H5V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <img
                        src={`https://img.youtube.com/vi/${video.youtube_video_id}/mqdefault.jpg`}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
                    {video.locked && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
                        LOCKED
                      </span>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this video?",
                            )
                          ) {
                            deleteVideo(video.id);
                          }
                        }}
                        className="bg-white/90 hover:bg-white text-red-500 p-1.5 rounded-full shadow-sm backdrop-blur-sm transition"
                        title="Delete Video"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400 bg-gray-100 px-1 rounded">
                        {video.id.substring(0, 8)}...
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(video.id);
                          alert("Video ID Copied!");
                        }}
                        className="text-gray-400 hover:text-indigo-600 transition"
                        title="Copy Video ID"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <h3 className="font-bold text-gray-800 line-clamp-1 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-sm text-indigo-600 font-medium flex items-center gap-1 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      {video.course_name}
                    </p>
                    <div
                      className="bg-gray-50 rounded p-2 text-xs font-mono text-gray-500 truncate"
                      title="Video ID"
                    >
                      {video.type === "upload"
                        ? "Local Upload"
                        : video.youtube_video_id}
                    </div>
                    {video.pdf_url && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <a
                          href={video.pdf_url}
                          download={video.pdf_name || "resource.pdf"}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                          title="Download PDF"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="truncate">
                            {video.pdf_name || "Attached PDF"}
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium">No videos found</p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Video"
      >
        {status.message && (
          <div
            className={`p-3 mb-4 rounded-lg text-sm font-medium ${status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {status.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4 p-1 bg-gray-100 rounded-lg mb-2">
            <button
              type="button"
              onClick={() => setVideoSourceType("youtube")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition flex items-center justify-center gap-2 ${videoSourceType === "youtube" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              YouTube Link
            </button>
            <button
              type="button"
              onClick={() => setVideoSourceType("upload")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition flex items-center justify-center gap-2 ${videoSourceType === "upload" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload File
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Next.js Tutorial #1"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {videoSourceType === "youtube" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube URL or ID
                </label>
                <input
                  type="text"
                  name="youtubeVideoId"
                  value={formData.youtubeVideoId}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Banner (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFormData((prev) => ({
                        ...prev,
                        bannerUrl: url,
                        bannerFile: file,
                      }));
                    }
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-lg p-1"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-lg p-1"
                required
              />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Banner/Poster (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFormData((prev) => ({
                        ...prev,
                        bannerUrl: url,
                        bannerFile: file,
                      }));
                    }
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-lg p-1"
                />
              </div>
              <p className="text-xs text-orange-500 mt-1">
                Warning: Local videos are stored temporarily in browser memory.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Course
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Choose a Course --</option>
              {courses &&
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attach PDF Material (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-lg p-1"
              />
            </div>
            {formData.pdfName && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Selected: {formData.pdfName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <input
              type="checkbox"
              name="locked"
              id="locked"
              checked={formData.locked}
              onChange={handleChange}
              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <label
              htmlFor="locked"
              className="text-sm font-bold text-amber-700 cursor-pointer select-none"
            >
              Premium / Locked Content?
            </label>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`mt-4 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Video
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}
