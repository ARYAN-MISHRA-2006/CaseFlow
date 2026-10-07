export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type CaseStage =
  | 'Pleadings'
  | 'Discovery / Evidence'
  | 'Pre-Trial Motion'
  | 'Hearing'
  | 'Judgment Pending'
  | 'Compliance / Execution';

export type BottleneckType =
  | 'Missing Document'
  | 'Pending Response'
  | 'Overdue Action'
  | 'Prolonged Inactivity'
  | 'Repeated Adjournment'
  | 'Upcoming Deadline'
  | 'Missed Deadline'
  | 'Dependency'
  | 'Inconsistent Records'
  | 'None / Resolved';

export type CaseStatus =
  | 'Active'
  | 'Requires Attention'
  | 'Bottleneck Detected'
  | 'Awaiting Action'
  | 'Awaiting Response'
  | 'Potentially Unblocked'
  | 'Resolved'
  | 'Human Review Required';

export type ActionStatus = 'Pending Approval' | 'Approved' | 'Rejected' | 'Completed';

export type FactConfidenceType = 'CONFIRMED FACT' | 'AI INFERENCE' | 'UNKNOWN';

export interface FactItem {
  id: string;
  field: string;
  value: string;
  type: FactConfidenceType;
  confidence: number; // 0 to 1
  sourceDocument?: string;
}

export interface CaseParty {
  name: string;
  role: 'Plaintiff' | 'Defendant' | 'Petitioner' | 'Respondent' | 'Third Party';
  counsel?: string;
  status: 'Active' | 'Non-responsive' | 'Complied';
}

export interface CaseDocument {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'DOCX' | 'TXT';
  uploadedAt: string;
  fileSize: string;
  status: 'Processed' | 'Processing' | 'Failed';
  documentType: 'Court Order' | 'Petition' | 'Evidence Submission' | 'Notice' | 'Hearing Brief';
  summary: string;
}

export interface CaseEvent {
  id: string;
  date: string;
  eventType: 'Case Filed' | 'Response Submitted' | 'Hearing Held' | 'Court Order Issued' | 'Evidence Submitted' | 'Deadline Passed';
  description: string;
  sourceDocument?: string;
  confidence: number;
}

export interface DependencyNode {
  id: string;
  label: string;
  status: 'completed' | 'pending' | 'blocked' | 'missing';
  detail?: string;
}

export interface Bottleneck {
  id: string;
  caseId: string;
  type: BottleneckType;
  severity: Priority; // Refers to Operational Attention Priority
  description: string;
  detectedDate: string;
  durationDays: number;
  supportingEvidence: string[];
  confidence: number;
  potentialImpact: string;
  suggestedInvestigation: string;
  dependencyNodes?: DependencyNode[];
  isResolved: boolean;
}

export interface RecommendedAction {
  id: string;
  caseId: string;
  actionType: string;
  reason: string;
  supportingEvidence: string[];
  priority: Priority;
  affectedElement: string;
  draftCommunication: string;
  confidence: number;
  status: ActionStatus;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface CaseItem {
  id: string;
  title: string;
  caseType: string;
  court: string;
  filedDate: string;
  currentStage: CaseStage;
  lastActivityDate: string;
  daysInactive: number;
  priority: Priority;
  status: CaseStatus;
  parties: CaseParty[];
  facts: FactItem[];
  documents: CaseDocument[];
  timeline: CaseEvent[];
  bottlenecks: Bottleneck[];
  actions: RecommendedAction[];
  upcomingDeadline?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userOrAgent: string;
  caseId: string;
  agentRole: 'CaseUnderstandingAgent' | 'BottleneckAgent' | 'ActionAgent' | 'FollowUpAgent' | 'Human Admin' | 'System';
  action: string;
  inputReference?: string;
  outputDetails: string;
  humanDecision?: string;
  status: 'Completed' | 'Pending Review' | 'Flagged';
}

export interface AnalyticsData {
  totalCases: number;
  requiresAttention: number;
  highPriority: number;
  bottlenecksDetected: number;
  actionsAwaitingApproval: number;
  actionsCompleted: number;
  potentiallyUnblocked: number;
  upcomingDeadlines: number;
  prolongedInactivityCount: number;
  avgDetectionToActionDays: number;
  avgActionToResolutionDays: number;
}
