import React, { useState } from "react";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";

export const Input = React.forwardRef(
  (
    {
      label,
      required,
      type = "text",
      error,
      warning,
      warningMessage,
      helperText,
      prefix,
      suffix,
      className = "",
      inputClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`w-full flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-700 flex items-center justify-between"
          >
            <span>
              {label} {required && <span className="text-emerald-700">*</span>}
            </span>
            {warning && (
              <span className="text-amber-700 font-medium text-[11px] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                {warningMessage || "Low confidence"}
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {prefix && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {prefix}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={actualType}
            className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-xl border transition-colors outline-none
              ${prefix ? "pl-10" : ""}
              ${suffix || isPassword || warning ? "pr-10" : ""}
              ${
                warning
                  ? "bg-[#FEF08A]/30 border-amber-300 text-slate-900 focus:bg-[#FEF08A]/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  : error
                  ? "bg-rose-50/50 border-rose-300 text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E]"
              }
              ${inputClassName}
            `}
            {...props}
          />

          {warning && !isPassword && (
            <div className="absolute right-3.5 flex items-center text-amber-500 pointer-events-none">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}

          {suffix && !isPassword && !warning && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
              {suffix}
            </div>
          )}
        </div>

        {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
        {helperText && !error && (
          <span className="text-[11px] text-slate-500">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
