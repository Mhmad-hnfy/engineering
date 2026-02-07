"use client";

import { useState, useEffect } from "react";
import { useData } from "@/app/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Play,
  Lock,
  Unlock,
  Maximize,
  Minimize,
  Expand,
  Shrink,
  FileText,
  Download,
  Heart,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function VideoCard({ video }) {
  const { redeemCode, videos, courses } = useData();
  const {
    currentUser,
    unlockVideo,
    unlockCourse,
    setCourseVideoLimit,
    toggleFavorite,
  } = useAuth();

  // Find parent course to check if it's free
  const parentCourse = courses.find((c) => c.id === video.course_id);

  // Helper to count how many videos the user has unlocked in this course
  const courseVideos = videos.filter((v) => v.course_id === video.course_id);
  const userUnlockedInThisCourseCount =
    currentUser?.unlocked_videos?.filter((vidId) =>
      courseVideos.some((cv) => cv.id === vidId),
    ).length || 0;

  const isUnlocked =
    currentUser?.role === "admin" ||
    currentUser?.unlocked_videos?.includes(video.id) ||
    currentUser?.unlocked_courses?.includes(video.course_id) ||
    parentCourse?.is_free ||
    !video.locked;

  const hasCourseLimitRemaining =
    (currentUser?.course_video_limits?.[video.course_id] || 0) >
    userUnlockedInThisCourseCount;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false); // For Player
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false); // For Code Entry
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'speed' | 'quality' | null
  const [isFavoriting, setIsFavoriting] = useState(false);

  const isFavorite = currentUser?.favorite_videos?.includes(video.id);

  // Custom Player State
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState("auto");

  // YouTube API initialization logic...

  const togglePlay = () => {
    if (!player || !isPlayerReady) return;
    setActiveMenu(null); // Close menus on interaction
    try {
      if (isPlaying) {
        if (typeof player.pauseVideo === "function") player.pauseVideo();
      } else {
        if (typeof player.playVideo === "function") player.playVideo();
      }
      // setIsPlaying updates are handled by onStateChange (YouTube) or onPlay/onPause (Local) events
    } catch (e) {
      console.error("Playback error", e);
    }
  };

  const toggleFullscreen = () => {
    const playerElement = document.getElementById(
      `video-container-${video.id}`,
    );
    if (!playerElement) return;

    if (!document.fullscreenElement) {
      playerElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Initialize YouTube API and Player
  useEffect(() => {
    if (!isOpen) {
      // Cleanup if closed
      return;
    }

    const loadPlayer = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = initPlayer;
        document.body.appendChild(tag);
      }
    };

    const initPlayer = () => {
      const newPlayer = new window.YT.Player(`youtube-player-${video.id}`, {
        videoId: video.youtube_video_id,
        playerVars: {
          autoplay: 1,
          controls: 0, // Disable native controls
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          disablekb: 1,
          fs: 0, // Disable fullscreen button
        },
        events: {
          onReady: (event) => {
            setDuration(event.target.getDuration());
            setAvailableQualities(event.target.getAvailableQualityLevels());
            setIsPlayerReady(true);
            // We don't auto-play here to avoid "playVideo is not a function"
            // if user interacts too fast before this event fires.
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            // Refresh quality levels whenever state changes, as they often populate after playback starts
            if (
              event.data === window.YT.PlayerState.PLAYING ||
              event.data === window.YT.PlayerState.BUFFERING
            ) {
              setAvailableQualities(event.target.getAvailableQualityLevels());
            }
          },
          onPlaybackQualityChange: (event) => {
            setCurrentQuality(event.data);
          },
        },
      });
      setPlayer(newPlayer);
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadPlayer, 100);

    // Sync Timer
    const interval = setInterval(() => {
      if (player && player.getCurrentTime) {
        setCurrentTime(player.getCurrentTime());
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      // Clean up player instance strictly? Re-rendering safety needed.
    };
  }, [isOpen, video.id]);

  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  // ... (previous state declarations)

  // Window Focus Handler for Anti-Recording Blur
  useEffect(() => {
    if (!isOpen) return;

    const handleBlur = () => {
      setIsWindowBlurred(true);
      if (isPlaying && player && player.pauseVideo) {
        // Optional: Auto-pause on blur
      }
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isOpen, isPlaying, player]);

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    if (player && typeof player.seekTo === "function") {
      player.seekTo(time, true);
      setCurrentTime(time);
    }
  };

  const changeSpeed = (rate) => {
    if (player) {
      player.setPlaybackRate(rate);
      setPlaybackRate(rate);
      setActiveMenu(null);
    }
  };

  const changeQuality = (quality) => {
    if (player) {
      player.setPlaybackQuality(quality);
      setCurrentQuality(quality);
      setActiveMenu(null);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleCardClick = async () => {
    if (isUnlocked) {
      setIsOpen(true);
      await trackView();
    } else if (!currentUser) {
      alert("Please login to unlock videos.");
      window.location.href = "/login";
    } else if (hasCourseLimitRemaining) {
      // Automatic unlock if user has remaining limit for this course
      await unlockVideo(video.id);
      setIsOpen(true);
      await trackView();
    } else {
      setIsUnlockModalOpen(true);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;
    setIsFavoriting(true);
    const res = await toggleFavorite(video.id);
    if (!res.success) {
      alert("Error: " + (res.message || "Could not update favorites"));
    }
    setIsFavoriting(false);
  };

  const trackView = async () => {
    try {
      await fetch("/api/video/view", {
        method: "POST",
        body: JSON.stringify({
          userId: currentUser?.id || "guest",
          videoId: video.id,
        }),
      });
    } catch (e) {
      console.error("Tracking error", e);
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError("");

    const result = await redeemCode(code, video.id);

    if (result.success) {
      let unlockResult;
      if (result.unlockType === "full") {
        unlockResult = await unlockCourse(video.course_id);
      } else if (result.unlockType === "limit") {
        await setCourseVideoLimit(video.course_id, result.videoLimit);
        unlockResult = await unlockVideo(video.id);
      } else {
        unlockResult = await unlockVideo(video.id);
      }

      if (unlockResult?.success === false) {
        setError(
          "Code valid, but profile update failed: " + unlockResult.message,
        );
        return;
      }

      setIsUnlockModalOpen(false);
      setIsOpen(true);
      await trackView();
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      {/* Video Card */}
      <Card
        className="cursor-pointer hover:shadow-xl transition-all duration-300 group overflow-hidden border-0 bg-gray-900 text-white"
        onClick={handleCardClick}
      >
        <CardContent className="p-0 relative">
          <AspectRatio ratio={16 / 9}>
            {video.banner_url ? (
              <img
                src={video.banner_url}
                alt={video.title}
                className={`object-cover w-full h-full transition duration-500 group-hover:scale-105 ${!isUnlocked ? "grayscale blur-[2px]" : ""}`}
              />
            ) : video.type === "upload" ? (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-gray-600">
                  <Play className="w-12 h-12 opacity-50" />
                </div>
              </div>
            ) : (
              <img
                src={`https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`}
                alt={video.title}
                className={`object-cover w-full h-full transition duration-500 group-hover:scale-105 ${!isUnlocked ? "grayscale blur-[2px]" : ""}`}
              />
            )}
          </AspectRatio>

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition">
            {isUnlocked ? (
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full group-hover:scale-110 transition">
                <Play className="fill-white text-white w-8 h-8" />
              </div>
            ) : (
              <div className="bg-black/60 backdrop-blur-md p-4 rounded-full group-hover:scale-110 transition flex flex-col items-center gap-2">
                <Lock className="text-white w-8 h-8" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  Locked
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardHeader className="p-4 bg-gray-950">
          <CardTitle className="text-base font-medium line-clamp-2 flex justify-between items-start gap-2">
            <span>{video.title}</span>
            <div className="flex items-center gap-1 shrink-0 mt-1">
              {currentUser && (
                <button
                  onClick={handleToggleFavorite}
                  disabled={isFavoriting}
                  className={`transition-all duration-300 transform hover:scale-125 ${isFavoriting ? "opacity-50" : "opacity-100"}`}
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-400"}`}
                  />
                </button>
              )}
              {!isUnlocked && <Lock className="w-4 h-4 text-gray-500" />}
            </div>
          </CardTitle>
          {video.instructor_name && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800">
              <img
                src={video.instructor_image || "https://github.com/shadcn.png"}
                alt={video.instructor_name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs text-gray-400">
                {video.instructor_name}
              </span>
            </div>
          )}
        </CardHeader>
        {video.pdf_url && (
          <div className="px-4 pb-4 pt-0 bg-gray-950 flex justify-end">
            <a
              href={video.pdf_url}
              download={video.pdf_name || "resource.pdf"}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              title="Download Attached Resource"
            >
              <FileText className="w-3 h-3" />
              <span>
                {video.pdf_name
                  ? video.pdf_name.length > 20
                    ? video.pdf_name.substring(0, 15) + "..."
                    : video.pdf_name
                  : "PDF Resource"}
              </span>
            </a>
          </div>
        )}
      </Card>

      {/* Unlock Modal */}
      <Dialog open={isUnlockModalOpen} onOpenChange={setIsUnlockModalOpen}>
        <DialogContent className="sm:max-w-md bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle>Unlock Video</DialogTitle>
            <DialogDescription>
              Enter your access code to watch <b>{video.title}</b>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUnlock} className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              placeholder="Enter Code (e.g. VIDEO2025)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Unlock Now
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Player Modal with Custom Controls */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setIsPlaying(false);
            setIsPlayerReady(false);
            setIsWindowBlurred(false); // Reset blur state
            if (document.fullscreenElement) document.exitFullscreen();
          }
        }}
      >
        <DialogContent
          className={`p-0 overflow-hidden bg-black border-gray-800 flex flex-col transition-all duration-500 ${isTheaterMode ? "max-w-7xl" : "sm:max-w-4xl"}`}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{video.title}</DialogTitle>
          </DialogHeader>

          <div
            id={`video-container-${video.id}`}
            className="relative group bg-black"
          >
            <AspectRatio ratio={16 / 9} className="bg-black relative">
              {video.type === "upload" ? (
                <video
                  id={`local-player-${video.id}`}
                  src={video.video_url}
                  poster={video.banner_url} // Added Poster
                  className="w-full h-full object-contain"
                  controlsList="nodownload"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  ref={(el) => {
                    if (el && !player) {
                      const localPlayerApi = {
                        playVideo: () => el.play(),
                        pauseVideo: () => el.pause(),
                        seekTo: (t) => {
                          if (el) el.currentTime = t;
                        },
                        getCurrentTime: () => (el ? el.currentTime : 0),
                        getDuration: () => (el ? el.duration : 0),
                        setPlaybackRate: (r) => {
                          if (el) el.playbackRate = r;
                        },
                        setPlaybackQuality: () => {},
                        getAvailableQualityLevels: () => [],
                      };
                      setPlayer(localPlayerApi);

                      const onReady = () => {
                        setDuration(el.duration);
                        setIsPlayerReady(true);
                      };

                      if (el.readyState >= 1) {
                        onReady();
                      } else {
                        el.addEventListener("loadedmetadata", onReady);
                      }
                    }
                  }}
                />
              ) : (
                <div
                  id={`youtube-player-${video.id}`}
                  className="w-full h-full"
                />
              )}

              {/* Dynamic Moving Watermark */}
              <MovingWatermark user={currentUser} />

              {/* Blur Overlay when Window is Not Focused */}
              <div
                className={`absolute inset-0 z-[70] bg-black/95 flex items-center justify-center backdrop-blur-xl transition-opacity duration-200 ${isWindowBlurred ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <div className="text-white text-center">
                  <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
                  <p className="font-bold text-2xl text-red-500">
                    SCREENSHOT PROTECTED
                  </p>
                  <p className="text-gray-400 mt-2">
                    Screenshots and Recording are prohibited.
                  </p>
                </div>
              </div>

              {/* Full Overlay to Block Direct Interaction & Handle Click-to-Play */}
              <div
                className="absolute inset-0 z-50 bg-transparent flex items-center justify-center cursor-pointer"
                onClick={togglePlay}
                onContextMenu={(e) => e.preventDefault()}
              >
                {/* Show Play Icon if Paused and hovered */}
                {!isPlaying && isPlayerReady && (
                  <div className="bg-black/50 rounded-full p-6 backdrop-blur-sm transition opacity-0 group-hover:opacity-100">
                    <Play className="fill-white text-white w-16 h-16" />
                  </div>
                )}
                {/* Show Spinner/Loading if not ready */}
                {!isPlayerReady && video.type !== "upload" && (
                  <div className="text-white font-bold opacity-50 animate-pulse text-xs uppercase tracking-widest">
                    Loading Secure Player...
                  </div>
                )}
              </div>
            </AspectRatio>

            {/* Custom Control Bar */}
            <div className="bg-gray-900 border-t border-gray-800 p-3 flex flex-wrap items-center gap-4 select-none">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-indigo-400 transition"
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="fill-current"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <Play className="fill-current" />
                )}
              </button>

              {/* Progress Bar */}
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />

              {/* Time */}
              <span className="text-xs text-gray-400 font-mono w-24 text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Quality Control */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextState =
                      activeMenu === "quality" ? null : "quality";
                    setActiveMenu(nextState);
                    if (
                      nextState === "quality" &&
                      player?.getAvailableQualityLevels
                    ) {
                      setAvailableQualities(player.getAvailableQualityLevels());
                    }
                  }}
                  className="text-xs font-bold text-gray-300 hover:text-white bg-gray-800 px-2 py-1 rounded uppercase min-w-[60px]"
                >
                  {currentQuality || "Auto"}
                </button>
                {activeMenu === "quality" && (
                  <div className="absolute bottom-full right-0 mb-2 w-32 bg-gray-900 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden border border-gray-700 z-[100] animate-in slide-in-from-bottom-2 duration-200">
                    <div className="p-2 border-b border-gray-800 text-[10px] font-black uppercase text-gray-500 text-center tracking-widest">
                      Quality
                    </div>
                    {availableQualities.length > 0 ? (
                      availableQualities.map((q) => (
                        <button
                          key={q}
                          onClick={() => changeQuality(q)}
                          className={`block w-full text-left px-4 py-3 text-xs hover:bg-indigo-600 transition-colors uppercase ${currentQuality === q ? "text-indigo-400 font-bold bg-indigo-500/10" : "text-gray-300"}`}
                        >
                          {q}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-xs text-gray-500 italic">
                        Auto Only
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Speed Control */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === "speed" ? null : "speed");
                  }}
                  className="text-xs font-bold text-gray-300 hover:text-white bg-gray-800 px-2 py-1 rounded min-w-[50px]"
                >
                  {playbackRate}x
                </button>
                {activeMenu === "speed" && (
                  <div className="absolute bottom-full right-0 mb-2 w-28 bg-gray-900 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden border border-gray-700 z-[100] animate-in slide-in-from-bottom-2 duration-200">
                    <div className="p-2 border-b border-gray-800 text-[10px] font-black uppercase text-gray-500 text-center tracking-widest">
                      Set Speed
                    </div>
                    {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changeSpeed(rate)}
                        className={`block w-full text-left px-4 py-3 text-xs hover:bg-indigo-600 transition-colors ${playbackRate === rate ? "text-indigo-400 font-bold bg-indigo-500/10" : "text-gray-300"}`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theater Mode Toggle */}
              <button
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className="text-gray-400 hover:text-white transition hidden md:block"
                title={isTheaterMode ? "Normal Mode" : "Theater Mode"}
              >
                {isTheaterMode ? (
                  <Shrink className="w-5 h-5" />
                ) : (
                  <Expand className="w-5 h-5" />
                )}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="text-gray-400 hover:text-white transition"
                title="Fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF Attachment Section */}
          {video.pdf_url && (
            <div className="bg-gray-950 p-4 border-t border-gray-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-red-500/10 p-2 rounded-lg shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-gray-200 truncate">
                    {video.pdf_name || "Attached Resource"}
                  </span>
                  <span className="text-xs text-gray-500">PDF Document</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={video.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold py-2 px-3 rounded-lg transition flex items-center gap-2"
                >
                  <FileText className="w-3 h-3" />
                  Open
                </a>
                <a
                  href={video.pdf_url}
                  download={video.pdf_name || "document.pdf"}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition flex items-center gap-2"
                >
                  <Download className="w-3 h-3" />
                  Download
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const MovingWatermark = ({ user }) => {
  const [position, setPosition] = useState({ top: "10%", left: "10%" });

  useEffect(() => {
    const move = () => {
      const top = Math.floor(Math.random() * 80) + 10; // 10% to 90%
      const left = Math.floor(Math.random() * 80) + 10;
      setPosition({ top: `${top}%`, left: `${left}%` });
    };

    // Move every 10 seconds (Slower)
    const interval = setInterval(move, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  return (
    <div
      className="absolute pointer-events-none z-[60] flex flex-col items-center justify-center transition-all duration-[10000ms] ease-in-out select-none opacity-30"
      style={{ top: position.top, left: position.left, pointerEvents: "none" }}
    >
      <div className="transform -rotate-12 bg-black/30 backdrop-blur-[2px] p-2 rounded-lg border border-white/5 shadow-sm">
        <p className="text-white/70 text-sm font-bold whitespace-nowrap drop-shadow-sm">
          {user.email || user.username}
        </p>
        <p className="text-white/40 text-[10px] font-mono text-center">
          ID: {user.id}
        </p>
      </div>
    </div>
  );
};
