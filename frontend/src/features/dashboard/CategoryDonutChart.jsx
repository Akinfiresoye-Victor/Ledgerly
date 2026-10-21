import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "../../components/ui/Card";
import { naira } from "../../lib/money";

const COLORS = ["#10B981", "#F59E0B", "#3B82F6", "#8B5CF6", "#64748B"];

/**
 * Custom Tooltip Component for Spending by Category Pie/Donut Chart.
 * Explicitly solid, 100% opaque dark-green background with mint text
 * and elevated z-index so it never appears transparent or overlaps with center text.
 */
function CustomCategoryTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    const item = data.payload || {};
    const name = data.name || item.name || "Category";
    const value = data.value !== undefined ? data.value : item.value;
    const amountKobo = item.amount_kobo;
    const color = data.fill || item.color || "#10B981";

    return (
      <div
        className="bg-[#07241B] text-white px-3.5 py-2.5 rounded-xl border border-emerald-500/50 shadow-[0_12px_30px_rgba(0,0,0,0.8)] text-xs space-y-1 select-none pointer-events-none"
        style={{ backgroundColor: "#07241B", opacity: 1 }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: color }}
          />
          <span className="font-bold text-white text-xs tracking-tight">
            {name}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[11px] pt-0.5">
          <span className="text-[#80EBB4] font-extrabold tracking-wide">
            {value}%
          </span>
          {amountKobo ? (
            <span className="text-slate-200 font-semibold font-mono">
              {naira(amountKobo)}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
  return null;
}

export function CategoryDonutChart({
  data = [],
  totalDisplay = "₦ 1.32M",
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <Card className="p-6">
      <div className="pb-4">
        <h3 className="text-base font-bold text-slate-900">Spending by Category</h3>
      </div>

      <div className="relative h-56 w-full flex items-center justify-center">
        {/* Center Display: Sits at z-0 behind the chart and tooltip */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 transition-all duration-200">
          {hoveredItem ? (
            <div className="flex flex-col items-center text-center animate-in fade-in duration-150">
              <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[90px]">
                {hoveredItem.name}
              </span>
              <span className="text-base font-extrabold text-[#0F3A2E] tracking-tight">
                {hoveredItem.value}%
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <span className="text-xs text-slate-400 font-medium">Total</span>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                {totalDisplay}
              </span>
            </div>
          )}
        </div>

        {/* ResponsiveContainer with Recharts Pie & Tooltip at z-10 */}
        <ResponsiveContainer width="100%" height="100%" className="relative z-10">
          <PieChart>
            <Tooltip
              wrapperStyle={{ zIndex: 9999, pointerEvents: "none" }}
              content={<CustomCategoryTooltip />}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                  stroke={hoveredIndex === index ? "#ffffff" : "none"}
                  strokeWidth={hoveredIndex === index ? 2 : 0}
                  className="transition-all duration-200"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend list */}
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
        {data.map((item, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between text-xs p-1 rounded-lg transition-colors cursor-pointer ${
                isHovered ? "bg-slate-50 font-bold" : ""
              }`}
            >
              <div className="flex items-center gap-2 text-slate-600">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: item.color || COLORS[index % COLORS.length],
                  }}
                />
                <span
                  className={`font-medium ${
                    isHovered ? "text-slate-900 font-bold" : "text-slate-700"
                  }`}
                >
                  {item.name}
                </span>
              </div>
              <span
                className={`font-bold ${
                  isHovered ? "text-emerald-700" : "text-slate-900"
                }`}
              >
                {item.value}%
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default CategoryDonutChart;
