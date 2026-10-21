import React from 'react';

/**
 * BrandPanel - Left brand panel featuring the restored brand header,
 * clean typography, and a live animated SVG/CSS smartphone component
 * with moving charts, pulsing metrics, donut ring, and AI insights.
 */
export function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 min-h-screen relative flex-col justify-between p-8 xl:p-12 bg-[#06231A] text-white overflow-hidden select-none">
      {/* ── Ambient Soft Glows & Organic Wave Background ── */}
      <div className="absolute -top-24 -left-24 w-[450px] h-[450px] bg-[#80EBB4]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-28 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-[480px] h-[480px] bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#80EBB4]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative smooth ambient curves */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,180 C280,60 220,520 520,380 C820,240 720,720 1000,620 L1000,1000 L0,1000 Z"
          fill="#0D3B2C"
          fillOpacity="0.5"
        />
        <path
          d="M0,480 C360,320 300,680 660,530 C860,430 800,820 1000,770 L1000,1000 L0,1000 Z"
          fill="#082A1F"
          fillOpacity="0.6"
        />
      </svg>

      {/* ── 1. Top Brand Header & Copy ── */}
      <div className="relative z-20 space-y-4 max-w-md">
        {/* Top Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 flex items-center justify-center">
            <svg
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path d="M14 2L24.5 7.5L14 13L3.5 7.5L14 2Z" fill="#34D399" />
              <path
                d="M3.5 11.2L14 16.7L24.5 11.2V13.8L14 19.3L3.5 13.8V11.2Z"
                fill="#10B981"
              />
              <path
                d="M3.5 16.8L14 22.3L24.5 16.8V19.4L14 24.9L3.5 19.4V16.8Z"
                fill="#059669"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Ledgerly
          </span>
        </div>

        {/* Main Heading & Subtext */}
        <div className="space-y-1.5">
          <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white leading-snug">
            Turn your receipts into{' '}
            <span className="text-[#80EBB4]">real insights.</span>
          </h1>
          <p className="text-slate-300 text-xs xl:text-sm leading-relaxed">
            Upload receipts, statements &amp; transfers. Let AI handle the heavy
            lifting.
          </p>
        </div>
      </div>

      {/* ── 2. Live Animated Smartphone Component ── */}
      <div className="relative z-10 w-full max-w-[320px] xl:max-w-[345px] mx-auto my-2 scale-95 origin-center animate-float-slow">
        {/* Smartphone Hardware Frame */}
        <div className="border-[7px] border-slate-800 rounded-[38px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-white overflow-hidden relative text-slate-900">
          
          {/* Top Notch & Status Bar */}
          <div className="bg-[#04281E] px-4 pt-1.5 pb-2 text-white relative">
            <div className="flex items-center justify-between text-[10px] font-semibold tracking-tight text-slate-200 px-1">
              <span>9:41</span>
              {/* Dynamic Island Pill */}
              <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span className="text-[9px]">5G</span>
                <div className="w-3.5 h-2 border border-slate-200 rounded-sm p-0.2">
                  <div className="w-2 h-full bg-emerald-400 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Inner App Header */}
            <div className="flex items-center justify-between mt-2 pt-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
                    <path d="M14 2L24.5 7.5L14 13L3.5 7.5L14 2Z" fill="#34D399" />
                    <path d="M3.5 11.2L14 16.7L24.5 11.2V13.8L14 19.3L3.5 13.8V11.2Z" fill="#10B981" />
                    <path d="M3.5 16.8L14 22.3L24.5 16.8V19.4L14 24.9L3.5 19.4V16.8Z" fill="#059669" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-white tracking-tight">Ledgerly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-[10px]">
                  🔔
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                  A
                </div>
              </div>
            </div>
          </div>

          {/* Phone Screen Scrollable/Content Body */}
          <div className="p-3 bg-slate-50/80 space-y-2.5">
            {/* User Greeting */}
            <div>
              <p className="text-[11px] font-extrabold text-slate-900 leading-tight">
                Good morning, Adeola 👋
              </p>
              <p className="text-[9px] text-slate-500">
                Here's what's happening with your business today.
              </p>
            </div>

            {/* A. Live Pulsing Metric Badges */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-2 animate-live-metric transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-500 font-medium">Total Income</span>
                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-100/80 px-1 rounded">↗ 12%</span>
                </div>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                  ₦ 2,450,000
                </p>
                <p className="text-[8px] text-slate-400 mt-0.5">vs last month</p>
              </div>

              <div className="bg-teal-50/70 border border-teal-200/60 rounded-xl p-2 animate-live-metric transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-500 font-medium">Net Profit</span>
                  <span className="text-[9px] text-teal-600 font-bold bg-teal-100/80 px-1 rounded">↗ 15%</span>
                </div>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                  ₦ 1,130,000
                </p>
                <p className="text-[8px] text-slate-400 mt-0.5">vs last month</p>
              </div>
            </div>

            {/* B. Live Animated SVG Line Graph (Business Overview) */}
            <div className="bg-white rounded-xl p-2.5 border border-slate-200/70 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-800">Business Overview</span>
                <span className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                  This Month ▾
                </span>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[8px] text-slate-500 mb-1">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Income
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Expenses
                </span>
              </div>

              {/* Animated Line Graph SVG */}
              <div className="relative h-16 w-full overflow-hidden pt-1">
                <svg
                  viewBox="0 0 280 70"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="15" x2="280" y2="15" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="40" x2="280" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="65" x2="280" y2="65" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Expenses (Orange) Area & Line with Pulse */}
                  <g className="animate-graph-pulse-alt">
                    <path
                      d="M0,52 Q40,58 70,45 T140,50 T210,38 T280,44 L280,70 L0,70 Z"
                      fill="url(#expenseGrad)"
                    />
                    <path
                      d="M0,52 Q40,58 70,45 T140,50 T210,38 T280,44"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Income (Green) Area & Line with Pulse */}
                  <g className="animate-graph-pulse">
                    <path
                      d="M0,42 Q40,32 70,22 T140,28 T210,14 T280,18 L280,70 L0,70 Z"
                      fill="url(#incomeGrad)"
                    />
                    <path
                      d="M0,42 Q40,32 70,22 T140,28 T210,14 T280,18"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between text-[7px] text-slate-400 mt-1 px-1">
                <span>Sep 1</span>
                <span>Sep 7</span>
                <span>Sep 14</span>
                <span>Sep 21</span>
                <span>Sep 30</span>
              </div>
            </div>

            {/* C. Spending by Category Donut Ring */}
            <div className="bg-white rounded-xl p-2 border border-slate-200/70 shadow-2xs">
              <span className="text-[9px] font-bold text-slate-800 block mb-1">
                Spending by Category
              </span>
              <div className="flex items-center justify-between gap-2">
                {/* SVG Donut Ring */}
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {/* Ring 1 - Transport (Green) 38% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="5"
                      strokeDasharray="38 62"
                      strokeDashoffset="0"
                    />
                    {/* Ring 2 - Meals (Purple) 22% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="5"
                      strokeDasharray="22 78"
                      strokeDashoffset="-38"
                    />
                    {/* Ring 3 - Utilities (Orange) 15% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="5"
                      strokeDasharray="15 85"
                      strokeDashoffset="-60"
                    />
                    {/* Ring 4 - Others (Blue) 25% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="5"
                      strokeDasharray="25 75"
                      strokeDashoffset="-75"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[7px] font-bold text-slate-800 leading-none">₦1.32M</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="text-[8px] space-y-0.5 text-slate-600 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Transport
                    </span>
                    <span className="font-semibold text-slate-700">38%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Food &amp; Meals
                    </span>
                    <span className="font-semibold text-slate-700">22%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Utilities
                    </span>
                    <span className="font-semibold text-slate-700">15%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* D. AI Insight Pill */}
            <div className="bg-emerald-50 border border-emerald-300/80 rounded-xl p-2 flex items-center justify-between text-[9px] shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">💡</span>
                <div>
                  <span className="font-bold text-emerald-950 block leading-tight">Insight</span>
                  <span className="text-emerald-800 text-[8px] leading-tight">
                    Your transport spending is up 30% this month.
                  </span>
                </div>
              </div>
              <span className="text-emerald-700 font-bold text-xs">›</span>
            </div>
          </div>

          {/* Bottom App Navigation Bar */}
          <div className="bg-white border-t border-slate-100 px-4 py-2 flex items-center justify-between text-slate-400">
            <div className="flex flex-col items-center text-emerald-600">
              <span className="text-xs">🏠</span>
              <span className="text-[7px] font-bold">Home</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600">
              <span className="text-xs">⇄</span>
              <span className="text-[7px]">Txns</span>
            </div>
            {/* Center + Action button */}
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-md -mt-3">
              +
            </div>
            <div className="flex flex-col items-center hover:text-slate-600">
              <span className="text-xs">💬</span>
              <span className="text-[7px]">Chat</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600">
              <span className="text-xs">⋯</span>
              <span className="text-[7px]">More</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Bottom Subtle Copyright/Branding Footer ── */}
      <div className="relative z-20 flex items-center justify-between text-[11px] text-emerald-200/50 pt-2 border-t border-emerald-500/10">
        <span>© 2026 Ledgerly Inc.</span>
        <span>AI-powered bookkeeping OS</span>
      </div>
    </div>
  );
}

export default BrandPanel;
