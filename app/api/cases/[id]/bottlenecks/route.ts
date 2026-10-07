import { NextRequest, NextResponse } from 'next/server';
import { BottleneckAgent } from '@/lib/agents/bottleneck-agent';
import { INITIAL_CASES } from '@/lib/mock-data';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseId = id.toUpperCase();
    const body = await req.json().catch(() => ({}));

    // Find existing case or build minimal structure
    const existingCase = body.caseData || INITIAL_CASES.find((c) => c.id === caseId);

    if (!existingCase) {
      return NextResponse.json(
        { success: false, error: `Case ${caseId} not found.` },
        { status: 404 }
      );
    }

    const result = await BottleneckAgent.detectBottlenecks(existingCase);

    return NextResponse.json({
      success: true,
      caseId,
      agent: 'BottleneckAgent',
      scannedTypesCount: result.scannedTypesCount,
      overallSeverity: result.overallSeverity,
      primaryBottleneck: result.primaryBottleneck,
      bottlenecks: result.bottlenecks,
      agentNotes: result.agentNotes,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Bottleneck detection failed.',
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

    const result = await BottleneckAgent.detectBottlenecks(existingCase);

    return NextResponse.json({
      success: true,
      caseId,
      agent: 'BottleneckAgent',
      overallSeverity: result.overallSeverity,
      primaryBottleneck: result.primaryBottleneck,
      bottlenecks: result.bottlenecks,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve bottleneck analysis.',
        details: err.message,
      },
      { status: 500 }
    );
  }
}
