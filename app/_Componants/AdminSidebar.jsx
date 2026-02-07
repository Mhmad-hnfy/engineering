"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  PieChart,
  BookPlus,
  Key,
  UserPlus,
  Video,
  BarChart3,
  Users,
  MessageSquare,
  UserCircle,
} from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Dashboard", path: "/Admin", icon: <LayoutDashboard size={20} /> },
    { name: "Overview", path: "/overview", icon: <PieChart size={20} /> },
    { name: "AddCourse", path: "/AddCourse", icon: <BookPlus size={20} /> },
    { name: "Create code", path: "/Create_code", icon: <Key size={20} /> },
    {
      name: "Add a doctor",
      path: "/Add_a_doctor",
      icon: <UserPlus size={20} />,
    },
    { name: "Add Video", path: "/AddVideo", icon: <Video size={20} /> },
    {
      name: "Video Stats",
      path: "/video-stats",
      icon: <BarChart3 size={20} />,
    },
    { name: "Users", path: "/Users", icon: <Users size={20} /> },
    { name: "Chat", path: "/Chat", icon: <MessageSquare size={20} /> },
    { name: "Profile", path: "/AdminProfile", icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-300 pt-4 flex flex-col transition-all duration-300 bg-white">
      {sidebarLinks.map((item, index) => {
        const isActive = pathname === item.path;
        return (
          <Link
            href={item.path}
            key={index}
            className={`flex items-center py-3 px-4 gap-3 
                                ${
                                  isActive
                                    ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                                    : "hover:bg-gray-100/90 border-white text-gray-700"
                                }`}
          >
            {item.icon}
            <p className="md:block hidden text-center">{item.name}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminSidebar;
