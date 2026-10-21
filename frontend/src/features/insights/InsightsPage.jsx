import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Users,
  Coins,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import Card from "../../components/ui/Card";
import { insightsApi } from "../../api/dashboard";
import { mockInsights } from "../../mocks/mockData";
import { naira } from "../../lib/money";

const ICONS = {
  trend: TrendingUp,
  users: Users,
  coin: Coins,
  alert: AlertTriangle,
};

const ICON_STYLES = {
  trend: "bg-emerald-50 text-emerald-600 border-emerald-100",
  users: "bg-sky-50 text-sky-600 border-sky-100",
  coin: "bg-amber-50 text-amber-600 border-amber-100",
  alert: "bg-orange-50 text-orange-600 border-orange-100",
};

export function InsightsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Spending", "Revenue", "Customers"];

  const { data: insights = mockInsights } = useQuery({
    queryKey: ["insights", activeTab],
    queryFn: async () => {
      try {
        const res = await insightsApi.list({ category: activeTab });
        return res.data;
      } catch {
        if (activeTab === "All") return mockInsights;
        return mockInsights.filter((i) => i.category === activeTab);
      }
    },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Useful insights about your business, updated weekly.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab
                ? "bg-[#0F3A2E] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Insights Cards List */}
      <div className="space-y-4">
        {insights.map((item) => {
          const Icon = ICONS[item.icon_type] || Lightbulb;
          const iconStyle =
            ICON_STYLES[item.icon_type] || "bg-emerald-50 text-emerald-600 border-emerald-100";

          return (
            <Card
              key={item.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${iconStyle} shadow-sm`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0F3A2E] transition-colors">
                      {item.title}
                    </h3>
                    {item.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.amount_kobo ? `${naira(item.amount_kobo)} · ` : ""}
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                <span className="text-[11px] font-semibold text-slate-400">
                  {item.date}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#0F3A2E] group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default InsightsPage;
