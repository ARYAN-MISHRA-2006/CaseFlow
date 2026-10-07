import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFileBuffer } from '@/lib/ingestion/text-extractor';
import { CaseUnderstandingAgent } from '@/lib/agents/case-understanding-agent';
import { INITIAL_CASES } from '@/lib/mock-data';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const caseId = (formData.get('caseId') as string) || 'CF-1024';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file selected. Please select a PDF, DOCX, or TXT document.' },
        { status: 400 }
      );
    }

    // Validate size (25 MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File exceeds the 25 MB limit.' },
        { status: 400 }
      );
    }

    // Validate file type
    const lowerName = file.name.toLowerCase();
    const isValidType = lowerName.endsWith('.pdf') || lowerName.endsWith('.docx') || lowerName.endsWith('.txt');
    if (!isValidType) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Allowed formats: .pdf, .docx, .txt' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Step 1: Extract Text
    const extractionResult = await extractTextFromFileBuffer(buffer, file.name, file.type);

    if (!extractionResult.success || !extractionResult.text) {
      return NextResponse.json(
        {
          success: false,
          error: extractionResult.error || 'Document could not be processed.',
        },
        { status: 422 }
      );
    }

    // Step 2: Run CaseUnderstandingAgent analysis on extracted text
    const existingCase = INITIAL_CASES.find((c) => c.id === caseId.toUpperCase());
    const agentOutput = await CaseUnderstandingAgent.analyzeCase(
      caseId.toUpperCase(),
      existingCase,
      extractionResult.text,
      file.name
    );

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;

    return NextResponse.json({
      success: true,
      caseId: caseId.toUpperCase(),
      fileName: file.name,
      fileType: lowerName.endsWith('.docx') ? 'DOCX' : lowerName.endsWith('.txt') ? 'TXT' : 'PDF',
      fileSize: formattedSize,
      extractedText: extractionResult.text,
      wordCount: extractionResult.wordCount,
      extractedMetadata: extractionResult.extractedMetadata,
      agentOutput: {
        extractionStatus: agentOutput.extractionStatus,
        confidenceOverall: agentOutput.confidenceOverall,
        timelineEventsCount: agentOutput.timeline.length,
        extractedFactsCount: agentOutput.facts.length,
        timeline: agentOutput.timeline,
        facts: agentOutput.facts,
        agentNotes: agentOutput.agentNotes,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Document could not be processed.',
        details: err.message,
      },
      { status: 500 }
    );
  }
}
