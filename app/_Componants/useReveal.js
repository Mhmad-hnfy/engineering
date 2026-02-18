"use client";
import { useEffect } from "react";

export default function useReveal(deps = []) {
  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll(".animate-reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };

    window.addEventListener("scroll", reveal);
    reveal(); // Initial check

    return () => window.removeEventListener("scroll", reveal);
  }, deps);
}
