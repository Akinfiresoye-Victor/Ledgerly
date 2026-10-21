import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Upload,
  MessageSquare,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react";
import BrandLogo from "../ui/BrandLogo";
import { useAuth } from "../../features/auth/AuthContext";

export function Sidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", to: "/", icon: LayoutDashboard },
    { name: "Transactions", to: "/transactions", icon: Receipt },
    { name: "Upload", to: "/upload", icon: Upload },
    { name: "Chat", to: "/chat", icon: MessageSquare },
    { name: "Insights", to: "/insights", icon: Sparkles },
    { name: "Settings", to: "/settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#08281F] text-white h-screen sticky top-0 shrink-0 border-r border-[#0D382B] select-none z-20">
      <div className="p-6 pb-8">
        <BrandLogo variant="light" size="lg" />
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-[#113C2F] text-white shadow-inner font-semibold border-l-4 border-emerald-400 pl-3"
                    : "text-emerald-100/70 hover:bg-[#0D3529] hover:text-white"
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0 opacity-90" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#0D382B]">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#0D3529] transition-colors group">
          <NavLink to="/settings" className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.initials || "AS"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.full_name || "Adeola Samuel"}
              </p>
              <p className="text-[11px] text-emerald-200/60 truncate">
                {user?.role || "Business Owner"}
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={logout}
            title="Log out"
            className="p-1.5 text-emerald-300/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
