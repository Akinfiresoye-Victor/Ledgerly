import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  CheckCircle2,
  X,
  RefreshCw,
} from "lucide-react";
import BrandLogo from "../../components/ui/BrandLogo";
import Button from "../../components/ui/Button";
import { useAuth } from "./AuthContext";

export function OtpVerificationPage() {
  const navigate = useNavigate();
  const { pendingEmail, verifyOtp, resendOtp } = useAuth();

  // State: 'input' | 'verifying' | 'success' | 'error'
  const [status, setStatus] = useState("input");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    if (status === "input" && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [status]);

  const handleDigitChange = (index, value) => {
    // Only accept numeric input
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...digits];
    // Handle paste or single char
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || digits.join("");
    if (code.length < 6) return;

    // Simulate incorrect code on 123450
    if (code === "123450") {
      setStatus("error");
      setCountdown(30);
      return;
    }

    // Verify OTP and transition directly to the "All set!" success screen
    setStatus("verifying");
    const res = await verifyOtp(code);
    if (res.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setCountdown(30);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    await resendOtp();
    setCountdown(45);
    setCanResend(false);
  };

  const handleTryAgain = () => {
    setDigits(["", "", "", "", "", ""]);
    setStatus("input");
  };

  const formattedCountdown = `00:${countdown < 10 ? `0${countdown}` : countdown}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between">
        <Link
          to="/signup"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <BrandLogo size="md" />
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Main Card Canvas */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        {/* ================= STATE 1: INPUT ================= */}
        {status === "input" && (
          <div className="text-center animate-in fade-in duration-200">
            {/* Center Mail Graphic */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              {/* Radiating decorative dots */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-200 animate-spin-slow" />
              <div className="w-16 h-16 rounded-2xl bg-[#08281F] text-emerald-400 flex items-center justify-center shadow-lg transform rotate-3">
                <Mail className="w-8 h-8" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Verify your email
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              We've sent a 6-digit code to{" "}
              <span className="font-semibold text-slate-800">
                {pendingEmail || "you@example.com"}
              </span>
            </p>

            {/* 6 Digits Input */}
            <div className="flex justify-center gap-2 sm:gap-3 my-8">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0F3A2E] focus:ring-2 focus:ring-[#0F3A2E]/20 transition-all shadow-sm"
                />
              ))}
            </div>

            {/* Countdown / Resend */}
            <div className="text-xs text-slate-500 mb-6">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-bold text-[#0F3A2E] hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Resend code
                </button>
              ) : (
                <span>
                  Resend code in{" "}
                  <span className="font-semibold text-slate-700">
                    {formattedCountdown}
                  </span>
                </span>
              )}
            </div>

            {/* Verify CTA */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleVerify()}
              disabled={digits.join("").length < 6}
              className="w-full text-base font-semibold"
            >
              Verify
            </Button>

            <p className="text-[11px] text-slate-400 mt-6">
              Didn't receive the code? Check your spam or{" "}
              <button
                type="button"
                onClick={handleResend}
                className="text-slate-600 underline font-medium"
              >
                try again
              </button>
              .
            </p>
          </div>
        )}

        {/* ================= STATE 2: VERIFYING ================= */}
        {status === "verifying" && (
          <div className="text-center animate-in fade-in duration-300">
            {/* Pulsing Emerald Animated Ring Graphic */}
            <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse-ring" />
              <div className="w-16 h-16 rounded-2xl bg-[#08281F] text-emerald-400 flex items-center justify-center shadow-xl z-10">
                <Mail className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Verifying your code...
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Please wait while we confirm your email address. This will only
              take a few seconds.
            </p>

            {/* Pulsing Hex/Rounded Slots */}
            <div className="flex justify-center gap-2 sm:gap-3 my-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-11 h-14 sm:w-12 sm:h-16 rounded-xl border-2 border-emerald-300 bg-emerald-50/50 animate-pulse flex items-center justify-center shadow-inner"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STATE 3: ALL SET / SUCCESS ================= */}
        {status === "success" && (
          <div className="text-center animate-in zoom-in-95 duration-300">
            {/* Green Checkmark Graphic */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#08281F] text-emerald-400 flex items-center justify-center shadow-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              All set!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Your email has been verified successfully. You can now continue to
              your dashboard.
            </p>

            <div className="mt-8">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/")}
                className="w-full text-base font-semibold"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ================= STATE 4: INCORRECT CODE ================= */}
        {status === "error" && (
          <div className="text-center animate-in zoom-in-95 duration-200">
            {/* Red Diamond with X */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#E02424] text-white flex items-center justify-center shadow-xl">
                <X className="w-10 h-10" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Incorrect code
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              The code you entered is invalid. Please check and try again.
            </p>

            {/* Red Digits Outline */}
            <div className="flex justify-center gap-2 sm:gap-3 my-8">
              {digits.map((digit, idx) => (
                <div
                  key={idx}
                  className="w-11 h-14 sm:w-12 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-xl border-2 border-rose-400 bg-rose-50/50 text-rose-600"
                >
                  {digit || "•"}
                </div>
              ))}
            </div>

            <div className="text-xs text-slate-500 mb-6">
              Resend code in{" "}
              <span className="font-semibold text-slate-700">
                {formattedCountdown}
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleTryAgain}
              className="w-full text-base font-semibold"
            >
              Try again
            </Button>

            <div className="mt-5">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-slate-400">
        © 2026 Ledgerly. Secure financial bookkeeping.
      </div>
    </div>
  );
}

export default OtpVerificationPage;
