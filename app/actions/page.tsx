'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { useCaseFlow } from '@/lib/store';
import { CheckSquare, Check, Edit3, ExternalLink, ShieldCheck } from 'lucide-react';
import { ActionStatus } from '@/types';

export default function ActionCenterPage() {
  const { cases, approveAction, rejectAction } = useCaseFlow();
  const [activeTab, setActiveTab] = useState<ActionStatus>('Pending Approval');
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState<string>('');

  // Collect all actions across cases
  const allActions = cases.flatMap((c) =>
    c.actions.map((act) => ({
      ...act,
      caseTitle: c.title,
    }))
  );

  const filteredActions = allActions.filter((a) => a.status === activeTab);

  const handleApprove = (actionId: string) => {
    approveAction(actionId, editingActionId === actionId ? draftText : undefined);
    setEditingActionId(null);
  };

  const handleReject = (actionId: string) => {
    const reason = prompt('Reason for rejection:', 'Administrative decision / alternate process chosen');
    if (reason) {
      rejectAction(actionId, reason);
    }
  };

  return (
    <div className="flex-1 pb-16 bg-slate-50 min-h-screen">
      <Header />

      <main className="px-8 mt-6 space-y-6 max-w-7xl mx-auto">
        {/* Header Title Bar */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-serif text-[#172033] font-bold tracking-tight">Action Center — Human in the Loop</h1>
          <p className="text-xs text-slate-500 mt-0.5">Review, edit, approve, or reject AI-generated administrative next steps</p>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs">
          <nav className="flex space-x-6 text-xs font-semibold">
            {(['Pending Approval', 'Approved', 'Rejected', 'Completed'] as ActionStatus[]).map((tab) => {
              const count = allActions.filter((a) => a.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3.5 border-b-2 font-bold flex items-center space-x-2 transition-all ${
                    activeTab === tab ? 'border-[#172A46] text-[#172A46]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      tab === 'Pending Approval' && count > 0
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Actions Grid */}
        {filteredActions.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No Actions in &quot;{activeTab}&quot;</h3>
            <p className="text-xs text-slate-500">All pending administrative actions have been reviewed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActions.map((act) => (
              <div key={act.id} className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/cases/${act.caseId}`} className="font-mono font-bold text-[#172A46] hover:underline flex items-center gap-1 text-xs">
                        <span>#{act.caseId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-slate-900">{act.caseTitle}</span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          act.priority === 'CRITICAL'
                            ? 'bg-red-50 text-[#C62828] border border-red-200'
                            : act.priority === 'HIGH'
                            ? 'bg-amber-50 text-[#D97706] border border-amber-200'
                            : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                        }`}
                      >
                        {act.priority}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{act.actionType}</h3>
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-bold text-[#172A46]">AI Confidence: {(act.confidence * 100).toFixed(0)}%</span>
                    <div className="text-slate-400 text-[11px]">Created: {act.createdAt}</div>
                  </div>
                </div>

                {/* Reason & Evidence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider block mb-1">Reasoning</span>
                    <p className="text-slate-800 font-medium">{act.reason}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider block mb-1">Supporting Evidence</span>
                    <ul className="text-slate-700 list-disc pl-4 space-y-0.5">
                      {act.supportingEvidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Draft Communication Box */}
                <div className="bg-[#101827] text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-[#1E2E48]">
                  <div className="flex items-center justify-between text-[#C8AA72] font-bold border-b border-slate-800 pb-2">
                    <span>AI GENERATED DRAFT COMMUNICATION</span>
                    {act.status === 'Pending Approval' && (
                      <button
                        onClick={() => {
                          setEditingActionId(act.id);
                          setDraftText(act.draftCommunication);
                        }}
                        className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Draft
                      </button>
                    )}
                  </div>

                  {editingActionId === act.id ? (
                    <textarea
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      className="w-full h-32 p-3 bg-slate-950 text-slate-100 border border-[#B08D57] rounded font-mono text-xs focus:outline-none"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap text-slate-200 text-[11px] leading-relaxed">{act.draftCommunication}</pre>
                  )}
                </div>

                {/* Decision Bar */}
                {act.status === 'Pending Approval' ? (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Human approval mandatory before proceeding
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleReject(act.id)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-all"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(act.id)}
                        className="px-5 py-2 bg-[#172A46] hover:bg-[#0F1B2D] text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <Check className="w-4 h-4 text-[#C8AA72]" /> Approve Action
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Approved by {act.approvedBy || 'Admin'} at {act.approvedAt || '10:36 AM'}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      {act.status}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
