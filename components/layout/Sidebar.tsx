'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  UploadCloud,
  CheckSquare,
  BarChart3,
  History,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCaseFlow } from '@/lib/store';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Cases', href: '/cases', icon: Briefcase },
  { label: 'Upload Case', href: '/upload', icon: UploadCloud },
  { label: 'Actions', href: '/actions', icon: CheckSquare, badgeKey: 'actionsAwaitingApproval' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Audit Log', href: '/audit', icon: History },
  { label: 'Settings', href: '/settings', icon: Settings },
];

// Custom Original Indian Judicial Emblem SVG Mark
const JudicialEmblem = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path d="M20 4L23.5 11H16.5L20 4Z" fill="#C8AA72" />
    <path d="M20 11V28" stroke="#C8AA72" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 14H30" stroke="#C8AA72" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 14L6 21H14L10 14Z" fill="#B08D57" opacity="0.9" />
    <path d="M30 14L26 21H34L30 14Z" fill="#B08D57" opacity="0.9" />
    <path d="M6 21C6 23.2 7.8 25 10 25C12.2 25 14 23.2 14 21" stroke="#C8AA72" strokeWidth="1.5" />
    <path d="M26 21C26 23.2 27.8 25 30 25C32.2 25 34 23.2 34 21" stroke="#C8AA72" strokeWidth="1.5" />
    <path d="M13 32H27" stroke="#C8AA72" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 35H30" stroke="#C8AA72" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Sidebar = () => {
  const pathname = usePathname();
  const { analytics, sidebarCollapsed, toggleSidebar } = useCaseFlow();
  const [agentsExpanded, setAgentsExpanded] = useState(true);

  return (
    <aside
      className={`bg-[#0F1B2D] text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-40 border-r border-[#1E2E48] transition-all duration-300 select-none ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header & Brand Logo */}
      <div className="p-4 border-b border-[#1E2E48] flex items-center justify-between min-h-[72px]">
        <Link href="/" className="flex items-center space-x-3 overflow-hidden">
          <JudicialEmblem />
          {!sidebarCollapsed && (
            <div className="leading-tight transition-opacity duration-200">
              <h1 className="text-base font-serif tracking-wider text-[#F8F6F0] font-bold">CASEFLOW</h1>
              <p className="text-[10px] font-medium text-[#C8AA72] tracking-normal">From Pending to Progress</p>
            </div>
          )}
        </Link>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2C46] transition-colors shrink-0"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const badgeValue = item.badgeKey ? analytics[item.badgeKey as keyof typeof analytics] : null;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={`group relative flex items-center ${
                sidebarCollapsed ? 'justify-center px-0 py-3' : 'justify-between px-3.5 py-2.5'
              } rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#1C2C46] text-white shadow-sm border-l-2 border-[#B08D57]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#16253C]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C8AA72]' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </div>

              {!sidebarCollapsed && typeof badgeValue === 'number' && badgeValue > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#B08D57]/20 text-[#E2C799] border border-[#B08D57]/40">
                  {badgeValue}
                </span>
              )}

              {/* Tooltip when collapsed */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                  {typeof badgeValue === 'number' && badgeValue > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-amber-500/30 text-amber-300 rounded font-bold">
                      {badgeValue}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status & Agent Fleet Monitoring */}
      <div className="p-4 border-t border-[#1E2E48] bg-[#0B1422] space-y-3 text-[11px]">
        {/* System Status */}
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          {!sidebarCollapsed ? (
            <div>
              <div className="font-bold text-slate-300 text-[11px]">System Status</div>
              <div className="text-emerald-400 font-semibold text-[10px]">All Systems Operational</div>
            </div>
          ) : (
            <div className="hidden group-hover:block" />
          )}
        </div>

        {/* AI Agents Monitoring Section */}
        {!sidebarCollapsed && (
          <div className="pt-2 border-t border-[#1C2C46] space-y-1.5">
            <button
              onClick={() => setAgentsExpanded(!agentsExpanded)}
              className="flex items-center justify-between w-full text-slate-400 hover:text-white font-bold uppercase tracking-wider text-[10px]"
            >
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8AA72]" />
                <span>AI AGENTS</span>
              </span>
              {agentsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {agentsExpanded && (
              <div className="space-y-1 pl-1 text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Case Understanding</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Bottleneck Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Action Recommendation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Follow-up Tracking</span>
                </div>
              </div>
            )}
          </div>
        )}

        {!sidebarCollapsed && (
          <div className="pt-2 border-t border-[#1C2C46] flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>PostgreSQL Ready</span>
            <span>v0.1.0</span>
          </div>
        )}
      </div>
    </aside>
  );
};
