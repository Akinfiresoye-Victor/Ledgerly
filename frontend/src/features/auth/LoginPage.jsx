import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "adebusiness@gmail.com",
    password: "password123",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPostAuthLoading, setIsPostAuthLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await login(formData.email, formData.password);
    setIsLoading(false);

    if (res.success) {
      setIsPostAuthLoading(true);
    } else {
      setError(res.error || "Invalid email or password");
    }
  };

  if (isPostAuthLoading) {
    return (
      <LoadingScreen
        mode="auth"
        duration={4000}
        onComplete={() => navigate("/")}
      />
    );
  }

  return (
    <AuthLayout>
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-[1.75rem] font-extrabold text-slate-900 leading-tight">
          Welcome back
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sign in to access your business ledger.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          required
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <Input
          label="Password"
          required
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {/* Remember me + forgot */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-slate-300 text-[#0F3A2E] focus:ring-[#0F3A2E]"
            />
            <span>Remember me</span>
          </label>
          <a
            href="#"
            className="font-semibold text-[#0F3A2E] hover:underline hover:text-emerald-700 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full font-bold"
            style={{ fontSize: "15px" }}
          >
            Sign in
          </Button>
        </div>
      </form>

      {/* Signup link */}
      <p className="text-center text-xs text-slate-500 pt-2">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-bold text-[#0F3A2E] hover:text-emerald-700 hover:underline transition-colors"
        >
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
