'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { useCaseFlow } from '@/lib/store';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Zap, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';

export default function AnalyticsPage() {
  const { analytics } = useCaseFlow();

  return (
    <div className="flex-1 pb-12 bg-slate-50 min-h-screen">
      <Header
        title="Analytics & Operational Impact"
        subtitle="Metrics on backlog resolution speed, bottleneck detection, and human approval efficiency"
      />

      <main className="px-8 mt-6 space-y-6 max-w-7xl">
        {/* Synthetic Disclaimer Banner */}
        <div className="bg-purple-900 text-white p-4 rounded-xl border border-purple-800 flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-purple-300 shrink-0" />
          <div className="text-xs">
            <span className="font-bold uppercase tracking-wider text-purple-200">Demo / Synthetic Data Banner: </span>
            <span>
              All operational metrics below are calculated based on the synthetic demonstration dataset. In future production deployment, real pilot metrics will integrate seamlessly.
            </span>
          </div>
        </div>

        {/* Top Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-xs text-slate-500 font-medium">Cases Analyzed</div>
            <div className="text-2xl font-bold text-slate-900">{analytics.totalCases.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +12.4% processing throughput
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-xs text-slate-500 font-medium">Bottlenecks Identified</div>
            <div className="text-2xl font-bold text-purple-700">{analytics.bottlenecksDetected}</div>
            <div className="text-[11px] text-slate-400">Procedural friction points</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-xs text-slate-500 font-medium">Actions Approved</div>
            <div className="text-2xl font-bold text-indigo-600">{analytics.actionsCompleted}</div>
            <div className="text-[11px] text-slate-400">Human-in-the-loop decisions</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-xs text-slate-500 font-medium">Cases Potentially Unblocked</div>
            <div className="text-2xl font-bold text-emerald-700">{analytics.potentiallyUnblocked}</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Re-analysis verified
            </div>
          </div>
        </div>

        {/* Speed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Average Detection to Action Time</span>
            </div>
            <div className="text-3xl font-black text-indigo-700">{analytics.avgDetectionToActionDays} Days</div>
            <p className="text-xs text-slate-500">Time elapsed from BottleneckAgent detection to human approval</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Average Action to Resolution Time</span>
            </div>
            <div className="text-3xl font-black text-emerald-700">{analytics.avgActionToResolutionDays} Days</div>
            <p className="text-xs text-slate-500">Time elapsed from action issuance to new evidence ingestion & unblocking</p>
          </div>
        </div>

        {/* Bottlenecks & Resolution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Bottlenecks by Category</h3>
            <div className="space-y-3">
              {[
                { label: 'Missing Documents', count: 142, pct: '32.4%', color: 'bg-red-500' },
                { label: 'Pending Responses', count: 118, pct: '26.9%', color: 'bg-amber-500' },
                { label: 'Repeated Adjournments', count: 84, pct: '19.1%', color: 'bg-purple-500' },
                { label: 'Upcoming Deadlines', count: 54, pct: '12.3%', color: 'bg-blue-500' },
                { label: 'Long Inactivity', count: 28, pct: '6.4%', color: 'bg-slate-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item.label}</span>
                    <span>{item.count} ({item.pct})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: item.pct }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Resolution Status Breakdown</h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900">Potentially Unblocked</span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Cases with verified missing items ingested</p>
                </div>
                <span className="text-xl font-bold text-emerald-800">137 Cases</span>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900">Awaiting Response / Evidence</span>
                  <p className="text-[11px] text-amber-700 mt-0.5">Approved notices issued to parties</p>
                </div>
                <span className="text-xl font-bold text-amber-800">24 Cases</span>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-900">Active Bottlenecks Pending Review</span>
                  <p className="text-[11px] text-purple-700 mt-0.5">Requires administrative review</p>
                </div>
                <span className="text-xl font-bold text-purple-800">8 Cases</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
