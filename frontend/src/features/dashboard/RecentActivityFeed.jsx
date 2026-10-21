import React from "react";
import { Link } from "react-router-dom";
import { Receipt, ArrowUpRight, ArrowDownLeft, Fuel, Building2 } from "lucide-react";
import Card from "../../components/ui/Card";
import { naira } from "../../lib/money";

const ICONS = {
  receipt: Receipt,
  transfer: ArrowUpRight,
  payment: ArrowDownLeft,
  fuel: Fuel,
};

export function RecentActivityFeed({ activities = [] }) {
  return (
    <Card className="p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {activities.map((item) => {
            const Icon = ICONS[item.icon] || Receipt;
            const isExpense = item.type === "expense";

            return (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isExpense
                        ? "bg-rose-50 text-rose-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#0F3A2E] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.date}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-extrabold ${
                      isExpense ? "text-slate-800" : "text-emerald-700"
                    }`}
                  >
                    {isExpense ? "-" : "+"}
                    {naira(item.amount_kobo)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-right">
        <Link
          to="/transactions"
          className="text-xs font-bold text-[#0F3A2E] hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
        >
          View details →
        </Link>
      </div>
    </Card>
  );
}

export default RecentActivityFeed;
