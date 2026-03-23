"use client";

import { useEffect, useState } from "react";
import Brand from "../utils/brand";
// Replace this import with your actual Brand component:
// import Brand from "@/components/utils/brand";

// ─── Temporary Brand placeholder — swap with your real import ─────────────────

// ─────────────────────────────────────────────────────────────────────────────

const MIN_DISPLAY_MS = 800; // always show preloader for at least this long

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const start = Date.now();

    const dismiss = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

      setTimeout(() => {
        setHiding(true);
        // Wait for fade-out animation to finish before unmounting
        setTimeout(() => setVisible(false), 600);
      }, remaining);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
      return () => window.removeEventListener("load", dismiss);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        bg-white dark:bg-black
        transition-opacity duration-600 ease-in-out
        ${hiding ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
      style={{ transitionDuration: "600ms" }}
    >
      {/* Brand */}
      <div
        className={`
          flex flex-col items-center gap-6
          transition-all duration-500
          brightness-0 opacity-80 hover:opacity-100 transition-opacity w-fit
          ${hiding ? "scale-95 opacity-0" : "scale-100 opacity-100"}
        `}
        style={{ transitionDuration: "500ms" }}
      >
                <Brand className="h-8 w-auto" />

        {/* Thin animated progress line */}
        <div className="w-32 h-px bg-black/10 dark:bg-white/10 overflow-hidden rounded-full">
          <div className="h-full bg-black dark:bg-white rounded-full animate-progress" />
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 70%;  margin-left: 10%; }
          100% { width: 0%;   margin-left: 100%; }
        }
        .animate-progress {
          animation: progress 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}