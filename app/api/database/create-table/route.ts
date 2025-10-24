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

    const { projectId, name, fields } = await req.json();

    if (!projectId || !name || !fields) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, name, fields' },
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

    // Store table schema in database_schemas table with correct schema
    const { data: schema, error: schemaError } = await supabase
      .from('database_schemas')
      .insert({
        project_id: projectId,
        table_name: name,
        schema: {
          fields: fields,
          created_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (schemaError) {
      console.error('Error creating table schema:', schemaError);
      return NextResponse.json(
        { 
          error: 'Failed to create table', 
          details: schemaError.message,
          code: schemaError.code 
        },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('project_activity').insert({
      project_id: projectId,
      action_type: 'table_created',
      description: `Created table: ${name}`,
      metadata: { schema_id: schema.id, field_count: fields.length }
    });

    return NextResponse.json({ success: true, schema });
  } catch (error: any) {
    console.error('Error in create table API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}


