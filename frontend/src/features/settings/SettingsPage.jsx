import React, { useState, useRef } from "react";
import {
  User,
  Building,
  Shield,
  Bell,
  CheckCircle2,
  Camera,
  KeyRound,
  Smartphone,
  Mail,
  MessageSquare,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../auth/AuthContext";

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("Profile");
  const [isSaved, setIsSaved] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || "Adeola Samuel",
    email: user?.email || "adebusiness@gmail.com",
    phone: "801 234 5678",
  });

  const [businessData, setBusinessData] = useState({
    businessName: user?.business_name || "Adeola's Electronics",
    businessType: user?.business_type || "Retail",
    cacNumber: "RC-1849204",
    address: user?.address || "12 Kingsway Road, Ikoyi",
    city: "Lagos",
    country: "Nigeria",
    currency: "NGN (₦)",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
  });

  const [notificationsData, setNotificationsData] = useState({
    emailReceipts: true,
    emailWeeklySummary: true,
    emailLowProfitAlerts: false,
    pushInstantExtraction: true,
    pushAuditAlerts: true,
    whatsappAlerts: true,
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        setAvatarPreview(result);
        updateUser({ avatar: result });
        showSaveSuccess("Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const showSaveSuccess = (message) => {
    setSavedMessage(message);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUser({
      full_name: profileData.fullName,
      email: profileData.email,
    });
    showSaveSuccess("Profile information updated successfully!");
  };

  const handleBusinessSubmit = (e) => {
    e.preventDefault();
    updateUser({
      business_name: businessData.businessName,
      business_type: businessData.businessType,
      address: businessData.address,
    });
    showSaveSuccess("Business details updated successfully!");
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    showSaveSuccess("Security settings updated successfully!");
    setSecurityData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handleNotificationsSubmit = (e) => {
    e.preventDefault();
    showSaveSuccess("Notification preferences saved successfully!");
  };

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Business", icon: Building },
    { name: "Security", icon: Shield },
    { name: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your account profile, business preferences, security, and alerts.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              type="button"
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#0F3A2E] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-semibold">
            {savedMessage || "Settings updated successfully!"}
          </p>
        </div>
      )}

      {activeTab === "Profile" && (
        <form onSubmit={handleProfileSubmit} className="space-y-6 animate-in fade-in duration-200">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Personal Profile
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your personal information and profile picture.
              </p>
            </div>

            <div className="flex items-center gap-4 py-2 border-y border-slate-100">
              <div className="relative group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="User Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#0F3A2E] text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-sm">
                    {user?.initials || "AS"}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-slate-200 shadow-sm text-slate-700 hover:text-emerald-700"
                  title="Change photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">
                  {profileData.fullName}
                </p>
                <p className="text-xs text-slate-400">
                  {user?.role || "Business Owner"} • {profileData.email}
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Change photo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full name"
                required
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullName: e.target.value })
                }
              />

              <Input
                label="Email address"
                type="email"
                required
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
              />
            </div>

            <div className="w-full flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Phone number (optional)
              </label>
              <div className="flex gap-2">
                <div className="w-24 shrink-0 flex items-center justify-center gap-1 min-h-[44px] px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                  <span>🇳🇬</span>
                  <span>+234</span>
                </div>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="md" className="px-6 font-semibold">
                Save Profile
              </Button>
            </div>
          </Card>
        </form>
      )}

      {activeTab === "Business" && (
        <form onSubmit={handleBusinessSubmit} className="space-y-6 animate-in fade-in duration-200">
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Business Information
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your enterprise details, tax identifiers, and official address.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business name"
                required
                value={businessData.businessName}
                onChange={(e) =>
                  setBusinessData({ ...businessData, businessName: e.target.value })
                }
              />

              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Business type
                </label>
                <select
                  value={businessData.businessType}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, businessType: e.target.value })
                  }
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E] font-medium"
                >
                  <option value="Retail">Retail &amp; Consumer Goods</option>
                  <option value="Services">Professional Services</option>
                  <option value="Wholesale">Wholesale &amp; Distribution</option>
                  <option value="Freelancer">Freelance &amp; Consulting</option>
                  <option value="Technology">Technology &amp; Software</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="CAC / Registration Number"
                value={businessData.cacNumber}
                onChange={(e) =>
                  setBusinessData({ ...businessData, cacNumber: e.target.value })
                }
                placeholder="e.g. RC-123456"
              />

              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Primary Ledger Currency
                </label>
                <select
                  value={businessData.currency}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, currency: e.target.value })
                  }
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E] font-medium"
                >
                  <option value="NGN (₦)">NGN (₦) - Nigerian Naira</option>
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                </select>
              </div>
            </div>

            <Input
              label="Business Address"
              value={businessData.address}
              onChange={(e) =>
                setBusinessData({ ...businessData, address: e.target.value })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                value={businessData.city}
                onChange={(e) =>
                  setBusinessData({ ...businessData, city: e.target.value })
                }
              />
              <Input
                label="Country"
                value={businessData.country}
                onChange={(e) =>
                  setBusinessData({ ...businessData, country: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="md" className="px-6 font-semibold">
                Save Business Details
              </Button>
            </div>
          </Card>
        </form>
      )}

      {activeTab === "Security" && (
        <form onSubmit={handleSecuritySubmit} className="space-y-6 animate-in fade-in duration-200">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Security &amp; Password
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your password, login credentials, and authentication layers.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Change Password</span>
              </div>

              <Input
                label="Current password"
                type="password"
                placeholder="Enter current password"
                value={securityData.currentPassword}
                onChange={(e) =>
                  setSecurityData({ ...securityData, currentPassword: e.target.value })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={securityData.newPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, newPassword: e.target.value })
                  }
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  placeholder="Confirm new password"
                  value={securityData.confirmPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900">
                    Two-Factor Authentication (2FA)
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Require an OTP verification code on login from unrecognized devices.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securityData.twoFactorEnabled}
                  onChange={(e) =>
                    setSecurityData({
                      ...securityData,
                      twoFactorEnabled: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F3A2E]" />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="md" className="px-6 font-semibold">
                Update Security
              </Button>
            </div>
          </Card>
        </form>
      )}

      {activeTab === "Notifications" && (
        <form onSubmit={handleNotificationsSubmit} className="space-y-6 animate-in fade-in duration-200">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Notification Preferences
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose how and when Ledgerly alerts you about business financial events.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>Email Notifications</span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: "emailReceipts",
                    title: "Receipt &amp; Invoice Processed",
                    desc: "Receive an email summary whenever AI reconciles uploaded documents.",
                  },
                  {
                    key: "emailWeeklySummary",
                    title: "Weekly Financial Digest",
                    desc: "Weekly overview of income, expenses, and net profit trends.",
                  },
                  {
                    key: "emailLowProfitAlerts",
                    title: "Profit Margin Anomalies",
                    desc: "Alerts when expenses surge or profits fall below target.",
                  },
                ].map(({ key, title, desc }) => (
                  <label
                    key={key}
                    className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{title}</p>
                      <p className="text-[11px] text-slate-500">{desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationsData[key]}
                      onChange={(e) =>
                        setNotificationsData({
                          ...notificationsData,
                          [key]: e.target.checked,
                        })
                      }
                      className="mt-0.5 rounded border-slate-300 text-[#0F3A2E] focus:ring-[#0F3A2E]"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Instant &amp; Mobile Alerts</span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: "pushInstantExtraction",
                    title: "Instant In-App Popups",
                    desc: "Show real-time toast alerts when receipts finish processing.",
                  },
                  {
                    key: "whatsappAlerts",
                    title: "WhatsApp Daily Balance Report",
                    desc: "Send daily closing balance and transactions to your WhatsApp.",
                  },
                ].map(({ key, title, desc }) => (
                  <label
                    key={key}
                    className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{title}</p>
                      <p className="text-[11px] text-slate-500">{desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationsData[key]}
                      onChange={(e) =>
                        setNotificationsData({
                          ...notificationsData,
                          [key]: e.target.checked,
                        })
                      }
                      className="mt-0.5 rounded border-slate-300 text-[#0F3A2E] focus:ring-[#0F3A2E]"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="md" className="px-6 font-semibold">
                Save Notification Preferences
              </Button>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}

export default SettingsPage;
