import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { formatNairaCompact } from "../../lib/money";

export function ChatInlineChart({
  title = "Transport Spending",
  total = "₦ 164,500",
  change = "+22% vs Aug",
  data = [
    { day: "Sep 1", amount: 15000 },
    { day: "Sep 7", amount: 35000 },
    { day: "Sep 14", amount: 28000 },
    { day: "Sep 21", amount: 48500 },
    { day: "Sep 28", amount: 38000 },
  ],
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 my-3 shadow-subtle max-w-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{title}</h4>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-extrabold text-slate-900">{total}</span>
          {change && (
            <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
              <ArrowUpRight className="w-3 h-3" />
              {change}
            </span>
          )}
        </div>
      </div>

      <div className="h-44 w-full mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="day"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                if (val === 0) return "0";
                return `${val / 1000}k`;
              }}
            />
            <Tooltip
              formatter={(val) => [`₦ ${val.toLocaleString()}`, "Amount"]}
              contentStyle={{
                backgroundColor: "#0F172A",
                color: "#F8FAFC",
                borderRadius: "0.5rem",
                border: "none",
                fontSize: "11px",
              }}
            />
            <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChatInlineChart;
