'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CaseItem, RecommendedAction, AuditLogEntry, AnalyticsData } from '../types';
import { INITIAL_CASES, INITIAL_AUDIT_LOGS, INITIAL_ANALYTICS } from './mock-data';

interface CaseFlowContextType {
  cases: CaseItem[];
  auditLogs: AuditLogEntry[];
  analytics: AnalyticsData;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  userRole: 'Admin' | 'Legal Staff' | 'Reviewer';
  setUserRole: (role: 'Admin' | 'Legal Staff' | 'Reviewer') => void;
  getCase: (id: string) => CaseItem | undefined;
  approveAction: (actionId: string, modifiedDraft?: string) => void;
  rejectAction: (actionId: string, reason: string) => void;
  simulateNewDocumentUpload: (caseId: string, fileName: string, fileType: 'PDF' | 'DOCX' | 'TXT') => void;
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

  // Load persisted demo state if present
  useEffect(() => {
    try {
      const storedCases = localStorage.getItem('caseflow_cases');
      if (storedCases) {
        setCases(JSON.parse(storedCases));
      }
      const storedLogs = localStorage.getItem('caseflow_audit');
      if (storedLogs) {
        setAuditLogs(JSON.parse(storedLogs));
      }
    } catch {
      // Fallback to initial mock data
    }
  }, []);

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

  // 3. Simulate New Document Upload
  const simulateNewDocumentUpload = (caseId: string, fileName: string, fileType: 'PDF' | 'DOCX' | 'TXT') => {
    const updatedCases = cases.map((c) => {
      if (c.id === caseId) {
        const newDoc = {
          id: `doc-${Date.now()}`,
          fileName,
          fileType,
          uploadedAt: 'Today',
          fileSize: '1.4 MB',
          status: 'Processed' as const,
          documentType: 'Evidence Submission' as const,
          summary: `New evidence submission file ${fileName} uploaded for Party B (Defendant).`,
        };
        const newEvent = {
          id: `t-${Date.now()}`,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          eventType: 'Evidence Submitted' as const,
          description: `Party B submitted documentary evidence (${fileName}).`,
          sourceDocument: fileName,
          confidence: 0.96,
        };
        return {
          ...c,
          documents: [newDoc, ...c.documents],
          timeline: [...c.timeline, newEvent],
          lastActivityDate: 'Today',
          daysInactive: 0,
        };
      }
      return c;
    });

    const newLogs = addAuditLog(
      caseId,
      'CaseUnderstandingAgent',
      'Document Ingestion & Analysis',
      `Processed new document ${fileName}. Updating timeline and facts.`,
      fileName
    );

    saveState(updatedCases, newLogs);
  };

  // 4. Simulate Party B Response & Trigger Case Re-Analysis (Step 10-12 in Demo!)
  const simulatePartyBResponse = (caseId: string) => {
    const fileName = 'PartyB_Evidence_Response_Received.pdf';

    // Step A: Insert doc & timeline
    simulateNewDocumentUpload(caseId, fileName, 'PDF');

    // Step B: Re-analyze case and resolve bottleneck
    setTimeout(() => {
      reAnalyzeCase(caseId);
    }, 400);
  };

  // 5. Re-analyze Case Loop (Step 11 & 12: BEFORE -> AFTER transition)
  const reAnalyzeCase = (caseId: string) => {
    const updatedCases = cases.map((c) => {
      if (c.id === caseId) {
        // Resolve bottlenecks
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

        // Resolve actions
        const completedActions = c.actions.map((act) => ({
          ...act,
          status: 'Completed' as const,
        }));

        // Add confirmed fact
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

    // Update analytics metrics
    setAnalytics((prev) => ({
      ...prev,
      requiresAttention: Math.max(0, prev.requiresAttention - 1),
      potentiallyUnblocked: prev.potentiallyUnblocked + 1,
      bottlenecksDetected: Math.max(0, prev.bottlenecksDetected - 1),
    }));

    saveState(updatedCases, newLogs);
  };

  // 6. Reset Demo Data
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
        getCase,
        approveAction,
        rejectAction,
        simulateNewDocumentUpload,
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
