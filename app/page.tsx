'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { useCaseFlow } from '@/lib/store';
import {
  Briefcase,
  AlertTriangle,
  Zap,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  FileText,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { cases, analytics, auditLogs } = useCaseFlow();

  const casesRequiringAttention = cases.filter(
    (c) => c.status === 'Bottleneck Detected' || c.status === 'Requires Attention' || c.status === 'Awaiting Action'
  );

  return (
    <div className="flex-1 pb-12 bg-slate-50 min-h-screen">
      <Header
        title="Administrative Dashboard"
        subtitle="Real-time case intelligence, bottleneck detection, and pending action queue"
      />

      <main className="px-8 mt-6 space-y-6 max-w-7xl">
        {/* Synthetic Data Disclaimer Banner */}
        <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white p-4 rounded-xl shadow-sm border border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm">HACKATHON PROTOTYPE DEMO MODE</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  Synthetic Dataset
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5">
                CaseFlow operates strictly on fictional case files. All operational metrics below represent synthetic demonstration data.
              </p>
            </div>
          </div>
          <Link
            href="/settings"
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all shrink-0"
          >
            Demo Settings
          </Link>
        </div>

        {/* A. Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Cases</span>
              <Briefcase className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">{analytics.totalCases.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2%
              </span>{' '}
              this month
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Requires Attention</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-2">{analytics.requiresAttention}</div>
            <div className="text-[11px] text-slate-500 mt-1">High severity bottlenecks</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Bottlenecks Detected</span>
              <Zap className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-700 mt-2">{analytics.bottlenecksDetected}</div>
            <div className="text-[11px] text-slate-500 mt-1">Procedural stalls</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Awaiting Approval</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-2">{analytics.actionsAwaitingApproval}</div>
            <div className="text-[11px] text-slate-500 mt-1">Human-in-the-loop queue</div>
          </div>

          <div className="bg-white p-5 rounded-xl border font-semibold border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
            <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
              <span>Potentially Unblocked</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2">{analytics.potentiallyUnblocked}</div>
            <div className="text-[11px] text-emerald-600 mt-1 font-normal">Re-analyzed & resolved</div>
          </div>
        </div>

        {/* B & C Section: Priority & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Priority Distribution */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Operational Priority Distribution</span>
                <span className="text-[11px] font-normal text-slate-400">Attention Scale</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Refers to administrative response priority (NOT judicial impact)</p>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-red-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span> Critical Priority
                    </span>
                    <span className="text-slate-600">4 Cases</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span> High Priority
                    </span>
                    <span className="text-slate-600">18 Cases</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-blue-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> Medium / Low Priority
                    </span>
                    <span className="text-slate-600">8 Cases</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Avg Days Inactive: <strong className="text-slate-800">46.5 days</strong></span>
              <span>Avg Action Prep: <strong className="text-slate-800">2.4 days</strong></span>
            </div>
          </div>

          {/* E. Bottleneck Types Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Bottleneck Distribution</span>
              <span className="text-xs text-indigo-600 font-semibold">Active Scans</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Top procedural friction points identified across active case files</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              <div className="p-3 bg-red-50/60 border border-red-100 rounded-lg">
                <div className="text-[11px] font-semibold text-red-800 uppercase tracking-wide">Missing Documents</div>
                <div className="text-xl font-bold text-red-900 mt-1">142</div>
                <div className="text-[11px] text-red-600 mt-0.5">32.4% of total</div>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg">
                <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">Pending Responses</div>
                <div className="text-xl font-bold text-amber-900 mt-1">118</div>
                <div className="text-[11px] text-amber-600 mt-0.5">26.9% of total</div>
              </div>

              <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-lg">
                <div className="text-[11px] font-semibold text-purple-800 uppercase tracking-wide">Repeated Adjournments</div>
                <div className="text-xl font-bold text-purple-900 mt-1">84</div>
                <div className="text-[11px] text-purple-600 mt-0.5">19.1% of total</div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
                <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wide">Upcoming Deadlines</div>
                <div className="text-xl font-bold text-blue-900 mt-1">54</div>
                <div className="text-[11px] text-blue-600 mt-0.5">12.3% of total</div>
              </div>

              <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg">
                <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Long Inactivity</div>
                <div className="text-xl font-bold text-slate-900 mt-1">28</div>
                <div className="text-[11px] text-slate-500 mt-0.5">6.4% of total</div>
              </div>

              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg">
                <div className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wide">Other / Inconsistent</div>
                <div className="text-xl font-bold text-indigo-900 mt-1">12</div>
                <div className="text-[11px] text-indigo-600 mt-0.5">2.9% of total</div>
              </div>
            </div>
          </div>
        </div>

        {/* D. Cases Requiring Attention Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900">Cases Requiring Immediate Attention</h2>
              <p className="text-xs text-slate-500 mt-0.5">Flagged by BottleneckAgent with actionable next steps</p>
            </div>
            <Link
              href="/cases"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All Cases ({cases.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Case Type</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Bottleneck</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Days Inactive</th>
                  <th className="py-3 px-4">Recommended Action</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {casesRequiringAttention.map((c) => {
                  const b = c.bottlenecks[0];
                  const act = c.actions[0];
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                        <Link href={`/cases/${c.id}`} className="hover:underline flex items-center gap-1">
                          <span>{c.id}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 max-w-[160px] truncate">{c.caseType}</td>
                      <td className="py-3.5 px-4 text-slate-600">{c.currentStage}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {b ? (
                          <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {b.type}
                          </span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 font-bold rounded text-[10px] uppercase ${
                            c.priority === 'CRITICAL'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : c.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{c.daysInactive} days</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium max-w-[200px] truncate">
                        {act ? act.actionType : 'None pending'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/cases/${c.id}`}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-semibold text-xs transition-colors"
                        >
                          Inspect Workspace
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* C. Recent Activity Feed */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Recent Agent & Human Activity Log</span>
          </h3>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start space-x-3 text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      [{log.caseId}] {log.action}
                    </span>
                    <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{log.outputDetails}</p>
                  <div className="mt-1 flex items-center space-x-2 text-[11px] text-slate-500">
                    <span>Agent/User: <strong>{log.userOrAgent}</strong></span>
                    {log.humanDecision && <span className="text-indigo-600 bg-indigo-50 px-1.5 rounded font-semibold">{log.humanDecision}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
