import React from "react";

export function BrandLogo({ variant = "dark", size = "md", className = "" }) {
  const isLight = variant === "light";
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  };

  const textClasses = {
    sm: "text-base font-semibold",
    md: "text-lg font-bold tracking-tight",
    lg: "text-xl font-bold tracking-tight",
    xl: "text-2xl font-extrabold tracking-tight",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* 3-layer stacked isometric ledger icon matching mockup */}
      <div className={`${sizeClasses[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Top Layer */}
          <path
            d="M14 2L24.5 7.5L14 13L3.5 7.5L14 2Z"
            fill="#34D399"
          />
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

      <span
        className={`${textClasses[size]} ${
          isLight ? "text-white" : "text-[#0F3A2E]"
        } font-bold`}
      >
        Ledgerly
      </span>
    </div>
  );
}

export default BrandLogo;
