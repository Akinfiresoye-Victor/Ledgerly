import React, { useState, useEffect } from "react";

/**
 * Ledgerly Workspace Setup & Authentication Loading Screen
 *
 * Implements the pixel-perfect design from "Ledgerly Workspace Setup.png":
 * - Background gradient (#031E16 to #0A2E23) with ambient corner wave ribbons
 * - Top: 3-layer isometric icon + "Ledgerly" + "Your business. In better numbers."
 * - Center: Circular dark badge with 3-layer stacked icon & continuous rotating glowing green ring
 *
 * Supports two distinct modes:
 * A) mode="initial" (Full Progress Bar Flow)
 *    - Shows logo, title "Setting up your workspace...", "This won't take long.",
 *      and the 7-second horizontal progress bar (0% -> 100% over 7s).
 * B) mode="auth" (Post-OTP & Post-Login Loading Flow)
 *    - Shows ONLY the centered circular badge with the rotating glowing green ring.
 *    - Hides the progress bar and subtitle. Visible for exactly 4s, then redirects to dashboard.
 */
export function LoadingScreen({ mode = "initial", duration, onComplete }) {
  const isInitial = mode === "initial";
  const totalDuration = duration || (isInitial ? 6000 : 4000);

  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    let animationFrameId;

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(pct);

      if (elapsed < totalDuration) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Begin smooth fade-out
        setIsFadingOut(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [totalDuration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden transition-opacity duration-500 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: "#031E16",
        backgroundImage: "url('/workspace-setup-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ── TOP: Brand Logo & Tagline (Shown in Initial flow) ── */}
      <div className="w-full flex flex-col items-center pt-8 sm:pt-14">
        {isInitial && (
          <div className="flex flex-col items-center text-center animate-fadeIn">
            {/* 3-Layer Stacked Ledgerly Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 mb-2 flex items-center justify-center">
              <svg
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[0_4px_12px_rgba(52,211,153,0.35)]"
              >
                {/* Top Layer */}
                <path d="M14 2L24.5 7.5L14 13L3.5 7.5L14 2Z" fill="#34D399" />
                {/* Middle Layer */}
                <path
                  d="M3.5 11.2L14 16.7L24.5 11.2V13.8L14 19.3L3.5 13.8V11.2Z"
                  fill="#10B981"
                />
                {/* Bottom Layer */}
                <path
                  d="M3.5 16.8L14 22.3L24.5 16.8V19.4L14 24.9L3.5 19.4V16.8Z"
                  fill="#059669"
                />
              </svg>
            </div>

            {/* Brand Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Ledgerly
            </h1>

            {/* Tagline */}
            <p className="mt-2 text-xs sm:text-sm text-emerald-100/70 font-medium tracking-wide">
              Your business. In better numbers.
            </p>
          </div>
        )}
      </div>

      {/* ── CENTER: Circular Badge & Rotating Glowing Ring ── */}
      <div className="flex flex-col items-center text-center -mt-6 sm:-mt-10">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          {/* Subtle Ambient Behind-Badge Glow */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />

          {/* Continuous Rotating Glowing Green Neon Arc Ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: "1.8s", animationTimingFunction: "linear" }}
            viewBox="0 0 100 100"
          >
            {/* Background faint ring track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(16, 185, 129, 0.15)"
              strokeWidth="2"
            />
            {/* Bright Glowing Active Arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#34D399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="90 200"
              style={{
                filter: "drop-shadow(0 0 6px rgba(52, 211, 153, 0.9))",
              }}
            />
          </svg>

          {/* Center Circular Badge */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#032018]/90 border border-emerald-500/20 backdrop-blur-md flex items-center justify-center p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="w-9 h-9 sm:w-11 sm:h-11">
              <svg
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Top Layer */}
                <path d="M14 2L24.5 7.5L14 13L3.5 7.5L14 2Z" fill="#34D399" />
                {/* Middle Layer */}
                <path
                  d="M3.5 11.2L14 16.7L24.5 11.2V13.8L14 19.3L3.5 13.8V11.2Z"
                  fill="#10B981"
                />
                {/* Bottom Layer */}
                <path
                  d="M3.5 16.8L14 22.3L24.5 16.8V19.4L14 24.9L3.5 19.4V16.8Z"
                  fill="#059669"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Subtitle & Progress Bar (ONLY shown in Initial Flow A) ── */}
        {isInitial && (
          <div className="mt-8 flex flex-col items-center animate-fadeIn">
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-normal">
              Setting up your workspace...
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/60 font-normal">
              This won't take long.
            </p>

            {/* 7-Second Horizontal Progress Bar */}
            <div className="w-56 sm:w-64 h-1 sm:h-1.5 bg-[#063327]/80 rounded-full overflow-hidden mt-5 p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-[#34D399] to-emerald-300 rounded-full transition-all ease-linear"
                style={{
                  width: `${progress}%`,
                  boxShadow: "0 0 10px rgba(52, 211, 153, 0.7)",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM SPACER ── */}
      <div className="w-full pb-4 sm:pb-8 flex justify-center">
        {/* Intentionally empty for exact visual vertical balance matching the mockup */}
      </div>
    </div>
  );
}

export default LoadingScreen;
