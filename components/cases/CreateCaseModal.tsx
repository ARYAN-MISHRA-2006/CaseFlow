'use client';

import React, { useState, useEffect } from 'react';
import { useCaseFlow, CreateCaseParams } from '@/lib/store';
import { CaseItem, CaseStage, Priority, CaseStatus } from '@/types';
import { X, Plus, AlertCircle, Scale, Building, Calendar, User, ShieldAlert } from 'lucide-react';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCase: CaseItem) => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { createCase } = useCaseFlow();

  const [title, setTitle] = useState('');
  const [caseType, setCaseType] = useState('Civil Litigation');
  const [court, setCourt] = useState('Fictional District Court');
  const [filedDate, setFiledDate] = useState('');
  const [plaintiffName, setPlaintiffName] = useState('');
  const [plaintiffCounsel, setPlaintiffCounsel] = useState('');
  const [defendantName, setDefendantName] = useState('');
  const [defendantCounsel, setDefendantCounsel] = useState('');
  const [currentStage, setCurrentStage] = useState<CaseStage>('Discovery / Evidence');
  const [status, setStatus] = useState<CaseStatus>('Active');
  const [priority, setPriority] = useState<Priority>('HIGH');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Keyboard shortcut listener (ESC to close) & default date setup
  useEffect(() => {
    if (isOpen) {
      if (!filedDate) {
        setFiledDate(new Date().toISOString().split('T')[0]);
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate mandatory required fields
    if (!title.trim()) {
      setValidationError('Case Title is required.');
      return;
    }
    if (!caseType.trim()) {
      setValidationError('Case Type is required.');
      return;
    }
    if (!court.trim()) {
      setValidationError('Court name is required.');
      return;
    }
    if (!filedDate.trim()) {
      setValidationError('Filing Date is required.');
      return;
    }
    if (!plaintiffName.trim()) {
      setValidationError('Plaintiff / Petitioner Name is required.');
      return;
    }
    if (!defendantName.trim()) {
      setValidationError('Defendant / Respondent Name is required.');
      return;
    }

    try {
      const params: CreateCaseParams = {
        title: title.trim(),
        caseType: caseType.trim(),
        court: court.trim(),
        filedDate: filedDate.trim(),
        plaintiffName: plaintiffName.trim(),
        plaintiffCounsel: plaintiffCounsel.trim() || undefined,
        defendantName: defendantName.trim(),
        defendantCounsel: defendantCounsel.trim() || undefined,
        currentStage,
        status,
        priority,
        description: description.trim() || undefined,
      };

      const created = createCase(params);

      // Reset form
      setTitle('');
      setPlaintiffName('');
      setPlaintiffCounsel('');
      setDefendantName('');
      setDefendantCounsel('');
      setDescription('');

      onSuccess(created);
      onClose();
    } catch (err: any) {
      setValidationError(err.message || 'Failed to create new case.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-case-title"
    >
      <div
        className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0F1B2D] text-white px-6 py-4 flex items-center justify-between border-b border-[#1E2E48]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#172A46] border border-[#B08D57]/40 flex items-center justify-center text-[#B08D57]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 id="create-case-title" className="text-base font-serif font-bold tracking-wide">
                Create New Synthetic Case
              </h2>
              <p className="text-[11px] text-slate-300">
                Institutional Case Management System • Synthetic Demo Mode
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center space-x-2 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Section 1: Basic Case Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#172A46] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#B08D57]" /> Basic Case Details
            </h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Case Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rohan Verma vs Neel Kapoor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#172A46]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Case Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#172A46]"
                  required
                >
                  <option value="Civil Litigation">Civil Litigation</option>
                  <option value="Commercial Dispute">Commercial Dispute</option>
                  <option value="Property Dispute">Property Dispute</option>
                  <option value="Contract Dispute">Contract Dispute</option>
                  <option value="Family Matter">Family Matter</option>
                  <option value="Recovery Suit">Recovery Suit</option>
                  <option value="Arbitration Petition">Arbitration Petition</option>
                  <option value="Constitutional Writ">Constitutional Writ</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Court / Tribunal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fictional District Court — Bench 2"
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#172A46]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Filing Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={filedDate}
                  onChange={(e) => setFiledDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#172A46]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Procedural Stage</label>
                <select
                  value={currentStage}
                  onChange={(e) => setCurrentStage(e.target.value as CaseStage)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#172A46]"
                >
                  <option value="Pleadings">Pleadings</option>
                  <option value="Discovery / Evidence">Discovery / Evidence</option>
                  <option value="Pre-Trial Motion">Pre-Trial Motion</option>
                  <option value="Hearing">Hearing</option>
                  <option value="Judgment Pending">Judgment Pending</option>
                  <option value="Compliance / Execution">Compliance / Execution</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#172A46]"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Parties Information */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-[#172A46] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#B08D57]" /> Litigant & Counsel Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plaintiff / Petitioner */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Plaintiff / Petitioner
                </span>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Plaintiff Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rohan Verma"
                    value={plaintiffName}
                    onChange={(e) => setPlaintiffName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-slate-900 font-semibold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Plaintiff Counsel</label>
                  <input
                    type="text"
                    placeholder="e.g. Adv. A. Sharma"
                    value={plaintiffCounsel}
                    onChange={(e) => setPlaintiffCounsel(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>

              {/* Defendant / Respondent */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Defendant / Respondent
                </span>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Defendant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Neel Kapoor"
                    value={defendantName}
                    onChange={(e) => setDefendantName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-slate-900 font-semibold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Defendant Counsel</label>
                  <input
                    type="text"
                    placeholder="e.g. Adv. K. Mehta"
                    value={defendantCounsel}
                    onChange={(e) => setDefendantCounsel(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Status & Optional Description */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Initial Case Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CaseStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#172A46]"
                >
                  <option value="Active">Active</option>
                  <option value="Requires Attention">Requires Attention</option>
                  <option value="Awaiting Response">Awaiting Response</option>
                  <option value="Bottleneck Detected">Bottleneck Detected</option>
                </select>
              </div>

              <div className="flex items-center pt-5 text-slate-500 text-[11px]">
                <ShieldAlert className="w-4 h-4 text-[#B08D57] mr-1.5 shrink-0" />
                <span>Case ID will be generated automatically in collision-safe sequence (e.g. CF-1215).</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Case Description (Optional)</label>
              <textarea
                placeholder="Brief summary of dispute background..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#172A46]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">
              * Required fields
            </span>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#172A46] hover:bg-[#0F1B2D] text-white font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-all"
              >
                <Plus className="w-4 h-4 text-[#C8AA72]" />
                <span>Create Case</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
