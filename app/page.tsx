'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { useCaseFlow } from '@/lib/store';
import {
  FileText,
  AlertTriangle,
  GitFork,
  Gavel,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  PieChart,
  Activity,
  MoreVertical,
  Check,
  Upload,
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const { cases, analytics, auditLogs, demoMode } = useCaseFlow();

  const casesRequiringAttention = cases.filter(
    (c) => c.status === 'Bottleneck Detected' || c.status === 'Requires Attention' || c.status === 'Awaiting Action'
  );

  return (
    <div className="flex-1 pb-16 bg-slate-50 min-h-screen">
      <Header />

      {/* Hero Section: Institutional Warm Ivory Banner */}
      <div className="bg-[#F8F6F0] border-b border-[#EAE5D9] px-8 py-8 relative overflow-hidden">
        {/* Subtle Architectural Supreme Court Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none flex items-center justify-end pr-12">
          <svg width="420" height="150" viewBox="0 0 420 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M210 10L390 60V70H30V60L210 10Z" fill="#172A46" />
            <circle cx="210" cy="40" r="14" fill="#C8AA72" opacity="0.6" />
            <rect x="50" y="70" width="16" height="70" rx="2" fill="#172A46" />
            <rect x="100" y="70" width="16" height="70" rx="2" fill="#172A46" />
            <rect x="150" y="70" width="16" height="70" rx="2" fill="#172A46" />
            <rect x="200" y="70" width="16" height="70" rx="2" fill="#172A46" />
            <rect x="250" y="70" width="16" height="70" rx="2" fill="#172A46" />
            <rect x="300" y="70" width="16" height="70" rx="2" fill="#172A46" />
            <rect x="350" y="70" width="16" height="70" rx="2" fill="#172A46" />
            <rect x="30" y="140" width="360" height="10" rx="2" fill="#172A46" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif text-[#172033] font-bold tracking-tight">Good evening, Aryan</h1>
            <p className="text-sm text-slate-600">Here’s the current status of cases and key insights across the system.</p>
          </div>

          {/* Institutional Tagline Card */}
          <div className="bg-white/90 backdrop-blur-xs border border-[#C8AA72]/40 pl-4 pr-6 py-3 rounded-xl shadow-xs flex items-center space-x-3.5 shrink-0">
            <div className="w-1.5 h-10 bg-[#B08D57] rounded-full shrink-0"></div>
            <div className="font-serif text-xs leading-relaxed text-[#172033]">
              <span className="font-bold text-[#172A46] block">Faster Workflows.</span>
              <span className="font-bold text-[#B08D57] block">Stronger Justice.</span>
              <span className="text-slate-600 italic">Accessible for All</span>
            </div>
          </div>
        </div>
      </div>

      <main className="px-8 mt-6 space-y-6 max-w-7xl mx-auto">
        {/* Synthetic Data Informational Banner */}
        {demoMode && (
          <div className="bg-[#F4F6F8] border border-slate-200/90 text-slate-700 px-4 py-3 rounded-lg shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-2.5 text-xs font-medium">
              <span className="px-2 py-0.5 font-bold text-[10px] uppercase rounded bg-[#B08D57]/20 text-[#8B6B35] border border-[#B08D57]/30">
                DEMO MODE
              </span>
              <span>Synthetic case data is currently active. All cases and metrics shown are fictional.</span>
            </div>
            <Link
              href="/settings"
              className="text-xs font-semibold text-[#172A46] hover:text-[#B08D57] underline shrink-0 ml-4"
            >
              Demo Settings
            </Link>
          </div>
        )}

        {/* Cohesive 5 KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Cases */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <span>Total Cases</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{analytics.totalCases.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" /> +4.2% from last month
            </div>
          </div>

          {/* Card 2: Requires Attention */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <span>Requires Attention</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">{analytics.requiresAttention}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 border border-amber-200">
                High Priority
              </span>
            </div>
            <div className="text-[11px] text-slate-500">Cases with critical bottlenecks</div>
          </div>

          {/* Card 3: Bottlenecks Detected (Clean Single Box Layout) */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <span>Bottlenecks Detected</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <GitFork className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">{analytics.bottlenecksDetected}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                35% of total
              </span>
            </div>
            <div className="text-[11px] text-slate-500">Potential procedural issues</div>
          </div>

          {/* Card 4: Awaiting Approval */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <span>Awaiting Approval</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Gavel className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700">{analytics.actionsAwaitingApproval}</div>
            <div className="text-[11px] text-slate-500">AI-generated actions queue</div>
          </div>

          {/* Card 5: Potentially Unblocked */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <span>Potentially Unblocked</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-emerald-800">{analytics.potentiallyUnblocked}</span>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> 12.3%
              </span>
            </div>
            <div className="text-[11px] text-slate-500">Re-analyzed & resolved</div>
          </div>
        </div>

        {/* Priority & Bottlenecks & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Donut Chart: Priority Distribution (Col 4) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <PieChart className="w-4 h-4 text-[#172A46]" />
                <span>Case Priority Distribution</span>
              </h3>

              {/* Donut SVG */}
              <div className="my-5 flex items-center justify-center relative">
                <svg width="170" height="170" viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="38" stroke="#E2E8F0" strokeWidth="14" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#64748B"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="238.76"
                    strokeDashoffset="85.95"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#2563EB"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="238.76"
                    strokeDashoffset="138.48"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#D97706"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="238.76"
                    strokeDashoffset="181.45"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#C62828"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="238.76"
                    strokeDashoffset="229.2"
                  />
                </svg>

                <div className="absolute text-center">
                  <div className="text-xl font-bold text-slate-900">1,250</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Total Cases</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C62828] shrink-0"></span>
                  <span className="text-slate-600">Critical</span>
                  <span className="font-bold text-slate-900 ml-auto">4% (50)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] shrink-0"></span>
                  <span className="text-slate-600">High</span>
                  <span className="font-bold text-slate-900 ml-auto">18% (225)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shrink-0"></span>
                  <span className="text-slate-600">Medium</span>
                  <span className="font-bold text-slate-900 ml-auto">42% (525)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#64748B] shrink-0"></span>
                  <span className="text-slate-600">Low</span>
                  <span className="font-bold text-slate-900 ml-auto">36% (450)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Bar Chart: Bottleneck Types (Col 4) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                  <GitFork className="w-4 h-4 text-[#172A46]" />
                  <span>Bottleneck Types</span>
                </h3>
                <Link href="/analytics" className="text-xs font-semibold text-[#172A46] hover:text-[#B08D57] flex items-center gap-0.5">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3.5 text-xs">
                {[
                  { label: 'Missing Documents', count: '142 (32.4%)', width: '85%', color: 'bg-[#C62828]' },
                  { label: 'Pending Responses', count: '118 (26.9%)', width: '70%', color: 'bg-[#D97706]' },
                  { label: 'Repeated Adjournments', count: '84 (19.1%)', width: '50%', color: 'bg-[#6B21A8]' },
                  { label: 'Upcoming Deadlines', count: '54 (12.3%)', width: '35%', color: 'bg-[#2563EB]' },
                  { label: 'Long Inactivity', count: '28 (6.4%)', width: '20%', color: 'bg-[#64748B]' },
                  { label: 'Other / Inconsistent', count: '12 (2.9%)', width: '10%', color: 'bg-slate-300' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="text-slate-900 font-bold">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: item.width }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed (Col 4) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#172A46]" />
                  <span>Recent Activity</span>
                </h3>
                <Link href="/audit" className="text-xs font-semibold text-[#172A46] hover:text-[#B08D57]">
                  View All →
                </Link>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Case CF-1024 analyzed</span>
                      <span className="text-[10px] text-slate-400 font-normal">2 mins ago</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Missing evidence detected</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 font-bold">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Action prepared for CF-1087</span>
                      <span className="text-[10px] text-slate-400 font-normal">12 mins ago</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Request pending response</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 font-bold">
                    <Upload className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>New document uploaded</span>
                      <span className="text-[10px] text-slate-400 font-normal">28 mins ago</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Evidence submission — CF-1112</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Action approved</span>
                      <span className="text-[10px] text-slate-400 font-normal">1 hour ago</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Reminder notice — CF-1190</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0 font-bold">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Case re-analyzed</span>
                      <span className="text-[10px] text-slate-400 font-normal">2 hours ago</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Bottleneck resolved — CF-0945</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Data Table: Cases Requiring Immediate Attention */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-[#C62828]" />
                <span>Cases Requiring Immediate Attention</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">High operational priority matters flagged by BottleneckAgent</p>
            </div>
            <Link href="/cases" className="text-xs font-semibold text-[#172A46] hover:text-[#B08D57] flex items-center gap-1">
              <span>View All Cases ({cases.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Case Type</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Bottleneck</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Days Inactive</th>
                  <th className="py-3 px-4">Recommended Action</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {casesRequiringAttention.map((c) => {
                  const b = c.bottlenecks[0];
                  const act = c.actions[0];
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#172A46]">
                        <Link href={`/cases/${c.id}`} className="hover:underline">
                          {c.id}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{c.caseType}</td>
                      <td className="py-3.5 px-4 text-slate-600">{c.currentStage}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{b ? b.type : 'None'}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold rounded ${
                            c.priority === 'CRITICAL'
                              ? 'bg-red-50 text-[#C62828] border border-red-200'
                              : c.priority === 'HIGH'
                              ? 'bg-amber-50 text-[#D97706] border border-amber-200'
                              : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{c.daysInactive}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium max-w-[200px] truncate">
                        {act ? act.actionType : 'Review record'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap inline-flex items-center gap-1 ${
                            c.status === 'Bottleneck Detected'
                              ? 'bg-red-50 text-[#C62828] border border-red-200'
                              : c.status === 'Awaiting Action'
                              ? 'bg-amber-50 text-[#D97706] border border-amber-200'
                              : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Link
                            href={`/cases/${c.id}`}
                            className="px-3 py-1 bg-slate-100 hover:bg-[#172A46] hover:text-white text-slate-700 rounded font-semibold text-xs transition-colors"
                          >
                            View
                          </Link>
                          <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
