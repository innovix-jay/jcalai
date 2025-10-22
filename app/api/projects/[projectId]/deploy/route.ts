import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { vercelDeployer } from '@/lib/deployment/vercel-deployer';

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get request body
    const body = await request.json();
    const { environment = 'production', customDomain, envVars = {} } = body;

    // Deploy to Vercel
    const result = await vercelDeployer.deploy({
      projectId: params.projectId,
      projectName: project.name,
      environment,
      customDomain,
      envVars,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Deployment failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deploymentId: result.deploymentId,
      url: result.url,
    });
  } catch (error) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


