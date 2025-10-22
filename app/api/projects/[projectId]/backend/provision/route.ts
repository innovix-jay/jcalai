import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { backendProvisioner } from '@/lib/backend/backend-provisioner';

/**
 * POST - Provision backend for a project
 */
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
      .select('name, backend_enabled')
      .eq('id', params.projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if backend already exists
    if (project.backend_enabled) {
      return NextResponse.json({ error: 'Backend already provisioned' }, { status: 400 });
    }

    // Get request body
    const body = await request.json();
    const { backendType, config } = body;

    if (!backendType || !['jcal-managed', 'external'].includes(backendType)) {
      return NextResponse.json({ error: 'Invalid backend type' }, { status: 400 });
    }

    // Provision backend
    const result = await backendProvisioner.provisionBackend({
      projectId: params.projectId,
      userId: user.id,
      projectName: project.name,
      backendType,
      config,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Provisioning failed' }, { status: 500 });
    }

    // Update project to mark backend as enabled
    await supabase
      .from('projects')
      .update({
        backend_enabled: true,
        backend_type: backendType,
      })
      .eq('id', params.projectId);

    // Log activity
    await supabase.from('project_activity').insert({
      project_id: params.projectId,
      user_id: user.id,
      activity_type: 'backend_provisioned',
      description: `Backend provisioned: ${backendType}`,
      metadata: {
        backend_type: backendType,
        provider: config?.externalProvider,
      },
    });

    return NextResponse.json({
      success: true,
      backendId: result.backendId,
      connectionInfo: result.connectionInfo,
      message: `${backendType === 'jcal-managed' ? 'Managed backend provisioned' : 'External backend connected'} successfully`,
    });
  } catch (error) {
    console.error('Backend provisioning error:', error);
    return NextResponse.json(
      { error: 'Failed to provision backend' },
      { status: 500 }
    );
  }
}

/**
 * GET - Get backend info for a project
 */
export async function GET(
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
      .select('id, backend_enabled, backend_type')
      .eq('id', params.projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.backend_enabled) {
      return NextResponse.json({
        enabled: false,
        message: 'No backend configured for this project',
      });
    }

    // Get backend info
    const backendInfo = await backendProvisioner.getBackendInfo(params.projectId);

    return NextResponse.json({
      enabled: true,
      backendType: project.backend_type,
      ...backendInfo,
    });
  } catch (error) {
    console.error('Error fetching backend info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backend info' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Deprovision backend
 */
export async function DELETE(
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
      .select('id')
      .eq('id', params.projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Deprovision backend
    await backendProvisioner.deprovisionBackend(params.projectId);

    // Update project
    await supabase
      .from('projects')
      .update({
        backend_enabled: false,
        backend_type: null,
      })
      .eq('id', params.projectId);

    return NextResponse.json({
      success: true,
      message: 'Backend deprovisioned successfully',
    });
  } catch (error) {
    console.error('Backend deprovisioning error:', error);
    return NextResponse.json(
      { error: 'Failed to deprovision backend' },
      { status: 500 }
    );
  }
}


