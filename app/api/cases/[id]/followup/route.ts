import { NextRequest, NextResponse } from 'next/server';
import { FollowUpAgent } from '@/lib/agents/followup-agent';
import { INITIAL_CASES } from '@/lib/mock-data';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseId = id.toUpperCase();
    const body = await req.json().catch(() => ({}));

    const existingCase = body.caseData || INITIAL_CASES.find((c) => c.id === caseId);

    if (!existingCase) {
      return NextResponse.json(
        { success: false, error: `Case ${caseId} not found.` },
        { status: 404 }
      );
    }

    const result = await FollowUpAgent.checkStatus(existingCase, body.approvedActions);

    return NextResponse.json({
      success: true,
      caseId,
      agent: 'FollowUpAgent',
      activeFollowUps: result.activeFollowUps,
      reAnalysisTriggered: result.reAnalysisTriggered,
      agentNotes: result.agentNotes,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'FollowUp tracking check failed.',
        details: err.message,
      },
      { status: 500 }
    );
  }
}
