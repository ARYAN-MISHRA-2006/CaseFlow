'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { useCaseFlow } from '@/lib/store';
import { History, Search, ShieldCheck, ExternalLink, Bot, User } from 'lucide-react';

export default function AuditLogPage() {
  const { auditLogs } = useCaseFlow();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.caseId.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.outputDetails.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || log.agentRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex-1 pb-12 bg-slate-50 min-h-screen">
      <Header
        title="Audit Log & Governance Trail"
        subtitle="Immutable record of every AI-generated conclusion and human administrative decision"
      />

      <main className="px-8 mt-6 space-y-6 max-w-7xl">
        {/* Search & Filter */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search audit trail by Case ID, Action, or Details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 shrink-0 text-xs">
            <span className="font-semibold text-slate-600">Filter Actor:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
            >
              <option value="ALL">All Actors</option>
              <option value="CaseUnderstandingAgent">CaseUnderstandingAgent</option>
              <option value="BottleneckAgent">BottleneckAgent</option>
              <option value="ActionAgent">ActionAgent</option>
              <option value="FollowUpAgent">FollowUpAgent</option>
              <option value="Human Admin">Human Admin</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Showing <strong>{filteredLogs.length}</strong> audit records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Case ID</th>
                  <th className="py-3.5 px-4">Actor / Agent</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Input Reference</th>
                  <th className="py-3.5 px-4">Output Details</th>
                  <th className="py-3.5 px-4">Human Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-600">
                      <Link href={`/cases/${log.caseId}`} className="hover:underline flex items-center gap-1">
                        <span>{log.caseId}</span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 font-bold text-slate-800 font-sans">
                        {log.agentRole === 'Human Admin' ? (
                          <User className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <Bot className="w-3.5 h-3.5 text-purple-600" />
                        )}
                        <span>{log.userOrAgent}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-900">{log.action}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-[150px] truncate">{log.inputReference || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-sans text-slate-700 max-w-[280px]">{log.outputDetails}</td>
                    <td className="py-3.5 px-4 font-sans">
                      {log.humanDecision ? (
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold text-[10px]">
                          {log.humanDecision}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Automated Task</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
