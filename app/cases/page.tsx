'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { useCaseFlow } from '@/lib/store';
import { Search, Filter, ArrowUpDown, ExternalLink, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Priority, CaseStage, CaseStatus, BottleneckType } from '@/types';

export default function CasesDirectoryPage() {
  const { cases } = useCaseFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedBottleneck, setSelectedBottleneck] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'inactivity' | 'severity' | 'filedDate'>('inactivity');

  // Filtering
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.court.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = selectedPriority === 'ALL' || c.priority === selectedPriority;
    const matchesStage = selectedStage === 'ALL' || c.currentStage === selectedStage;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;

    const matchesBottleneck =
      selectedBottleneck === 'ALL' ||
      (selectedBottleneck === 'NONE' && c.bottlenecks.length === 0) ||
      c.bottlenecks.some((b) => b.type === selectedBottleneck);

    return matchesSearch && matchesPriority && matchesStage && matchesStatus && matchesBottleneck;
  });

  // Sorting
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortBy === 'inactivity') {
      return b.daysInactive - a.daysInactive;
    }
    if (sortBy === 'severity') {
      const priorityOrder: Record<Priority, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(b.filedDate).getTime() - new Date(a.filedDate).getTime();
  });

  return (
    <div className="flex-1 pb-12 bg-slate-50 min-h-screen">
      <Header title="Case Directory" subtitle="Comprehensive list of synthetic court cases under management" />

      <main className="px-8 mt-6 space-y-6 max-w-7xl">
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by Case ID (#CF-1024), Title, Court, or Case Type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            {/* Sorting */}
            <div className="flex items-center space-x-2 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="inactivity">Days Inactive (Highest First)</option>
                <option value="severity">Priority Severity</option>
                <option value="filedDate">Filing Date (Newest First)</option>
              </select>
            </div>
          </div>

          {/* Filter Dropdowns Row */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium"
            >
              <option value="ALL">Priority: All</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Stage Filter */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium"
            >
              <option value="ALL">Stage: All</option>
              <option value="Pleadings">Pleadings</option>
              <option value="Discovery / Evidence">Discovery / Evidence</option>
              <option value="Pre-Trial Motion">Pre-Trial Motion</option>
              <option value="Hearing">Hearing</option>
            </select>

            {/* Bottleneck Filter */}
            <select
              value={selectedBottleneck}
              onChange={(e) => setSelectedBottleneck(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium"
            >
              <option value="ALL">Bottleneck: All</option>
              <option value="Missing Document">Missing Document</option>
              <option value="Pending Response">Pending Response</option>
              <option value="Repeated Adjournment">Repeated Adjournment</option>
              <option value="Upcoming Deadline">Upcoming Deadline</option>
              <option value="NONE">No Bottleneck</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium"
            >
              <option value="ALL">Status: All</option>
              <option value="Bottleneck Detected">Bottleneck Detected</option>
              <option value="Requires Attention">Requires Attention</option>
              <option value="Awaiting Response">Awaiting Response</option>
              <option value="Potentially Unblocked">Potentially Unblocked</option>
              <option value="Active">Active</option>
            </select>

            {/* Reset Filters */}
            {(selectedPriority !== 'ALL' || selectedStage !== 'ALL' || selectedBottleneck !== 'ALL' || selectedStatus !== 'ALL' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPriority('ALL');
                  setSelectedStage('ALL');
                  setSelectedBottleneck('ALL');
                  setSelectedStatus('ALL');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline ml-auto"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Case Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Showing <strong>{sortedCases.length}</strong> of <strong>{cases.length}</strong> total synthetic cases
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Case ID</th>
                  <th className="py-3.5 px-4">Case Title & Type</th>
                  <th className="py-3.5 px-4">Court</th>
                  <th className="py-3.5 px-4">Filed</th>
                  <th className="py-3.5 px-4">Current Stage</th>
                  <th className="py-3.5 px-4">Inactivity</th>
                  <th className="py-3.5 px-4">Bottleneck</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Workspace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedCases.map((c) => {
                  const activeBottleneck = c.bottlenecks.find((b) => !b.isResolved);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-4 font-mono font-bold text-indigo-600">
                        <Link href={`/cases/${c.id}`} className="hover:underline flex items-center gap-1">
                          <span>{c.id}</span>
                        </Link>
                      </td>
                      <td className="py-4 px-4 max-w-[220px]">
                        <Link href={`/cases/${c.id}`} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors block truncate">
                          {c.title}
                        </Link>
                        <span className="text-[11px] text-slate-400 block truncate">{c.caseType}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 max-w-[150px] truncate">{c.court}</td>
                      <td className="py-4 px-4 text-slate-500">{c.filedDate}</td>
                      <td className="py-4 px-4 font-medium text-slate-700">{c.currentStage}</td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${c.daysInactive > 60 ? 'text-red-600' : c.daysInactive > 30 ? 'text-amber-600' : 'text-slate-600'}`}>
                          {c.daysInactive} days
                        </span>
                        <span className="text-[10px] text-slate-400 block">Since {c.lastActivityDate}</span>
                      </td>
                      <td className="py-4 px-4">
                        {activeBottleneck ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            {activeBottleneck.type}
                          </span>
                        ) : c.bottlenecks.some((b) => b.isResolved) ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">None Identified</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 font-bold rounded text-[10px] uppercase ${
                            c.priority === 'CRITICAL'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : c.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : c.priority === 'MEDIUM'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'Potentially Unblocked' || c.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : c.status === 'Bottleneck Detected'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/cases/${c.id}`}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-xs shadow-sm inline-flex items-center gap-1 transition-all"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
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
