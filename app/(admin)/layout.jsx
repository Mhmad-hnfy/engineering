"use client";
import AdminSidebar from "../_Componants/AdminSidebar";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
          <span className="font-bold text-xl tracking-tight">Admin Panel</span>
        </div>

        <div className="flex items-center gap-5 text-gray-500">
          <p className="font-medium text-sm hidden sm:block">Welcome, Admin</p>
          <button
            onClick={handleLogout}
            className="border border-gray-200 rounded-full text-xs font-bold px-5 py-2 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-65px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
