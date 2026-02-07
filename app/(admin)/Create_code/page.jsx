"use client";
import React, { useState } from "react";
import { useData } from "@/app/context/DataContext";
import Modal from "@/app/_Componants/Modal";

export default function CreateCode() {
  const {
    courses,
    videos,
    codes,
    addCode,
    deleteCode,
    fetchVideos,
    fetchCodes,
    isVideosLoaded,
    isCodesLoaded,
  } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [generateFor, setGenerateFor] = useState("course"); // 'course' | 'video'
  const [formData, setFormData] = useState({
    courseId: "",
    videoId: "",
    usageLimit: 1,
    quantity: 1,
    unlockType: "full",
    videoLimit: 1,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  React.useEffect(() => {
    if (!isVideosLoaded) fetchVideos();
    if (!isCodesLoaded) fetchCodes();
  }, [isVideosLoaded, isCodesLoaded, fetchVideos, fetchCodes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateRandomCode = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.usageLimit < 1 || formData.quantity < 1) {
      alert("Please check usage limit and quantity");
      return;
    }

    if (generateFor === "course" && !formData.courseId) {
      alert("Please select a course");
      return;
    }
    if (generateFor === "video" && !formData.videoId) {
      alert("Please select a video");
      return;
    }

    let entityId = "";
    let entityName = "";

    if (generateFor === "course") {
      const course = courses.find((c) => c.id === formData.courseId);
      entityId = course.id;
      entityName = course.title;
    } else {
      const video = videos.find((v) => v.id === formData.videoId);
      entityId = video.id;
      entityName = video.title;
    }

    const newCodes = [];
    for (let i = 0; i < formData.quantity; i++) {
      newCodes.push({
        code: generateRandomCode(),
        type: generateFor,
        unlock_type: generateFor === "course" ? formData.unlockType : "single",
        video_limit:
          generateFor === "course" && formData.unlockType === "limit"
            ? Number(formData.videoLimit)
            : 0,
        entity_id: entityId,
        entity_name: entityName,
        usage_limit: Number(formData.usageLimit),
        usage_remaining: Number(formData.usageLimit),
      });
    }

    setIsProcessing(true);
    const result = await addCode(newCodes);
    setIsProcessing(false);

    if (result.success) {
      setStatus({
        type: "success",
        message: `${formData.quantity} code(s) generated!`,
      });
      setTimeout(() => {
        setFormData((prev) => ({ ...prev, quantity: 1 }));
        setIsModalOpen(false);
        setStatus({ type: "", message: "" });
      }, 1500);
    } else {
      setStatus({
        type: "error",
        message:
          "Error: " +
          (result.message ||
            result.error?.message ||
            "Failed to generate codes."),
      });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!");
  };

  // Filter Codes
  const filteredCodes = codes.filter(
    (code) =>
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.entity_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      {(!isVideosLoaded || !isCodesLoaded) && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 font-medium font-mono animate-pulse">
            LOADING SECURE DATA...
          </p>
        </div>
      )}
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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </span>
            Access Codes
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and generate access codes for courses and videos.
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
          Generate New Code
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
          placeholder="Search by code or name..."
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Codes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCodes.length > 0 ? (
          filteredCodes
            .slice()
            .reverse()
            .map((code) => (
              <div
                key={code.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => deleteCode(code.id)}
                    className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-full transition"
                    title="Delete Code"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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

                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${code.type === "video" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}
                  >
                    {code.type === "video" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(code.code)}
                    className="text-indigo-600 font-mono text-lg font-bold hover:text-indigo-800 transition tracking-wider"
                    title="Click to copy"
                  >
                    {code.code}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 opacity-50 group-hover:opacity-100 transition"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-1">
                  <h3
                    className="font-semibold text-gray-800 line-clamp-1"
                    title={code.entity_name}
                  >
                    {code.entity_name || "Unknown Item"}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Remaining Uses:</span>
                    <span
                      className={`font-bold ${code.usage_remaining === 0 ? "text-red-500" : "text-green-500"}`}
                    >
                      {code.usage_remaining} / {code.usage_limit}
                    </span>
                  </div>
                  {code.unlock_type === "limit" && (
                    <p className="text-xs text-orange-500 font-medium">
                      Limited to {code.video_limit} videos
                    </p>
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg font-medium">No codes found</p>
            <p className="text-sm">Generate a new code to get started.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Access Codes"
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
              onClick={() => setGenerateFor("course")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition flex items-center justify-center gap-2 ${generateFor === "course" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              For Course
            </button>
            <button
              type="button"
              onClick={() => setGenerateFor("video")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition flex items-center justify-center gap-2 ${generateFor === "video" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
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
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              For Video
            </button>
          </div>

          {generateFor === "course" ? (
            <>
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
                  Unlock Mode
                </label>
                <select
                  name="unlockType"
                  value={formData.unlockType}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="full">Open All Videos in Course</option>
                  <option value="limit">Specific Number of Videos</option>
                </select>
              </div>
              {formData.unlockType === "limit" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Limit (count)
                  </label>
                  <input
                    type="number"
                    name="videoLimit"
                    value={formData.videoLimit}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Video
              </label>
              <select
                name="videoId"
                value={formData.videoId}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">-- Choose a Video --</option>
                {videos &&
                  videos.map((video) => (
                    <option key={video.id} value={video.id}>
                      {video.title}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit
              </label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                min="1"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
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
                Generating...
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
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Generate Codes
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}
