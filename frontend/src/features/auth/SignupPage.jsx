import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "./AuthContext";

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+234",
    phone: "",
    businessName: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email address is required";
    if (!formData.businessName.trim())
      newErrors.businessName = "Business name is required";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const res = await signup({
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone ? `${formData.countryCode} ${formData.phone}` : "",
      business_name: formData.businessName,
      password: formData.password,
    });
    setIsLoading(false);

    if (res.success) {
      navigate("/verify-otp");
    } else {
      setErrors({ form: res.error });
    }
  };

  return (
    <AuthLayout>
      {/* Step label + title */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Step 1 of 2
        </span>
        <h2 className="text-2xl sm:text-[1.75rem] font-extrabold text-slate-900 mt-1 leading-tight">
          Create your account
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Get started with Ledgerly in seconds.
        </p>
      </div>

      {/* Form error banner */}
      {errors.form && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {errors.form}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full name"
          required
          name="fullName"
          placeholder="e.g. Samz Keyz"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />

        <Input
          label="Email address"
          required
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        {/* Phone with Country Code */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Phone number (optional)
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className="w-[90px] shrink-0 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <span className="text-sm leading-none">🇳🇬</span>
              <span>+234</span>
              <svg className="w-3 h-3 text-slate-400 shrink-0" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. 801 234 5678"
              value={formData.phone}
              onChange={handleChange}
              className="w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E] transition-colors"
            />
          </div>
        </div>

        <Input
          label="Business name"
          required
          name="businessName"
          placeholder="e.g. Ade's Electronics"
          value={formData.businessName}
          onChange={handleChange}
          error={errors.businessName}
        />

        <Input
          label="Password"
          required
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full font-bold"
            style={{ fontSize: "15px" }}
          >
            Create account
          </Button>
        </div>
      </form>

      {/* Login link */}
      <p className="text-center text-xs text-slate-500 pt-1">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold text-[#0F3A2E] hover:text-emerald-700 hover:underline transition-colors"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default SignupPage;
