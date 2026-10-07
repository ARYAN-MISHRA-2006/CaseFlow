'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CaseItem, RecommendedAction, AuditLogEntry, AnalyticsData, CaseDocument, CaseEvent, FactItem, CaseStage, CaseStatus, Priority } from '../types';
import { INITIAL_CASES, INITIAL_AUDIT_LOGS, INITIAL_ANALYTICS } from './mock-data';

export interface CreateCaseParams {
  title: string;
  caseType: string;
  court: string;
  filedDate: string;
  plaintiffName: string;
  plaintiffCounsel?: string;
  defendantName: string;
  defendantCounsel?: string;
  currentStage?: CaseStage;
  status?: CaseStatus;
  priority?: Priority;
  description?: string;
}

interface CaseFlowContextType {
  cases: CaseItem[];
  auditLogs: AuditLogEntry[];
  analytics: AnalyticsData;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  userRole: 'Admin' | 'Legal Staff' | 'Reviewer';
  setUserRole: (role: 'Admin' | 'Legal Staff' | 'Reviewer') => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
  toggleSidebar: () => void;
  getCase: (id: string) => CaseItem | undefined;
  createCase: (params: CreateCaseParams) => CaseItem;
  approveAction: (actionId: string, modifiedDraft?: string) => void;
  rejectAction: (actionId: string, reason: string) => void;
  simulateNewDocumentUpload: (caseId: string, fileName: string, fileType: 'PDF' | 'DOCX' | 'TXT') => void;
  ingestRealDocument: (
    caseId: string,
    fileName: string,
    fileType: 'PDF' | 'DOCX' | 'TXT',
    fileSize: string,
    extractedText: string,
    analysisResult?: any
  ) => void;
  simulatePartyBResponse: (caseId: string) => void;
  resetDemoData: () => void;
  reAnalyzeCase: (caseId: string) => void;
}

const CaseFlowContext = createContext<CaseFlowContextType | undefined>(undefined);

