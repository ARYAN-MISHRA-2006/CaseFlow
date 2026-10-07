'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { useCaseFlow } from '@/lib/store';
import { Settings, Sparkles, RefreshCw, UploadCloud, CheckCircle2, ShieldCheck, Cpu, Bot, Zap, Play } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { demoMode, setDemoMode, resetDemoData, simulatePartyBResponse, reAnalyzeCase, cases } = useCaseFlow();
  const [model, setModel] = useState('Gemini 1.5 Pro (Recommended)');
  const [demoMessage, setDemoMessage] = useState<string | null>(null);

  const triggerStep10Scenario = () => {
    setDemoMessage('Simulating Step 10: New Evidence received from Party B for CF-1024...');
    simulatePartyBResponse('CF-1024');

    setTimeout(() => {
      setDemoMessage('Step 11 & 12 Complete: CF-1024 re-analyzed! Bottleneck transitioned from Missing Evidence → RESOLVED.');
    }, 800);
  };

  const handleReset = () => {
    resetDemoData();
    setDemoMessage('Demo dataset reset to default initial state.');
  };

  return (
    <div className="flex-1 pb-12 bg-slate-50 min-h-screen">
      <Header title="Settings & Demo Controls" subtitle="Configure AI model parameters, system security, and hackathon presentation controls" />

      <main className="px-8 mt-6 space-y-6 max-w-5xl mx-auto">
        {demoMessage && (
          <div className="p-4 bg-indigo-900 text-white rounded-xl text-xs font-semibold flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>{demoMessage}</span>
            </div>
            <button onClick={() => setDemoMessage(null)} className="text-indigo-300 hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        {/* DEMO MODE PRESENTATION CONTROLS (Requested Feature 40) */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-xl shadow-md border border-purple-800/40 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-purple-300" />
              <div>
                <h2 className="text-base font-bold text-white">Hackathon Presentation & Demo Controls</h2>
                <p className="text-xs text-purple-200/80">
                  Simulate live events during your 2–3 minute hackathon pitch (Steps 1 to 13)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-purple-200">Demo Mode:</span>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  demoMode ? 'bg-purple-500 text-white shadow' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {demoMode ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {/* Action 1: Simulate Party B Response */}
            <button
              onClick={triggerStep10Scenario}
              className="p-4 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 rounded-xl text-left space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between">
                <Play className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
                <span className="text-[10px] font-bold bg-purple-500/30 px-2 py-0.5 rounded text-purple-200">Step 10-12 Story</span>
              </div>
              <div className="text-xs font-bold text-white">Simulate Party B Evidence Ingestion</div>
              <p className="text-[11px] text-purple-200/70">
                Uploads missing evidence for CF-1024, executes re-analysis loop, and resolves bottleneck.
              </p>
            </button>

            {/* Action 2: Force Re-analyze */}
            <button
              onClick={() => {
                reAnalyzeCase('CF-1024');
                setDemoMessage('CF-1024 re-analyzed by BottleneckAgent.');
              }}
              className="p-4 bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/40 rounded-xl text-left space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between">
                <Zap className="w-4 h-4 text-indigo-300 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold bg-indigo-500/30 px-2 py-0.5 rounded text-indigo-200">Loop Trigger</span>
              </div>
              <div className="text-xs font-bold text-white">Trigger Re-Analysis Loop</div>
              <p className="text-[11px] text-indigo-200/70">Executes CaseFlowOrchestrator re-evaluation of case bottlenecks.</p>
            </button>

            {/* Action 3: Reset Demo */}
            <button
              onClick={handleReset}
              className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left space-y-2 transition-all"
            >
              <div className="flex items-center justify-between">
                <RefreshCw className="w-4 h-4 text-slate-300" />
                <span className="text-[10px] font-bold bg-slate-700 px-2 py-0.5 rounded text-slate-300">Restore State</span>
              </div>
              <div className="text-xs font-bold text-white">Reset Demo Dataset</div>
              <p className="text-[11px] text-slate-400">Restores initial 5 synthetic cases to initial stalled state.</p>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-purple-300/80 font-mono">
            Direct Workspace Link: <Link href="/cases/CF-1024" className="underline font-bold text-white">Open CF-1024 Workspace</Link>
          </div>
        </div>

        {/* AI Provider & Model Configuration */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>AI Model & Provider Configuration</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Reasoning Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Gemini 1.5 Pro (Recommended)">Google Gemini 1.5 Pro (Structured Context)</option>
                <option value="Gemini 1.5 Flash">Google Gemini 1.5 Flash (Low Latency)</option>
                <option value="Local Llama 3 70B">Local Llama 3 70B (Air-gapped Legal Vault)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confidence Threshold</label>
              <input
                type="text"
                value="0.80 (80% minimum for high-priority recommendation)"
                readOnly
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Agent Monitor */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>Modular Agent Fleet Status</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              { name: 'CaseUnderstandingAgent', status: 'Online', role: 'Ingest & Structure' },
              { name: 'BottleneckAgent', status: 'Online', role: 'Friction Detection' },
              { name: 'ActionRecommendationAgent', status: 'Online', role: 'Safe Next Steps' },
              { name: 'FollowUpAgent', status: 'Online', role: 'Outcome Tracking' },
            ].map((agent, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-[11px] truncate">{agent.name}</span>
                  <span className="text-emerald-600 text-[10px] font-bold">● {agent.status}</span>
                </div>
                <p className="text-[10px] text-slate-500">{agent.role}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
