import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "../../components/ui/Card";
import { naira } from "../../lib/money";

export function MetricCard({
  title,
  amountKobo,
  changePct,
  changeLabel = "vs last month",
  isPositiveGood = true,
  className = "",
}) {
  const isUp = changePct?.startsWith("+") || changePct?.startsWith("↑");

  return (
    <Card className={`flex flex-col justify-between p-6 ${className}`}>
      <div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
          {naira(amountKobo)}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs">
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[11px] ${
            isUp
              ? "bg-[#DEF7EC] text-[#03543F]"
              : "bg-[#FDE8E8] text-[#9B1C1C]"
          }`}
        >
          {isUp ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {changePct}
        </span>
        <span className="text-slate-400 font-medium">{changeLabel}</span>
      </div>
    </Card>
  );
}

export default MetricCard;
