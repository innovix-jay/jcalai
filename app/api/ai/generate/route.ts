import { NextRequest, NextResponse } from 'next/server';
import { modelRouter, type AIProvider, type TaskType } from '@/lib/ai/model-router';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, taskType = 'general', userPreference } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('[AI API] Generating with prompt:', prompt.substring(0, 100) + '...');
    console.log('[AI API] Task type:', taskType);
    console.log('[AI API] User preference:', userPreference || 'auto');

    // Call the model router on the server where env vars are available
    const result = await modelRouter.generate(
      prompt,
      taskType as TaskType,
      userPreference as AIProvider | undefined
    );

    console.log('[AI API] Generation successful!');

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('[AI API] Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate AI response',
        details: error.stack 
      },
      { status: 500 }
    );
  }
}

