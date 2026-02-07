"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }) {
  const { currentUser, isAuthLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAuthLoaded) return;

    // Protected routes configuration
    const isAdminRoute =
      pathname.startsWith("/AddCourse") ||
      pathname.startsWith("/AddVideo") ||
      pathname.startsWith("/Add_a_doctor") ||
      pathname.startsWith("/Admin") ||
      pathname.startsWith("/Chat") ||
      pathname.startsWith("/Create_code") ||
      pathname.startsWith("/Users") ||
      pathname.startsWith("/video-stats");

    const isUserRoute =
      pathname.startsWith("/videos") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/courses") ||
      pathname.startsWith("/course-details");

    if (!currentUser) {
      if (isAdminRoute || isUserRoute) {
        router.push("/login");
      } else {
        setIsReady(true);
      }
    } else {
      if (isAdminRoute && currentUser.role !== "admin") {
        router.push("/");
      } else {
        setIsReady(true);
      }
    }
  }, [currentUser, isAuthLoaded, pathname, router]);

  if (!isReady) return null; // Prevent flash of content

  return children;
}
