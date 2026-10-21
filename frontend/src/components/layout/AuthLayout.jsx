import React from 'react';
import BrandPanel from '../ui/BrandPanel';

export function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden">
      {/* ── Left Brand Panel (50% on desktop) ── */}
      <BrandPanel />

      {/* ── Right Form Panel (50% on desktop) ── */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
