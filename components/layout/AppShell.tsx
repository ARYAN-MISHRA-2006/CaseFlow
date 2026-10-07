'use client';

import React, { Suspense } from 'react';
import { useCaseFlow } from '@/lib/store';
import { Sidebar } from './Sidebar';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarCollapsed } = useCaseFlow();

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans antialiased w-full max-w-full overflow-x-hidden">
      <Suspense fallback={<div className="w-64 bg-[#0F1B2D] h-screen fixed left-0 top-0" />}>
        <Sidebar />
      </Suspense>
      <div
        className={`flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
