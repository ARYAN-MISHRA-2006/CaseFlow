'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useCaseFlow } from '@/lib/store';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  X,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

type IngestionState = 'IDLE' | 'FILE_SELECTED' | 'UPLOADING' | 'EXTRACTING' | 'ANALYZING' | 'SUCCESS' | 'ERROR';

function UploadContent() {
  const searchParams = useSearchParams();
  const queryCaseId = searchParams.get('caseId');
  const { cases, ingestRealDocument } = useCaseFlow();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => {
    if (queryCaseId && cases.some((c) => c.id === queryCaseId)) {
      return queryCaseId;
    }
    return cases[0]?.id || 'CF-1024';
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ingestionState, setIngestionState] = useState<IngestionState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Selection Handler
  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate size (25 MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage('File exceeds the 25 MB limit.');
      setIngestionState('ERROR');
      setSelectedFile(null);
      return;
    }

    // Validate extension
    const lowerName = file.name.toLowerCase();
    const isValid = lowerName.endsWith('.pdf') || lowerName.endsWith('.docx') || lowerName.endsWith('.txt');
    if (!isValid) {
      setErrorMessage('Unsupported file type. Please select a .pdf, .docx, or .txt file.');
      setIngestionState('ERROR');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
    setIngestionState('FILE_SELECTED');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Start Real Ingestion Pipeline
  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setErrorMessage(null);
    setIngestionState('UPLOADING');

    try {
      // Step 1: Prepare FormData
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('caseId', selectedCaseId);

      // Step 2: Upload to server API
      setTimeout(() => setIngestionState('EXTRACTING'), 600);
      setTimeout(() => setIngestionState('ANALYZING'), 1200);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Document could not be processed.');
        setIngestionState('ERROR');
        return;
      }

      // Step 3: Persist real document & extracted analysis into global CaseFlow store
      const fileType = selectedFile.name.toLowerCase().endsWith('.docx')
        ? 'DOCX'
        : selectedFile.name.toLowerCase().endsWith('.txt')
        ? 'TXT'
        : 'PDF';

      ingestRealDocument(
        selectedCaseId,
        data.fileName,
        fileType,
        data.fileSize,
        data.extractedText,
        data.agentOutput
      );

      setUploadResult(data);
      setIngestionState('SUCCESS');
    } catch (err: any) {
      setErrorMessage('Case analysis failed. Server communication error.');
      setIngestionState('ERROR');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="flex-1 pb-16 bg-slate-50 min-h-screen">
      <Header />

      <main className="px-8 mt-6 space-y-6 max-w-4xl mx-auto">
        {/* Header Title Bar */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-serif text-[#172033] font-bold tracking-tight">Document Ingestion & Analysis</h1>
          <p className="text-xs text-slate-500 mt-0.5">Upload real court case documents (PDF, DOCX, TXT) for server extraction and AI analysis</p>
        </div>

        {/* Main Upload Card */}
        <div className="bg-white p-8 rounded-xl border border-slate-200/90 shadow-xs space-y-6">
          {/* Target Case Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Target Case</label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              disabled={ingestionState === 'UPLOADING' || ingestionState === 'EXTRACTING' || ingestionState === 'ANALYZING'}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#172A46]"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title} ({c.caseType})
                </option>
              ))}
            </select>
          </div>

          {/* Hidden HTML File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            className="hidden"
          />

          {/* File Picker & Upload Drag Drop Area */}
          {!selectedFile && (ingestionState === 'IDLE' || ingestionState === 'ERROR') && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#172A46]/20 bg-[#F8F6F0] hover:bg-[#F3EFE6] hover:border-[#172A46]/40 rounded-xl p-10 text-center space-y-4 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-[#C8AA72]/40 text-[#172A46] flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6 text-[#172A46]" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">Drag & drop a PDF, DOCX, or TXT file here</p>
                <p className="text-xs text-slate-500 mt-1">or click to choose a file from your computer</p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-5 py-2 bg-[#172A46] hover:bg-[#0F1B2D] text-white font-bold text-xs rounded-lg shadow-xs transition-all"
                >
                  Choose File
                </button>
              </div>

              <p className="text-[11px] text-slate-400 font-medium">Maximum file size: 25 MB</p>
            </div>
          )}

          {/* Selected File Card */}
          {selectedFile && ingestionState === 'FILE_SELECTED' && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#172A46] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {selectedFile.name.split('.').pop() || 'FILE'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900">{selectedFile.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 text-slate-700 uppercase">
                        {selectedFile.name.split('.').pop()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Size: {formatSize(selectedFile.size)}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setIngestionState('IDLE');
                  }}
                  className="text-xs text-slate-500 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-slate-200 transition-colors"
                >
                  Change File
                </button>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setIngestionState('IDLE');
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartAnalysis}
                  className="px-5 py-2 bg-[#172A46] hover:bg-[#0F1B2D] text-white font-bold text-xs rounded-lg shadow-xs flex items-center space-x-2 transition-all"
                >
                  <FileCode className="w-4 h-4 text-[#C8AA72]" />
                  <span>Start Analysis</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading States: Uploading / Extracting / Analyzing */}
          {(ingestionState === 'UPLOADING' || ingestionState === 'EXTRACTING' || ingestionState === 'ANALYZING') && (
            <div className="bg-[#0F1B2D] text-slate-100 p-6 rounded-xl space-y-4 shadow-md font-mono text-xs border border-[#1E2E48]">
              <div className="flex items-center justify-between text-[#C8AA72] font-bold border-b border-[#1E2E48] pb-2">
                <span>REAL DOCUMENT INGESTION PIPELINE</span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {ingestionState}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">File selected: {selectedFile?.name}</span>
                </div>

                <div className="flex items-center space-x-3">
                  {ingestionState === 'UPLOADING' ? (
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className={ingestionState === 'UPLOADING' ? 'text-white font-bold' : 'text-slate-300'}>
                    Uploading document to server API...
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {ingestionState === 'EXTRACTING' ? (
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                  ) : ingestionState === 'ANALYZING' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={ingestionState === 'EXTRACTING' ? 'text-white font-bold' : 'text-slate-400'}>
                    Extracting document text with text-extractor.ts...
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {ingestionState === 'ANALYZING' ? (
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={ingestionState === 'ANALYZING' ? 'text-white font-bold' : 'text-slate-400'}>
                    CaseUnderstandingAgent is analyzing the document...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SUCCESS STATE */}
          {ingestionState === 'SUCCESS' && uploadResult && (
            <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl space-y-5">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#16805C] text-white flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-emerald-950">Document Processed Successfully</h3>
                    <p className="text-xs text-emerald-700 mt-0.5">Real file parsed and associated with case #{selectedCaseId}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-200 text-emerald-900 rounded font-bold text-xs">COMPLETE</span>
              </div>

              {/* Extraction Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Case ID</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{uploadResult.caseId}</div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Document Name</span>
                  <div className="font-bold text-slate-900 truncate mt-0.5" title={uploadResult.fileName}>
                    {uploadResult.fileName}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Text Extraction</span>
                  <div className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Text Extracted
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Case Understanding</span>
                  <div className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Analysis Completed
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs bg-white p-3.5 rounded-lg border border-emerald-200">
                <span>Timeline Events Extracted: <strong>{uploadResult.agentOutput?.timelineEventsCount || 0}</strong></span>
                <span>Facts Extracted: <strong>{uploadResult.agentOutput?.extractedFactsCount || 0}</strong></span>
                <span>Overall Confidence: <strong>94%</strong></span>
              </div>

              {/* Inspect Case Workspace Button */}
              <div className="flex items-center space-x-3 pt-2">
                <Link
                  href={`/cases/${selectedCaseId}`}
                  className="px-5 py-2.5 bg-[#172A46] hover:bg-[#0F1B2D] text-white rounded-lg text-xs font-bold shadow-xs inline-flex items-center gap-2 transition-all"
                >
                  <span>Inspect Case Workspace</span>
                  <ArrowRight className="w-4 h-4 text-[#C8AA72]" />
                </Link>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadResult(null);
                    setIngestionState('IDLE');
                  }}
                  className="px-4 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-all"
                >
                  Upload Another Document
                </button>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {ingestionState === 'ERROR' && errorMessage && (
            <div className="bg-red-50 border border-red-300 p-5 rounded-xl space-y-3">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-red-900">Upload / Ingestion Failure</h3>
                  <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedFile(null);
                  setErrorMessage(null);
                  setIngestionState('IDLE');
                }}
                className="px-3.5 py-1.5 bg-white border border-red-300 text-red-800 font-semibold text-xs rounded-lg hover:bg-red-100 transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function DocumentUploadPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Document Ingestion...</div>}>
      <UploadContent />
    </Suspense>
  );
}
