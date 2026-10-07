'use client';

import React from 'react';
import { useCaseFlow } from '@/lib/store';
import { Search, Bell, PanelLeft, ChevronDown, User, Shield } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = () => {
  const { userRole, setUserRole, toggleSidebar } = useCaseFlow();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Toggle & Institutional Search */}
        <div className="flex items-center space-x-3 flex-1 max-w-2xl">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
            title="Toggle sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search cases by case number, party name, type, or keyword..."
              className="w-full pl-10 pr-16 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#172A46] focus:bg-white transition-all"
            />
            <kbd className="absolute right-3 top-2.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* Right Side: Role Selector, Notifications, User Avatar */}
        <div className="flex items-center space-x-4 shrink-0">
          {/* Role Selector Dropdown */}
          <div className="flex items-center space-x-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-700 text-xs focus:outline-none cursor-pointer"
            >
              <option value="Admin">Admin</option>
              <option value="Legal Staff">Legal Staff</option>
              <option value="Reviewer">Reviewer</option>
            </select>
          </div>

          {/* Notifications Icon with Badge 3 */}
          <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#172A46] text-white font-bold flex items-center justify-center text-xs shadow-xs">
              A
            </div>
            <div className="hidden sm:flex items-center space-x-1 cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">Aryan Mishra</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
