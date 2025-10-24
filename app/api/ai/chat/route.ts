import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { modelRouter } from '@/lib/ai/model-router';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      message, 
      mode = 'chat', 
      projectId, 
      conversationHistory = [],
      provider = 'auto'
    } = await req.json();

    if (!message || !projectId) {
      return NextResponse.json(
        { error: 'Missing required fields: message, projectId' },
        { status: 400 }
      );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Build conversation context
    const messages = conversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    messages.push({
      role: 'user',
      content: message
    });

    let systemPrompt = '';

    if (mode === 'agent') {
      // AGENT MODE: Build things
      systemPrompt = `You are an AI builder assistant for JCAL.ai. When users ask you to build something, respond in a friendly way explaining what you'll create, then provide actions.

Format your response like this:

[Friendly explanation in plain English using markdown]

\`\`\`json
[
  {"type": "create_page", "data": {"name": "PageName", "path": "/page", "template": "blank"}},
  {"type": "add_component", "data": {"name": "Button", "type": "button", "code": "<button>Click</button>", "props": {}}}
]
\`\`\`

Available actions:
- create_page: Creates a new page with data: {name, path, template}
- add_component: Adds a UI component with data: {name, type, code, props}
- create_table: Creates a database table with data: {name, fields: [{name, type}]}

Be conversational and helpful. Always explain what you're doing in plain English first.`;
    } else {
      // CHAT MODE: Just conversation
      systemPrompt = 'You are a helpful AI assistant. Answer questions, help brainstorm ideas, and provide guidance. You are NOT building anything right now, just having a conversation.';
    }

    // Use the existing LLM provider system
    const fullPrompt = `${systemPrompt}\n\nUser message: ${message}`;
    
    let llmResult;
    try {
      llmResult = await modelRouter.generate(
        fullPrompt, 
        mode === 'agent' ? 'code' : 'general', 
        provider as any
      );
    } catch (error: any) {
      console.error('LLM generation error:', error);
      
      // Provide fallback response if AI fails
      const fallbackResponse = mode === 'agent' 
        ? `I'm having trouble connecting to the AI service right now. Please check that your API keys are configured properly in the environment variables.

**Fallback Response:**
I understand you want me to help build something, but I need to be connected to an AI service to assist you. Please ensure the following API keys are configured:
- ANTHROPIC_API_KEY (for Claude)
- OPENAI_API_KEY (for GPT)
- GOOGLE_API_KEY (for Gemini)

Once configured, I'll be able to help you build amazing applications!`
        : `I'm having trouble connecting to the AI service right now. Please check that your API keys are configured properly.

**Fallback Response:**
I'd love to help you, but I need to be connected to an AI service to provide responses. Please ensure your API keys are configured in the environment variables.`;

      llmResult = {
        response: fallbackResponse,
        provider: 'fallback',
        model: 'fallback',
        tokensUsed: 0,
        cost: 0
      };
    }

    const content = llmResult.response;

    // Extract actions from code blocks (only in agent mode)
    let actions = [];
    if (mode === 'agent') {
      const actionsMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (actionsMatch) {
        try {
          actions = JSON.parse(actionsMatch[1]);
        } catch (e) {
          console.error('Failed to parse actions:', e);
        }
      }
    }

    // Save messages to database
    await supabase.from('chat_messages').insert([
      {
        project_id: projectId,
        user_id: user.id,
        role: 'user',
        content: message,
        mode: mode
      },
      {
        project_id: projectId,
        user_id: user.id,
        role: 'assistant',
        content: content,
        mode: mode,
        actions: actions,
        metadata: {
          provider: llmResult.provider,
          model: llmResult.model,
          tokens_used: llmResult.tokensUsed,
          cost: llmResult.cost
        }
      }
    ]);

    // Log AI generation for tracking
    await supabase.from('ai_generations').insert({
      project_id: projectId,
      provider: llmResult.provider,
      model: llmResult.model,
      prompt_tokens: Math.floor(llmResult.tokensUsed * 0.7), // Estimate
      completion_tokens: Math.floor(llmResult.tokensUsed * 0.3), // Estimate
      total_tokens: llmResult.tokensUsed,
      cost_usd: llmResult.cost
    });

    return NextResponse.json({
      response: content,
      actions: actions,
      provider: llmResult.provider,
      model: llmResult.model,
      tokensUsed: llmResult.tokensUsed,
      cost: llmResult.cost
    });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
