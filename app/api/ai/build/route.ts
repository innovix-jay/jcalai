import { NextRequest, NextResponse } from 'next/server';
import { MultiAIOrchestrator } from '@/services/multi-ai-orchestrator';
import { createClient } from '@/lib/supabase/server';

const orchestrator = new MultiAIOrchestrator();

export async function POST(req: NextRequest) {
  try {
    const { message, projectId, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Get current user
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use the Multi-AI Orchestrator to generate response
    const result = await orchestrator.execute(
      `User wants to build: "${message}"

Project Context:
- Project ID: ${projectId}
- Project Name: ${context?.projectName || 'Untitled'}

Analyze the request and provide:
1. A friendly response explaining what you'll do
2. Specific build actions needed

Return JSON:
{
  "response": "Your friendly response to the user",
  "actions": [
    {
      "type": "create_page" | "add_component" | "modify_code" | "configure_database",
      "data": { /* action-specific data */ }
    }
  ]
}`,
      'architecture',
      {
        provider: 'auto',
        temperature: 0.7
      }
    );

    // Parse the AI response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(result.response);
    } catch (parseError) {
      // If AI didn't return JSON, wrap it
      parsedResponse = {
        response: result.response,
        actions: []
      };
    }

    // Log the interaction
    await supabase
      .from('agent_analytics')
      .insert({
        user_id: user.id,
        agent_id: 'builder-assistant',
        event_type: 'chat_message',
        event_data: {
          message,
          projectId,
          model: result.model,
          actions: parsedResponse.actions?.length || 0
        }
      });

    return NextResponse.json({
      response: parsedResponse.response,
      actions: parsedResponse.actions || [],
      model: result.model,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI build chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

