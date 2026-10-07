'use client';

import React from 'react';
import { useCaseFlow } from '@/lib/store';
import { Shield, Bell, Search, Sparkles, AlertCircle } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { demoMode, setDemoMode, userRole, setUserRole } = useCaseFlow();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {demoMode && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                Synthetic Data
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Search */}
          <div className="relative hidden md:block w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search case #, title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Role Switcher */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <Shield className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <span className="text-slate-500 font-medium text-[11px]">Role:</span>
            {(['Admin', 'Legal Staff', 'Reviewer'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  userRole === role
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Demo Toggle Button */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              demoMode
                ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>Demo: {demoMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>

          {/* User Badge */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
              {userRole[0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
