import React from "react";
import { ArrowUpRight, ArrowDownRight, CheckCircle2, AlertCircle } from "lucide-react";

export function Badge({
  children,
  variant = "default",
  size = "md",
  icon = null,
  className = "",
}) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-semibold",
  };

  const variants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200/60",
    confirmed: "bg-[#DEF7EC] text-[#03543F] border border-[#DEF7EC]",
    income: "bg-[#DEF7EC] text-[#03543F] border border-[#BCF0DA]",
    expense: "bg-[#FDE8E8] text-[#9B1C1C] border border-[#FBD5D5]",
    warning: "bg-[#FEF08A] text-[#854D0E] border border-[#FDE047]",
    danger: "bg-[#FDE8E8] text-[#9B1C1C] border border-[#FBD5D5]",
    neutral: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    positiveTrend: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
    negativeTrend: "bg-rose-50 text-rose-700 border border-rose-200/50",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full whitespace-nowrap ${sizeClasses[size]} ${variants[variant]} ${className}`}
    >
      {variant === "confirmed" && <CheckCircle2 className="w-3 h-3 text-[#03543F]" />}
      {variant === "warning" && <AlertCircle className="w-3 h-3 text-[#854D0E]" />}
      {icon}
      {children}
    </span>
  );
}

export function CategoryBadge({ category }) {
  // Category colors matching mockup pills
  const categoryStyles = {
    "Food & Meals": "bg-orange-100/70 text-orange-800 border-orange-200",
    "Inventory": "bg-purple-100/70 text-purple-800 border-purple-200",
    "Income": "bg-emerald-100/70 text-emerald-800 border-emerald-200",
    "Utilities": "bg-amber-100/70 text-amber-800 border-amber-200",
    "Transport": "bg-sky-100/70 text-sky-800 border-sky-200",
    "Fuel and Diesel": "bg-rose-100/70 text-rose-800 border-rose-200",
    "Other": "bg-slate-100 text-slate-700 border-slate-200",
  };

  const style = categoryStyles[category] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${style}`}>
      {category}
    </span>
  );
}

export default Badge;
