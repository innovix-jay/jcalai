import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { projectValidator } from '@/lib/validation/project-validator';

/**
 * GET - Validate a project
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
      .select('id')
      .eq('id', params.projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Run validation
    const result = await projectValidator.validateProject(params.projectId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate project' },
      { status: 500 }
    );
  }
}

/**
 * POST - Auto-fix validation issues
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
      .select('id')
      .eq('id', params.projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get issue IDs to fix from request body
    const body = await request.json();
    const { issueIds = [] } = body;

    // Auto-fix issues
    const fixedCount = await projectValidator.autoFixIssues(params.projectId, issueIds);

    // Re-validate to get updated results
    const result = await projectValidator.validateProject(params.projectId);

    return NextResponse.json({
      fixedCount,
      validation: result,
    });
  } catch (error) {
    console.error('Auto-fix error:', error);
    return NextResponse.json(
      { error: 'Failed to fix issues' },
      { status: 500 }
    );
  }
}