export const CaseFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [analytics, setAnalytics] = useState<AnalyticsData>(INITIAL_ANALYTICS);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'Admin' | 'Legal Staff' | 'Reviewer'>('Admin');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Load persisted demo state & sidebar state if present
  useEffect(() => {
    try {
      const storedCases = localStorage.getItem('caseflow_cases');
      if (storedCases) {
        const parsed: CaseItem[] = JSON.parse(storedCases);
        const missingInitial = INITIAL_CASES.filter((ic) => !parsed.some((c) => c.id === ic.id));
        const merged = [...parsed, ...missingInitial];
        setCases(merged);
      }
      const storedLogs = localStorage.getItem('caseflow_audit');
      if (storedLogs) {
        setAuditLogs(JSON.parse(storedLogs));
      }
      const storedSidebar = localStorage.getItem('caseflow_sidebar_collapsed');
      if (storedSidebar !== null) {
        setSidebarCollapsed(storedSidebar === 'true');
      }
    } catch {
      // Fallback to initial mock data
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('caseflow_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Save changes
  const saveState = (updatedCases: CaseItem[], updatedLogs: AuditLogEntry[]) => {
    setCases(updatedCases);
    setAuditLogs(updatedLogs);
    try {
      localStorage.setItem('caseflow_cases', JSON.stringify(updatedCases));
      localStorage.setItem('caseflow_audit', JSON.stringify(updatedLogs));
    } catch {
      // ignore
    }
  };

  const getCase = (id: string) => cases.find((c) => c.id === id);

  // Create New Persistent Synthetic Case
  const createCase = (params: CreateCaseParams): CaseItem => {
    const existingNumbers = cases
      .map((c) => {
        const match = c.id.match(/^CF-(\d+)$/i);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((n): n is number => n !== null && !isNaN(n));

    const maxId = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 1005;
    const newId = `CF-${maxId + 1}`;

    const formattedFiledDate = params.filedDate
      ? new Date(params.filedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newCase: CaseItem = {
      id: newId,
      title: params.title.trim(),
      caseType: params.caseType.trim(),
      court: params.court.trim(),
      filedDate: formattedFiledDate,
      currentStage: params.currentStage || 'Discovery / Evidence',
      lastActivityDate: 'Today',
      daysInactive: 0,
      priority: params.priority || 'HIGH',
      status: params.status || 'Active',
      parties: [
        {
          name: params.plaintiffName.trim(),
          role: 'Plaintiff',
          counsel: params.plaintiffCounsel?.trim() || undefined,
          status: 'Active',
        },
        {
          name: params.defendantName.trim(),
          role: 'Defendant',
          counsel: params.defendantCounsel?.trim() || undefined,
          status: 'Active',
        },
      ],
      facts: [],
      documents: [],
      timeline: [
        {
          id: `evt-init-${Date.now()}`,
          date: formattedFiledDate,
          eventType: 'Case Filed',
          description: `Synthetic case filed in ${params.court}. Parties: ${params.plaintiffName} vs ${params.defendantName}.`,
          confidence: 1.0,
        },
      ],
      bottlenecks: [],
      actions: [],
    };

    const updatedCases = [newCase, ...cases];
    const newLogs = addAuditLog(
      newId,
      'Human Admin',
      'Create Synthetic Case',
      `Created new synthetic case #${newId} "${newCase.title}" (${newCase.caseType}) in ${newCase.court}.`,
      newId,
      'Created Case'
    );

    setAnalytics((prev) => ({
      ...prev,
      totalCases: prev.totalCases + 1,
    }));

    saveState(updatedCases, newLogs);
    return newCase;
  };

  const addAuditLog = (
    caseId: string,
    agentRole: AuditLogEntry['agentRole'],
    action: string,
    outputDetails: string,
    inputReference?: string,
    humanDecision?: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      userOrAgent: agentRole === 'Human Admin' ? `Human (${userRole})` : agentRole,
      caseId,
      agentRole,
      action,
      inputReference,
      outputDetails,
      humanDecision,
      status: 'Completed',
    };
    return [newLog, ...auditLogs];
  };

  // 1. Approve Action (Human in the loop step)
  const approveAction = (actionId: string, modifiedDraft?: string) => {
    let targetCaseId = '';
    const updatedCases = cases.map((c) => {
      const updatedActions = c.actions.map((act) => {
        if (act.id === actionId) {
          targetCaseId = c.id;
          return {
            ...act,
            status: 'Approved' as const,
            draftCommunication: modifiedDraft || act.draftCommunication,
            approvedBy: `Human (${userRole})`,
            approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return act;
      });
      return { ...c, actions: updatedActions, status: c.status === 'Bottleneck Detected' ? ('Awaiting Action' as const) : c.status };
    });

    const newLogs = addAuditLog(
      targetCaseId || 'CF-1024',
      'Human Admin',
      'Approved Action Recommendation',
      `Approved recommendation for action ${actionId}. FollowUpAgent tracking initialized.`,
      actionId,
      modifiedDraft ? 'Approved with modifications' : 'Approved directly'
    );

    // Update analytics
    setAnalytics((prev) => ({
      ...prev,
      actionsAwaitingApproval: Math.max(0, prev.actionsAwaitingApproval - 1),
      actionsCompleted: prev.actionsCompleted + 1,
    }));

    saveState(updatedCases, newLogs);
  };

  // 2. Reject Action
  const rejectAction = (actionId: string, reason: string) => {
    let targetCaseId = '';
    const updatedCases = cases.map((c) => {
      const updatedActions = c.actions.map((act) => {
        if (act.id === actionId) {
          targetCaseId = c.id;
          return {
            ...act,
            status: 'Rejected' as const,
            rejectionReason: reason,
          };
        }
        return act;
      });
      return { ...c, actions: updatedActions };
    });

    const newLogs = addAuditLog(
      targetCaseId || 'CF-1024',
      'Human Admin',
      'Rejected Action Recommendation',
      `Action ${actionId} rejected by user. Reason: ${reason}`,
      actionId,
      'Rejected'
    );

    saveState(updatedCases, newLogs);
  };

  // 3. Ingest Real Document & Persist Case Understanding Output
  const ingestRealDocument = (
    caseId: string,
    fileName: string,
    fileType: 'PDF' | 'DOCX' | 'TXT',
    fileSize: string,
    extractedText: string,
    analysisResult?: any
  ) => {
    const updatedCases = cases.map((c) => {
      if (c.id === caseId) {
        const newDoc: CaseDocument = {
          id: `doc-real-${Date.now()}`,
          fileName,
          fileType,
          uploadedAt: 'Today',
          fileSize,
          status: 'Processed' as const,
          documentType: fileName.toLowerCase().includes('order')
            ? 'Court Order'
            : fileName.toLowerCase().includes('evidence')
            ? 'Evidence Submission'
            : 'Petition',
          summary: `Extracted text snippet (${extractedText.length} chars): "${extractedText.substring(0, 120)}..."`,
        };

        const newEvents: CaseEvent[] = analysisResult?.timeline || [
          {
            id: `evt-${Date.now()}`,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            eventType: 'Evidence Submitted',
            description: `Real document ingested: ${fileName}`,
            sourceDocument: fileName,
            confidence: 0.98,
          },
        ];

        const newFacts: FactItem[] = analysisResult?.facts || [
          {
            id: `f-real-${Date.now()}`,
            field: 'Document Ingestion',
            value: `Verified text extracted from ${fileName}`,
            type: 'CONFIRMED FACT',
            confidence: 0.99,
            sourceDocument: fileName,
          },
        ];

        return {
          ...c,
          documents: [newDoc, ...c.documents],
          timeline: [...c.timeline, ...newEvents.filter((ne) => !c.timeline.some((te) => te.id === ne.id))],
          facts: [...c.facts, ...newFacts.filter((nf) => !c.facts.some((tf) => tf.id === nf.id))],
          lastActivityDate: 'Today',
          daysInactive: 0,
        };
      }
      return c;
    });

    const newLogs = addAuditLog(
      caseId,
      'CaseUnderstandingAgent',
      'Real Document Ingestion & Analysis',
      `Parsed uploaded document "${fileName}" (${fileSize}). Extracted text & updated case timeline and facts.`,
      fileName
    );

    saveState(updatedCases, newLogs);
  };

  // 4. Simulate New Document Upload (for quick demo buttons)
  const simulateNewDocumentUpload = (caseId: string, fileName: string, fileType: 'PDF' | 'DOCX' | 'TXT') => {
    ingestRealDocument(caseId, fileName, fileType, '1.4 MB', `Synthetic Text for ${fileName}`);
  };

  // 5. Simulate Party B Response & Trigger Case Re-Analysis (Step 10-12 in Demo!)
  const simulatePartyBResponse = (caseId: string) => {
    const fileName = 'PartyB_Evidence_Response_Received.pdf';
    simulateNewDocumentUpload(caseId, fileName, 'PDF');
    setTimeout(() => {
      reAnalyzeCase(caseId);
    }, 400);
  };

  // 6. Re-analyze Case Loop (Step 11 & 12: BEFORE -> AFTER transition)
  const reAnalyzeCase = (caseId: string) => {
    const updatedCases = cases.map((c) => {
      if (c.id === caseId) {
        const resolvedBottlenecks = c.bottlenecks.map((b) => ({
          ...b,
          isResolved: true,
          dependencyNodes: b.dependencyNodes?.map((node) =>
            node.id === 'n3'
              ? { ...node, status: 'completed' as const, detail: 'Received and verified in repository' }
              : node.id === 'n4'
              ? { ...node, status: 'completed' as const, detail: 'Ready for pre-trial scheduling' }
              : node
          ),
        }));

        const completedActions = c.actions.map((act) => ({
          ...act,
          status: 'Completed' as const,
        }));

        const updatedFacts = [
          ...c.facts,
          {
            id: `f-res-${Date.now()}`,
            field: 'Party B Evidence Received',
            value: 'Verified document PartyB_Evidence_Response_Received.pdf uploaded',
            type: 'CONFIRMED FACT' as const,
            confidence: 0.98,
            sourceDocument: 'PartyB_Evidence_Response_Received.pdf',
          },
        ];

        return {
          ...c,
          status: 'Potentially Unblocked' as const,
          bottlenecks: resolvedBottlenecks,
          actions: completedActions,
          facts: updatedFacts,
          daysInactive: 0,
        };
      }
      return c;
    });

    const newLogs = addAuditLog(
      caseId,
      'BottleneckAgent',
      'Re-Analysis Loop Executed',
      `New evidence verified. Previous bottleneck 'Missing Document' is now RESOLVED. Case status updated to 'Potentially Unblocked'.`,
      'Re-analysis trigger'
    );

    setAnalytics((prev) => ({
      ...prev,
      requiresAttention: Math.max(0, prev.requiresAttention - 1),
      potentiallyUnblocked: prev.potentiallyUnblocked + 1,
      bottlenecksDetected: Math.max(0, prev.bottlenecksDetected - 1),
    }));

    saveState(updatedCases, newLogs);
  };

  // 7. Reset Demo Data
  const resetDemoData = () => {
    setCases(INITIAL_CASES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAnalytics(INITIAL_ANALYTICS);
    try {
      localStorage.removeItem('caseflow_cases');
      localStorage.removeItem('caseflow_audit');
    } catch {
      // ignore
    }
  };

  return (
    <CaseFlowContext.Provider
      value={{
        cases,
        auditLogs,
        analytics,
        demoMode,
        setDemoMode,
        userRole,
        setUserRole,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        getCase,
        createCase,
        approveAction,
        rejectAction,
        simulateNewDocumentUpload,
        ingestRealDocument,
        simulatePartyBResponse,
        resetDemoData,
        reAnalyzeCase,
      }}
    >
      {children}
    </CaseFlowContext.Provider>
  );
};

export const useCaseFlow = () => {
  const context = useContext(CaseFlowContext);
  if (!context) {
    throw new Error('useCaseFlow must be used within a CaseFlowProvider');
  }
  return context;
};
