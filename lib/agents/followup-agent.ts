import { CaseItem, RecommendedAction, AuditLogEntry } from '../../types';

export interface FollowUpTask {
  id: string;
  caseId: string;
  actionId: string;
  actionType: string;
  dispatchedAt: string;
  responseDeadlineDays: number;
  dueDate: string;
  status: 'Tracking Active' | 'Response Received' | 'Overdue' | 'Escalated';
  lastChecked: string;
}

export interface FollowUpAgentOutput {
  caseId: string;
  activeFollowUps: FollowUpTask[];
  agentNotes: string[];
  reAnalysisTriggered: boolean;
}

/**
 * FollowUpAgent
 * Modular Agent responsible for tracking approved administrative actions,
 * monitoring statutory response windows, triggering re-analysis loops upon document receipt,
 * and maintaining audit trail compliance.
 */
export class FollowUpAgent {
  public static async checkStatus(
    caseData: CaseItem,
    approvedActions?: RecommendedAction[]
  ): Promise<FollowUpAgentOutput> {
    const notes: string[] = [];
    notes.push(`Executing FollowUpAgent audit check for Case #${caseData.id}`);

    const targetActions = approvedActions || caseData.actions.filter((a) => a.status === 'Approved');
    const tasks: FollowUpTask[] = [];

    let reAnalysisTriggered = false;

    // Check if new document has arrived resolving the action
    const partyBResponseDoc = caseData.documents.find(
      (d) =>
        d.fileName.toLowerCase().includes('partyb') ||
        d.fileName.toLowerCase().includes('response') ||
        d.fileName.toLowerCase().includes('evidence')
    );

    targetActions.forEach((act) => {
      const isResolved = Boolean(partyBResponseDoc);
      if (isResolved) {
        reAnalysisTriggered = true;
      }

      tasks.push({
        id: `flw-${act.id}`,
        caseId: caseData.id,
        actionId: act.id,
        actionType: act.actionType,
        dispatchedAt: act.approvedAt || '19 Sep 2026',
        responseDeadlineDays: 14,
        dueDate: '03 Oct 2026',
        status: isResolved ? 'Response Received' : caseData.daysInactive > 14 ? 'Overdue' : 'Tracking Active',
        lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    if (reAnalysisTriggered) {
      notes.push('FollowUpAgent detected response document receipt! Re-analysis loop triggered for bottleneck resolution.');
    } else {
      notes.push(`Tracking ${tasks.length} active approved actions.`);
    }

    return {
      caseId: caseData.id,
      activeFollowUps: tasks,
      agentNotes: notes,
      reAnalysisTriggered,
    };
  }
}
