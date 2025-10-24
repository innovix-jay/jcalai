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

    const { projectId, dbType, tables } = await req.json();

    if (!projectId || !dbType || !tables) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, config')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Update project config with database settings
    const updatedConfig = {
      ...(project.config || {}),
      database: {
        type: dbType,
        tables: tables.map((table: any) => ({
          name: table.name,
          fields: table.fields
        }))
      }
    };

    const { error: updateError } = await supabase
      .from('projects')
      .update({ 
        config: updatedConfig,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('Error updating project config:', updateError);
      return NextResponse.json(
        { 
          error: 'Failed to save configuration', 
          details: updateError.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (error: any) {
    console.error('Error in configure database API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}


