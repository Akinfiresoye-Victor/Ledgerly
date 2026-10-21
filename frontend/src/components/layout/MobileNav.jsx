import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Upload,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export function MobileNav() {
  const items = [
    { name: "Dashboard", to: "/", icon: LayoutDashboard },
    { name: "Transactions", to: "/transactions", icon: Receipt },
    { name: "Upload", to: "/upload", icon: Upload, highlight: true },
    { name: "Chat", to: "/chat", icon: MessageSquare },
    { name: "Insights", to: "/insights", icon: Sparkles },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1 shadow-lg">
      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-[10px] font-medium transition-colors ${
                  isActive
                    ? "text-[#0F3A2E] font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-1.5 rounded-xl transition-all ${
                      item.highlight && isActive
                        ? "bg-[#0F3A2E] text-white"
                        : item.highlight
                        ? "bg-emerald-50 text-[#0F3A2E]"
                        : isActive
                        ? "bg-slate-100 text-[#0F3A2E]"
                        : ""
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <span className="mt-0.5 leading-none">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default MobileNav;
