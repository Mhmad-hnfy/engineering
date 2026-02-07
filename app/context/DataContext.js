"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [codes, setCodes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isVideosLoaded, setIsVideosLoaded] = useState(false);
  const [isCodesLoaded, setIsCodesLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadedCourses, setLoadedCourses] = useState(new Set());

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [{ data: coursesData }, { data: doctorsData }] = await Promise.all([
        supabase.from("courses").select("*"),
        supabase.from("doctors").select("*"),
      ]);

      if (coursesData) setCourses(coursesData);
      if (doctorsData) setDoctors(doctorsData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const fetchVideos = useCallback(
    async (options = {}) => {
      const { courseId, ids, force = false } = options;

      // Skip if already loaded (unless force)
      if (!force) {
        if (courseId && loadedCourses.has(courseId)) return;
        if (!courseId && !ids && isVideosLoaded) return;
      }

      try {
        let query = supabase.from("videos").select("*");

        if (courseId) {
          query = query.eq("course_id", courseId);
        } else if (ids) {
          if (ids.length > 0) {
            query = query.in("id", ids);
          } else {
            // If empty array of IDs provided, just return empty data
            setIsVideosLoaded(true);
            return { success: true };
          }
        }

        const { data, error } = await query;

        if (data) {
          setVideos((prev) => {
            const newIds = new Set(data.map((v) => v.id));
            const existingFiltered = prev.filter((v) => !newIds.has(v.id));
            return [...existingFiltered, ...data];
          });

          if (courseId) {
            setLoadedCourses((prev) => new Set([...prev, courseId]));
          }
        }

        setIsVideosLoaded(true);
        return { success: !error, error };
      } catch (err) {
        console.error("Error fetching videos:", err);
        return { success: false, error: err };
      }
    },
    [isVideosLoaded, loadedCourses],
  );

  const fetchCodes = useCallback(
    async (force = false) => {
      if (isCodesLoaded && !force) return;
      try {
        const { data, error } = await supabase.from("codes").select("*");
        if (data) {
          setCodes(data);
        }
        setIsCodesLoaded(true);
        return { success: !error, error };
      } catch (err) {
        console.error("Error fetching codes:", err);
        setIsCodesLoaded(true);
        return { success: false, error: err };
      }
    },
    [isCodesLoaded],
  );

  const _cleanData = (obj, table) => {
    const cleaned = { ...obj };
    delete cleaned.instructorId;
    delete cleaned.courseId;
    delete cleaned.isFree;
    return cleaned;
  };

  const addCourse = async (course) => {
    const cleaned = _cleanData(course, "courses");
    const { data, error } = await supabase
      .from("courses")
      .insert([cleaned])
      .select();
    if (data) setCourses((prev) => [...prev, data[0]]);
    return { success: !error, error };
  };

  const updateCourse = async (id, course) => {
    const cleaned = _cleanData(course, "courses");
    const { data, error } = await supabase
      .from("courses")
      .update(cleaned)
      .eq("id", id)
      .select();
    if (data)
      setCourses((prev) => prev.map((c) => (c.id === id ? data[0] : c)));
    return { success: !error, error };
  };

  const deleteCourse = async (id) => {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (!error) setCourses((prev) => prev.filter((c) => c.id !== id));
    return { success: !error, error };
  };

  const addDoctor = async (doctor) => {
    const { data, error } = await supabase
      .from("doctors")
      .insert([doctor])
      .select();
    if (data) setDoctors((prev) => [...prev, data[0]]);
    return { success: !error, error };
  };

  const updateDoctor = async (id, doctor) => {
    const { data, error } = await supabase
      .from("doctors")
      .update(doctor)
      .eq("id", id)
      .select();
    if (data)
      setDoctors((prev) => prev.map((d) => (d.id === id ? data[0] : d)));
    return { success: !error, error };
  };

  const deleteDoctor = async (id) => {
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (!error) setDoctors((prev) => prev.filter((d) => d.id !== id));
    return { success: !error, error };
  };

  const addVideo = async (video) => {
    const cleaned = _cleanData(video, "videos");
    const { data, error } = await supabase
      .from("videos")
      .insert([cleaned])
      .select();
    if (data) setVideos((prev) => [...prev, data[0]]);
    return { success: !error, error };
  };

  const updateVideo = async (id, video) => {
    const cleaned = _cleanData(video, "videos");
    const { data, error } = await supabase
      .from("videos")
      .update(cleaned)
      .eq("id", id)
      .select();
    if (data) setVideos((prev) => prev.map((v) => (v.id === id ? data[0] : v)));
    return { success: !error, error };
  };

  const deleteVideo = async (id) => {
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (!error) setVideos((prev) => prev.filter((v) => v.id !== id));
    return { success: !error, error };
  };

  const addCode = async (code) => {
    const payload = Array.isArray(code) ? code : [code];
    const { data, error } = await supabase
      .from("codes")
      .insert(payload)
      .select();
    if (data) setCodes((prev) => [...prev, ...data]);
    return { success: !error, error };
  };

  const updateCode = async (id, code) => {
    const { data, error } = await supabase
      .from("codes")
      .update(code)
      .eq("id", id)
      .select();
    if (data) setCodes((prev) => prev.map((c) => (c.id === id ? data[0] : c)));
    return { success: !error, error };
  };

  const deleteCode = async (id) => {
    const { error } = await supabase.from("codes").delete().eq("id", id);
    if (!error) setCodes((prev) => prev.filter((c) => c.id !== id));
    return { success: !error, error };
  };

  const redeemCode = async (inputCode, videoId, targetCourseId) => {
    if (!inputCode) return { success: false, message: "Please enter a code" };

    const normalized = inputCode.trim().toUpperCase();

    const { data: code, error: fetchError } = await supabase
      .from("codes")
      .select("*")
      .eq("code", normalized)
      .single();

    if (fetchError || !code) {
      return { success: false, message: "Invalid or expired code" };
    }

    if (Number(code.usage_remaining) <= 0)
      return {
        success: false,
        message: "This code has reached its usage limit",
      };

    const type = code.type;
    const entity_id = code.entity_id;

    if (type === "video") {
      if (videoId && entity_id !== videoId) {
        return {
          success: false,
          message: "This code is for a different video.",
        };
      }
    } else if (type === "course") {
      if (targetCourseId && entity_id !== targetCourseId) {
        return {
          success: false,
          message: "This code is for a different course.",
        };
      }

      if (!targetCourseId && videoId) {
        const { data: video } = await supabase
          .from("videos")
          .select("course_id")
          .eq("id", videoId)
          .single();

        if (!video || video.course_id !== entity_id) {
          return {
            success: false,
            message: "This code is for a different course than this video.",
          };
        }
      }
    }

    const { data: updatedCode, error: updateError } = await supabase
      .from("codes")
      .update({ usage_remaining: code.usage_remaining - 1 })
      .eq("id", code.id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        message: "System error: Could not update code usage",
      };
    }

    setCodes((prev) =>
      prev.map((c) => (c.id === updatedCode.id ? updatedCode : c)),
    );

    return {
      success: true,
      message: "Code successfully redeemed!",
      type: type,
      unlockType: code.unlock_type || (type === "video" ? "single" : "full"),
      videoLimit: code.video_limit || 0,
    };
  };

  return (
    <DataContext.Provider
      value={{
        courses,
        doctors,
        codes,
        videos,
        isVideosLoaded,
        isCodesLoaded,
        isLoaded,
        selectedCourse,
        setSelectedCourse,
        fetchInitialData,
        fetchVideos,
        fetchCodes,
        addCourse,
        updateCourse,
        deleteCourse,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addVideo,
        updateVideo,
        deleteVideo,
        addCode,
        updateCode,
        deleteCode,
        redeemCode,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
