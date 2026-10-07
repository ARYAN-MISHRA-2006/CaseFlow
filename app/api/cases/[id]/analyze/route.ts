import { NextRequest, NextResponse } from 'next/server';
import { CaseUnderstandingAgent } from '@/lib/agents/case-understanding-agent';
import { INITIAL_CASES } from '@/lib/mock-data';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseId = id.toUpperCase();
    const body = await req.json().catch(() => ({}));

    const existingCase = INITIAL_CASES.find((c) => c.id === caseId);

    const result = await CaseUnderstandingAgent.analyzeCase(
      caseId,
      existingCase,
      body.newDocumentText,
      body.newFileName
    );

    return NextResponse.json({
      success: true,
      caseId,
      agent: 'CaseUnderstandingAgent',
      extractionStatus: result.extractionStatus,
      confidenceOverall: result.confidenceOverall,
      structuredCase: result.structuredCase,
      timeline: result.timeline,
      facts: result.facts,
      pendingActions: result.pendingActions,
      agentNotes: result.agentNotes,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Analysis incomplete — human review required.',
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
  const { id } = await params;
  const caseId = id.toUpperCase();
  const existingCase = INITIAL_CASES.find((c) => c.id === caseId);

  const result = await CaseUnderstandingAgent.analyzeCase(caseId, existingCase);

  return NextResponse.json({
    success: true,
    caseId,
    agent: 'CaseUnderstandingAgent',
    structuredCase: result.structuredCase,
    facts: result.facts,
  });
}
