'use client';

import React from 'react';
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
  ShieldCheck,
  Bot,
  Database,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { useCaseFlow } from '@/lib/store';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Cases', href: '/cases', icon: Briefcase },
  { label: 'Upload Case', href: '/upload', icon: UploadCloud },
  { label: 'Action Center', href: '/actions', icon: CheckSquare, badgeKey: 'actionsAwaitingApproval' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Audit Log', href: '/audit', icon: History },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { analytics, demoMode } = useCaseFlow();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-slate-800 shadow-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
            CF
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">CASEFLOW</h1>
            <p className="text-[11px] font-medium text-indigo-400 mt-1">From Pending to Progress</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const badgeValue = item.badgeKey ? analytics[item.badgeKey as keyof typeof analytics] : null;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {typeof badgeValue === 'number' && badgeValue > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {badgeValue}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status Panel */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3 text-xs">
        {demoMode && (
          <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-800/40">
            <AlertTriangle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold text-[11px]">DEMO MODE Active</span>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <span className="flex items-center space-x-1.5">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Agents</span>
            </span>
            <span className="text-emerald-400 font-normal">● Ready</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-400 pl-1">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Case Understanding</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Bottleneck Detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Action Recommendation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Follow-up Tracking</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <Database className="w-3 h-3 text-indigo-400" />
            <span>PostgreSQL Ready</span>
          </span>
          <span className="flex items-center space-x-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Audit Active</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
