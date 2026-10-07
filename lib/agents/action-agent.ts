import { CaseItem, RecommendedAction, Bottleneck, Priority } from '../../types';
import { GoogleGenAI } from '@google/genai';

export interface ActionAgentOutput {
  caseId: string;
  recommendedActions: RecommendedAction[];
  agentNotes: string[];
  safetyDisclaimer: string;
}

/**
 * ActionRecommendationAgent
 * Modular Agent responsible for formulating non-binding action recommendations
 * for human administrative review based on detected bottlenecks.
 *
 * SAFETY MANDATE:
 * - Recommendations are strictly NON-BINDING.
 * - Requires explicit Human-in-the-Loop approval before any dispatch or execution.
 * - Does NOT determine guilt, liability, or final judicial outcomes.
 */
export class ActionRecommendationAgent {
  public static readonly SAFETY_DISCLAIMER =
    'Recommendation for Human Administrative Approval. Non-binding. Requires official review prior to dispatch.';

  public static async generateRecommendations(
    caseData: CaseItem,
    bottlenecks?: Bottleneck[]
  ): Promise<ActionAgentOutput> {
    const notes: string[] = [];
    notes.push(`Executing ActionRecommendationAgent scan for Case #${caseData.id}`);

    const activeBottlenecks = bottlenecks && bottlenecks.length > 0 
      ? bottlenecks.filter((b) => !b.isResolved)
      : caseData.bottlenecks.filter((b) => !b.isResolved);

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if live Gemini API is available for natural pre-drafted communication generation
    if (apiKey && apiKey !== 'your_gemini_api_key_here' && activeBottlenecks.length > 0) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are ActionRecommendationAgent for CaseFlow judicial administration system.
Analyze case #${caseData.id} with active procedural bottlenecks: ${JSON.stringify(activeBottlenecks)}

Formulate 1 to 2 administrative action recommendations for human approval.
Return a valid JSON object with:
- "actions": Array of {
    "actionType": "Issue Notice" | "Request Document" | "Schedule Hearing" | "Escalate to Judge" | "Administrative Review",
    "reason": string (clear non-binding justification referencing procedural rules/evidence),
    "supportingEvidence": string[],
    "priority": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
    "affectedElement": string,
    "draftCommunication": string (formal institutional memo/notice text for court registrar to send),
    "confidence": number
  }

CRITICAL RULES:
- Frame recommendations as suggestions for human review.
- Do NOT make legal judgments or assign liability.
- Include pre-drafted formal notice text.`;

        const response = await ai.models.generateContent({
          model: 'gemini-1.5-pro',
          contents: prompt,
        });

        const rawText = response.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.actions && parsed.actions.length > 0) {
            notes.push('Generated recommendations using live Gemini API.');
            const liveActions: RecommendedAction[] = parsed.actions.map((a: any, idx: number) => ({
              id: `act-[${caseData.id}]-${Date.now()}-${idx}`,
              caseId: caseData.id,
              actionType: a.actionType || 'Issue Notice',
              reason: a.reason || 'Administrative action recommended to resolve procedural stall.',
              supportingEvidence: a.supportingEvidence || activeBottlenecks[0]?.supportingEvidence || ['Court filing repository'],
              priority: (a.priority as Priority) || activeBottlenecks[0]?.severity || 'HIGH',
              affectedElement: a.affectedElement || 'Court Registry File',
              draftCommunication: a.draftCommunication || `FORMAL NOTICE: Re Case ${caseData.id}. Please submit requested documents within 14 days.`,
              confidence: typeof a.confidence === 'number' ? a.confidence : 0.9,
              status: 'Pending Approval',
              createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }));

            return {
              caseId: caseData.id,
              recommendedActions: liveActions,
              agentNotes: notes,
              safetyDisclaimer: ActionRecommendationAgent.SAFETY_DISCLAIMER,
            };
          }
        }
      } catch (err: any) {
        notes.push(`Gemini API call notice: ${err.message}. Running rule-based recommendation generator.`);
      }
    }

    // Rule-Based Action Recommendation Engine
    const actions: RecommendedAction[] = [];

    if (activeBottlenecks.length === 0) {
      notes.push('No active bottlenecks detected. Returning default administrative review action.');
      actions.push({
        id: `act-default-${Date.now()}`,
        caseId: caseData.id,
        actionType: 'Administrative Review',
        reason: 'Case progress appears normal. Routine administrative check recommended before next hearing.',
        supportingEvidence: ['Court Registry active status record'],
        priority: 'LOW',
        affectedElement: 'Hearing Schedule',
        draftCommunication: `MEMORANDUM\nTo: Registrar / Case Administrator\nRe: Routine Case Progress Check - Case #${caseData.id}\n\nPlease verify upcoming hearing schedule and confirm party readiness.`,
        confidence: 0.95,
        status: 'Pending Approval',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } else {
      activeBottlenecks.forEach((bot, idx) => {
        if (bot.type === 'Missing Document' || bot.type === 'Inconsistent Records') {
          actions.push({
            id: `act-md-${Date.now()}-${idx}`,
            caseId: caseData.id,
            actionType: 'Issue Notice',
            reason: `Missing Defendant evidence submission following Court Order direction. Statutory 30-day window elapsed.`,
            supportingEvidence: bot.supportingEvidence,
            priority: bot.severity,
            affectedElement: 'Party B (Defendant) Evidence Submission',
            draftCommunication: `COURT NOTICE OF PENDING FILING\nCase ID: ${caseData.id}\nTo: Counsel for Defendant (Party B)\n\nTake notice that the record indicates evidence submission mandated by Court Order has not been received. You are requested to file the required document within 14 days of this notice or submit a statement of non-compliance. Failure to comply may result in pre-trial motion proceeding without defendant submission.`,
            confidence: 0.92,
            status: 'Pending Approval',
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        } else if (bot.type === 'Pending Response' || bot.type === 'Prolonged Inactivity') {
          actions.push({
            id: `act-pr-${Date.now()}-${idx}`,
            caseId: caseData.id,
            actionType: 'Request Document',
            reason: `Respondent counter-affidavit overdue by ${Math.max(1, bot.durationDays - 30)} days. Recommended issue of formal reminder.`,
            supportingEvidence: bot.supportingEvidence,
            priority: bot.severity,
            affectedElement: 'Pleadings File',
            draftCommunication: `ADMINISTRATIVE REMINDER\nCase ID: ${caseData.id}\nTo: Respondent / Legal Representative\n\nYour formal response in Case #${caseData.id} is overdue. Please submit counter-affidavit to the registry within 7 business days.`,
            confidence: 0.89,
            status: 'Pending Approval',
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        } else if (bot.type === 'Repeated Adjournment' || bot.type === 'Overdue Action') {
          actions.push({
            id: `act-ra-${Date.now()}-${idx}`,
            caseId: caseData.id,
            actionType: 'Schedule Hearing',
            reason: `Case has experienced consecutive adjournments spanning ${bot.durationDays} days. Pre-trial direction hearing recommended.`,
            supportingEvidence: bot.supportingEvidence,
            priority: bot.severity,
            affectedElement: 'Court Calendar & Pre-Trial Bench',
            draftCommunication: `SPECIAL DIRECTION HEARING NOTICE\nCase ID: ${caseData.id}\n\nThe Court Administrator recommends listing Case #${caseData.id} for a fixed procedural directions hearing to resolve outstanding preliminary motions and establish a firm trial timeline.`,
            confidence: 0.94,
            status: 'Pending Approval',
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        } else if (bot.type === 'Upcoming Deadline' || bot.type === 'Missed Deadline') {
          actions.push({
            id: `act-ud-${Date.now()}-${idx}`,
            caseId: caseData.id,
            actionType: 'Flag for Inspection',
            reason: `Filing deadline approaching on record. Urgent administrative compliance check advised.`,
            supportingEvidence: bot.supportingEvidence,
            priority: bot.severity,
            affectedElement: 'Compliance Registry',
            draftCommunication: `HIGH-PRIORITY COMPLIANCE ALERT\nCase ID: ${caseData.id}\n\nUrgent compliance verification required for approaching deadline in Case #${caseData.id}. Please verify receipt of mandated filings with registry desk.`,
            confidence: 0.96,
            status: 'Pending Approval',
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        } else {
          actions.push({
            id: `act-gen-${Date.now()}-${idx}`,
            caseId: caseData.id,
            actionType: 'Administrative Review',
            reason: bot.suggestedInvestigation || 'Procedural stall detected; administrative inspection required.',
            supportingEvidence: bot.supportingEvidence,
            priority: bot.severity,
            affectedElement: 'General Case Registry',
            draftCommunication: `ADMINISTRATIVE REVIEW REQUEST\nCase ID: ${caseData.id}\n\nCase Administrator requested to inspect procedural status for potential dependency resolution.`,
            confidence: 0.85,
            status: 'Pending Approval',
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
      });
    }

    return {
      caseId: caseData.id,
      recommendedActions: actions,
      agentNotes: notes,
      safetyDisclaimer: ActionRecommendationAgent.SAFETY_DISCLAIMER,
    };
  }
}
