import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Agent } from '@/lib/agent-system/agent-core';

export async function POST(req: NextRequest) {
  try {
    const agent: Agent = await req.json();
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Insert agent into database
    const { data, error } = await supabase
      .from('agents')
      .insert({
        id: agent.id,
        user_id: user.id,
        name: agent.name,
        description: agent.description,
        avatar: agent.avatar,
        color: agent.color,
        capabilities: agent.capabilities,
        model: agent.model,
        system_prompt: agent.systemPrompt,
        temperature: agent.temperature,
        memory: agent.memory,
        tools: agent.tools,
        is_active: agent.isActive,
        current_task: agent.currentTask,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create agent:', error);
      return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Agent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}

