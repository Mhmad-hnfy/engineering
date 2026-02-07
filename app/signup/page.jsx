"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register({
      full_name: formData.username,
      email: formData.email,
      password: formData.password,
    });
    if (result.success) {
      if (result.profile?.role === "admin") {
        router.push("/Admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-87.5 text-center bg-white/6 border border-white/10 rounded-2xl px-8 mx-auto mt-20"
      >
        <h2 className="text-white text-3xl mt-10 font-medium">Sign Up</h2>

        <p className="text-gray-400 text-sm mt-2">
          Create an account to continue
        </p>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <div className="flex items-center mt-6 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white/60"
          >
            <path
              d="M3.125 13.125a4.375 4.375 0 0 1 8.75 0M10 4.375a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"
              stroke="currentColor"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
            type="text"
            name="username"
            placeholder="Username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white/60"
          >
            <path
              d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375"
              stroke="currentColor"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
              stroke="currentColor"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white/60"
          >
            <path
              d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375"
              stroke="currentColor"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
              stroke="currentColor"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button className="mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition font-medium">
          Create Account
        </button>

        <p className="text-gray-400 text-sm mt-3 mb-11">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Log In
          </Link>
        </p>
      </form>

      {/* Soft Backdrop*/}
      <div className="fixed inset-0 -z-1 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-245 h-115 bg-linear-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl" />
        <div className="absolute right-12 bottom-10 w-105 h-55 bg-linear-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl" />
      </div>
    </>
  );
}
