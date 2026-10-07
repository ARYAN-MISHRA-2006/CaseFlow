'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useCaseFlow } from '@/lib/store';
import {
  Briefcase,
  Calendar,
  Building,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  HelpCircle,
  FileCode,
  Zap,
  UploadCloud,
  ChevronRight,
  ShieldAlert,
  Info,
  Sparkles,
  Layers,
  Check,
  X,
  Edit3,
} from 'lucide-react';

function WorkspaceContent() {
  const params = useParams();
  const caseId = (params?.id as string)?.toUpperCase();
  const { getCase, approveAction, rejectAction, reAnalyzeCase } = useCaseFlow();

  const caseData = getCase(caseId);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'documents' | 'analysis' | 'bottlenecks' | 'actions' | 'activity'>('overview');
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [actionDraftText, setActionDraftText] = useState<string>('');

  if (!caseData) {
    return (
      <div className="flex-1 pb-16 bg-slate-50 min-h-screen">
        <Header />
        <main className="px-8 mt-12 text-center max-w-xl mx-auto">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto" />
            <h2 className="text-lg font-serif font-bold text-slate-900">Case #{caseId} Not Found</h2>
            <p className="text-xs text-slate-500">The requested synthetic case file does not exist in the demonstration repository.</p>
            <Link
              href="/cases"
              className="inline-block px-4 py-2 bg-[#172A46] hover:bg-[#0F1B2D] text-white font-semibold text-xs rounded-lg shadow-xs"
            >
              Return to Case Directory
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const activeBottleneck = caseData.bottlenecks.find((b) => !b.isResolved) || caseData.bottlenecks[0];
  const pendingAction = caseData.actions.find((a) => a.status === 'Pending Approval') || caseData.actions[0];

  const handleApprove = (actionId: string) => {
    approveAction(actionId, editingActionId === actionId ? actionDraftText : undefined);
    setEditingActionId(null);
  };

  const handleReject = (actionId: string) => {
    const reason = prompt('Please enter reason for rejecting action:', 'Administrative grounds / insufficient evidence');
    if (reason) {
      rejectAction(actionId, reason);
    }
  };

  return (
    <div className="flex-1 pb-16 bg-slate-50 min-h-screen">
      <Header />

      <main className="px-8 mt-6 space-y-6 max-w-7xl mx-auto">
        {/* Workspace Top Header Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-lg text-[#172A46]">{caseData.id}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-700">{caseData.caseType}</span>
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    caseData.priority === 'CRITICAL'
                      ? 'bg-red-50 text-[#C62828] border border-red-200'
                      : caseData.priority === 'HIGH'
                      ? 'bg-amber-50 text-[#D97706] border border-amber-200'
                      : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                  }`}
                >
                  {caseData.priority} Priority
                </span>
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    caseData.status === 'Potentially Unblocked' || caseData.status === 'Resolved'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {caseData.status}
                </span>
              </div>
              <h1 className="text-xl font-serif font-bold text-slate-900">{caseData.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {caseData.court}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Filed: {caseData.filedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Last Activity: {caseData.lastActivityDate} ({caseData.daysInactive} days inactive)
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => reAnalyzeCase(caseData.id)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Re-Analyze Case</span>
              </button>

              <Link
                href="/upload"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all"
              >
                <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload Document</span>
              </Link>

              {pendingAction && (
                <button
                  onClick={() => setActiveTab('actions')}
                  className="px-4 py-2 bg-[#172A46] hover:bg-[#0F1B2D] text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8AA72]" />
                  <span>Review Actions</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs">
          <nav className="flex space-x-6 text-xs font-semibold overflow-x-auto">
            {([
              { id: 'overview', label: 'Overview' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'documents', label: 'Documents', badge: caseData.documents.length },
              { id: 'analysis', label: 'Analysis' },
              { id: 'bottlenecks', label: 'Bottlenecks', badge: caseData.bottlenecks.filter((b) => !b.isResolved).length },
              { id: 'actions', label: 'Actions', badge: caseData.actions.filter((a) => a.status === 'Pending Approval').length },
              { id: 'activity', label: 'Activity' },
            ] as Array<{ id: string; label: string; badge?: number }>).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 border-b-2 font-bold flex items-center space-x-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#172A46] text-[#172A46]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                      tab.id === 'bottlenecks' || tab.id === 'actions'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Info className="w-4 h-4 text-[#172A46]" />
                    <span>Structured Case Information & AI Confidence</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    CaseFlow strictly separates verified facts, inferred relationships, and unconfirmed items.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> CONFIRMED FACT
                  </span>
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" /> AI INFERENCE
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded font-semibold flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-slate-500" /> UNKNOWN
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {caseData.facts.map((fact) => (
                  <div key={fact.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-500 uppercase tracking-wider">{fact.field}</span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          fact.type === 'CONFIRMED FACT'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : fact.type === 'AI INFERENCE'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {fact.type} ({(fact.confidence * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{fact.value}</p>
                    {fact.sourceDocument ? (
                      <div className="text-[11px] text-[#172A46] font-medium flex items-center gap-1 pt-1 border-t border-slate-200">
                        <FileText className="w-3 h-3 text-[#B08D57]" />
                        <span>Source: {fact.sourceDocument}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 font-normal italic pt-1 border-t border-slate-200">
                        Not found in provided documents.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-[#172A46]" />
                <span>Litigants & Counsel Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseData.parties.map((party, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{party.name}</span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-700 rounded border border-slate-300">
                          {party.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Counsel: <strong>{party.counsel || 'Unrepresented / Not Recorded'}</strong></p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        party.status === 'Complied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : party.status === 'Non-responsive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {party.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Chronological Case Timeline</h2>
                <p className="text-xs text-slate-500 mt-0.5">Automated sequence reconstructed from synthetic filing records and orders</p>
              </div>
              <span className="text-xs text-slate-500 font-semibold">{caseData.timeline.length} Recorded Events</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {caseData.timeline.map((event) => (
                <div key={event.id} className="relative group">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#172A46] ring-4 ring-white border border-[#0F1B2D] flex items-center justify-center"></div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-[#172A46] transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-[#172A46] bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300">
                          {event.date}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{event.eventType}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">Confidence: {(event.confidence * 100).toFixed(0)}%</span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">{event.description}</p>

                    {event.sourceDocument && (
                      <div className="pt-2 border-t border-slate-200 flex items-center space-x-2 text-[11px] text-[#172A46] font-semibold">
                        <FileText className="w-3.5 h-3.5 text-[#B08D57]" />
                        <span>Source Document: {event.sourceDocument}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Case Document Repository</h2>
                <p className="text-xs text-slate-500 mt-0.5">Synthetic files processed by CaseUnderstandingAgent</p>
              </div>
              <Link
                href="/upload"
                className="px-3 py-1.5 bg-[#172A46] hover:bg-[#0F1B2D] text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#C8AA72]" /> Upload File
              </Link>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {caseData.documents.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded bg-slate-100 border border-slate-300 text-[#172A46] flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                      {doc.fileType}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{doc.fileName}</span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded">
                          {doc.documentType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{doc.summary}</p>
                      <div className="text-[11px] text-slate-400 mt-1 space-x-3">
                        <span>Uploaded: {doc.uploadedAt}</span>
                        <span>Size: {doc.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ANALYSIS */}
        {activeTab === 'analysis' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-[#172A46]" />
              <span>Structured Case JSON & Agent Diagnostics</span>
            </h2>
            <p className="text-xs text-slate-500">Output generated by CaseUnderstandingAgent for downstream reasoning</p>

            <div className="bg-[#101827] text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-96">
              <pre>{JSON.stringify(caseData, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* TAB 5: BOTTLENECKS */}
        {activeTab === 'bottlenecks' && (
          <div className="space-y-6">
            {activeBottleneck ? (
              <div
                className={`p-6 rounded-xl border shadow-xs space-y-6 ${
                  activeBottleneck.isResolved
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-amber-50/40 border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        activeBottleneck.isResolved ? 'bg-[#16805C] text-white' : 'bg-[#D97706] text-white'
                      }`}
                    >
                      {activeBottleneck.isResolved ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-bold text-xs uppercase tracking-wider ${
                            activeBottleneck.isResolved ? 'text-emerald-800' : 'text-amber-900'
                          }`}
                        >
                          {activeBottleneck.isResolved ? '✓ BOTTLENECK RESOLVED' : '⚠ BOTTLENECK DETECTED'}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-red-100 text-red-800 border border-red-200">
                          {activeBottleneck.severity} OPERATIONAL PRIORITY
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 mt-1">{activeBottleneck.type}</h2>
                      <p className="text-xs text-slate-600 mt-0.5">{activeBottleneck.description}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="font-bold text-slate-700">Duration: {activeBottleneck.durationDays} days</div>
                    <div className="text-slate-500 mt-0.5">Confidence: {(activeBottleneck.confidence * 100).toFixed(0)}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#172A46]" />
                      <span>Supporting Evidence Trail</span>
                    </h3>
                    <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                      {activeBottleneck.supportingEvidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      <span>Potential Administrative Impact</span>
                    </h3>
                    <p className="text-xs text-slate-600">{activeBottleneck.potentialImpact}</p>
                  </div>
                </div>

                {/* Visual Dependency Graph */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-[#172A46]" />
                        <span>Case Dependency Graph</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Visual procedural chain explaining why case progress is stalled</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
                    {(activeBottleneck.dependencyNodes || [
                      { id: 'n1', label: 'Court Order', status: 'completed' },
                      { id: 'n2', label: 'Evidence Requested', status: 'completed' },
                      { id: 'n3', label: 'Party A Evidence', status: 'completed' },
                      { id: 'n4', label: 'Party B Evidence', status: 'missing' },
                      { id: 'n5', label: 'CASE STALLED', status: 'blocked' },
                    ]).map((node, i, arr) => (
                      <React.Fragment key={node.id}>
                        <div
                          className={`p-3.5 rounded-xl border flex-1 w-full text-center space-y-1 transition-all ${
                            node.status === 'completed'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : node.status === 'missing'
                              ? 'bg-red-50 border-red-300 text-red-900 ring-2 ring-red-400/30'
                              : node.status === 'blocked'
                              ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-1 text-xs font-bold">
                            {node.status === 'completed' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            {node.status === 'missing' && <X className="w-3.5 h-3.5 text-red-600" />}
                            {node.status === 'blocked' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                            <span>{node.label}</span>
                          </div>
                          {node.detail && <p className="text-[10px] text-slate-500">{node.detail}</p>}
                        </div>

                        {i < arr.length - 1 && (
                          <div className="hidden md:block text-slate-300">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="bg-[#172A46] text-white p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8AA72]">Action Recommendation Agent</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      Suggested Action: {pendingAction ? pendingAction.actionType : 'Investigate missing evidence'}
                    </h4>
                  </div>
                  <button
                    onClick={() => setActiveTab('actions')}
                    className="px-4 py-2 bg-[#B08D57] hover:bg-[#C8AA72] text-[#0F1B2D] font-bold text-xs rounded-lg shadow-xs transition-all shrink-0"
                  >
                    Review Recommended Action
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">No Actionable Bottleneck Identified</h3>
                <p className="text-xs text-slate-500">Case files appear up to date with regular procedural progress.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ACTIONS */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Recommended Administrative Actions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Mandatory Human-in-the-loop review before any external step is taken</p>
              </div>
            </div>

            <div className="space-y-4">
              {caseData.actions.map((act) => (
                <div key={act.id} className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{act.actionType}</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            act.status === 'Pending Approval'
                              ? 'bg-amber-100 text-amber-800'
                              : act.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {act.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">Reason: <strong>{act.reason}</strong></p>
                    </div>

                    <div className="text-right text-xs">
                      <span className="font-bold text-[#172A46]">AI Confidence: {(act.confidence * 100).toFixed(0)}%</span>
                      <div className="text-slate-400 text-[11px] mt-0.5">Created: {act.createdAt}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Generated Draft Communication:</span>
                      {act.status === 'Pending Approval' && (
                        <button
                          onClick={() => {
                            setEditingActionId(act.id);
                            setActionDraftText(act.draftCommunication);
                          }}
                          className="text-[#172A46] hover:underline text-[11px] flex items-center gap-1 font-semibold"
                        >
                          <Edit3 className="w-3 h-3" /> Edit Draft
                        </button>
                      )}
                    </div>

                    {editingActionId === act.id ? (
                      <textarea
                        value={actionDraftText}
                        onChange={(e) => setActionDraftText(e.target.value)}
                        className="w-full h-32 p-3 text-xs bg-white border border-[#172A46] rounded font-mono text-slate-800 focus:outline-none"
                      />
                    ) : (
                      <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{act.draftCommunication}</pre>
                    )}
                  </div>

                  {act.status === 'Pending Approval' ? (
                    <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleReject(act.id)}
                        className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-all"
                      >
                        Reject Action
                      </button>
                      <button
                        onClick={() => handleApprove(act.id)}
                        className="px-4 py-1.5 bg-[#172A46] hover:bg-[#0F1B2D] text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Action
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic pt-2 border-t border-slate-100">
                      Action approved by {act.approvedBy} at {act.approvedAt}.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Audit Trail for Case #{caseData.id}</h2>

            <div className="space-y-3">
              {useCaseFlow()
                .auditLogs.filter((l) => l.caseId === caseData.id)
                .map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>
                        [{log.agentRole}] {log.action}
                      </span>
                      <span className="text-slate-400 font-normal text-[11px]">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600">{log.outputDetails}</p>
                    {log.humanDecision && (
                      <div className="text-[#172A46] font-semibold text-[11px] pt-1">Decision: {log.humanDecision}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CaseWorkspacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Case Workspace...</div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
