import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, component } = await req.json();

    if (!projectId || !component || !component.name || !component.code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Store component in components table
    const { data: newComponent, error: componentError } = await supabase
      .from('components')
      .insert({
        project_id: projectId,
        name: component.name,
        category: component.category || 'Other',
        code: component.code,
        props: component.props || {},
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (componentError) {
      console.error('Error adding component:', componentError);
      return NextResponse.json(
        { 
          error: 'Failed to add component', 
          details: componentError.message,
          code: componentError.code 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, component: newComponent });
  } catch (error: any) {
    console.error('Error in add component API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}


