"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let subscription;
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setIsAuthLoaded(true);
      }

      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          setCurrentUser(null);
          setIsAuthLoaded(true);
        }
      });

      subscription = sub;
    };

    initAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (data) setUsers(data);
  };

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        const normalizedUser = {
          ...data,
          name: data.full_name,
          username: data.full_name,
          profileImage: data.profile_image,
        };
        setCurrentUser(normalizedUser);
        setIsAuthLoaded(true);
        return normalizedUser;
      } else {
        // Heal: Profile missing but user exists in Auth
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && user.id === userId) {
          // Check if it's the very first user or a specific bootstrap case
          // But generally, we should just create a default profile
          const { data: newProfile } = await supabase
            .from("profiles")
            .upsert({
              id: user.id,
              email: user.email,
              full_name:
                user.user_metadata?.full_name || user.email.split("@")[0],
              role: "user", // Default, shouldn't overwrite if it exists but fetch failed
            })
            .select()
            .single();

          if (newProfile) {
            const normalized = {
              ...newProfile,
              name: newProfile.full_name,
              username: newProfile.full_name,
              profileImage: newProfile.profile_image,
            };
            setCurrentUser(normalized);
            setIsAuthLoaded(true);
            return normalized;
          }
        }
      }
    } catch (err) {
      // Profile fetch failed silently
    }
    setIsAuthLoaded(true);
    return null;
  };

  // Register a new user
  const register = async (userData) => {
    const { email, password, full_name } = userData;

    // 1. Sign up user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return { success: false, message: authError.message };
    if (!authData.user)
      return {
        success: false,
        message: "Signup successful, please check your email to confirm.",
      };

    // Rely on default role or set via metadata
    const role = userData.role || "user";

    // 2. Create profile or update if exists (Upsert)
    const { error: profileError } = await supabase.from("profiles").upsert([
      {
        id: authData.user.id,
        email,
        full_name,
        role,
      },
    ]);

    if (profileError) return { success: false, message: profileError.message };

    const profile = await fetchProfile(authData.user.id);
    return { success: true, user: authData.user, profile };
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, message: error.message };

    const profile = await fetchProfile(data.user.id);
    return { success: true, user: data.user, profile };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const _updateUser = async (updates) => {
    if (!currentUser) return { success: false, message: "No active user" };

    try {
      // 1. Update Supabase Auth if email or NEW password are provided
      if (
        updates.email ||
        (updates.password && updates.password.trim() !== "")
      ) {
        const authUpdates = {};
        if (updates.email && updates.email !== currentUser.email)
          authUpdates.email = updates.email;
        if (updates.password && updates.password.trim() !== "")
          authUpdates.password = updates.password;

        if (Object.keys(authUpdates).length > 0) {
          const { error: authError } =
            await supabase.auth.updateUser(authUpdates);
          if (authError) return { success: false, message: authError.message };
        }
      }

      // 2. Update Database Profile Table
      const dbUpdates = { ...updates };

      // Clean up fields that shouldn't go to DB or need mapping
      if (updates.name) dbUpdates.full_name = updates.name;
      if (updates.username) dbUpdates.full_name = updates.username;
      if (updates.profileImage) dbUpdates.profile_image = updates.profileImage;

      delete dbUpdates.name;
      delete dbUpdates.username;
      delete dbUpdates.profileImage;
      delete dbUpdates.password;

      // If email didn't change, no need to update it in DB (Supabase handles this sync usually, but being explicit)
      if (dbUpdates.email === currentUser.email) delete dbUpdates.email;

      if (Object.keys(dbUpdates).length > 0) {
        const { data, error: dbError } = await supabase
          .from("profiles")
          .update(dbUpdates)
          .eq("id", currentUser.id)
          .select()
          .single();

        if (dbError) return { success: false, message: dbError.message };

        if (data) {
          const normalizedUser = {
            ...data,
            name: data.full_name,
            username: data.full_name,
            profileImage: data.profile_image,
          };
          setCurrentUser(normalizedUser);
          if (normalizedUser.role === "admin") fetchUsers();
        }
      } else {
        await fetchProfile(currentUser.id);
      }

      return { success: true };
    } catch (err) {
      console.error("Profile update error:", err);
      return {
        success: false,
        message: err.message || "An unexpected error occurred",
      };
    }
  };

  const unlockVideo = async (videoId) => {
    if (!currentUser) return { success: false, message: "User not logged in" };
    if (currentUser.unlocked_videos?.includes(videoId))
      return { success: true };

    return await _updateUser({
      unlocked_videos: [...(currentUser.unlocked_videos || []), videoId],
    });
  };

  const unlockCourse = async (courseId) => {
    if (!currentUser) return { success: false, message: "User not logged in" };
    if (currentUser.unlocked_courses?.includes(courseId))
      return { success: true };

    return await _updateUser({
      unlocked_courses: [...(currentUser.unlocked_courses || []), courseId],
    });
  };

  const setCourseVideoLimit = async (courseId, limit) => {
    if (!currentUser) return { success: false, message: "User not logged in" };

    const currentLimits = currentUser.course_video_limits || {};
    const newLimit = (currentLimits[courseId] || 0) + limit;

    return await _updateUser({
      course_video_limits: {
        ...currentLimits,
        [courseId]: newLimit,
      },
    });
  };

  const toggleFavorite = async (videoId) => {
    if (!currentUser) return { success: false, message: "User not logged in" };

    const favorites = currentUser.favorite_videos || [];
    const isFavorite = favorites.includes(videoId);
    const newFavorites = isFavorite
      ? favorites.filter((id) => id !== videoId)
      : [...favorites, videoId];

    const result = await _updateUser({
      favorite_videos: newFavorites,
    });

    return result;
  };

  const updateUserProfile = async (profileData) => {
    if (!currentUser) return { success: false, message: "No active user" };
    return await _updateUser(profileData);
  };

  const deleteUser = async (id) => {
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id)
      .select();

    if (error) return { success: false, error };
    if (!data || data.length === 0) {
      return {
        success: false,
        message: "Deletion failed. Check your database RLS policies.",
      };
    }

    fetchUsers();
    return { success: true };
  };

  const deleteUsers = async (ids) => {
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .in("id", ids)
      .select();

    if (error) return { success: false, error };
    if (!data || data.length === 0) {
      return {
        success: false,
        message: "Deletion failed for selected users. Check RLS policies.",
      };
    }

    fetchUsers();
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAuthLoaded,
        register,
        login,
        logout,
        unlockVideo,
        unlockCourse,
        setCourseVideoLimit,
        toggleFavorite,
        updateUserProfile,
        deleteUser,
        deleteUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
