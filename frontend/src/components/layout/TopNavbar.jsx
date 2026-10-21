import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Receipt,
  TrendingUp,
  ShieldCheck,
  Building,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../ui/BrandLogo";
import { useAuth } from "../../features/auth/AuthContext";

export function TopNavbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const navRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      icon: Receipt,
      iconColor: "text-emerald-600 bg-emerald-50",
      title: "Receipt Processed",
      message: "GoodLife Mart (₦45,000) was extracted and categorized.",
      time: "10 mins ago",
      unread: true,
    },
    {
      id: "notif-2",
      icon: TrendingUp,
      iconColor: "text-teal-600 bg-teal-50",
      title: "Net Profit Increased",
      message: "Your monthly profit margin is up 12% vs last month.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: "notif-3",
      icon: ShieldCheck,
      iconColor: "text-blue-600 bg-blue-50",
      title: "Security Login Alert",
      message: "New login verified from Chrome on Windows (Lagos, Nigeria).",
      time: "Yesterday",
      unread: true,
    },
    {
      id: "notif-4",
      icon: Building,
      iconColor: "text-purple-600 bg-purple-50",
      title: "Bank Statement Reconciled",
      message: "14 transactions synced with your Stanbic IBTC account.",
      time: "2 days ago",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/transactions?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4"
    >
      {/* Mobile brand indicator */}
      <div className="flex items-center gap-3 md:hidden">
        <BrandLogo size="sm" />
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions, receipts, vendors..."
            className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm bg-slate-50 border border-slate-200/80 rounded-xl placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E] transition-all"
          />
        </div>
      </form>

      {/* Right controls */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Notification Bell with Interactive Dropdown */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setMenuOpen(false);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notification Dropdown Menu */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95">
              {/* Dropdown Header */}
              <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all as read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                        item.unread ? "bg-emerald-50/20" : ""
                      }`}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === item.id ? { ...n, unread: false } : n
                          )
                        );
                      }}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                          {item.message}
                        </p>
                      </div>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 text-center">
                <Link
                  to="/settings"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-semibold text-[#0F3A2E] hover:underline"
                >
                  Manage notification preferences →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.full_name || "User"}
                className="w-8 h-8 rounded-full object-cover border border-emerald-500/30 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#0F3A2E] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {user?.initials || "AS"}
              </div>
            )}
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.full_name || "Adeola Samuel"}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {user?.role || "Business Owner"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* User Menu Dropdown */}
          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95"
              onClick={() => setMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-xs font-bold text-slate-800">
                  {user?.full_name || "Adeola Samuel"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {user?.role || "Business Owner"}
                </p>
              </div>

              <Link
                to="/settings"
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Profile &amp; Settings
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
