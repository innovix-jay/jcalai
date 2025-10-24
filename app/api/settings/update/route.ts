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

    const { projectId, settings } = await req.json();

    if (!projectId || !settings) {
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

    // Merge settings into project config
    const updatedConfig = {
      ...(project.config || {}),
      ...(settings.general && {
        framework: settings.general.framework
      }),
      ...(settings.deployment && {
        buildCommand: settings.deployment.buildCommand,
        outputDir: settings.deployment.outputDir,
        envVars: settings.deployment.envVars
      })
    };

    // Update project
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        name: settings.general?.name || project.name,
        description: settings.general?.description || project.description,
        config: updatedConfig,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating project settings:', updateError);
      return NextResponse.json(
        { 
          error: 'Failed to update settings', 
          details: updateError.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error: any) {
    console.error('Error in update settings API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

