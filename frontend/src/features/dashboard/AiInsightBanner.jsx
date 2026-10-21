import React from "react";
import { Link } from "react-router-dom";
import { Lightbulb, ArrowRight } from "lucide-react";

export function AiInsightBanner({
  text = "Your transport spending is up 38% this month compared to last month.",
  actionLabel = "View details →",
  actionUrl = "/insights",
}) {
  return (
    <div className="bg-[#DEF7EC]/80 border border-[#BCF0DA] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-white text-[#03543F] border border-[#BCF0DA] flex items-center justify-center shrink-0 shadow-sm">
          <Lightbulb className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#03543F]">
            AI Insight
          </span>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">
            {text}
          </p>
        </div>
      </div>

      <Link
        to={actionUrl}
        className="text-xs font-bold text-[#03543F] hover:text-emerald-800 shrink-0 inline-flex items-center gap-1.5 self-end sm:self-auto hover:underline"
      >
        <span>{actionLabel}</span>
      </Link>
    </div>
  );
}

export default AiInsightBanner;
