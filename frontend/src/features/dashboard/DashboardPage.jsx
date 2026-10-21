import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronDown, RefreshCw } from "lucide-react";
import { dashboardApi } from "../../api/dashboard";
import { useAuth } from "../auth/AuthContext";
import MetricCard from "./MetricCard";
import IncomeExpenseChart from "./IncomeExpenseChart";
import CategoryDonutChart from "./CategoryDonutChart";
import RecentActivityFeed from "./RecentActivityFeed";
import AiInsightBanner from "./AiInsightBanner";
import { CardSkeleton } from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import { mockDashboardSummary } from "../../mocks/mockData";

export function DashboardPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("Sep 1, 2026 - Sep 30, 2026");

  const {
    data: summaryData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-summary", dateRange],
    queryFn: async () => {
      try {
        const res = await dashboardApi.getSummary({ range: dateRange });
        return res.data;
      } catch (err) {
        // Fallback to mock data for resilient offline development
        return mockDashboardSummary;
      }
    },
    staleTime: 60 * 1000,
  });

  const data = summaryData || mockDashboardSummary;
  const firstName = user?.full_name?.split(" ")[0] || "Adeola";

  return (
    <div className="space-y-6">
      {/* Top Greeting & Date Range Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Good morning, {firstName}</span>
            <span role="img" aria-label="wave">
              👏
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative inline-flex items-center self-start sm:self-auto">
          <button
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-subtle hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]/20 transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {isError && (
        <ErrorState
          title="Could not load dashboard metrics"
          message="Please check your connection and try again."
          onRetry={refetch}
        />
      )}

      {/* 3 Metric Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <MetricCard
            title="Total Income"
            amountKobo={data.metrics.total_income_kobo}
            changePct={data.metrics.income_change_pct}
          />
          <MetricCard
            title="Total Expenses"
            amountKobo={data.metrics.total_expenses_kobo}
            changePct={data.metrics.expenses_change_pct}
          />
          <MetricCard
            title="Net Profit"
            amountKobo={data.metrics.net_profit_kobo}
            changePct={data.metrics.profit_change_pct}
          />
        </div>
      )}

      {/* Charts Dual Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={data.income_vs_expenses} />
        </div>
        <div className="lg:col-span-1">
          <CategoryDonutChart
            data={data.spending_by_category}
            totalDisplay={data.total_spending_display}
          />
        </div>
      </div>

      {/* AI Insight & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 space-y-4">
          <AiInsightBanner
            text={data.ai_insight.text}
            actionLabel={data.ai_insight.action_label}
            actionUrl={data.ai_insight.action_url}
          />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed activities={data.recent_activity} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
