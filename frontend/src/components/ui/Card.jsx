import React from "react";

export function Card({
  children,
  className = "",
  header,
  footer,
  noPadding = false,
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.04)] ${className}`}
      {...props}
    >
      {header && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className={noPadding ? "" : "p-5"}>{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
