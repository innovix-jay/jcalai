import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIModelRouter } from '@/lib/ai/model-router';

const modelRouter = new AIModelRouter();

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, message, conversationHistory } = await req.json();

    if (!projectId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Get existing pages and components for context
    const { data: pages } = await supabase
      .from('pages')
      .select('name, path')
      .eq('project_id', projectId);

    const { data: components } = await supabase
      .from('components')
      .select('name, category')
      .eq('project_id', projectId);

    // Build context for AI
    const context = {
      projectName: project.name,
      projectDescription: project.description,
      framework: project.config?.framework || 'react',
      existingPages: pages || [],
      existingComponents: components || [],
      conversationHistory: conversationHistory || []
    };

    // Create prompt for AI agent
    const prompt = `You are an AI Builder Assistant. The user wants to build: "${message}"

CONTEXT:
- Project: ${context.projectName}
- Framework: ${context.framework}
- Existing pages: ${context.existingPages.map(p => p.name).join(', ') || 'none'}
- Existing components: ${context.existingComponents.map(c => c.name).join(', ') || 'none'}

Your response MUST be in TWO parts separated by "---ACTIONS---":

PART 1: A friendly, conversational response in plain English explaining what you'll build. Use markdown formatting for better readability.

PART 2: A JSON array of actions to execute. Each action must have:
- "type": one of ["create_page", "add_component", "modify_code"]
- "data": object with relevant fields

Example actions:
{
  "type": "create_page",
  "data": {
    "name": "Login",
    "route": "/login",
    "template": "blank"
  }
}

{
  "type": "add_component",
  "data": {
    "name": "LoginForm",
    "category": "Forms",
    "code": "<form>...</form>"
  }
}

IMPORTANT:
- Be specific and actionable
- Only suggest realistic, implementable changes
- If the request is unclear, ask for clarification instead of guessing
- Keep responses concise but helpful

Format:
Your friendly explanation here...

---ACTIONS---
[{"type": "...", "data": {...}}, ...]
`;

    // Call AI model
    const aiResponse = await modelRouter.generate(prompt, {
      model: 'claude', // Use Claude for code generation
      maxTokens: 2000
    });

    // Parse response
    const parts = aiResponse.split('---ACTIONS---');
    const plainTextResponse = parts[0].trim();
    
    let actions = [];
    if (parts[1]) {
      try {
        actions = JSON.parse(parts[1].trim());
      } catch (parseError) {
        console.error('Failed to parse actions:', parseError);
        // Continue without actions if parsing fails
      }
    }

    // Log the interaction
    await supabase.from('ai_generations').insert({
      project_id: projectId,
      user_id: user.id,
      prompt: message,
      response: aiResponse,
      model_used: 'claude',
      created_at: new Date().toISOString()
    });

    return NextResponse.json({
      response: plainTextResponse,
      actions: actions
    });

  } catch (error: any) {
    console.error('Error in AI agent:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error',
        response: "I apologize, but I encountered an error processing your request. Could you try rephrasing it?"
      },
      { status: 500 }
    );
  }
}

