'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { useCaseFlow } from '@/lib/store';
import { UploadCloud, FileText, CheckCircle2, Sparkles, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function DocumentUploadPage() {
  const { simulateNewDocumentUpload, cases } = useCaseFlow();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CF-1024');
  const [fileName, setFileName] = useState<string>('PartyB_Counter_Evidence_Submission.pdf');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const PROCESS_STEPS = [
    'Uploading synthetic case document...',
    'Extracting raw document text & OCR verification...',
    'CaseUnderstandingAgent: Identifying parties & court orders...',
    'Reconstructing chronological case timeline...',
    'BottleneckAgent: Scanning for pending actions & friction...',
    'Analysis complete! Updating case state.',
  ];

  const handleStartUpload = () => {
    setIsProcessing(true);
    setIsComplete(false);
    setStepIndex(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < PROCESS_STEPS.length) {
        setStepIndex(currentStep);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setIsComplete(true);
        simulateNewDocumentUpload(selectedCaseId, fileName, 'PDF');
      }
    }, 600);
  };

  return (
    <div className="flex-1 pb-12 bg-slate-50 min-h-screen">
      <Header title="Document Ingestion & Analysis" subtitle="Upload synthetic case documents for automated Agent analysis" />

      <main className="px-8 mt-6 space-y-6 max-w-4xl mx-auto">
        {/* Upload Card */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Synthetic Document Ingestion Simulator</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a target case and file format (PDF, DOCX, TXT) to trigger automated ingestion and AI analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Case Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Target Case</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                disabled={isProcessing}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Simulated File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                disabled={isProcessing}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl p-8 text-center space-y-3">
            <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto" />
            <div>
              <p className="text-xs font-bold text-slate-800">Drag synthetic PDF / DOCX / TXT files here</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Maximum file size: 25 MB (Synthetic Processing)</p>
            </div>
            <button
              onClick={handleStartUpload}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Start Ingestion & Analysis
                </>
              )}
            </button>
          </div>

          {/* Processing Steps Animation */}
          {isProcessing && (
            <div className="bg-slate-900 text-slate-100 p-6 rounded-xl space-y-4 shadow-lg font-mono text-xs">
              <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-slate-800 pb-2">
                <span>AGENT PIPELINE PROCESSING</span>
                <span>STEP {stepIndex + 1} OF 6</span>
              </div>

              <div className="space-y-2">
                {PROCESS_STEPS.map((step, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    {idx < stepIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : idx === stepIndex ? (
                      <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span
                      className={
                        idx < stepIndex
                          ? 'text-slate-400 line-through'
                          : idx === stepIndex
                          ? 'text-white font-bold'
                          : 'text-slate-600'
                      }
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ingestion Completion Card */}
          {isComplete && (
            <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-900">Document Processed Successfully</h3>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Extracted text structured and integrated into case file #{selectedCaseId}.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Link
                  href={`/cases/${selectedCaseId}`}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
                >
                  <span>Inspect Case Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setIsComplete(false)}
                  className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-100"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
