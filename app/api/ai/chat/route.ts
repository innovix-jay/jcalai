import { NextRequest, NextResponse } from 'next/server';
import { MultiAIOrchestrator } from '@/services/multi-ai-orchestrator';

const orchestrator = new MultiAIOrchestrator();

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Use the Multi-AI Orchestrator to generate response
    const result = await orchestrator.execute(
      message,
      'architecture', // Default task type for general chat
      {
        provider: 'auto', // Let AI auto-select best model
        systemPrompt: `You are JCAL.ai's helpful AI assistant. You help users:
- Create and manage AI agents
- Build web applications
- Understand JCAL.ai features
- Navigate the platform

Be friendly, helpful, and concise. Always provide actionable suggestions.`,
        temperature: 0.7
      }
    );

    return NextResponse.json({
      message: result.response,
      model: result.model,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

