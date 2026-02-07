"use client";
import { useEffect } from "react";

export default function SecurityProvider({ children }) {
  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // 2. Disable Keyboard Shortcuts for DevTools & Print & Save
    const handleKeyDown = (e) => {
      // F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }

      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return;
      }

      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        return;
      }

      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        return;
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        return;
      }

      // Ctrl+S (Save Page) - Optional, maybe annoying but "secure"
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        return;
      }

      // Print Screen protection (Attempts to blank screen)
      if (e.key === "PrintScreen") {
        // Create a temporary overlay or hide body
        const body = document.querySelector("body");
        if (body) {
          body.style.visibility = "hidden"; // Instant hide
          setTimeout(() => {
            body.style.visibility = "visible";
            alert("Screenshots are disabled for security reasons.");
          }, 1000);
        }

        // Clear clipboard if possible (permissions usually block this without user gesture, but worth a try)
        try {
          navigator.clipboard.writeText("");
        } catch (err) {}
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    // document.addEventListener("keyup", handleKeyUp); // Sometimes PrintScreen fires on keyup

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="select-none print:hidden">
      {/* prevent selection for copy-paste */}
      {children}
    </div>
  );
}
