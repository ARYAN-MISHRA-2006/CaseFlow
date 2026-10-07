import { NextRequest, NextResponse } from 'next/server';
import { ActionRecommendationAgent } from '@/lib/agents/action-agent';
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

    const result = await ActionRecommendationAgent.generateRecommendations(
      existingCase,
      body.bottlenecks
    );

    return NextResponse.json({
      success: true,
      caseId,
      agent: 'ActionRecommendationAgent',
      safetyDisclaimer: result.safetyDisclaimer,
      recommendedActions: result.recommendedActions,
      agentNotes: result.agentNotes,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Action recommendation formulation failed.',
        details: err.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseId = id.toUpperCase();
    const existingCase = INITIAL_CASES.find((c) => c.id === caseId);

    if (!existingCase) {
      return NextResponse.json(
        { success: false, error: `Case ${caseId} not found.` },
        { status: 404 }
      );
    }

    const result = await ActionRecommendationAgent.generateRecommendations(existingCase);

    return NextResponse.json({
      success: true,
      caseId,
      agent: 'ActionRecommendationAgent',
      safetyDisclaimer: result.safetyDisclaimer,
      recommendedActions: result.recommendedActions,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve action recommendations.',
        details: err.message,
      },
      { status: 500 }
    );
  }
}
